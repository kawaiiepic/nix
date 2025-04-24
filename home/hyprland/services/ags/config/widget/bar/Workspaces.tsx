import { Gtk, hook, Widget } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hypr = AstalHyprland.get_default();

export default () =>
  Widget.Box({
    cssClasses: ["workspaces"],
    vexpand: false,
    children: Array.from({ length: 5 }, (_, i) => i + 1).map(
      (i) => (
        <box
          onButtonPressed={() => hypr.message_async(`dispatch workspace ${i}`, null)}
        >
          <label
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            tooltipText={`Workspace: ${i}`}
            label={`${i}`}
            setup={(self) => hook(self, hypr, "event", () => {
              if(hypr.focusedWorkspace.id === i){
                self.add_css_class("focused");
              } else {
                self.remove_css_class("focused");
              }
              
              if((hypr.get_workspace(i)?.clients.length || 0) > 0){
                self.add_css_class("occupied");
              } else {
                self.remove_css_class("occupied");
              }
            })}
          ></label>
        </box>
      ),
    ),
  });
