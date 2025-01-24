import { bind, GObject, Variable } from "astal";
import { astalify, ConstructProps, Gtk, Widget } from "astal/gtk3";
import Battery from "gi://AstalBattery";

const bat = Battery.get_default();

const uptime = Variable("").poll(1000, ["bash", "-c", "uptime | awk -F'( |,|:)+' '{print $6\"d \" $8\"h \"$9\"m\"}'"]);

export default () => (
  <box className="surface0" spacing={6}>
    <label label="" />
    <label label={bind(uptime)} />
  </box>
);
