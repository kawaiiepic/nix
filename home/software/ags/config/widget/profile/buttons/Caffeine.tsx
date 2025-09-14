import { Gtk } from "ags/gtk4";
import { send_notification } from "../../utils";

export default () => {
  var caffeine = false;

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  });

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
  
  toggleButton.connect("toggled", () => {
    caffeine = !caffeine;
    send_notification("Caffeine", "Caffeine toggled");
  });

  box.append(toggleButton);
  box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Caffeine" }));
  return box;
};
