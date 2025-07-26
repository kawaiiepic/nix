import { Gtk } from "ags/gtk4";

var caffeine = false;

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });

const toggleButton = new Gtk.ToggleButton({
  cssClasses: ["profile-normal-button", "circular"],
  halign: Gtk.Align.CENTER,
  active: caffeine,
  tooltipText: "Toggle Caffeine",
  child: new Gtk.Label({
    cssClasses: ["profile-normal-button-label"],
    label: "",
  }),
});

box.append(toggleButton);
box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Caffeine" }));

export default () => box;
