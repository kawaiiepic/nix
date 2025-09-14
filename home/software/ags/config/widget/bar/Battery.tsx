import { Gtk } from "ags/gtk4";
import AstalBattery from "gi://AstalBattery?version=0.1";

export default () => {
  const battery = AstalBattery.get_default();

  const menuButton = new Gtk.MenuButton({cssClasses: ["entry"], visible: battery.isPresent});
  const box = new Gtk.Box();
  
  const image = new Gtk.Image();
  const label = new Gtk.Label();
  
  box.append(image);
  box.append(label);
  
  battery.connect("notify::is-present", (battery) => {
    menuButton.set_visible(battery.isPresent);
  });
  
  battery.connect("notify::icon-name", (battery) => {
    image.iconName = battery.batteryIconName;
  });
  
  battery.connect("notify::percentage", (battery) => {
    label.label = `${Math.floor(battery.percentage * 100)}%`;
  });
  
  return menuButton;
};
