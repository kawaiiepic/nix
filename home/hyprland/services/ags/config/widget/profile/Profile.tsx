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
import Theme from "./buttons/Theme";
import Caffeine from "./buttons/Caffeine";
import Microphone from "./indicators/Microphone";
import Screenshare from "./indicators/Screenshare";
import Screenshot from "./buttons/Screenshot";
import Record from "./buttons/Record";
import Battery from "./Battery";
import Uptime from "./Uptime";

export default (gdkmonitor: Gdk.Monitor) => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return new Widget.Window({
    name: "profile",
    className: "profile",
    visible: false,
    gdkmonitor: gdkmonitor,
    application: App,
    exclusivity: Astal.Exclusivity.EXCLUSIVE,
    marginRight: 50,
    marginBottom: 2,
    keymode: Astal.Keymode.EXCLUSIVE,
    onKeyPressEvent: (self, event) => {
      if (event.get_keyval()[1] === Gdk.KEY_Escape) {
        App.toggle_window("profile");
      }
    },
    anchor: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,

    child: new Widget.Box({
      className: "profile macchiato",
      vertical: true,
      spacing: 20,
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

              Uptime(),
              Battery(),
            ],
          }),

          end_widget: new Widget.Box({
            spacing: 5,
            halign: Gtk.Align.END,
            children: [Screenshot(), ShutdownButton()],
          }),
        }),

        new Separator({}),

        new Widget.Box({
          className: "surface1",
          vertical: true,
          spacing: 6,
          children: [
            new Widget.Box({
              className: "surface1",
              spacing: 12,
              halign: Gtk.Align.CENTER,
              hexpand: false,
              vexpand: false,
              children: [
                InternetButton(),
                BluetoothButton(),
                NightLightButton(),
                Theme(),
              ],
            }),

            new Widget.Box({
              className: "surface1",
              spacing: 35,
              halign: Gtk.Align.CENTER,
              hexpand: false,
              vexpand: false,
              children: [
                Caffeine(),
                DoNotDisturbButton(),
                Microphone(),
                Screenshare(),
              ],
            }),
          ],
        }),

        new Widget.Box({
          className: "surface1",
          vertical: true,
          spacing: 12,
          children: [
            new Widget.Box({
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

        new Separator({}),

        new Widget.Box({
          className: "calendar surface0",
          child: new Calendar({
            hexpand: true,
          }),
        }),
      ],
    }),
  });
};

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
