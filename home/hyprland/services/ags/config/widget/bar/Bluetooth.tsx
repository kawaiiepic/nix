import { Widget } from "astal/gtk3";
import Bluetooth from "gi://AstalBluetooth";

export default () => {
  const bluetooth = Bluetooth.get_default();

  function setup(box: Widget.Box) {
    box.hook(bluetooth, "notify::devices", (self) => {
      self.children = bluetooth.devices.map(({ icon, alias }) => {
        return (
          <box
            tooltipText={alias}
            children={[<icon icon={`${icon}-symbolic`} />]}
          />
        );
      });
    });
  }

  return <box className="bluetooth" setup={setup}></box>;
};
