import { Gtk } from "ags/gtk4";

const button = new Gtk.Button({
  cssClasses: ["profile-small-button", "circular"],
  valign: Gtk.Align.CENTER,
  tooltipText: "Screenshot",
  child: new Gtk.Label({
    cssClasses: ["profile-small-button-icon"],
    label: "",
  }),
});

export default () => button;
