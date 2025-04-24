import { Process } from "astal";
import { Gtk } from "astal/gtk4";

export default () => (
  <button
    cssClasses={["profile-small-button", "circular"]}
    onClicked={() => {
      Process.exec("hyprexit");
    }}
    valign={Gtk.Align.CENTER}
    tooltipText="Refresh"
  >
    <label cssClasses={["profile-small-button-icon"]} label="" />
  </button>
);
