import Notifd from "gi://AstalNotifd";
import { execAsync } from "ags/process";

const notifd = Notifd.get_default();

export class NotificationUtils {
  /**
   * Toggle do not disturb mode
   */
  static toggleDND(): void {
    notifd.set_dont_disturb(!notifd.dontDisturb);
  }

  /**
   * Enable do not disturb mode
   */
  static enableDND(): void {
    notifd.set_dont_disturb(true);
  }

  /**
   * Disable do not disturb mode
   */
  static disableDND(): void {
    notifd.set_dont_disturb(false);
  }

  /**
   * Get current DND state
   */
  static isDNDEnabled(): boolean {
    return notifd.dontDisturb;
  }

  /**
   * Clear all notifications
   */
  static clearAll(): void {
    const notifications = notifd.notifications;
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification: Notifd.Notification) => {
        notification.dismiss();
      });
    }
  }

  /**
   * Get notification count
   */
  static getNotificationCount(): number {
    return notifd.notifications?.length || 0;
  }

  /**
   * Dismiss notification by ID
   */
  static dismissNotification(id: number): void {
    const notification = notifd.get_notification(id);
    if (notification) {
      notification.dismiss();
    }
  }

  /**
   * Send system notification (for testing or internal use)
   */
  static async sendTestNotification(
    summary: string = "Test Notification",
    body: string = "This is a test notification",
    icon: string = "dialog-information",
  ): Promise<void> {
    try {
      await execAsync(["notify-send", "-i", icon, summary, body]);
    } catch (error) {
      // Silently ignore test notification errors
    }
  }

  /**
   * Toggle DND for a specific duration (in minutes)
   */
  static toggleDNDForDuration(minutes: number): void {
    if (!notifd.dontDisturb) {
      notifd.set_dont_disturb(true);

      // Auto-disable after specified duration
      setTimeout(
        () => {
          notifd.set_dont_disturb(false);
        },
        minutes * 60 * 1000,
      );
    } else {
      notifd.set_dont_disturb(false);
    }
  }

  /**
   * Get formatted notification summary for display
   */
  static getNotificationSummary(): string {
    const count = this.getNotificationCount();
    const dnd = this.isDNDEnabled();

    if (dnd) {
      return "Do Not Disturb enabled";
    }

    if (count === 0) {
      return "No notifications";
    }

    return `${count} notification${count > 1 ? "s" : ""}`;
  }

  /**
   * Check if there are any critical notifications
   */
  static hasCriticalNotifications(): boolean {
    const notifications = notifd.notifications;
    if (!notifications) return false;

    return notifications.some(
      (notification: Notifd.Notification) =>
        notification.urgency === Notifd.Urgency.CRITICAL,
    );
  }

  /**
   * Get notifications grouped by urgency
   */
  static getNotificationsByUrgency(): {
    critical: Notifd.Notification[];
    normal: Notifd.Notification[];
    low: Notifd.Notification[];
  } {
    const notifications = notifd.notifications || [];

    return {
      critical: notifications.filter(
        (n) => n.urgency === Notifd.Urgency.CRITICAL,
      ),
      normal: notifications.filter((n) => n.urgency === Notifd.Urgency.NORMAL),
      low: notifications.filter((n) => n.urgency === Notifd.Urgency.LOW),
    };
  }

  /**
   * Register global keybinds for notification management
   * This would typically be called from the main app
   */
  static registerKeybinds(): void {
    // Note: This would require integration with your window manager's keybind system
    // For Hyprland, you'd add these to your hyprland.conf:
    // bind = SUPER, N, exec, ags -r 'NotificationUtils.toggleDND()'
    // bind = SUPER SHIFT, N, exec, ags -r 'NotificationUtils.clearAll()'
    // bind = SUPER CTRL, N, exec, ags -r 'NotificationUtils.sendTestNotification()'
  }
}

// Export individual functions for convenience
export const toggleDND = NotificationUtils.toggleDND;
export const enableDND = NotificationUtils.enableDND;
export const disableDND = NotificationUtils.disableDND;
export const clearAllNotifications = NotificationUtils.clearAll;
export const getNotificationCount = NotificationUtils.getNotificationCount;
export const sendTestNotification = NotificationUtils.sendTestNotification;

// Make utils available globally for CLI access
(globalThis as any).NotificationUtils = NotificationUtils;
