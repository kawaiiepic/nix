import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import Pango from "gi://Pango?version=1.0";

export default () => {
  const hypr = AstalHyprland.get_default();
  const client = createBinding(hypr, "focusedClient");

  const apps = new AstalApps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
  });

  const currentClient = client.get();
  
  const app = currentClient ? apps.fuzzy_query(currentClient.class)[0] : null;
  const appName = app?.name || currentClient?.class || "Desktop";
  const title = currentClient?.title || "No Window";

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
    iconName: app?.iconName || "desktop",
    pixelSize: 16,
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
    label: appName,
    cssClasses: ["app-name"],
    halign: Gtk.Align.START,
    ellipsize: 3, // ELLIPSIZE_END
    maxWidthChars: 25,
  });
  textBox.append(appLabel);

  // Window title (only if different from app name)
  const titleLabel = new Gtk.Label({
    label: title,
    visible: title !== appName && title !== "No Window",
    cssClasses: ["window-title"],
    halign: Gtk.Align.START,
    ellipsize: Pango.EllipsizeMode.END, // ELLIPSIZE_END
    maxWidthChars: 40,
  });
  textBox.append(titleLabel);

  const tooltipText = currentClient
    ? [
        `App: ${appName}`,
        `Title: ${title}`,
        `Class: ${currentClient.class}`,
        `Workspace: ${currentClient.workspace?.name || currentClient.workspace?.id || "Unknown"}`,
        `PID: ${currentClient.pid}`,
        `Address: ${currentClient.address}`,
        currentClient.fullscreen ? "Fullscreen: Yes" : "Fullscreen: No",
        currentClient.floating ? "Floating: Yes" : "Floating: No",
      ].join("\n")
    : "No focused window";
  box.set_tooltip_text(tooltipText);

  box.append(icon);
  box.append(textBox);

  client.subscribe(() => {
    const currentClient = client.get();
    const app = currentClient ? apps.fuzzy_query(currentClient.class)[0] : null;
    const appName = app?.name || currentClient?.class || "Desktop";
    const title = currentClient?.title || "No Window";

    // App icon
    if (app?.iconName) {
      icon.iconName = app.iconName;
    } else if (currentClient) {
      icon.iconName = "application-x-executable";
    } else {
      icon.iconName = "desktop";
    }

    appLabel.label = appName;

    titleLabel.label = title;
    titleLabel.visible = title !== appName && title !== "No Window";

    // Set up tooltip with detailed information
    const tooltipText = currentClient
      ? [
          `App: ${appName}`,
          `Title: ${title}`,
          `Class: ${currentClient.class}`,
          `Workspace: ${currentClient.workspace?.name || currentClient.workspace?.id || "Unknown"}`,
          `PID: ${currentClient.pid}`,
          `Address: ${currentClient.address}`,
          currentClient.fullscreen ? "Fullscreen: Yes" : "Fullscreen: No",
          currentClient.floating ? "Floating: Yes" : "Floating: No",
        ].join("\n")
      : "No focused window";

    box.set_tooltip_text(tooltipText);
  });

  return box;
};
