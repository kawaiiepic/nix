import { Gtk } from "ags/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";
import Pango from "gi://Pango?version=1.0";
import {
  focusedWindow,
  Window,
  windows,
  workspaceName,
} from "../services/niri";

export default () => {
  const apps = new AstalApps.Apps();

  const box = new Gtk.Box({
    cssClasses: ["focused-client"],
    orientation: Gtk.Orientation.HORIZONTAL,
    spacing: 8,
    margin_start: 8,
    margin_end: 8,
    margin_top: 4,
    margin_bottom: 4,
  });

  const icon = new Gtk.Image({
    iconName: "desktop",
    pixelSize: 18,
    valign: Gtk.Align.CENTER,
  });

  // App name and title container
  const textBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    valign: Gtk.Align.CENTER,
    spacing: 2,
  });

  // App name
  const appLabel = new Gtk.Label({
    label: "Desktop",
    cssClasses: ["app-name"],
    halign: Gtk.Align.START,
    ellipsize: 3, // ELLIPSIZE_END
    maxWidthChars: 25,
  });
  textBox.append(appLabel);

  // Window title (only if different from app name)
  const titleLabel = new Gtk.Label({
    label: "No Window",
    visible: false,
    cssClasses: ["window-title"],
    halign: Gtk.Align.START,
    ellipsize: Pango.EllipsizeMode.END, // ELLIPSIZE_END
    maxWidthChars: 40,
  });
  textBox.append(titleLabel);

  box.append(icon);
  box.append(textBox);

  windows.subscribe(() => {
    const window: Window | null = focusedWindow();
    const app = apps.list.find(
      (a) => a.entry.replace(/\.desktop$/, "") === window?.app_id,
    );
    const appName = app?.name || window?.app_id || "Desktop";
    const title = window?.title || "No Window";

    // App icon
    if (app?.iconName) {
      icon.iconName = app.iconName;
    } else if (window) {
      icon.iconName = "application-x-executable";
    } else {
      icon.iconName = "desktop";
    }

    appLabel.label = appName;

    titleLabel.label = title;
    titleLabel.visible = window != null ? true : false;

    // Set up tooltip with detailed information
    const tooltipText = window
      ? [
          `App: ${appName}`,
          `Title: ${title}`,
          `Class: ${window?.app_id}`,
          `Workspace: ${workspaceName(window.workspace_id)}`,
          `PID: ${window?.pid}`,
          window?.is_floating ? "Floating: Yes" : "Floating: No",
        ].join("\n")
      : "";

    box.set_tooltip_text(tooltipText);
  });

  return box;
};
