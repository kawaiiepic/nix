import { Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";

export default () => {
  const notifd = Notifd.get_default();

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  });

  const toggleButton = new Gtk.ToggleButton({
    cssClasses: ["profile-normal-button", "circular"],
    halign: Gtk.Align.CENTER,
    active: notifd.dontDisturb,
    tooltipText: "Toggle Do Not Disturb",
    child: new Gtk.Label({
      cssClasses: ["profile-normal-button-label"],
      label: "󰂚",
    }),
  });

  notifd.connect("notify::dont-disturb", () => {
    toggleButton.active = notifd.dontDisturb;
  });

  toggleButton.connect("toggled", () => {
    notifd.dontDisturb = toggleButton.active;
  });

  box.append(toggleButton);
  box.append(
    new Gtk.Label({ cssClasses: ["small-font"], label: "Do Not Disturb" }),
  );
  return box;
};
