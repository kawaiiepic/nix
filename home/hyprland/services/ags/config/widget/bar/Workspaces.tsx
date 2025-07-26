import { Gtk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hypr = AstalHyprland.get_default();

const box = new Gtk.Box({
  cssClasses: ["workspaces"],
  vexpand: false,
});

Array.from({ length: 5 }, (_, i) => i + 1).forEach((i) => {
  const innerBox = new Gtk.Box({});
  var gesture = new Gtk.GestureClick();
  gesture.connect("pressed", () => {
    hypr.message_async(`dispatch workspace ${i}`, null);
  });
  innerBox.add_controller(gesture);
  
  const label = new Gtk.Label({
    label: `${i}`,
    cssClasses: ["workspace-label"],
    hexpand: true,
    vexpand: true,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
    tooltipText: `Workspace: ${i}`,
  });
  
  hypr.connect("event", () => {
    if (hypr.focusedWorkspace.id === i) {
      label.add_css_class("focused");
    } else {
      label.remove_css_class("focused");
    }
    
    if ((hypr.get_workspace(i)?.clients.length || 0) > 0) {
      label.add_css_class("occupied");
    } else {
      label.remove_css_class("occupied");
    }
  })
  
  innerBox.append(label);
  
  box.append(innerBox);
});

export default () => box;