import { Gtk, Widget } from "astal/gtk3";
import { ToggleButton } from "../../customWidget/ToggleButton";

export default () =>
  new Widget.Box({
    vertical: true,
    spacing: 6,
    children: [
      new ToggleButton({
        className: "profile-normal-button circular",
        hexpand: false,
        halign: Gtk.Align.CENTER,
        tooltip_text: "Toggle Do Not Disturb",
        active: true,
        child: new Widget.Label({
          className: "profile-normal-button-label",
          label: "󰂚",
        }),
      }),

      new Widget.Box({
        child: new Widget.Label({
          className: "small-font",
          label: "Do Not\nDisturb",
        }),
      }),
    ],
  });
