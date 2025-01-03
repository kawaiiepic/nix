import Bluetooth from "gi://AstalBluetooth";
import { ToggleButton } from "../../customWidget/ToggleButton";
import { bind } from "astal";
import { Widget } from "astal/gtk3";
const bluetooth = Bluetooth.get_default();

export default () =>
  new ToggleButton({
    className: "profile-normal-button circular",
    tooltip_text: "Toggle Bluetooth",
    onButtonPressEvent: (self) => {
      bluetooth.toggle;
    },
    active: bind(bluetooth, "isPowered"),
    child: new Widget.Icon({
      className: "profile-normal-button-icon",
      icon: bind(bluetooth, "isPowered").as(
        (powered) => `bluetooth-${powered ? "active" : "disabled"}-symbolic`,
      ),
    }),
  });
