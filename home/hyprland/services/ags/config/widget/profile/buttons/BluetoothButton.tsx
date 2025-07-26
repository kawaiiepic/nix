import { Gtk } from "ags/gtk4";
import Bluetooth from "gi://AstalBluetooth";

const bluetooth = Bluetooth.get_default();

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });

const image = new Gtk.Image({
  cssClasses: ["profile-normal-button-icon"],
  iconName: `bluetooth-${bluetooth.isPowered ? "active" : "disabled"}-symbolic`,
});

const toggleButton = new Gtk.ToggleButton({
  cssClasses: ["profile-normal-button", "circular"],
  halign: Gtk.Align.CENTER,
  active: bluetooth.isPowered,
  tooltipText: "Toggle Bluetooth",
  child: image,
});

const label = new Gtk.Label({
  cssClasses: ["small-font"],
  label: "Bluetooth ",
});

bluetooth.connect("notify::is-powered", (source) => {
  image.iconName = `bluetooth-${source.isPowered ? "active" : "disabled"}-symbolic`;
});

box.append(toggleButton);
box.append(label);

export default () => box;
