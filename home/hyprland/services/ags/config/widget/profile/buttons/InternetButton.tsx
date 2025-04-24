import { bind } from "astal";
import { Astal, Gtk, Widget } from "astal/gtk4";
import Network from "gi://AstalNetwork";
import { ToggleButton } from "../../custom/ToggleButton";

const { wifi, wired } = Network.get_default();
export default () => (
  <stack visibleChildName="ethernet">
    <box name="wifi" vertical spacing={6}>
      <ToggleButton
        cssClasses={["profile-normal-button", "circular"]}
        active={bind(wifi, "enabled")}
        halign={Gtk.Align.CENTER}
      >
        <image
          cssClasses={["profile-normal-button-icon"]}
          iconName={bind(wifi, "iconName")}
        />
      </ToggleButton>
      <box halign={Gtk.Align.CENTER}>
        {bind(wifi, "enabled").as((active) => {
          if (active) {
            return (
              <label cssClasses={["small-font"]} label={bind(wifi, "ssid")} />
            );
          } else {
            return <label cssClasses={["small-font"]} label="No Connection" />;
          }
        })}
        <label cssClasses={["small-font"]} label="" />
      </box>
    </box>
    <box name="ethernet" vertical spacing={6}>
      <ToggleButton
        cssClasses={["profile-normal-button", "circular"]}
        halign={Gtk.Align.CENTER}
        active={bind(wired, "state").as((state) => {
          if (state == Network.DeviceState.ACTIVATED) {
            return true;
          } else {
            return false;
          }
        })}
      >
        <image
          cssClasses={["profile-normal-button-icon"]}
          iconName={bind(wired, "iconName")}
        />
      </ToggleButton>
      <box halign={Gtk.Align.CENTER}>
        {bind(wired, "state").as((state) => {
          if (state == Network.DeviceState.ACTIVATED) {
            return <label cssClasses={["small-font"]} label="Connected" />;
          } else {
            return <label cssClasses={["small-font"]} label="No Connection" />;
          }
        })}
        <label cssClasses={["small-font"]} label="" />
      </box>
    </box>
  </stack>
);