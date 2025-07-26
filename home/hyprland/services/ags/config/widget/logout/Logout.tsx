import GLib from "gi://GLib?version=2.0";
import { setup_theme } from "../theme";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import app from "ags/gtk4/app";

const HOSTNAME = GLib.get_host_name();

export default (gdkmonitor: Gdk.Monitor) => {
  const window = new Astal.Window({
    name: "logout",
    namespace: "logout",
    gdkmonitor: gdkmonitor,
    application: app,
    cssClasses: ["logout"],
    exclusivity: Astal.Exclusivity.IGNORE,
    keymode: Astal.Keymode.EXCLUSIVE,
    anchor:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT |
      Astal.WindowAnchor.BOTTOM,
    layer: Astal.Layer.OVERLAY,
    visible: false,
  });

  // Create overlay background for click-outside detection
  const overlay = new Gtk.Overlay();
  const backgroundButton = new Gtk.Button({
    cssClasses: ["logout-background"],
    hexpand: true,
    vexpand: true,
  });

  // Main container for logout options
  const mainBox = new Gtk.Box({
    cssClasses: ["logout-container"],
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 24,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });

  // Title
  const titleLabel = new Gtk.Label({
    label: "Power Options",
    cssClasses: ["logout-title"],
    halign: Gtk.Align.CENTER,
  });

  // Buttons container
  const buttonsBox = new Gtk.Box({
    cssClasses: ["logout-buttons"],
    spacing: 16,
    halign: Gtk.Align.CENTER,
  });

  // Create power option buttons
  const shutdownButton = new Gtk.Button({
    cssClasses: ["logout-button", "shutdown"],
    tooltipText: "Shutdown",
    widthRequest: 80,
    heightRequest: 80,
  });
  const shutdownIcon = new Gtk.Label({
    label: "󰐥",
    cssClasses: ["logout-icon"],
  });
  const shutdownLabel = new Gtk.Label({
    label: "Shutdown",
    cssClasses: ["logout-label"],
  });
  const shutdownContent = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });
  shutdownContent.append(shutdownIcon);
  shutdownContent.append(shutdownLabel);
  shutdownButton.set_child(shutdownContent);

  const rebootButton = new Gtk.Button({
    cssClasses: ["logout-button", "reboot"],
    tooltipText: "Reboot",
    widthRequest: 80,
    heightRequest: 80,
  });
  const rebootIcon = new Gtk.Label({
    label: "󰜉",
    cssClasses: ["logout-icon"],
  });
  const rebootLabel = new Gtk.Label({
    label: "Reboot",
    cssClasses: ["logout-label"],
  });
  const rebootContent = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });
  rebootContent.append(rebootIcon);
  rebootContent.append(rebootLabel);
  rebootButton.set_child(rebootContent);

  const logoutButton = new Gtk.Button({
    cssClasses: ["logout-button", "logout"],
    tooltipText: HOSTNAME == "steamdeck" ? "Return to Steam" : "Logout",
    widthRequest: 80,
    heightRequest: 80,
  });
  const logoutIcon = new Gtk.Label({
    label: HOSTNAME == "steamdeck" ? "" : "󰍃",
    cssClasses: ["logout-icon"],
  });
  const logoutLabel = new Gtk.Label({
    label: HOSTNAME == "steamdeck" ? "Steam" : "Logout",
    cssClasses: ["logout-label"],
  });
  const logoutContent = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });
  logoutContent.append(logoutIcon);
  logoutContent.append(logoutLabel);
  logoutButton.set_child(logoutContent);

  const suspendButton = new Gtk.Button({
    cssClasses: ["logout-button", "suspend"],
    tooltipText: "Suspend",
    widthRequest: 80,
    heightRequest: 80,
  });
  const suspendIcon = new Gtk.Label({
    label: "󰒲",
    cssClasses: ["logout-icon"],
  });
  const suspendLabel = new Gtk.Label({
    label: "Suspend",
    cssClasses: ["logout-label"],
  });
  const suspendContent = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });
  suspendContent.append(suspendIcon);
  suspendContent.append(suspendLabel);
  suspendButton.set_child(suspendContent);

  const lockButton = new Gtk.Button({
    cssClasses: ["logout-button", "lock"],
    tooltipText: "Lock Screen",
    widthRequest: 80,
    heightRequest: 80,
  });
  const lockIcon = new Gtk.Label({
    label: "󰌾",
    cssClasses: ["logout-icon"],
  });
  const lockLabel = new Gtk.Label({
    label: "Lock",
    cssClasses: ["logout-label"],
  });
  const lockContent = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });
  lockContent.append(lockIcon);
  lockContent.append(lockLabel);
  lockButton.set_child(lockContent);

  const cancelButton = new Gtk.Button({
    cssClasses: ["logout-button", "cancel"],
    tooltipText: "Cancel",
    widthRequest: 80,
    heightRequest: 80,
  });
  const cancelIcon = new Gtk.Label({
    label: "",
    cssClasses: ["logout-icon"],
  });
  const cancelLabel = new Gtk.Label({
    label: "Cancel",
    cssClasses: ["logout-label"],
  });
  const cancelContent = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
  });
  cancelContent.append(cancelIcon);
  cancelContent.append(cancelLabel);
  cancelButton.set_child(cancelContent);

  // Function to close the logout window
  const closeLogout = () => {
    window.set_visible(false);
  };

  // Button event handlers
  shutdownButton.connect("clicked", () => {
    closeLogout();
    execAsync(["systemctl", "poweroff"]).catch(() => {});
  });

  rebootButton.connect("clicked", () => {
    closeLogout();
    execAsync(["systemctl", "reboot"]).catch(() => {});
  });

  logoutButton.connect("clicked", () => {
    closeLogout();
    if (HOSTNAME == "steamdeck") {
      execAsync(["steamos-session-select", "steam"]).catch(() => {});
    } else {
      execAsync(["hyprctl", "dispatch", "exit"]).catch(() => {});
    }
  });

  suspendButton.connect("clicked", () => {
    closeLogout();
    execAsync(["systemctl", "suspend"]).catch(() => {});
  });

  lockButton.connect("clicked", () => {
    closeLogout();
    execAsync(["hyprlock"]).catch(() => {});
  });

  cancelButton.connect("clicked", () => {
    closeLogout();
  });

  // Click outside to close
  backgroundButton.connect("clicked", () => {
    closeLogout();
  });

  // Escape key to close
  const keyController = new Gtk.EventControllerKey();
  keyController.connect("key-pressed", (controller, keyval, keycode, state) => {
    if (keyval === Gdk.KEY_Escape) {
      closeLogout();
      return true;
    }
    return false;
  });
  window.add_controller(keyController);

  // Assemble the layout
  buttonsBox.append(shutdownButton);
  buttonsBox.append(rebootButton);
  buttonsBox.append(logoutButton);
  buttonsBox.append(suspendButton);
  buttonsBox.append(lockButton);
  buttonsBox.append(cancelButton);

  mainBox.append(titleLabel);
  mainBox.append(buttonsBox);

  overlay.set_child(backgroundButton);
  overlay.add_overlay(mainBox);

  setup_theme(overlay);
  window.set_child(overlay);

  return window;
};
