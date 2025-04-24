import { exec, GLib } from "astal";
import { App, Astal, Gdk } from "astal/gtk4";
import { setup_theme } from "../theme";

const HOSTNAME = GLib.get_host_name();

export default (gdkmonitor: Gdk.Monitor) => (
  <window
    name="logout"
    cssClasses={["logout"]}
    gdkmonitor={gdkmonitor}
    application={App}
    exclusivity={Astal.Exclusivity.IGNORE}
    keymode={Astal.Keymode.EXCLUSIVE}
    anchor={Astal.WindowAnchor.TOP}
    onKeyPressed={(self, keyval) => {
      if (keyval === Gdk.KEY_Escape) {
        App.toggle_window("logout");
      }
    }}
  >
    <box setup={setup_theme} spacing={12}>
      <box cssClasses={["logout"]} spacing={12}>
        <button
          cssClasses={["circular"]}
          tooltipText="Shutdown"
          onButtonPressed={() => exec(["bash", "-c", "shutdown"])}
          label="󰐥"
        />
        <button
          cssClasses={["circular"]}
          tooltipText="Reboot"
          onButtonPressed={() => exec(["bash", "-c", "reboot"])}
          label="󰜉"
        />
        <button
          cssClasses={["circular"]}
          tooltipText={HOSTNAME == "steamdeck" ? "Return to Steam" : "Logout"}
          onButtonPressed={() => exec(["bash", "-c", "hyprexit"])}
          label={HOSTNAME == "steamdeck" ? "" : "󰍃"}
        />
        <button
          cssClasses={["circular"]}
          tooltipText="Reboot to Windows"
          onButtonPressed={() => exec(["bash", "-c", "reboot-to-windows"])}
          label=""
        />
        <button
          cssClasses={["circular"]}
          tooltipText="Cancel"
          onButtonPressed={() => App.toggle_window("logout")}
          label=""
        />
      </box>
    </box>
  </window>
);
