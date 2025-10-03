import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { setTheme } from "../../theme";

export default () => {
  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  });

  const toggleButton = new Gtk.Button({
    cssClasses: ["profile-normal-button", "circular"],
    halign: Gtk.Align.CENTER,
    tooltipText: "Theme",
    // active: true,
    child: new Gtk.Label({
      cssClasses: ["profile-normal-button-label"],
      label: "󰔎",
    }),
  });

  const click = new Gtk.GestureClick();
  click.connect("pressed", () => {
    popover.popup();
  });
  toggleButton.add_controller(click);

  const popover = new Gtk.Popover({
    child: new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 6,
    }),
  });

  const themesBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  });

  popover.child = themesBox;

  const themes = [
    { id: "latte", description: "Latte", scheme: "light" },
    { id: "frappe", description: "Frappe", scheme: "dark" },
  ];

  themes.forEach((theme) => {
    const click1 = new Gtk.GestureClick();
    click1.connect("pressed", () => {
      popover.popdown();
      console.log(`Switching theme to ${theme.id}`);
      execAsync(`themeswitch ${theme.scheme}`);
      setTheme(theme.id);
    });
    const label = new Gtk.Label({
      label: `${theme.description} (${theme.scheme})`,
    });
    label.add_controller(click1);
    themesBox.append(label);
  });

  box.append(toggleButton);
  box.append(popover);
  box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Theme " }));
  return box;
};
