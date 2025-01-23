import { bind, GObject, Variable } from "astal";
import { astalify, ConstructProps, Gtk, Widget } from "astal/gtk3";
import Battery from "gi://AstalBattery";

const bat = Battery.get_default();

const uptime = Variable("").poll(1000, ["bash", "-c", "uptime | sed -E 's/^[^,]*up *//; s/, *[[:digit:]]* users?.*//; s/days/giorni/; s/day/giorno/; s/min/min./; s/([[:digit:]]+):0?([[:digit:]]+)/\\1h \\2m/;'"]);

export default () => (
  <box className="surface0" spacing={6}>
    <label label="" />
    <label label={bind(uptime)} />
  </box>
);
