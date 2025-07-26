import { Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";

const notifd = Notifd.get_default();

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });

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

box.append(toggleButton);
box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Do Not Disturb" }));

export default () => box;
