import {
  App,
  Astal,
  Gtk,
  Gdk,
  Widget,
  astalify,
  type ConstructProps,
} from "astal/gtk3";
import RefreshButton from "./buttons/RefreshButton";
import LockButton from "./buttons/LockButton";
import ShutdownButton from "./buttons/ShutdownButton";
import InternetButton from "./buttons/InternetButton";
import BluetoothButton from "./buttons/BluetoothButton";
import NightLightButton from "./buttons/NightLightButton";
import DoNotDisturbButton from "./buttons/DoNotDisturbButton";

export default (gdkmonitor: Gdk.Monitor) =>
  new Widget.Window({
    name: "profile",
    className: "profile",
    visible: false,
    gdkmonitor: gdkmonitor,
    application: App,
    exclusivity: Astal.Exclusivity.EXCLUSIVE,
    margin: 5,
    keymode: Astal.Keymode.EXCLUSIVE,
    onKeyPressEvent: (self, event) => {
      if (event.get_keyval()[1] === Gdk.KEY_Escape) {
        App.toggle_window("profile");
      }
    },
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,

    child: new Widget.Box({
      className: "profile",
      vertical: true,
      children: [
        new Widget.CenterBox({
          start_widget: new Widget.Box({
            spacing: 5,
            children: [
              new Widget.Box({
                className: "profile-pic",
                hexpand: false,
                halign: Gtk.Align.CENTER,
                vexpand: false,
                valign: Gtk.Align.CENTER,
                css: "background-image: url('/home/mia/.face');",
              }),
              new Widget.CenterBox({
                child: new Widget.Label({ label: "Cutie" }),
              }),

              new Widget.CenterBox({
                child: new Widget.Label({ label: "Cutie" }),
              }),

              new Widget.CenterBox({
                child: new Widget.Label({ label: "Cutie" }),
              }),
            ],
          }),

          end_widget: new Widget.Box({
            spacing: 5,
            halign: Gtk.Align.END,
            children: [RefreshButton(), LockButton(), ShutdownButton()],
          }),
        }),
        
        new Widget.Box({
                 spacing: 30,
                 halign: Gtk.Align.CENTER,
                 vexpand: false,
                 children: [InternetButton(), BluetoothButton(), DoNotDisturbButton(), NightLightButton()],
               }),

        new Widget.Label({ label: "This is to test how it looks. This is to test how it looks. This is to test how it looks. This is to test how it looks." }),
      ],
    }),
  });
