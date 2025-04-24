import { GLib, Process } from "astal";
import { App, Gtk } from "astal/gtk4";

export default () => (
  <box
    setup={() => {
      App.apply_css(`
           window.bar .launcher {
           background-image: url(file://${GLib.getenv("HOME") + "/.face"});
           }
        `);
    }}
    onButtonPressed={() => {
      App.toggle_window("launcher");
    }}
    halign={Gtk.Align.CENTER}
    hexpand={false}
    vexpand={false}
    valign={Gtk.Align.CENTER}
    cssClasses={["launcher"]}
    cssName="image"
    tooltip_text={"NixOS " + Process.exec("uname -r")}
  ></box>
);
