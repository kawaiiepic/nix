import AstalApps from "gi://AstalApps";
import GLib from "gi://GLib";

import { setup_theme } from "../theme";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

const MAX_ITEMS = 8;

function hide() {
  app.get_window("launcher")!.hide();
}

function closeAppLauncher() {
  hide();
}

function createDesktopFile(app: AstalApps.Application) {
  const desktopPath = GLib.get_home_dir() + "/Desktop";
  const fileName = `${app.name?.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}.desktop`;
  const filePath = `${desktopPath}/${fileName}`;

  // Check if Desktop directory exists
  if (!GLib.file_test(desktopPath, GLib.FileTest.EXISTS)) {
    try {
      GLib.mkdir_with_parents(desktopPath, 0o755);
    } catch (error) {
      return;
    }
  }

  const desktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${app.name || "Unknown App"}
Comment=${app.description || ""}
Exec=${app.executable}
Icon=${app.iconName || "application-x-executable"}
Terminal=false
Categories=${app.categories?.join(";") || ""}
`;

  try {
    const success = GLib.file_set_contents(filePath, desktopContent);
    if (success) {
      // Make file executable
      try {
        GLib.chmod(filePath, 0o755);
      } catch (chmodError) {
        // Silently ignore chmod errors
      }
    }
  } catch (error) {
    // Silently ignore file creation errors
  }
}

function AppButton({ app }: { app: AstalApps.Application }) {
  const button = new Gtk.Button({ cssClasses: ["AppButton"] });
  const box = new Gtk.Box();

  const image = new Gtk.Image({ pixelSize: 28, iconName: app.iconName });
  const innerBox = new Gtk.Box({ valign: Gtk.Align.CENTER });
  innerBox.append(
    new Gtk.Label({ cssClasses: ["name"], xalign: 0, label: app.name }),
  );
  if (app.description) {
    innerBox.append(
      new Gtk.Label({
        cssClasses: ["description"],
        wrap: true,
        xalign: 0,
        label: app.description,
      }),
    );
  }

  box.append(image);
  box.append(innerBox);

  // Declare context menu first
  const contextMenu = new Gtk.Popover();

  const leftClick = new Gtk.GestureClick({
    button: 1, // Left mouse button
  });
  leftClick.connect("pressed", (gesture) => {
    // Only launch if not showing context menu
    if (!contextMenu.get_visible()) {
      hide();
      app.launch();
    }
  });

  button.add_controller(leftClick);

  // Right-click context menu
  const rightClick = new Gtk.GestureClick({
    button: 3, // Right mouse button
  });
  const menuBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    marginTop: 8,
    marginBottom: 8,
    marginStart: 8,
    marginEnd: 8,
  });

  // Add to Desktop menu item
  const addToDesktopItem = new Gtk.Button({
    label: "📄 Add to Desktop",
    cssClasses: ["context-menu-item"],
  });

  // Use activate signal instead of clicked for better menu handling
  addToDesktopItem.connect("activate", () => {
    createDesktopFile(app);
    contextMenu.popdown();

    // Show feedback in original button
    const originalLabel = app.name;
    if (button.child && button.child instanceof Gtk.Box) {
      const box = button.child as Gtk.Box;
      const innerBox = box.get_last_child();
      if (innerBox && innerBox instanceof Gtk.Box) {
        const nameLabel = innerBox.get_first_child();
        if (nameLabel && nameLabel instanceof Gtk.Label) {
          nameLabel.set_label("✅ Added!");
          setTimeout(() => {
            nameLabel.set_label(originalLabel);
          }, 1500);
        }
      }
    }
  });

  // Handle mouse clicks with gesture instead of clicked signal
  const addToDesktopClick = new Gtk.GestureClick();
  addToDesktopClick.connect("pressed", (gesture) => {
    gesture.set_state(Gtk.EventSequenceState.CLAIMED);
    createDesktopFile(app);
    contextMenu.popdown();

    // Show feedback in original button
    const originalLabel = app.name;
    if (button.child && button.child instanceof Gtk.Box) {
      const box = button.child as Gtk.Box;
      const innerBox = box.get_last_child();
      if (innerBox && innerBox instanceof Gtk.Box) {
        const nameLabel = innerBox.get_first_child();
        if (nameLabel && nameLabel instanceof Gtk.Label) {
          nameLabel.set_label("✅ Added!");
          setTimeout(() => {
            nameLabel.set_label(originalLabel);
          }, 1500);
        }
      }
    }
  });
  addToDesktopItem.add_controller(addToDesktopClick);

  // Launch app menu item
  const launchItem = new Gtk.Button({
    label: "🚀 Launch",
    cssClasses: ["context-menu-item"],
  });

  const launchClick = new Gtk.GestureClick();
  launchClick.connect("pressed", (gesture) => {
    gesture.set_state(Gtk.EventSequenceState.CLAIMED);
    hide();
    app.launch();
    contextMenu.popdown();
  });
  launchItem.add_controller(launchClick);

  menuBox.append(launchItem);
  menuBox.append(new Gtk.Separator());
  menuBox.append(addToDesktopItem);

  contextMenu.set_child(menuBox);
  contextMenu.set_parent(button);

  rightClick.connect("pressed", (gesture, nPress, x, y) => {
    // Prevent the menu from interfering with other gestures
    gesture.set_state(Gtk.EventSequenceState.CLAIMED);

    const rect = new Gdk.Rectangle({ x: x, y: y, width: 1, height: 1 });
    contextMenu.set_pointing_to(rect);
    contextMenu.popup();

    // Prevent left click from triggering while menu is open
    leftClick.set_propagation_phase(Gtk.PropagationPhase.NONE);

    // Re-enable left click when menu closes
    contextMenu.connect("closed", () => {
      leftClick.set_propagation_phase(Gtk.PropagationPhase.BUBBLE);
    });
  });

  button.add_controller(rightClick);

  button.child = box;

  return button;
}

function AppIcon({ app }: { app: AstalApps.Application }) {
  const box = new Gtk.Box({
    cssClasses: ["AppIcon"],
    halign: Gtk.Align.CENTER,
  });

  // Add click handling to launch app
  const clickGesture = new Gtk.GestureClick();
  clickGesture.connect("pressed", () => {
    hide();
    app.launch();
  });
  box.add_controller(clickGesture);

  box.append(
    new Gtk.Image({
      pixelSize: 36,
      tooltipText: app.name,
      halign: Gtk.Align.CENTER,
      cssClasses: ["icon"],
      iconName: app.iconName,
    }),
  );

  return box;
}

export default (gdkmonitor: Gdk.Monitor) => {
  const apps = new AstalApps.Apps({ minScore: 20 });

  const { CENTER } = Gtk.Align;

  const default_apps = [
    apps.fuzzy_query("zen")[0],
    // apps.fuzzy_query("spotify")[0],
    apps.fuzzy_query("files")[0],
    apps.fuzzy_query("kitty")[0],
    apps.fuzzy_query("zed")[0],
    apps.fuzzy_query("steam")[0],
  ];

  const list = apps
    .fuzzy_query("")
    .slice(0, MAX_ITEMS)
    .filter((app) => {
      if (app.executable.includes("steam://rungameid")) {
        return true;
      }
      return true;
    });

  const onEnter = () => {
    list[0].launch();
    entry.text = "";
    hide();
  };

  const entry = new Gtk.Entry({ placeholderText: "Search" });

  // const entry: Gtk.Entry = (<entry
  //   placeholderText="Search"
  //   onChanged={(self) => text.set(self.text)}
  //   onActivate={onEnter}
  // />);
  //
  const window = new Astal.Window({
    name: "launcher",
    cssClasses: ["launcher"],
    gdkmonitor: gdkmonitor,
    application: app,
    exclusivity: Astal.Exclusivity.IGNORE,
    keymode: Astal.Keymode.ON_DEMAND,
    anchor:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT |
      Astal.WindowAnchor.BOTTOM,
    layer: Astal.Layer.OVERLAY,
  });

  // Create overlay for click-outside detection
  const overlay = new Gtk.Overlay();

  // Background button to catch clicks outside the launcher content
  const backgroundButton = new Gtk.Button({
    cssClasses: ["launcher-background"],
    hexpand: true,
    vexpand: true,
  });

  // Handle background click to close launcher
  backgroundButton.connect("clicked", () => {
    closeAppLauncher();
  });

  // Main launcher content container
  const launcherContainer = new Gtk.Box({
    cssClasses: ["launcher-container"],
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 12,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
    widthRequest: 600,
    heightRequest: 500,
  });

  // Prevent clicks on the launcher content from triggering background close
  const contentClick = new Gtk.GestureClick();
  contentClick.connect("pressed", (gesture) => {
    gesture.set_state(Gtk.EventSequenceState.CLAIMED);
  });
  launcherContainer.add_controller(contentClick);

  const controllerKey = new Gtk.EventControllerKey();
  window.add_controller(controllerKey);

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 12,
  });

  setup_theme(box);

  // Default apps container - will be positioned at top of screen
  const defaultApps = new Gtk.Box({
    cssClasses: ["default-apps"],
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.START,
    spacing: 6,
    marginTop: 20,
  });
  default_apps.forEach((app) => {
    defaultApps.append(AppIcon({ app: app }));
  });

  // Prevent clicks on default apps from propagating to background
  const defaultAppsClick = new Gtk.GestureClick();
  defaultAppsClick.connect("pressed", (gesture) => {
    gesture.set_state(Gtk.EventSequenceState.CLAIMED);
  });
  defaultApps.add_controller(defaultAppsClick);

  const appLauncher = new Gtk.Box({
    cssClasses: ["Applauncher"],
    halign: Gtk.Align.CENTER,
    orientation: Gtk.Orientation.VERTICAL,
  });
  appLauncher.append(entry);

  var appButtonList: Gtk.Button[] = [];

  const appList = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  });
  list.forEach((app) => {
    const button = AppButton({ app: app });
    appButtonList.push(button);
    appList.append(button);
  });

  const listEmpty = new Gtk.Box({
    halign: Gtk.Align.CENTER,
    cssClasses: ["not-found"],
    orientation: Gtk.Orientation.VERTICAL,
    visible: false,
  });
  listEmpty.append(new Gtk.Image({ iconName: "system-search-symbolic" }));
  listEmpty.append(new Gtk.Label({ label: "No match found" }));

  appLauncher.append(appList);
  appLauncher.append(listEmpty);

  box.append(appLauncher);

  controllerKey.connect("key-pressed", (self, keyval) => {
    if (keyval === Gdk.KEY_Escape) {
      app.toggle_window("launcher");
      entry.text = "";
    }
  });

  entry.connect("notify::text", (source) => {
    appButtonList.forEach((widget) => {
      appList.remove(widget);
    });

    appButtonList = [];
    const list = apps
      .fuzzy_query(source.text)
      .slice(0, MAX_ITEMS)
      .filter((app) => {
        if (app.executable.includes("steam://rungameid")) {
          return true;
        }
        return true;
      });

    list.forEach((app) => {
      const button = AppButton({ app: app });
      appButtonList.push(button);
      appList.append(button);
    });

    listEmpty.visible = list.length === 0;
  });

  entry.connect("activate", () => {
    appList;
  });

  // Assemble the overlay structure
  launcherContainer.append(box);
  overlay.set_child(backgroundButton);
  overlay.add_overlay(launcherContainer);
  overlay.add_overlay(defaultApps);

  setup_theme(overlay);
  window.child = overlay;

  return window;
};
