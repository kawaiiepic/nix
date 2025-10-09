import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import GLib from "gi://GLib?version=2.0";

const time = createPoll(
  "",
  1000,
  () => GLib.DateTime.new_now_local().format("%I:%M %p — %a %d %b")!.replace(/^0/, ""),
);

export default () => {
  const timeLabel = new Gtk.Label({
    label: time.get(),
    cssClasses: ["time"],
  });
  const menuButton = new Gtk.MenuButton({
    valign: Gtk.Align.CENTER,
    vexpand: false,
    cssClasses: ["time"],
    popover: new Gtk.Popover({
      position: Gtk.PositionType.BOTTOM,
      child: new Gtk.Calendar(),
    }),
    child: timeLabel,
  });

  time.subscribe(() => {
    timeLabel.label = time.get();
  });

  return menuButton;
};
