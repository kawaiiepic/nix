import { Gtk } from "astal/gtk4";

export default () => (
  <button
    cssClasses={["profile-small-button", "circular"]}
    valign={Gtk.Align.CENTER}
    tooltipText="Lock"
  >
    <label cssClasses={["profile-small-button-icon"]} label="" />
  </button>
);
