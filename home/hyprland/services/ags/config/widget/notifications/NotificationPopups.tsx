import Notifd from "gi://AstalNotifd";
import Notification from "./Notification";
import { type Subscribable } from "astal/binding";
import { GLib, Variable, bind, timeout } from "astal";
import { Astal, Gdk, Gtk } from "astal/gtk4";
import { setup_theme } from "../theme";

const notifd = Notifd.get_default();

// see comment below in constructor
const TIMEOUT_DELAY = 8000;

// The purpose if this class is to replace Variable<Array<Widget>>
// with a Map<number, Widget> type in order to track notification widgets
// by their id, while making it conviniently bindable as an array
class NotifiationMap implements Subscribable {
  // the underlying map to keep track of id widget pairs
  private map: Map<number, Gtk.Widget> = new Map();

  // it makes sense to use a Variable under the hood and use its
  // reactivity implementation instead of keeping track of subscribers ourselves
  private var: Variable<Array<Gtk.Widget>> = Variable([]);

  // notify subscribers to rerender when state changes
  private notifiy() {
    this.var.set([...this.map.values()]);
  }

  public constructor(display: Gdk.Display) {
    const notifd = Notifd.get_default();

    /**
     * uncomment this if you want to
     * ignore timeout by senders and enforce our own timeout
     * note that if the notification has any actions
     * they might not work, since the sender already treats them as resolved
     */
    notifd.ignoreTimeout = true;

    notifd.connect("notified", (_, id) => {
      this.set(
        id,
        Notification({
          notification: notifd.get_notification(id)!,
          display: display,

          // once hovering over the notification is done
          // destroy the widget without calling notification.dismiss()
          // so that it acts as a "popup" and we can still display it
          // in a notification center like widget
          // but clicking on the close button will close it
          onHoverLost: () => this.delete(id), // this.delete(id)

          // notifd by default does not close notifications
          // until user input or the timeout specified by sender
          // which we set to ignore above
          setup: () =>
            timeout(TIMEOUT_DELAY, () => {
              /**
               * uncomment this if you want to "hide" the notifications
               * after TIMEOUT_DELAY
               */

              (this.map.get(id) as Gtk.Revealer).revealChild = false;
              timeout(200, () => this.delete(id)); // this.delete(id)
            }),
        }),
      );
    });

    // notifications can be closed by the outside before
    // any user input, which have to be handled too
    notifd.connect("resolved", (_, id) => {
      this.delete(id);
    });
  }

  private set(key: number, value: Gtk.Widget) {
    // (this.map.get(key)?.parent as Gtk.Box).remove(this.map.get(key)!);
    this.map.set(key, value);
    this.notifiy();
  }

  private delete(key: number) {
    this.map.delete(key);
    this.notifiy();
  }

  // needed by the Subscribable interface
  get() {
    return this.var.get();
  }

  // needed by the Subscribable interface
  subscribe(callback: (list: Array<Gtk.Widget>) => void) {
    return this.var.subscribe(callback);
  }
}

export default function NotificationPopups(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor;
  const notifs = new NotifiationMap(gdkmonitor.display);

  return (
    <window
      layer={Astal.Layer.OVERLAY}
      visible={bind(notifd, "dontDisturb")}
      cssClasses={["NotificationPopups"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      marginTop={5}
      marginRight={5}
      anchor={TOP | RIGHT}
    >
      <box setup={setup_theme} vertical>
        {bind(notifs)}
      </box>
    </window>
  );
}
