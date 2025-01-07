import { Variable, GLib, bind, Process } from "astal";
import { Gtk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";

const hypr = Hyprland.get_default();

export default () =>
  new Widget.Box({
    className: "workspaces",
    children: Array.from({ length: 5 }, (_, i) => i + 1).map(
      (i) =>
        new Widget.EventBox({
          onClick: (event) => {
            hypr.get_workspace(i).focus();
          },
          child: new Widget.Label({
            // attribute: i,
            className: "workspace",
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.CENTER,
            tooltip_text: `Workspace: ${i}`,
            label: `${i}`,
            setup: (self) =>
              self.hook(hypr, "event", () => {
                self.toggleClassName("focused", hypr.focusedWorkspace.id === i);
                self.toggleClassName(
                  "occupied",
                  (hypr.get_workspace(i)?.clients.length || 0) > 0,
                );
              }),
          }),
        }),
    ),
  });
