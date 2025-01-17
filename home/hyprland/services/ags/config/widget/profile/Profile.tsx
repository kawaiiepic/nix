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
import { bind, GObject } from "astal";
import Wp from "gi://AstalWp";

export default (gdkmonitor: Gdk.Monitor) => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  
  
  return new Widget.Window({
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

              new Widget.Box({
                className: "profile-pill-button",
                child: new Widget.Label({ label: "2h 15m" }),
              }),
            ],
          }),

          end_widget: new Widget.Box({
            spacing: 5,
            halign: Gtk.Align.END,
            children: [LockButton(), ShutdownButton()],
          }),
        }),

        new Separator({className: "sep"}),

        new Widget.Box({
          className: "pill",
          vertical: true,
          spacing: 12,
          children: [
            new Widget.Box({
              className: "pill",
              spacing: 30,
              halign: Gtk.Align.CENTER,
              hexpand: false,
              vexpand: false,
              children: [
                InternetButton(),
                BluetoothButton(),
                DoNotDisturbButton(),
                NightLightButton(),
              ],
            }),

            new Widget.Box({
              className: "pill",
              spacing: 30,
              halign: Gtk.Align.CENTER,
              hexpand: false,
              vexpand: false,
              children: [
                InternetButton(),
                BluetoothButton(),
                DoNotDisturbButton(),
                NightLightButton(),
              ],
            }),
          ],
        }),

        new Widget.Box({
          className: "pill",
          child: new Widget.Box({
            className: "pill",
            vertical: true,
            spacing: 12,
            children: [
              new Widget.Box({
                className: "profile-progressbar",
                spacing: 15,
                children: [
                  new Widget.Icon({ icon: bind(speaker, "volumeIcon") }),
                  new Widget.Slider({
                    className: "slider",
                    hexpand: true,
                    onDragged: ({ value }) => (speaker.volume = value),
                    value: bind(speaker, "volume"),
                  }),
                ],
              }),

              new Widget.Box({
                className: "profile-progressbar",
                spacing: 15,
                children: [
                  new Widget.Icon({ icon: bind(speaker, "volumeIcon") }),
                  new Widget.Slider({
                    className: "slider",
                    hexpand: true,
                    onDragged: ({ value }) => (speaker.volume = value),
                    value: bind(speaker, "volume"),
                  }),
                ],
              }),
            ],
          }),
        }),

        new Separator({className: "sep"}),

        new Widget.Box({
          className: "calendar",
          child: new Calendar({
            hexpand: true,
          }),
        }),
      ],
    }),
  });
}

export class Calendar extends astalify(Gtk.Calendar) {
  static {
    GObject.registerClass(this);
  }

  constructor(props: ConstructProps<Calendar, Gtk.Calendar.ConstructorProps>) {
    super(props as any);
  }
}

export class Separator extends astalify(Gtk.Separator) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<Separator, Gtk.Separator.ConstructorProps>,
  ) {
    super(props as any);
  }
}
