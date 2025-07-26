import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import { exec } from "ags/process";
import { createPoll } from "ags/time";

const uptime = createPoll("", 1000, (prev) =>
  exec([
    "bash",
    "-c",
    "uptime | sed -E 's/^[^,]*up *//; s/, *[[:digit:]]* users.*//; s/ min/m/; s/([[:digit:]]+):0?([[:digit:]]+)/\\1 hours, \\2 minutes/'",
  ]),
);

const box = new Gtk.Box({ cssClasses: ["surface0"], spacing: 6 });

box.append(new Gtk.Label({ label: "" }));

const label = new Gtk.Label();
box.append(label);

uptime.subscribe(() => {
  label.label = uptime.get();
});

export default () => box;
