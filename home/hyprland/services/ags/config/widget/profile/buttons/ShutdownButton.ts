import { App, Gtk, Widget } from "astal/gtk3";

export default () =>
  new Widget.Button({
    className: "profile-small-button circular",
    valign: Gtk.Align.CENTER,
    tooltip_text: "Shutdown",
    onClick: () => {
      App.toggle_window("logout")
      App.toggle_window("profile")
    },
    child: new Widget.Label({
      className: "profile-small-button-icon",
      label: "",
    }),
  });