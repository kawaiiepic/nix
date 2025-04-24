import { Astal, Gtk } from "astal/gtk4";
import { ToggleButton } from "../../custom/ToggleButton";
import { bind, execAsync, Variable } from "astal";

var active = Variable(false);

export default () => (
  <box vertical spacing={6}>
    <ToggleButton
      cssClasses={["profile-normal-button", "circular"]}
      halign={Gtk.Align.CENTER}
      tooltipText="Toggle Night Light"
      active={bind(active)}
      onButtonPressed={(b, s) => {
        active.set(!active.get());
        if (!active.get()) {
          execAsync("hyprctl hyprsunset temperature 2500");
        } else {
          execAsync("hyprctl hyprsunset identity");
        }
      }}
    >
      <label cssClasses={["profile-normal-button-icon"]} label="" />
    </ToggleButton>
    <label
      halign={Gtk.Align.CENTER}
      cssClasses={["small-font"]}
      label="Night Light"
    />
  </box>
);
