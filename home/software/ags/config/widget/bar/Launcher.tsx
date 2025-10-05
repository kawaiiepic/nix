import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { Process } from "ags/process";
import GLib from "gi://GLib";

export default () => {
  //TODO: Subscribe to /.face
  var box = new Gtk.Box({cssClasses: ["launcher"]});
  app.apply_css(`
           window.bar .launcher {
           background-image: url(file://${GLib.getenv("HOME") + "/.face"});
           }
      `);
  var gesture = new Gtk.GestureClick();
  gesture.connect("pressed", () => {
    app.toggle_window("launcher");
  });
  box.add_controller(gesture);

  box.halign = Gtk.Align.CENTER;
  box.hexpand = false;
  box.vexpand = false;
  box.valign = Gtk.Align.CENTER;
  box.tooltip_text = "NixOS " + Process.exec("uname -r");
  return box;
};
