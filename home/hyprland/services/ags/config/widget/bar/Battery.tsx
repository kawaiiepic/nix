import { bind } from "astal";
import AstalBattery from "gi://AstalBattery?version=0.1";

export default () => {
  const bat = AstalBattery.get_default();
  
  return (
    <image
      visible={bind(bat, "isPresent")}
      tooltipText={bind(bat, "percentage").as(
        (p) => `${Math.floor(p * 100)} %`,
      )}
      cssName="battery"
      iconName={bind(bat, "batteryIconName")}
      pixelSize={14}
    />
  );
};