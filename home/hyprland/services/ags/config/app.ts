import app from "ags/gtk4/app";
import style from "./style/style.scss";
import Bar from "./widget/bar/Bar";
import Desktop from "./widget/desktop/Desktop";
import Applauncher from "./widget/applauncher/Applauncher";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Logout from "./widget/logout/Logout";
import OSD from "./widget/osd/OSD";
import { WallpaperManager } from "./widget/desktop/WallpaperManager";
import { NotificationUtils } from "./widget/notifications/NotificationUtils";

WallpaperManager();

// Initialize notification utilities and log keybind information
NotificationUtils.registerKeybinds();

app.start({
  css: style,
  main() {
    Applauncher(app.get_monitors()[0]);
    NotificationPopups(app.get_monitors()[0]);
    Logout(app.get_monitors()[0]);

    app.get_monitors().map(Bar);
    app.get_monitors().map(Desktop);
    app.get_monitors().map(OSD);
  },
});
