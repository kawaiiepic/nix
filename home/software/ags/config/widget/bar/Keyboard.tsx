import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";

export default () => {
  const label = new Gtk.Label({
    label: "",
    tooltipText: "Toggle on-screen Keyboard",
  });

  const onClick = Gtk.GestureClick.new();
  onClick.connect("pressed", () => {
    execAsync("pkill -RTMIN wvkbd");
  });

  label.add_controller(onClick);

  return label;
};
