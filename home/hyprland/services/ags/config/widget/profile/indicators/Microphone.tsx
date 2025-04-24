import { Gtk } from "astal/gtk4";
import { ToggleButton } from "../../custom/ToggleButton";

export default () => (
  <box vertical spacing={6}>
    <ToggleButton
      cssClasses={["profile-normal-button", "circular"]}
      halign={Gtk.Align.CENTER}
      tooltipText="Microphone status"
    >
      <label cssClasses={["profile-normal-button-label"]} label="" />
    </ToggleButton>
    <label
      halign={Gtk.Align.CENTER}
      cssClasses={["small-font"]}
      label="Microphone"
    />
  </box>
);
