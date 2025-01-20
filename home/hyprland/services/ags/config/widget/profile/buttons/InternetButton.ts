import { bind } from "astal";
import { Gtk, Widget } from "astal/gtk3";
import Network from "gi://AstalNetwork";
import { ToggleButton } from "../../customWidget/ToggleButton";

const { wifi } = Network.get_default();
export default () =>
  new Widget.Box({
    vertical: true,
    children: [
      new ToggleButton({
        className: "profile-normal-button circular",
        hexpand: false,
        halign: Gtk.Align.CENTER,
        
        active: true,
        child: new Widget.Icon({
          className: "profile-normal-button-icon",
          icon: bind(wifi, "iconName"),
        }),
      }),
      new Widget.Box({
        children: [
          new Widget.Label({
            label: bind(wifi, "ssid"),
          }),
          new Widget.Label({ label: "" }),
        ],
      }),
    ],
  });
