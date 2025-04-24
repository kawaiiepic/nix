import { App, Gtk, Widget } from "astal/gtk4";

export default () => (
  <button
    cssClasses={["profile-small-button", "circular"]}
    valign={Gtk.Align.CENTER}
    tooltipText={"Shutdown"}
    onClicked={() => {
      App.toggle_window("logout");
      App.toggle_window("profile");
    }}
  >
    <label cssClasses={["profile-small-button-icon"]} label={""}></label>
  </button>
);
