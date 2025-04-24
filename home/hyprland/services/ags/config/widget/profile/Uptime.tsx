import { bind, GObject, Variable } from "astal";

const uptime = Variable("").poll(1000, [
  "bash",
  "-c",
  "uptime | sed -E 's/^[^,]*up *//; s/, *[[:digit:]]* users.*//; s/ min/m/; s/([[:digit:]]+):0?([[:digit:]]+)/\\1 hours, \\2 minutes/'",
]);

export default () => (
  <box cssClasses={["surface0"]} spacing={6}>
    <label label="" />
    <label label={bind(uptime)} />
  </box>
);
