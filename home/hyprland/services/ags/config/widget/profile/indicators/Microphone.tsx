import { Gtk } from "ags/gtk4";

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });

const toggleButton = new Gtk.ToggleButton({
  cssClasses: ["profile-normal-button", "circular"],
  sensitive: false,
  halign: Gtk.Align.CENTER,
  tooltipText: "Microphone status",
  child: new Gtk.Label({
    cssClasses: ["profile-normal-button-label"],
    label: "",
  }),
});

box.append(toggleButton);
box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Microphone" }));

export default () => box;
