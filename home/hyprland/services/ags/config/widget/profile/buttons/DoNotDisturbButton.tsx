import { Gtk, Widget } from "astal/gtk4";
import { ToggleButton } from "../../custom/ToggleButton";
import Notifd from "gi://AstalNotifd";
import { bind } from "astal";

const notifd = Notifd.get_default();

export default () => (
  <box vertical spacing={6}>
    <ToggleButton
      cssClasses={["profile-normal-button", "circular"]}
      halign={Gtk.Align.CENTER}
      tooltipText="Toggle Do Not Disturb"
      active={bind(notifd, "dontDisturb")}
      onButtonPressed={() => {
        notifd.set_dont_disturb(!notifd.dontDisturb);
      }}
    >
      <label cssClasses={["profile-normal-button-icon"]} label="󰂚" />
    </ToggleButton>
    <label
      halign={Gtk.Align.CENTER}
      cssClasses={["small-font"]}
      label="Do Not Disturb"
    />
  </box>
);
