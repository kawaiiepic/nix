import { Gtk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hypr = AstalHyprland.get_default();

let isShowingDesktop = false;
let minimizedWindows: string[] = [];

export default function ShowDesktop(): Gtk.Box {
  const button = new Gtk.Box({
    cssClasses: ["show-desktop"],
    tooltipText: "Show Desktop",
  });

  // Create icon
  const icon = new Gtk.Image({
    iconName: "user-desktop-symbolic",
    pixelSize: 16,
  });

  // Add click gesture
  const gesture = new Gtk.GestureClick();
  gesture.connect("pressed", () => {
    toggleShowDesktop();
  });
  button.add_controller(gesture);

  // Add hover controller for visual feedback
  const hoverController = new Gtk.EventControllerMotion();
  hoverController.connect("enter", () => {
    button.add_css_class("hover");
  });
  hoverController.connect("leave", () => {
    button.remove_css_class("hover");
  });
  button.add_controller(hoverController);

  // Right-click context menu
  const popover = new Gtk.Popover();
  const menuBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
    marginTop: 8,
    marginBottom: 8,
    marginStart: 8,
    marginEnd: 8,
  });

  // Show desktop method buttons
  const minimizeAllButton = new Gtk.Button({
    label: "📦 Move to Special Workspace",
    cssClasses: ["menu-item"],
    halign: Gtk.Align.FILL,
  });
  minimizeAllButton.connect("clicked", () => {
    minimizeAllWindows();
    popover.popdown();
  });

  const hideAllButton = new Gtk.Button({
    label: "👁️ Hide All Windows",
    cssClasses: ["menu-item"],
    halign: Gtk.Align.FILL,
  });
  hideAllButton.connect("clicked", () => {
    hideAllWindows();
    popover.popdown();
  });

  const restoreButton = new Gtk.Button({
    label: "🔄 Restore Windows",
    cssClasses: ["menu-item"],
    halign: Gtk.Align.FILL,
  });
  restoreButton.connect("clicked", () => {
    restoreWindows();
    popover.popdown();
  });

  // Separator
  const separator = new Gtk.Separator({
    orientation: Gtk.Orientation.HORIZONTAL,
    marginTop: 4,
    marginBottom: 4,
  });

  // Simple workspace switch option
  const emptyWorkspaceButton = new Gtk.Button({
    label: "🏠 Switch to Workspace 10",
    cssClasses: ["menu-item"],
    halign: Gtk.Align.FILL,
  });
  emptyWorkspaceButton.connect("clicked", () => {
    hypr.message_async("dispatch workspace 10", null);
    popover.popdown();
  });

  menuBox.append(minimizeAllButton);
  menuBox.append(hideAllButton);
  menuBox.append(restoreButton);
  menuBox.append(separator);
  menuBox.append(emptyWorkspaceButton);

  popover.set_child(menuBox);
  popover.set_parent(button);

  // Right-click to show context menu
  const rightClick = new Gtk.GestureClick({
    button: 3, // Right mouse button
  });

  rightClick.connect("pressed", () => {
    updateTooltip();
    popover.popup();
  });

  button.add_controller(rightClick);

  // Function to toggle show desktop
  const toggleShowDesktop = () => {
    if (!isShowingDesktop) {
      showDesktop();
    } else {
      hideDesktop();
    }
  };

  // Method 1: Simple and reliable - move all windows to workspace 9
  const minimizeAllWindows = () => {
    // First try: move current workspace to special
    hypr.message_async("dispatch movetoworkspacesilent special:desktop", null);

    // Fallback: if that doesn't work, use a simple approach
    setTimeout(() => {
      // Move all windows from current workspace to workspace 9
      const currentWorkspace = hypr.focusedWorkspace.id;
      hypr.message_async(
        `dispatch moveworkspacetomonitor ${currentWorkspace} 9`,
        null,
      );
      hypr.message_async("dispatch workspace 9", null);
      hypr.message_async("dispatch workspace special:empty", null);
    }, 50);

    isShowingDesktop = true;
    minimizedWindows = [hypr.focusedWorkspace.id.toString()];
    updateVisualState();
  };

  // Method 2: Hide all windows using opacity
  const hideAllWindows = () => {
    hypr.message_async("keyword decoration:active_opacity 0.1", null);
    hypr.message_async("keyword decoration:inactive_opacity 0.1", null);
    isShowingDesktop = true;
    updateVisualState();
  };

  // Method 3: Go to empty workspace or create new one
  const goToEmptyWorkspace = () => {
    // Try to find first empty workspace (1-10)
    let foundEmpty = false;
    for (let i = 1; i <= 10; i++) {
      const workspace = hypr.get_workspace(i);
      if (!workspace || workspace.clients.length === 0) {
        hypr.message_async(`dispatch workspace ${i}`, null);
        foundEmpty = true;
        break;
      }
    }

    // If no empty workspace found, create a new one
    if (!foundEmpty) {
      hypr.message_async("dispatch workspace empty", null);
    }
  };

  // Default show desktop function - hide windows on current workspace
  const showDesktop = () => {
    const clients = hypr.get_clients();
    const currentWorkspace = hypr.focusedWorkspace.id;
    minimizedWindows = [];

    clients.forEach((client) => {
      if (
        !client.floating &&
        client.mapped &&
        !client.hidden &&
        client.workspace.id === currentWorkspace
      ) {
        // Move window to special workspace to hide it
        hypr.message_async(
          `dispatch movetoworkspacesilent special:minimized,pid:${client.pid}`,
          null,
        );
        minimizedWindows.push(client.pid.toString());
      }
    });

    isShowingDesktop = true;
    updateVisualState();
  };

  // Restore windows
  const restoreWindows = () => {
    if (minimizedWindows.length > 0) {
      // Restore windows from special workspace to current workspace
      const currentWorkspace = hypr.focusedWorkspace.id;
      minimizedWindows.forEach((pid) => {
        hypr.message_async(
          `dispatch movetoworkspacesilent ${currentWorkspace},pid:${pid}`,
          null,
        );
      });
      minimizedWindows = [];
    } else {
      // Restore opacity method
      hypr.message_async("keyword decoration:active_opacity 1", null);
      hypr.message_async("keyword decoration:inactive_opacity 1", null);
    }

    isShowingDesktop = false;
    updateVisualState();
  };

  const hideDesktop = () => {
    restoreWindows();
  };

  // Update visual state
  const updateVisualState = () => {
    if (isShowingDesktop) {
      button.add_css_class("active");
      icon.set_from_icon_name("view-restore-symbolic");
    } else {
      button.remove_css_class("active");
      icon.set_from_icon_name("user-desktop-symbolic");
    }
    updateTooltip();
  };

  // Update tooltip with current state and instructions
  const updateTooltip = () => {
    let tooltipText = "";

    if (isShowingDesktop) {
      tooltipText = "🖥️ Desktop Visible\n\n";
      tooltipText += "Left click: Restore windows\n";
      tooltipText += "Right click: More options\n\n";

      if (minimizedWindows.length > 0) {
        tooltipText += `📦 ${minimizedWindows.length} windows minimized`;
      } else {
        tooltipText += "👁️ Windows hidden (opacity)";
      }
    } else {
      const clients = hypr.get_clients();
      const visibleWindows = clients.filter(
        (c) => !c.floating && c.mapped && !c.hidden,
      ).length;

      tooltipText = "🏠 Show Desktop\n\n";
      tooltipText += "Left click: Show desktop\n";
      tooltipText += "Right click: Choose method\n\n";
      tooltipText += `📋 ${visibleWindows} windows visible`;
    }

    button.set_tooltip_text(tooltipText);
  };

  // Listen for workspace changes to update state
  hypr.connect("event", () => {
    // Check if we're still showing desktop by counting visible windows
    const clients = hypr.get_clients();
    const visibleWindows = clients.filter(
      (c) => !c.floating && c.mapped && !c.hidden,
    ).length;

    // If windows appeared and we thought we were showing desktop, update state
    if (
      isShowingDesktop &&
      visibleWindows > 0 &&
      minimizedWindows.length === 0
    ) {
      isShowingDesktop = false;
      updateVisualState();
    }

    updateTooltip();
  });

  // Initial state
  updateVisualState();

  button.append(icon);
  return button;
}
