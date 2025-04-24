import { bind } from "astal";
import Battery from "gi://AstalBattery";

const bat = Battery.get_default();

export default () => (
  <box cssClasses={["battery", "surface0"]} visible={bind(bat, "isPresent")}>
    <image iconName={bind(bat, "batteryIconName")} />
    <label
      label={bind(bat, "percentage").as((p) => `${Math.floor(p * 100)} %`)}
    />
  </box>
);
