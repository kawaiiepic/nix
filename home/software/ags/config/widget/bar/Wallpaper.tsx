import { Gtk } from "ags/gtk4";
import { update_wallpaper } from "../desktop/WallpaperManager";

export default () => {
  const label = new Gtk.Label({ label: "󰸉", tooltipText: "Change wallpaper" });

  const onClick = Gtk.GestureClick.new();
  onClick.connect("pressed", () => {
    update_wallpaper();
  });

  label.add_controller(onClick);

  return label;
};
