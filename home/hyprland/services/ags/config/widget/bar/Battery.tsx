import { Variable, GLib, bind, Process } from "astal";
import Battery from "gi://AstalBattery";

export default () => {
  const bat = Battery.get_default();

  return (
    <icon
      visible={bind(bat, "isPresent")}
      tooltipText={bind(bat, "percentage").as(
        (p) => `${Math.floor(p * 100)} %`,
      )}
      className="battery"
      icon={bind(bat, "batteryIconName")}
    />
  );
};
