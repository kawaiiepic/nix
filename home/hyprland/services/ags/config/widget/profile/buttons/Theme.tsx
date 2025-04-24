import { Gtk } from "astal/gtk4";
import { ToggleButton } from "../../custom/ToggleButton";

export default () =>
(
  <box vertical spacing={6}>
    <ToggleButton
      cssClasses={["profile-normal-button", "circular"]}
      halign={Gtk.Align.CENTER}
      tooltipText="Theme"
      active
    >
      <label cssClasses={["profile-normal-button-label"]} label="󰔎" />
    </ToggleButton>
    <box halign={Gtk.Align.CENTER}>
    <label cssClasses={["small-font"]} label="Theme" />
    <label cssClasses={["small-font"]} label="" />
    </box>
    
  </box>
);
