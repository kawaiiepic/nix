import Network from "gi://AstalNetwork";
import { Gtk } from "ags/gtk4";

const network = Network.get_default();
const wifi = network?.wifi;
const wired = network?.wired;

const stack = new Gtk.Stack({ valign: Gtk.Align.CENTER });

// Wifi

const boxWifi = new Gtk.Box({
  name: "wifi",
  orientation: Gtk.Orientation.VERTICAL,
  spacing: 6,
});

const imageWifi = new Gtk.Image({
  cssClasses: ["profile-normal-button-icon"],
  iconName: wifi?.iconName || "network-wireless-offline",
});

const toggleButtonWifi = new Gtk.ToggleButton({
  cssClasses: ["profile-normal-button", "circular"],
  halign: Gtk.Align.CENTER,
  active: wifi?.state == Network.DeviceState.ACTIVATED,
  child: imageWifi,
});

toggleButtonWifi.connect("toggled", () => {
  if (wifi) {
    if (toggleButtonWifi.active) {
      wifi.enabled = true;
    } else {
      wifi.enabled = false;
    }
  }
});

const labelWifi = new Gtk.Label({
  cssClasses: ["small-font"],
  valign: Gtk.Align.CENTER,
  label:
    wifi?.state == Network.DeviceState.ACTIVATED
      ? (wifi.ssid || "Unknown") + " "
      : "No Connection ",
});

if (wifi) {
  wifi.connect("state-changed", (source, prevState, newState, reason) => {
    toggleButtonWifi.active = newState == Network.DeviceState.ACTIVATED;
    labelWifi.label =
      newState == Network.DeviceState.ACTIVATED
        ? (wifi.ssid || "Unknown") + " "
        : "No Connection ";
  });

  wifi.connect("notify::enabled", (source) => {
    toggleButtonWifi.active =
      source.enabled && wifi.state == Network.DeviceState.ACTIVATED;
  });

  wifi.connect("notify::icon-name", (source) => {
    imageWifi.iconName = source.iconName || "network-wireless-offline";
  });

  wifi.connect("notify::ssid", (source) => {
    if (source.enabled && wifi.state == Network.DeviceState.ACTIVATED) {
      labelWifi.label = (wifi.ssid || "Unknown") + " ";
    } else {
      labelWifi.label = "No Connection ";
    }
  });
}

// ethernet

const boxWired = new Gtk.Box({
  name: "ethernet",
  orientation: Gtk.Orientation.VERTICAL,
  spacing: 6,
});

const imageWired = new Gtk.Image({
  cssClasses: ["profile-normal-button-icon"],
  iconName: wired?.iconName || "network-wired-disconnected",
});

const toggleButtonWired = new Gtk.Button({
  cssClasses: ["profile-normal-button", "circular"],
  halign: Gtk.Align.CENTER,
  child: imageWired,
});

// Wired connections are typically managed by the system
// and don't need manual toggling, so we just reflect the state

const labelWired = new Gtk.Label({
  cssClasses: ["small-font"],
  label:
    wired?.state == Network.DeviceState.ACTIVATED
      ? "Connected "
      : "No Connection ",
});

if (wired) {
  wired.connect("notify::state", () => {
    labelWired.label =
      wired.state == Network.DeviceState.ACTIVATED
        ? "Connected "
        : "No Connection ";
  });

  wired.connect("notify::icon-name", (source) => {
    imageWired.iconName = source.iconName || "network-wired-disconnected";
  });
}

boxWifi.append(toggleButtonWifi);
boxWifi.append(labelWifi);

boxWired.append(toggleButtonWired);
boxWired.append(labelWired);

stack.add_named(boxWifi, "wifi");
stack.add_named(boxWired, "wired");

// Determine which interface to show
function updateVisibleInterface() {
  if (wired?.state == Network.DeviceState.ACTIVATED) {
    stack.set_visible_child_name("wired");
  } else if (
    wifi &&
    (wifi.state == Network.DeviceState.ACTIVATED || wifi.enabled)
  ) {
    stack.set_visible_child_name("wifi");
  } else if (wired) {
    stack.set_visible_child_name("wired");
  } else if (wifi) {
    stack.set_visible_child_name("wifi");
  } else {
    // Fallback if no interfaces available
    stack.set_visible_child_name("wired");
  }
}

// Update interface visibility when states change
if (wifi) {
  wifi.connect("state-changed", updateVisibleInterface);
  wifi.connect("notify::enabled", updateVisibleInterface);
}

if (wired) {
  wired.connect("notify::state", updateVisibleInterface);
}

// Set initial interface
updateVisibleInterface();

export default () => stack;
