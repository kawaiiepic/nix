import { Gtk } from "ags/gtk4";

export default () => {
  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
  });

  const toggleButton = new Gtk.ToggleButton({
    cssClasses: ["profile-normal-button", "circular"],
    halign: Gtk.Align.CENTER,
    tooltipText: "Theme",
    active: true,
    child: new Gtk.Label({
      cssClasses: ["profile-normal-button-label"],
      label: "󰔎",
    }),
  });

  box.append(toggleButton);
  box.append(new Gtk.Label({ cssClasses: ["small-font"], label: "Theme " }));
  return box;
};
