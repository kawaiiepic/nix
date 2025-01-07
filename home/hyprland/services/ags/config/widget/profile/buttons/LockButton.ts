import { Gtk, Widget } from "astal/gtk3";

export default () =>
  new Widget.Button({
    className: "profile-small-button circular",
    valign: Gtk.Align.CENTER,
    tooltip_text: "Lock",
    child: new Widget.Label({
      className: "profile-small-button-icon",
      label: "",
    }),
  });