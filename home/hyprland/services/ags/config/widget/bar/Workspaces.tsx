import { Variable, GLib, bind, Process } from "astal";
import { Gtk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";

const hypr = Hyprland.get_default();

// export default () => {
//   const hypr = Hyprland.get_default();
//   const focused = bind(hypr, "focusedWorkspace");

//   const listItems: JSX.Element[] = [];

//   for (let i = 1; i <= 5; i++) {
//     const workspace = hypr.get_workspace(i);
//     listItems.push(
//       <eventbox>
//         <label
//           tooltipText={`${i}`}
//           className={focused.as((fw) =>
//             workspace == fw
//               ? "focused"
//               : workspace.clients.length > 0
//                 ? "occupied"
//                 : "",
//           )}
//           label="1"
//           valign={Gtk.Align.CENTER}
//         ></label>
//       </eventbox>,
//     );
//   }

//   return <box className="workspaces">{listItems}</box>;
// }

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
