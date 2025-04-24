import { execAsync } from "astal";
import { App, Gtk } from "astal/gtk4";

export default () => (
  <button
    cssClasses={["profile-small-button", "circular"]}
    valign={Gtk.Align.CENTER}
    tooltipText={"Screenshot"}
    onClicked={() => {
      App.toggle_window("profile");
      execAsync(["bash", "-c", "screenshot"]);
    }}
  >
    <label cssClasses={["profile-small-button-icon"]} label={""} />
  </button>
);
