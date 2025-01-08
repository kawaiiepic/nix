import { Process } from "astal";
import { Gtk, Widget } from "astal/gtk3";

export default () =>
  new Widget.Button({
    className: "profile-small-button circular",
    onClick: () => {
      Process.exec("hyprexit");
    },
    valign: Gtk.Align.CENTER,
    tooltip_text: "Refresh",
    child: new Widget.Label({
      className: "profile-small-button-icon",
      label: "",
    }),
  });
