import { exec } from "astal";
import { App, Gtk, Widget } from "astal/gtk3";

export default () =>
  new Widget.Button({
    className: "profile-small-button circular",
    valign: Gtk.Align.CENTER,
    tooltip_text: "Screenshot",
    onClick: () => {
      App.toggle_window("profile");
      exec(["bash", "-c", "screenshot"]);
    },
    child: new Widget.Label({
      className: "profile-small-button-icon",
      label: "",
    }),
  });
