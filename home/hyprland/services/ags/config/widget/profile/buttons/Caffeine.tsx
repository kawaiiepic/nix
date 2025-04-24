import { Gtk, Widget } from "astal/gtk4";
import { ToggleButton } from "../../custom/ToggleButton";
import { bind, execAsync, Variable } from "astal";

var active = Variable(false);

export default () => (
  <box vertical spacing={6}>
    <ToggleButton
      cssClasses={["profile-normal-button", "circular"]}
      halign={Gtk.Align.CENTER}
      active={bind(active)}
      onButtonPressed={(b, s) => {
        active.set(!active.get());
        if (!active.get()) {
          execAsync("systemctl --user stop hypridle");
        } else {
          execAsync("systemctl --user start hypridle");
        }
      }}
      tooltipText="Toggle Caffeine"
    >
      <label cssClasses={["profile-normal-button-label"]} label="" />
    </ToggleButton>
    <label
      halign={Gtk.Align.CENTER}
      cssClasses={["small-font"]}
      label="Caffeine"
    />
  </box>
);
