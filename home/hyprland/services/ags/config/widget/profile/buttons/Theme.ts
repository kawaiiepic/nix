import { bind } from "astal";
import { Gtk, Widget } from "astal/gtk3";
import Network from "gi://AstalNetwork";
import { ToggleButton } from "../../customWidget/ToggleButton";

const { wifi } = Network.get_default();
export default () =>
  new Widget.Box({
    vertical: true,
    spacing: 6,
    children: [
      new Widget.Button({
        className: "profile-normal-button circular",
        hexpand: false,
        halign: Gtk.Align.CENTER,
        
        child: new Widget.Label({
          className: "profile-normal-button-label",
          label: "󰔎",
        }),
      }),
      new Widget.Box({
        children: [
          new Widget.Label({
            className: "small-font",
            label: "Theme",
          }),
          new Widget.Label({ className: "small-font", label: " " }),
        ],
      }),
    ],
  });
