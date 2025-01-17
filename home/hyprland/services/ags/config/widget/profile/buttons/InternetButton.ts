import { bind } from "astal";
import { Widget } from "astal/gtk3";
import Network from "gi://AstalNetwork";
import { ToggleButton } from "../../customWidget/ToggleButton";

const { wifi } = Network.get_default();
export default () =>
  new Widget.Box({
    vertical: true,
    hexpand: false,
    children: [
      new ToggleButton({
        vexpand: false,
        hexpand: false,
        className: "profile-normal-button circular",
        active: true,
        child: new Widget.Icon({
          className: "profile-normal-button-icon",
          icon: bind(wifi, "iconName"),
        }),
      }),
      new Widget.Box({
        hexpand: false,
        children: [
          new Widget.Label({
            hexpand: false,
            label: bind(wifi, "ssid"),
          }),
          new Widget.Label({ label: "" }),
        ],
      }),
    ],
  });
