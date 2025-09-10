import { Gtk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hypr = AstalHyprland.get_default();

const box = new Gtk.Box({
  cssClasses: ["workspaces"],
  vexpand: false,
});

Array.from({ length: 5 }, (_, i) => i + 1).forEach((i) => {
  const innerBox = new Gtk.Box({
    cssClasses: ["workspace-button"],
  });

  // Click gesture for workspace switching
  var gesture = new Gtk.GestureClick();
  gesture.connect("pressed", () => {
    hypr.message_async(`dispatch workspace ${i}`, null);
  });
  innerBox.add_controller(gesture);

  // Function to create detailed tooltip
  const updateTooltip = () => {
    const workspace = hypr.get_workspace(i);
    const isFocused = hypr.focusedWorkspace.id === i;
    const clientCount = workspace?.clients.length || 0;

    let tooltipText = `🏠 Workspace ${i}`;

    if (isFocused) {
      tooltipText += " (Active ✓)";
    }

    if (clientCount > 0) {
      tooltipText += `\n\n📋 ${clientCount} window${clientCount > 1 ? "s" : ""} open:`;

      workspace?.clients.forEach((client, index) => {
        if (index < 5) {
          const title =
            client.title.length > 35
              ? client.title.substring(0, 32) + "..."
              : client.title;
          const appName = client.class || "Unknown";
          tooltipText += `\n  • ${appName}: ${title}`;
        }
      });

      if (clientCount > 5) {
        tooltipText += `\n  ... and ${clientCount - 5} more windows`;
      }
    } else {
      tooltipText += "\n\n📁 Empty workspace";
    }

    tooltipText += "\n\n🖱️ Click to switch workspace";
    label.set_tooltip_text(tooltipText);
  };

  // Hover controller for visual feedback
  const hoverController = new Gtk.EventControllerMotion();
  hoverController.connect("enter", () => {
    label.add_css_class("hover");
    updateTooltip(); // Refresh tooltip on hover
  });
  hoverController.connect("leave", () => {
    label.remove_css_class("hover");
  });
  innerBox.add_controller(hoverController);

  const label = new Gtk.Label({
    label: `${i}`,
    cssClasses: ["workspace-label"],
    hexpand: true,
    vexpand: true,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
    tooltipText: `Workspace ${i}`,
  });

  hypr.connect("event", () => {
    if (hypr.focusedWorkspace.id === i) {
      label.add_css_class("focused");
    } else {
      label.remove_css_class("focused");
    }

    if ((hypr.get_workspace(i)?.clients.length || 0) > 0) {
      label.add_css_class("occupied");
    } else {
      label.remove_css_class("occupied");
    }

    // Update tooltip when workspace state changes
    updateTooltip();
  });

  // Initial setup
  updateTooltip();

  innerBox.append(label);

  box.append(innerBox);
});

export default () => box;
