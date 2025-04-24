import { bind } from "astal";
import { hook, Widget } from "astal/gtk4";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";

export default () => {
  const bluetooth = AstalBluetooth.get_default();

  return (
    <box
      visible={bind(bluetooth, "isPowered")}
      tooltipText={"Bluetooth"}
    >
      <image iconName={"bluetooth-symbolic"} pixelSize={14}></image>
    </box>
  );
};