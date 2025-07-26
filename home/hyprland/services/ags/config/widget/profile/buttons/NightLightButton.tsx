import { Gtk } from "ags/gtk4";

var nightLight = true;

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });

const toggleButton = new Gtk.ToggleButton({
  cssClasses: ["profile-normal-button", "circular"],
  halign: Gtk.Align.CENTER,
  active: nightLight,
  tooltipText: "Toggle Night Light",
  child: new Gtk.Label({
    cssClasses: ["profile-normal-button-label"],
    label: "",
  }),
});

box.append(toggleButton);
box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Night Light" }));

export default () => box;
