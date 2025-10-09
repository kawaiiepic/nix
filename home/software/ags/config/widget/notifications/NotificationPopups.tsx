import Notifd from "gi://AstalNotifd";
import Notification from "./Notification";
import { setup_theme } from "../theme";
import { createBinding } from "ags";
import { timeout } from "ags/time";
import { Astal, Gdk, Gtk } from "ags/gtk4";

const notifd = Notifd.get_default();

// see comment below in constructor
const TIMEOUT_DELAY = 8000;

export default function NotificationPopups(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor;

  // Map to keep track of notification widgets by ID
  const notificationWidgets = new Map<number, Gtk.Revealer>();

  // Main container box
  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 5,
  });

  setup_theme(box);

  // Handle new notifications
  notifd.connect("notified", (_, id) => {
    const n = notifd.get_notification(id);

    if (!window.visible) {
      window.show();
    }
    if (!n) return;

    const revealer = Notification({
      notification: n,
      display: gdkmonitor.display,

      // Remove notification when hover is lost
      onHoverLost: () => {
        // revealer.set_reveal_child(false);
        // timeout(200, () => {
        //   if (notificationWidgets.has(id)) {
        //     box.remove(revealer);
        //     notificationWidgets.delete(id);
        //   }
        // });
      },

      // Setup timeout for auto-dismiss
      setup: () => {
        timeout(TIMEOUT_DELAY, () => {
          if (notificationWidgets.has(id)) {
            revealer.set_reveal_child(false);
            timeout(200, () => {
              if (notificationWidgets.has(id)) {
                box.remove(revealer);
                notificationWidgets.delete(id);

                if (notificationWidgets.size === 0) {
                  window.hide();
                }
              }
            });
          }
        });
      },
    });

    notificationWidgets.set(id, revealer);
    box.append(revealer);
  });

  // Handle notifications resolved by external sources
  notifd.connect("resolved", (_, id) => {
    const widget = notificationWidgets.get(id);
    if (widget) {
      widget.set_reveal_child(false);
      timeout(200, () => {
        if (notificationWidgets.has(id)) {
          box.remove(widget);
          notificationWidgets.delete(id);
        }
      });
    }
  });

  // Configure notifd
  notifd.ignoreTimeout = true;

  const dontDisturb = createBinding(notifd, "dontDisturb");

  const window = new Astal.Window({
    layer: Astal.Layer.OVERLAY,
    exclusivity: Astal.Exclusivity.IGNORE,
    cssClasses: ["NotificationPopups"],
    marginTop: 15,
    marginRight: 5,
    anchor: TOP | RIGHT,
    visible: !dontDisturb.get(),
  });

  window.set_child(box);

  return window;
}
