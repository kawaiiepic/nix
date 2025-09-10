import { Gtk } from "ags/gtk4";

export default () => {
  const label = new Gtk.Label({ label: "󰸉", tooltipText: "Change wallpaper" });
  return label;
}
