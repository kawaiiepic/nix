import { Notification } from "resource:///com/github/Aylur/ags/service/notifications.js";
import { GLib } from "types/@girs/glib-2.0/glib-2.0";
import { Align } from "types/@girs/gtk-3.0/gtk-3.0.cjs";

const notifications = await Service.import("notifications");
const hyprland = await Service.import("hyprland");

export const hasNotifications = Variable(false);
export const notifications_count = Variable(0);
export const doNotDisturb = Variable(false);

export const popups_widget = Widget.Box({
  vertical: true,
  css: "min-width: 2px; min-height: 2px;",
  class_name: "notifications",
  expand: false,
  halign: Align.START,
});

export const notifications_widget = Widget.Box({ vertical: true });

const breadcrumb_widget = Widget.Box({
  vertical: true,
  css: "min-width: 2px; min-height: 2px;",
  class_name: "breadcrumbs",
  expand: false,
  halign: Align.START,
});

export function totalNotifications(): number {
  return notifications.notifications.length;
}

export function clearNotifications() {
  notifications.clear();
  notifications_count.setValue(0);
}

export function removeNotification(notification: Notification) {
  notification.close();
}

function NotificationIcon(notification: Notification) {
  const { image, app_icon, app_entry } = notification;

  if (image) {
    return Widget.Box({
      css:
        `background-image: url("${image}");` +
        "background-size: cover;" +
        "background-repeat: no-repeat;" +
        "background-position: center;",
    });
  }

  let icon = "dialog-information-symbolic";
  if (Utils.lookUpIcon(app_icon)) icon = app_icon;

  if (app_entry && Utils.lookUpIcon(app_entry)) icon = app_entry;

  return Widget.Box({
    child: Widget.Icon({
      icon: icon,
      size: 48,
    }),
  });
}

function NotificationWidget(notification: Notification, clock_bar?: boolean) {
  const icon = Widget.Box({
    vpack: "start",
    child: NotificationIcon(notification),

    setup(self) {
      if (clock_bar) {
        self.class_name = "small-icon";
      } else {
        self.class_name = "icon";
      }
    },
  });

  const preview = Widget.Box({
    hpack: "start",
    class_name: "preview",
    child: NotificationIcon(notification),
  });

  const title = Widget.Label({
    xalign: 0,
    justification: "left",
    hexpand: true,
    max_width_chars: 24,
    truncate: "end",
    wrap: true,
    label: notification.summary,
    use_markup: true,

    setup(self) {
      if (clock_bar) {
        self.class_name = "small-title";
      } else {
        self.class_name = "title";
      }
    },
  });

  const body = Widget.Label({
    hexpand: true,
    use_markup: true,
    xalign: 0,
    justification: "left",
    label: notification.body,
    wrap: true,

    setup(self) {
      if (clock_bar) {
        self.class_name = "small-body";
      } else {
        self.class_name = "body";
      }
    },
  });

  const actions = Widget.Box({
    setup(self) {
      if (clock_bar) {
        self.class_name = "small-actions";
        self.children = notification.actions.map(({ id, label }) =>
          Widget.Button({
            class_name: "small-action-button",
            on_clicked: () => {
              notification.invoke(id);
            },
            hexpand: false,
            child: Widget.Label(label),
          })
        );
      } else {
        self.class_name = "actions";
        self.children = notification.actions.map(({ id, label }) =>
          Widget.Button({
            class_name: "action-button",
            on_clicked: () => {
              notification.invoke(id);
            },
            hexpand: true,
            child: Widget.Label(label),
          })
        );
      }
    },
  });

  if (clock_bar) {
    const time_string = Variable("", {
      poll: [
        1000,
        function () {
          const now = GLib.DateTime.new_now_local();
          const then = GLib.DateTime.new_from_unix_local(notification.time);
          const hour_diff = Math.round(now.get_hour() - then.get_hour());
          const minutes_diff = Math.round(now.get_minute() - then.get_minute());

          const s1 = hour_diff > 0 ? hour_diff + " Hour(s)" : "";
          const s2 = minutes_diff > 0 ? minutes_diff + " Minute(s)" : "";
          const s3 =
            (hour_diff > 0 || minutes_diff > 0 ? "  " : "") +
            s1 +
            s2 +
            (hour_diff > 0 || minutes_diff > 0 ? " ago." : "");
          return s3;
        },
      ],
    });

    const time = Widget.Label({
      class_name: "small-time",
      justification: "right",
      label: time_string.bind(),
    });

    const dismiss = Widget.EventBox({
      hpack: "end",
      hexpand: true,
      halign: Align.END,
      child: Widget.Label({
        label: " ",
        tooltip_text: "Dismiss Notification",
      }),

      "on-primary-click": () => {
        notification.close();
      },
    });

    switch (notification.app_name) {
      case "Spotify":
        return Widget.Revealer({
          revealChild: false,
          transitionDuration: 500,
          transition: "slide_down",
          attribute: { id: notification.id, hint: "spotify" },
          setup: (self) => {
            Utils.timeout(500, () => {
              self.reveal_child = true;
            });
          },
          child: Widget.Box({
            class_name: `small-notification ${notification.urgency}`,
            children: [
              icon,
              Widget.Box({
                vertical: true,
                spacing: 5,
                children: [
                  Widget.Box({
                    spacing: 10,
                    children: [title, time, dismiss],
                  }),
                  body,
                  actions,
                ],
              }),
            ],
          }),
        });
        break;
      case "wallpaper":
      case "screenshot":
        return Widget.Revealer({
          revealChild: false,
          transitionDuration: 500,
          transition: "slide_down",
          attribute: {
            id: notification.id,
            hint: notification.hints["hint"]?.get_string()[0],
          },
          setup: (self) => {
            Utils.timeout(500, () => {
              self.reveal_child = true;
            });
          },
          child: Widget.Box({
            class_name: `small-notification ${notification.urgency}`,
            vertical: true,
            spacing: 14,
            children: [
              Widget.Box({
                vertical: true,
                children: [
                  Widget.Box({
                    spacing: 5,
                    children: [title, time, dismiss],
                  }),
                  body,
                ],
              }),
              preview,
              Widget.Box({
                class_name: "small-actions",
                children: [
                  Widget.Button({
                    class_name: "small-action-button",
                    on_clicked: () => {
                      //
                    },
                    hexpand: false,
                    child: Widget.Label("Copy to Clipboard"),
                  }),
                ],
              }),
            ],
          }),
        });
        break;
      case "discord":
        return Widget.Revealer({
          revealChild: false,
          transitionDuration: 500,
          transition: "slide_down",
          attribute: { id: notification.id },
          setup: (self) => {
            Utils.timeout(500, () => {
              self.reveal_child = true;
            });
          },
          child: Widget.Box({
            attribute: { id: notification.id },
            class_name: `small-notification ${notification.urgency}`,
            children: [
              icon,
              Widget.Box({
                vertical: true,
                spacing: 5,
                children: [
                  Widget.Box({
                    spacing: 10,
                    children: [title, time, dismiss],
                  }),
                  body,
                  Widget.Box({
                    class_name: "small-actions",
                    children: [
                      Widget.Button({
                        class_name: "small-action-button",
                        on_clicked: () => {
                          hyprland.messageAsync(`dispatch workspace 3`);
                          // switch to discord
                        },
                        hexpand: false,
                        child: Widget.Label("View"),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
        break;
      default:
        return Widget.Revealer({
          revealChild: false,
          transitionDuration: 500,
          transition: "slide_down",
          attribute: {
            id: notification.id,
            hint: notification.hints["hint"]?.get_string()[0],
          },
          setup: (self) => {
            Utils.timeout(500, () => {
              self.reveal_child = true;
            });
          },
          child: Widget.Box({
            attribute: { id: notification.id },
            class_name: `small-notification ${notification.urgency}`,
            children: [
              icon,
              Widget.Box({
                vertical: true,
                spacing: 5,
                children: [
                  Widget.Box({
                    spacing: 10,
                    children: [title, time, dismiss],
                  }),
                  body,
                  actions,
                ],
              }),
            ],
          }),
        });
        break;
    }
  } else {
    switch (notification.app_name) {
      case "Spotify":
        return Widget.Revealer({
          revealChild: false,
          transitionDuration: 500,
          transition: "slide_down",
          attribute: { id: notification.id, hint: "spotify" },
          setup: (self) => {
            Utils.timeout(500, () => {
              self.reveal_child = true;
            });
          },
          child: Widget.EventBox({
            on_primary_click: notification.dismiss,
            child: Widget.Box(
              {
                class_name: `notification ${notification.urgency}`,
                vertical: true,
              },
              Widget.Box([icon, Widget.Box({ vertical: true }, title, body)]),
              actions
            ),
          }),
        });
      default:
        return Widget.Revealer({
          revealChild: false,
          transitionDuration: 500,
          transition: "slide_down",
          attribute: {
            id: notification.id,
            hint: notification.hints["hint"]?.get_string()[0],
          },
          setup: (self) => {
            Utils.timeout(500, () => {
              self.reveal_child = true;
            });
          },
          child: Widget.EventBox({
            on_primary_click: notification.dismiss,
            child: Widget.Box(
              {
                class_name: `notification ${notification.urgency}`,
                vertical: true,
              },
              Widget.Box([icon, Widget.Box({ vertical: true }, title, body)]),
              actions
            ),
          }),
        });
    }
  }
}

export function breadcrumb() {
  function icon(notificationInstance: Notification) {
    return Widget.Box({
      hpack: "start",
      class_name: "breadcrumb-icon",
      child: NotificationIcon(notificationInstance),
    });
  }

  function add_breadcrumb(_, id: number) {
    const notificationInstance = notifications.getNotification(id);
    if (notificationInstance != null) {
      if (notificationInstance.urgency == "low") {
        const widget = Widget.EventBox({
          attribute: { id: notificationInstance.id },
          child: Widget.Box({
            class_name: "breadcrumb",
            halign: Align.CENTER,
            spacing: 25,
            children: [
              icon(notificationInstance),

              Widget.Box({
                vertical: true,
                children: [
                  Widget.Label({
                    class_name: "breadcrumb-title",
                    label: notificationInstance.summary,
                  }),
                  Widget.Label({
                    class_name: "breadcrumb-body",
                    label: notificationInstance.body,
                  }),
                ],
              }),
            ],
          }),
        });

        breadcrumb_widget.children = [widget, ...breadcrumb_widget.children];
      }
    }
  }

  function remove_breadcrumb(_, id: number) {
    // @ts-ignore
    breadcrumb_widget.children.find((n) => n.attribute.id === id)?.destroy();
  }

  breadcrumb_widget.hook(notifications, add_breadcrumb, "notified");
  breadcrumb_widget.hook(notifications, remove_breadcrumb, "closed");
  breadcrumb_widget.hook(notifications, remove_breadcrumb, "dismissed");

  return Widget.Window({
    name: `breadcrumbs`,
    class_name: "breadcrumbs-window",
    layer: "overlay",
    anchor: ["bottom"],
    child: breadcrumb_widget,
  });
}

export function NotificationPopups(monitor = 0) {
  notifications.popupTimeout = 10000;

  function onNotified(_, id: number) {
    const notificationInstance = notifications.getNotification(id);
    if (notificationInstance != null) {
      if (notificationInstance.urgency == "low") {
        // Breadcrumb
      } else {
        if (hasNotifications.value == false) hasNotifications.setValue(true);
        notifications_count.setValue(notifications_count.value + 1);

        if (!doNotDisturb.value)
          popups_widget.children = [
            ...popups_widget.children,
            NotificationWidget(notificationInstance, false),
          ];
        notifications_widget.children = [
          NotificationWidget(notificationInstance, true),
          ...notifications_widget.children,
        ];
      }
    }
  }

  function onDismissed(_, id: number) {
    const notificationInstance = notifications.getNotification(id);

    if (notificationInstance?.urgency == "low") {
    } else {
      popups_widget.children.find((n) => n.attribute.id === id)?.destroy();
    }
  }

  function onClosed(_, id: number) {
    const notificationInstance = notifications.getNotification(id);
    popups_widget.children.find((n) => n.attribute.id === id)?.destroy();
    if (notificationInstance != null) {
      let index_to_delete = -1;
      let index = 0;
      popups_widget.foreach(function (element) {
        if (element.attribute.id === id) {
          index_to_delete = index;
        }
        index++;
      });

      if (index_to_delete > -1) {
        popups_widget.children.splice(index_to_delete, 1);
      }
    }

    notifications_widget.children.find((n) => n.attribute.id === id)?.destroy();
    if (notifications_widget.children[0] == null) {
      hasNotifications.setValue(false);
    }
  }

  popups_widget.hook(notifications, onDismissed, "dismissed");

  notifications_widget.hook(notifications, onNotified, "notified");
  notifications_widget.hook(notifications, onClosed, "closed");

  return Widget.Window({
    monitor,
    name: `notifications${monitor}`,
    class_name: "notification-popups",
    layer: "overlay",
    anchor: ["top", "right"],
    child: popups_widget,
  });
}
