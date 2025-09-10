import { App, Gtk } from "astal/gtk4";

import Notifd from "gi://AstalNotifd";
import { GLib, timeout } from "astal";

type Props = {
  onHoverLost(self: Gtk.Box): void;
  notification: Notifd.Notification;
};

export function Notification(props: Props) {
  const { notification: notification, onHoverLost } = props;

  // if (
  //   notification.image &&
  //   GLib.file_test(notification.image, GLib.FileTest.EXISTS)
  // ) {
  //   App.apply_css(`
  //          .image-${notification.id} {
  //          background-image: url(file://${notification.image});
  //          }
  //       `);
  // }

  return (<label label="Boop"/>)
  return (
    <revealer
      setup={(self) => timeout(100, () => (self.revealChild = true))}
      transitionType={Gtk.RevealerTransitionType.SWING_RIGHT}
    >
      <box cssClasses={["Notification", `$urgency(n)}`]}>
        <box vertical spacing={3}>
          <box
            spacing={3}
            halign={Gtk.Align.FILL}
            hexpand
            cssClasses={["header"]}
          >
            <image
              cssClasses={["app-icon"]}
              iconName={
                notification.appIcon ||
                notification.desktopEntry ||
                "dialog-information"
              }
            />

            <label
              cssClasses={["app-name"]}
              halign={Gtk.Align.START}
              label={notification.appName || "Unknown"}
            />

            <label
              cssClasses={["time"]}
              hexpand
              halign={Gtk.Align.END}
              label={notification.time.toString()}
            />
          </box>

          <box spacing={6} cssClasses={["content"]}>
            {notification.image &&
              GLib.file_test(notification.image, GLib.FileTest.EXISTS) && (
                <box
                  valign={Gtk.Align.START}
                  cssClasses={["image", `image-${notification.id}`]}
                ></box>
              )}
            {notification.image &&
              Gtk.IconTheme.new().has_icon(notification.image) && (
                <box valign={Gtk.Align.START} cssClasses={["icon-image"]}>
                  <image
                    iconName={notification.image}
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                  ></image>
                </box>
              )}

            <box vertical>
              <label
                cssClasses={["summary"]}
                wrap
                useMarkup
                halign={Gtk.Align.START}
                xalign={0}
                label={notification.summary}
              />
              {notification.body && (
                <label
                  cssClasses={["body"]}
                  wrap
                  useMarkup
                  halign={Gtk.Align.START}
                  xalign={0}
                  label={notification.body.replace(/&/g, "&amp;")}
                />
              )}
            </box>
          </box>
          {notification.get_actions().length > 0 && (
            <box cssClasses={["actions"]}>
              {notification.get_actions().map(({ label, id }) => (
                <button hexpand onClicked={() => notification.invoke(id)}>
                  <label label={label} halign={Gtk.Align.CENTER} hexpand />
                </button>
              ))}
            </box>
          )}
        </box>
      </box>
    </revealer>
  );
}
