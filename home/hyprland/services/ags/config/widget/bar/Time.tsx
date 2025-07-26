import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import GLib from "gi://GLib?version=2.0";

const time = createPoll(
  GLib.DateTime.new_now_local().format("%H:%M — %a %d %b")!,
  1000,
  () => GLib.DateTime.new_now_local().format("%H:%M — %a %d %b")!,
);

export default () => {
  const menuButton = new Gtk.MenuButton({
    valign: Gtk.Align.CENTER,
    vexpand: false,
    cssClasses: ["time"],
    popover: new Gtk.Popover({
      position: Gtk.PositionType.BOTTOM,
      child: new Gtk.Calendar(),
    }),
    child: new Gtk.Label({
      label: time.get(),
      cssClasses: ["time"],
    }),
  });

  return menuButton;
};
