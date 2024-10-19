const mpris = await Service.import('mpris')

export default () => {
  const label = Utils.watch("", mpris, "player-changed", () => {
    if (mpris.players[0]) {
      const { track_title } = mpris.players[0]
      const title = `${track_title} `
      return title.length <= 20 ? title : title.substring(0, 20) + "..."
    } else {
      return ''
    }
  })

  const tooltip = Utils.watch("", mpris, "player-changed", () => {
    if (mpris.players[0]) {
      const { track_artists, track_title } = mpris.players[0]
      var artists = ""
      if (track_artists.join(', ') == 'Unknown artist') {
        artists = ""
      } else {
        artists = "─ " + track_artists.join(', ');
      }
      return `${track_title} ${artists}`
    } else {
      return ''
    }
  })

  const playicon = Utils.watch("", mpris, "changed", () => {
    if (mpris.players[0]) {
      const { play_back_status } = mpris.players[0]
      if (play_back_status == "Playing") {
        return ""
      }
    }
    return ""
  })

  const source = Utils.watch("", mpris, "player-changed", () => {
    if (mpris.players[0]) {
      const { identity } = mpris.players[0]
      switch (identity) {
        case 'Spotify':
          return ``
        case 'Kodi':
          return `󰌔`
        case 'Mozilla Firefox':
          return ``
      }
      return `󰎈`
    } else {
      return ''
    }
  })

  const revealer = Widget.Revealer({
    transitionDuration: 1000,
    transition: 'slide_right',
    child: Widget.Box({
      children: [
        Widget.EventBox({
          class_name: "media-buttons",
          child: Widget.Label({
            label: "",
            tooltip_text: "Previous"
          })
        }),

        Widget.EventBox({
          class_name: "media-buttons",
          child: Widget.Label({
            label: playicon,
            tooltip_text: "Play/Pause"
          })
        }),

        Widget.EventBox({
          class_name: "media-buttons",
          child: Widget.Label({
            label: "",
            tooltip_text: "Next"
          })
        })
      ]
    }),
  })

  const widget = Widget.EventBox({
    on_hover: (event) => {
      if (mpris.players[0]) {
        revealer.reveal_child = true;
        Utils.timeout(3000, () => {
          revealer.reveal_child = false;
        })
      }
    },

    child: Widget.Box({
      hpack: "end",
      spacing: 8,
      children: [
        Widget.Label({
          class_name: "media-icon",
          label: source
        }),
        Widget.Label({
          class_name: "media-name",
          tooltip_text: tooltip,
          label
        }),
        revealer]
    })
  })

  return widget
}