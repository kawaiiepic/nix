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
      spacing: 12,
      children: [
        new Widget.CenterBox({
          start_widget: new Widget.Box({
            spacing: 5,
            children: [
              new Widget.Box({
                className: "profile-pfp",
                hexpand: false,
                halign: Gtk.Align.CENTER,
                vexpand: false,
                valign: Gtk.Align.CENTER,
                tooltipText: "mia@dreamhouse",
                css: "background-image: url('/home/mia/.face');",
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
          children: [
            InternetButton(),
            BluetoothButton(),
            DoNotDisturbButton(),
            NightLightButton(),
          ],
        }),

        new Widget.Box({
          spacing: 30,
          halign: Gtk.Align.CENTER,
          vexpand: false,
          children: [
            InternetButton(),
            BluetoothButton(),
            DoNotDisturbButton(),
            NightLightButton(),
          ],
        }),

        new Widget.Box({
          className: "profile-progressbar",
          spacing: 25,
          children: [
            new Widget.Label({halign: Gtk.Align.CENTER, label: "" }),
            new Widget.LevelBar({
              valign: Gtk.Align.CENTER,
              hexpand: true,
              value: 0.5,
            }),
          ],
        }),
        
        new Widget.Box({
          className: "profile-progressbar",
          spacing: 25,
          children: [
            new Widget.Label({halign: Gtk.Align.CENTER, label: "󰃠" }),
            new Widget.LevelBar({
              valign: Gtk.Align.CENTER,
              hexpand: true,
              value: 0.8,
            }),
          ],
        }),

        new Widget.Label({ label: "Uptime: 23 hrs" }),
      ],
    }),
  });
