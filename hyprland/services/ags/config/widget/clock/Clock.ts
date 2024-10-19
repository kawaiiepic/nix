import { notifications_widget, hasNotifications, notifications_count, clearNotifications, doNotDisturb } from "../notification/Notification"
import { format } from 'date-fns'

const mpris = await Service.import("mpris")

const day = Variable('', {
  poll: [1000, function () {
    return format(new Date(), "h 'o''clock'");
  }],
});

const daydesc = Variable('', {
  poll: [1000, function () {
    return format(new Date(), "BBBB");
  }],
});

function media() {
  const player = mpris.players[0]

  /** @param {number} length */
  function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
  }

  const title = Widget.Label({
    class_name: "clock-media-title",
    wrap: true,
    hpack: "start",
    label: player.bind("track_title").transform(title => title.length <= 25 ? title : title.substring(0, 25) + "..."),
    tooltip_text: player.bind("track_title"),
  })

  function cover() {
    return Widget.Box({
      hpack: "start",
      class_name: "clock-media-cover",
      child: Widget.Box({
        css: player.bind("cover_path").transform(p => `background-image: url("${p}");`
          + "background-size: cover;"
          + "background-repeat: no-repeat;"
          + "background-position: center;",
        )
      }),
    })
  }

  const artist = Widget.Label({
    class_name: "clock-media-artist",
    wrap: true,
    hpack: "start",
    label: player.bind("track_artists").transform(a => a.join(", ")),
    tooltip_text: player.bind("track_artists").transform(a => a.join(", ")),
  })

  function progress() {
    return Widget.Box({
      hexpand: false,
      setup: self => {
        function update() {
          if (player.position != -1) {
            self.child = Widget.Slider({
              class_name: "clock-media-progress",
              draw_value: false,
              on_change: ({ value }) => player.position = value * player.length,
              setup: self => {
                function update() {
                  const value = player.position / player.length
                  self.value = value > 0 ? value : 0
                }
                self.hook(player, update)
                self.hook(player, update, "position")
                self.poll(1000, update)
              },
            })
          } else {

          }
        }
        self.hook(mpris, update, "player-changed")
      }
    })
  }

  const playPause = Widget.EventBox({
    class_name: "media-buttons",
    "on-primary-click": () => player.playPause(),
    visible: player.bind("can_play"),
    child: Widget.Label({
      label: player.bind("play_back_status").transform(s => {
        switch (s) {
          case "Playing": return ""
          case "Paused":
          case "Stopped": return ""
        }
      }),
      tooltip_text: player.bind("play_back_status").transform(s => {
        switch (s) {
          case "Playing": return "Pause"
          case "Paused":
          case "Stopped": return "Play"
        }
      }),
    }),
  })

  const prev = Widget.EventBox({
    class_name: "media-buttons",
    "on-primary-click": () => player.previous(),
    visible: player.bind("can_go_prev"),
    child: Widget.Label({
      label: "",
      tooltip_text: "Previous"
    }),
  })

  const next = Widget.EventBox({
    class_name: "media-buttons",
    "on-primary-click": () => player.next(),
    visible: player.bind("can_go_next"),
    child: Widget.Label({
      label: "",
      tooltip_text: "Next"
    }),
  })


  if (player != null) {

    return Widget.Box({
      class_name: "clock-media",
      vertical: true,
      children: [
        Widget.Box({
          spacing: 10,
          children: [cover(), Widget.CenterBox({
            start_widget: Widget.Box({
              vertical: true,
              children: [
                title,
                artist,
              ],
            }),

            end_widget: Widget.Box({
              children: [prev, playPause, next],
            })
          })],
        }),

        progress()
      ],
    })
  } else {
    return Widget.Box({})
  }
}

export default () => Widget.Window({
  name: "clockbar",
  class_name: "transparent",
  visible: false,
  keymode: "exclusive",
  setup: self => self.keybind("Escape", () => {
    App.closeWindow("clockbar")
  }),
  anchor: ['top'],
  layer: "top",
  margins: [10, 0],

  child: Widget.Box({
    class_name: "clockbar",
    spacing: 20,

    children: [
      Widget.Box({
        vertical: true,
        spacing: 20,

        children: [

          Widget.CenterBox({
            hexpand: true,

            start_widget: Widget.Box({
              class_name: "dnd",
              spacing: 5,
              children: [

                Widget.Label({ label: "Do Not Disturb" }),

                Widget.Switch({
                  onActivate: ({ active }) => {
                    doNotDisturb.setValue(active);
                  },
                }),
              ]
            }),

            end_widget: Widget.EventBox({
              hpack: "end",
              "on-primary-click": () => {
                clearNotifications()
              },

              child: Widget.Label({
                label: " ",
                class_name: "notification-clear",
                tooltip_text: notifications_count.bind().as((count) => `Clear notifications. (${count})`)
              })
            })
          }),

          Widget.Scrollable({
            hscroll: 'never',
            vscroll: 'automatic',
            visible: hasNotifications.bind(),
            child: notifications_widget,
            vexpand: true,
            vpack: "fill",
          }),

          Widget.CenterBox({
            vertical: true,
            vexpand: true,
            vpack: "fill",
            visible: hasNotifications.bind().as(value => value ? false : true),

            center_widget: Widget.Box({
              class_name: "empty-notifications",
              vertical: true,
              children: [
                Widget.Label({
                  class_name: "empty-notifications-icon",
                  label: ""
                }),

                Widget.Label({
                  class_name: "empty-notifications",
                  label: "No Notifications"
                })
              ],
            })
          }),
        ],
      }),

      Widget.Separator({ vertical: true }),

      Widget.Box({
        class_name: "right-side",
        spacing: 30,
        vertical: true,

        children: [

          Widget.Box({
            vertical: true,
            children: [
              Widget.Label({
                label: day.bind(),
              }),
              Widget.Label({
                label: daydesc.bind(),
              })
            ]
          }),

          Widget.Calendar({
            class_name: "calendar",
            showDayNames: true,
            showDetails: false,
            showHeading: true,
            showWeekNumbers: false,
            onDaySelected: ({ date: [y, m, d] }) => {
              print(`${y}. ${m}. ${d}.`)
            },
          }),

          media(),

          Widget.Label("Insert-Random-Widget")

        ]
      })

    ]
  })
})