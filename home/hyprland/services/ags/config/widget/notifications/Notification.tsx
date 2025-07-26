import Notifd from "gi://AstalNotifd";
import GdkPixbuf20 from "gi://GdkPixbuf";
import Pango from "gi://Pango?version=1.0";
import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib?version=2.0";
import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";

export const fileExists = (path: string) =>
  GLib.file_test(path, GLib.FileTest.EXISTS);

const time = (time: number, format = "%H:%M") => {
  return GLib.DateTime.new_from_unix_local(time).format(format)!;
};

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

type Props = {
  setup(self: Gtk.Box): void;
  onHoverLost(self: Gtk.Box): void;
  display: Gdk.Display;
  notification: Notifd.Notification;
};

export default function Notification(props: Props): Gtk.Revealer {
  const { display: display, notification: n, onHoverLost, setup } = props;
  const { START, CENTER, END, FILL } = Gtk.Align;
  const isIcon = (icon: string) =>
    Gtk.IconTheme.get_for_display(display).has_icon(icon);

  if (n.image && fileExists(n.image)) {
    app.apply_css(`
         .image-${n.id} {
         background-image: url(file://${n.image});
         }
      `);
  }

  // Create the main revealer
  const revealer = new Gtk.Revealer({revealChild: true});
  revealer.set_transition_type(Gtk.RevealerTransitionType.SWING_DOWN);

  // Setup the revealer to reveal after timeout
  timeout(100, () => {
    revealer.set_reveal_child(true);
    return false;
  });

  // Create the main notification box
  const notificationBox = new Gtk.Box();
  notificationBox.set_orientation(Gtk.Orientation.HORIZONTAL);
  notificationBox.add_css_class("Notification");
  notificationBox.add_css_class(urgency(n));

  // Apply setup and hover handlers
  setup(notificationBox);

  const hoverController = new Gtk.EventControllerMotion();
  hoverController.connect("leave", () => onHoverLost(notificationBox));
  notificationBox.add_controller(hoverController);

  // Create the main vertical box for content
  const mainBox = new Gtk.Box();
  mainBox.set_orientation(Gtk.Orientation.VERTICAL);
  mainBox.set_spacing(3);

  // Create header box
  const headerBox = new Gtk.Box();
  headerBox.set_orientation(Gtk.Orientation.HORIZONTAL);
  headerBox.set_spacing(3);
  headerBox.set_halign(FILL);
  headerBox.set_hexpand(true);
  headerBox.add_css_class("header");

  // App icon
  const appIcon = new Gtk.Image();
  appIcon.set_from_icon_name(
    n.appIcon || n.desktopEntry || "dialog-information",
  );
  appIcon.add_css_class("app-icon");
  headerBox.append(appIcon);

  // App name label
  const appNameLabel = new Gtk.Label();
  appNameLabel.set_label(n.appName || "Unknown");
  appNameLabel.set_halign(START);
  appNameLabel.add_css_class("app-name");
  headerBox.append(appNameLabel);

  // Time label
  const timeLabel = new Gtk.Label();
  timeLabel.set_label(time(n.time));
  timeLabel.set_hexpand(true);
  timeLabel.set_halign(END);
  timeLabel.add_css_class("time");
  headerBox.append(timeLabel);

  mainBox.append(headerBox);

  // Create content box
  const contentBox = new Gtk.Box();
  contentBox.set_orientation(Gtk.Orientation.HORIZONTAL);
  contentBox.set_spacing(6);
  contentBox.add_css_class("content");

  // Add image if it exists as file
  if (n.image && fileExists(n.image)) {
    const imageBox = new Gtk.Box();
    imageBox.set_valign(START);
    imageBox.add_css_class("image");
    imageBox.add_css_class(`image-${n.id}`);
    contentBox.append(imageBox);
  }

  // Add image if it's an icon
  if (n.image && isIcon(n.image)) {
    const iconImageBox = new Gtk.Box();
    iconImageBox.set_valign(START);
    iconImageBox.add_css_class("icon-image");

    const iconImage = new Gtk.Image();
    iconImage.set_from_icon_name(n.image);
    iconImage.set_halign(CENTER);
    iconImage.set_valign(CENTER);
    iconImageBox.append(iconImage);

    contentBox.append(iconImageBox);
  }

  // Create text content box
  const textBox = new Gtk.Box();
  textBox.set_orientation(Gtk.Orientation.VERTICAL);

  // Summary label
  const summaryLabel = new Gtk.Label();
  summaryLabel.set_label(n.summary);
  summaryLabel.set_halign(START);
  summaryLabel.set_xalign(0);
  summaryLabel.add_css_class("summary");
  textBox.append(summaryLabel);

  // Body label (if exists)
  if (n.body) {
    const bodyLabel = new Gtk.Label();
    bodyLabel.set_markup(n.body);
    bodyLabel.set_wrap(true);
    bodyLabel.set_halign(START);
    bodyLabel.set_xalign(0);
    bodyLabel.add_css_class("body");
    textBox.append(bodyLabel);
  }

  contentBox.append(textBox);
  mainBox.append(contentBox);

  // Add actions if they exist
  const actions = n.get_actions();
  if (actions.length > 0) {
    const actionsBox = new Gtk.Box();
    actionsBox.set_orientation(Gtk.Orientation.HORIZONTAL);
    actionsBox.add_css_class("actions");

    actions.forEach(({ label, id }) => {
      const actionButton = new Gtk.Button();
      actionButton.set_hexpand(true);

      const buttonLabel = new Gtk.Label();
      buttonLabel.set_label(label);
      buttonLabel.set_halign(CENTER);
      buttonLabel.set_hexpand(true);

      actionButton.set_child(buttonLabel);
      actionButton.connect("clicked", () => n.invoke(id));

      actionsBox.append(actionButton);
    });

    mainBox.append(actionsBox);
  }

  notificationBox.append(mainBox);
  revealer.set_child(notificationBox);

  return revealer;
}
