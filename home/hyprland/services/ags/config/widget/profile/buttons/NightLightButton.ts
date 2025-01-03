import { GObject } from "astal";
import { astalify, ConstructProps, Gtk, Widget } from "astal/gtk3";
import { ToggleButton } from "../../customWidget/ToggleButton";

export default () =>
  new ToggleButton({
    className: "profile-normal-button circular",
    tooltip_text: "Toggle Night Light",
    active: true,
    child: new Widget.Label({
      label: "",
    }),
  });