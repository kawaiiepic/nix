import { Variable, GLib, bind, Process } from "astal";
import Hyprland from "gi://AstalHyprland";

export default () => {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedWorkspace");

  const listItems: JSX.Element[] = [];

  for (let i = 1; i <= 5; i++) {
    const workspace = hypr.get_workspace(i);
    listItems.push(
      <eventbox>
        <label
          className={focused.as((fw) =>
            workspace == fw
              ? "focused"
              : workspace.clients.length > 0
                ? "occupied"
                : "",
          )}
          label="1"
        ></label>
      </eventbox>,
    );
  }

  return <box className="workspaces">{listItems}</box>;
}