import { bind, GObject } from "astal";
import { astalify, ConstructProps, Gtk, Widget } from "astal/gtk3";
import Battery from "gi://AstalBattery";

const bat = Battery.get_default();

export default () => (
  <box className="Battery surface0" visible={bind(bat, "isPresent")}>
    <icon icon={bind(bat, "batteryIconName")} />
    <label
      label={bind(bat, "percentage").as((p) => `${Math.floor(p * 100)} %`)}
    />
  </box>
);
