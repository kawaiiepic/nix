import { Process } from "astal";
import Hyprland from "gi://AstalHyprland";

const hypr = Hyprland.get_default();

export default () => {
  return (
    <eventbox
      tooltipText="New Tab"
      onClick={() => {
        switch (hypr.focusedWorkspace.id) {
          case 1:
            Process.exec("app.zen_browser.zen");
            break;
          case 2:
            Process.exec("kitty");
            break;
          case 3:
            Process.exec("discord");
            break;
          case 4:
            Process.exec("zeditor");
            break;
          case 5:
            Process.exec("steam");
            break;
        }
      }}
    >
      <label className="default-app" label="" />
    </eventbox>
  );
};
