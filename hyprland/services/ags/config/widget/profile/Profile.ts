import InternetButton from "./buttons/InternetButton";
import BatteryButton from "./buttons/BatteryButton";
import ShutdownButton from "./buttons/ShutdownButton";
import LockButton from "./buttons/LockButton";
import RefreshButton from "./buttons/RefreshButton";
import BluetoothButton from "./buttons/BluetoothButton";
import DoNotDisturbButton from "./buttons/DoNotDisturbButton";
import NightLightButton from "./buttons/NightLightButton";
import ScreenShare from "./indicator/ScreenShare";
import Mic from "./indicator/Microphone";

export default () =>
  Widget.Window({
    name: "profile",
    class_name: "transparent",
    visible: false,
    keymode: "exclusive",
    setup: (self) =>
      self.keybind("Escape", () => {
        App.closeWindow("profile");
      }),
    anchor: ["top", "right"],
    layer: "top",
    margins: [10, 0],

    child: Widget.Box({
      class_name: "profile",
      spacing: 20,
      vertical: true,
      children: [
        Widget.CenterBox({
          start_widget: Widget.Box({
            spacing: 5,
            children: [
              Widget.Box({
                class_name: "profile-pfp",
                hexpand: false,
                hpack: "center",
                vexpand: false,
                vpack: "center",
                child: Widget.Box({
                  class_name: "circular",
                  css:
                    `background-image: url("/home/mia/.face");` +
                    "background-size: cover;" +
                    "background-repeat: no-repeat;" +
                    "background-position: center;",
                }),
              }),

              BatteryButton(),
            ],
          }),

          end_widget: Widget.Box({
            spacing: 5,
            hpack: "end",
            children: [RefreshButton(), LockButton(), ShutdownButton()],
          }),
        }),

        Widget.Box({
          spacing: 30,
          hpack: "center",
          vexpand: false,
          children: [InternetButton(), BluetoothButton(), DoNotDisturbButton(), NightLightButton()],
        }),

        Widget.Box({
          spacing: 30,
          children: [button(), button(), ScreenShare(), Mic()],
        }),

        Widget.Box({
          class_name: "profile-progressbar",
          spacing: 25,
          children: [
            Widget.Label(""),
            Widget.ProgressBar({
              vpack: "center",
              hexpand: true,
              value: 0.5,
            }),
          ],
        }),

        Widget.Box({
          class_name: "profile-progressbar",
          spacing: 25,
          children: [
            Widget.Label("󰃠"),
            Widget.ProgressBar({
              vpack: "center",
              hexpand: true,
              value: 0.8,
            }),
          ],
        }),
      ],
    }),
  });

function button(
  icon = "dialog-information-symbolic",
  tooltip = "",
  small = false
) {
  if (small) {
    return Widget.Button({
      class_name: "profile-small-button circular",
      tooltip_text: tooltip,
      child: Widget.Icon({
        class_name: "profile-small-button-icon",
        icon: icon,
      }),
    });
  } else {
    return Widget.ToggleButton({
      class_name: "profile-normal-button circular",
      tooltip_text: tooltip,
      child: Widget.Icon({
        class_name: "profile-normal-button-icon",
        icon: icon,
      }),
    });
  }
}
