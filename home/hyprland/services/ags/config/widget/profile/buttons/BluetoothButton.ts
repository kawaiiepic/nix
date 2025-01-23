import Bluetooth from "gi://AstalBluetooth";
import { ToggleButton } from "../../customWidget/ToggleButton";
import { bind } from "astal";
import { Gtk, Widget } from "astal/gtk3";
const bluetooth = Bluetooth.get_default();

export default () =>
  new Widget.Box({
    vertical: true,
    spacing: 6,
    children: [
      new ToggleButton({
        className: "profile-normal-button circular",
        hexpand: false,
        halign: Gtk.Align.CENTER,
        tooltip_text: "Toggle Bluetooth",
        onButtonPressEvent: (self) => {
          bluetooth.toggle;
        },
        active: bind(bluetooth, "isPowered"),
        child: new Widget.Icon({
          className: "profile-normal-button-icon",
          icon: bind(bluetooth, "isPowered").as(
            (powered) =>
              `bluetooth-${powered ? "active" : "disabled"}-symbolic`,
          ),
        }),
      }),
      
      new Widget.Box({
        children: [
          new Widget.Label({
            className: "small-font",
            label: "Bluetooth",
          }),
          new Widget.Label({ className: "small-font", label: " " }),
        ],
      }),
    ],
  });
