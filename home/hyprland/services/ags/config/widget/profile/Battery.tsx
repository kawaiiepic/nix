import { Gtk } from "ags/gtk4";
import Battery from "gi://AstalBattery";

const bat = Battery.get_default();

const box = new Gtk.Box({
  cssClasses: ["battery", "surface0"],
  visible: bat.isPresent,
});

const image = new Gtk.Image({ iconName: bat.batteryIconName });
const label = new Gtk.Label({ label: `${Math.floor(bat.percentage * 100)} %` });

bat.connect("notify::is-present", (device) => {
  box.visible = device.isPresent;
});

bat.connect("notify::battery-icon-name", (device) => {
  image.iconName = device.batteryIconName;
});

bat.connect("notify::percentage", (device) => {
  label.label = `${Math.floor(device.percentage * 100)} %`;
});

export default () => box;
