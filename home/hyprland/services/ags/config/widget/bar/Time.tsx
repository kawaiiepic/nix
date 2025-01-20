import { Variable, GLib, bind, Process } from "astal";

export default ({ format = "%H:%M" }) => { //  — %a %d %b
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!,
  );

  return (
    <label className="time" onDestroy={() => time.drop()} label={time()} />
  );
}