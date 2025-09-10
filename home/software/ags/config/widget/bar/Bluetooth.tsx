import { Gtk } from "ags/gtk4";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";

export default () => {
  const bluetooth = AstalBluetooth.get_default();
  
  const box = new Gtk.Box({tooltipText: "Bluetooth"});
  
  box.append(new Gtk.Image({iconName: "bluetooth-symbolic", pixelSize: 14}));
  
  bluetooth.connect("notify::is-powered", () => {
    box.visible = bluetooth.isPowered;
  });
  
  return box;
};