import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import { NotificationUtils } from "../notifications/NotificationUtils";

const notifd = Notifd.get_default();

export default function Notifications(): Gtk.Box {
  const dndBinding = createBinding(notifd, "dontDisturb");
  const notificationsBinding = createBinding(notifd, "notifications");

  const button = new Gtk.Box({
    cssClasses: ["notifications-toggle"],
  });

  // Create overlay for notification count badge
  const overlay = new Gtk.Overlay();

  const icon = new Gtk.Image({
    pixelSize: 14,
  });

  // Notification count badge
  const countLabel = new Gtk.Label({
    cssClasses: ["notification-count"],
    valign: Gtk.Align.START,
    halign: Gtk.Align.END,
    visible: false,
  });

  overlay.set_child(icon);
  overlay.add_overlay(countLabel);
  button.append(overlay);
  // button.set_child(overlay);

  // Update icon and styles based on do not disturb state
  const updateState = () => {
    const dnd = notifd.dontDisturb;
    const notifications = notifd.notifications;
    const count = notifications?.length || 0;

    if (dnd) {
      icon.set_from_icon_name("notifications-disabled");
      button.add_css_class("dnd-active");
      button.remove_css_class("has-notifications");
      countLabel.set_visible(false);
    } else {
      icon.set_from_icon_name("notification");
      button.remove_css_class("dnd-active");

      if (count > 0) {
        button.add_css_class("has-notifications");
        countLabel.set_text(count > 99 ? "99+" : count.toString());
        countLabel.set_visible(true);
      } else {
        button.remove_css_class("has-notifications");
        countLabel.set_visible(false);
      }
    }
  };

  // Update tooltip with detailed information
  const updateTooltip = () => {
    const dnd = notifd.dontDisturb;
    const notifications = notifd.notifications;
    const count = notifications?.length || 0;

    let tooltipText = "";

    if (dnd) {
      tooltipText =
        "🔇 Do Not Disturb enabled\nLeft click: Disable DND\nRight click: More options";
    } else {
      if (count === 0) {
        tooltipText =
          "🔔 No notifications\nLeft click: Enable DND\nRight click: More options";
      } else {
        const summary = NotificationUtils.getNotificationsByUrgency();
        const parts = [];

        if (summary.critical.length > 0) {
          parts.push(`🔴 ${summary.critical.length} critical`);
        }
        if (summary.normal.length > 0) {
          parts.push(`🟡 ${summary.normal.length} normal`);
        }
        if (summary.low.length > 0) {
          parts.push(`🟢 ${summary.low.length} low`);
        }

        tooltipText = `🔔 ${count} notification${count > 1 ? "s" : ""}\n${parts.join(", ")}\nLeft click: Enable DND\nRight click: More options`;
      }
    }

    button.set_tooltip_text(tooltipText);
  };

  // Subscribe to changes
  dndBinding.subscribe(() => {
    updateState();
    updateTooltip();
  });
  notificationsBinding.subscribe(() => {
    updateState();
    updateTooltip();
  });

  // Initial state
  updateState();
  updateTooltip();

  // // Toggle do not disturb on click
  // button.connect("clicked", () => {
  //   NotificationUtils.toggleDND();
  // });

  // Create context menu for additional options
  const popover = new Gtk.Popover();
  const menuBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    marginTop: 8,
    marginBottom: 8,
    marginStart: 8,
    marginEnd: 8,
  });

  // Clear all notifications button
  const clearButton = new Gtk.Button({
    label: "Clear All",
    cssClasses: ["menu-item"],
  });
  clearButton.connect("clicked", () => {
    NotificationUtils.clearAll();
    popover.popdown();
  });

  // DND for 1 hour button
  const dnd1hButton = new Gtk.Button({
    label: "DND for 1 hour",
    cssClasses: ["menu-item"],
  });
  dnd1hButton.connect("clicked", () => {
    NotificationUtils.toggleDNDForDuration(60);
    popover.popdown();
  });

  // Test notification button
  const testButton = new Gtk.Button({
    label: "Send Test",
    cssClasses: ["menu-item"],
  });
  testButton.connect("clicked", () => {
    NotificationUtils.sendTestNotification();
    popover.popdown();
  });

  menuBox.append(clearButton);
  menuBox.append(dnd1hButton);
  menuBox.append(testButton);

  popover.set_child(menuBox);
  popover.set_parent(button);

  // Right-click to show context menu
  const rightClick = new Gtk.GestureClick({
    button: 3, // Right mouse button
  });

  rightClick.connect("pressed", () => {
    popover.popup();
  });

  button.add_controller(rightClick);

  return button;
}
