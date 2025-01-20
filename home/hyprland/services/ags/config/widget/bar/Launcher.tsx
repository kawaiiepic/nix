import { Process } from "astal";
import { App, Gtk } from "astal/gtk3";

export default () => {
  return (
    <eventbox
      onClick={() => {
        App.toggle_window("launcher");
      }}
    >
      <box
        halign={Gtk.Align.CENTER}
        hexpand={false}
        vexpand={false}
        valign={Gtk.Align.CENTER}
        className="launcher"
        tooltip_text={"NixOS " + Process.exec("uname -r")}
        css="background-image: url('/home/mia/.face');"
      />
    </eventbox>
  );
};
