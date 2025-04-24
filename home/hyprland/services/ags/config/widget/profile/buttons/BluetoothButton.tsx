import Bluetooth from "gi://AstalBluetooth";
import { bind } from "astal";
import { astalify, Gtk, Widget } from "astal/gtk4";
import { ToggleButton } from "../../custom/ToggleButton";

const bluetooth = Bluetooth.get_default();

export default () => (
  <box vertical spacing={6}>
    <ToggleButton
      cssClasses={["profile-normal-button", "circular"]}
      halign={Gtk.Align.CENTER}
      tooltipText="Toggle Bluetooth"
      onButtonPressed={() => bluetooth.toggle()}
      active={bind(bluetooth, "isPowered")}
    >
      <image
        cssClasses={["profile-normal-button-icon"]}
        iconName={bind(bluetooth, "isPowered").as(
          (powered) => `bluetooth-${powered ? "active" : "disabled"}-symbolic`,
        )}
      ></image>
    </ToggleButton>
    <box halign={Gtk.Align.CENTER}>
      <label cssClasses={["small-font"]} label="Bluetooth" />
      <label cssClasses={["small-font"]} label="" />
    </box>
  </box>
);
// Widget.Box({
//   vertical: true,
//   spacing: 6,
//   children: [
//     ToggleButton({
//       cssClasses: ["profile-normal-button", "circular"],
//       hexpand: false,
//       halign: Gtk.Align.CENTER,
//       tooltip_text: "Toggle Bluetooth",
//       onButtonPressEvent: (self) => {
//         bluetooth.toggle;
//       },
//       active: bind(bluetooth, "isPowered"),
//       child: Widget.Image({
//         cssClasses: ["profile-normal-button-icon"],
//         iconName: bind(bluetooth, "isPowered").as(
//           (powered) =>
//             `bluetooth-${powered ? "active" : "disabled"}-symbolic`,
//         ),
//       }),
//     }),

//     Widget.Box({
//       children: [
//         Widget.Label({
//           cssClasses: ["small-font"],
//           label: "Bluetooth",
//         }),
//         Widget.Label({ cssClasses: ["small-font"], label: " " }),
//       ],
//     }),
//   ],
// });
