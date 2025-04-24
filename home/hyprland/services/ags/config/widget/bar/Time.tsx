import { Variable, GLib } from "astal";
import { Gtk } from "astal/gtk4";

const time = Variable<string>("").poll(
  1000,
  () => GLib.DateTime.new_now_local().format("%H:%M — %a %d %b")!,
);

export default () => (
  <menubutton valign={Gtk.Align.CENTER} vexpand={false} cssClasses={["time"]} canFocus={false}>
    <label cssClasses={["time"]} onDestroy={() => time.drop()} label={time()} />
    <popover>
    {Gtk.Calendar.new()}
    </popover>
  </menubutton>
);
