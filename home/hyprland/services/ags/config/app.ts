import { App } from "astal/gtk4";
import style from "./style/style.scss";
import Bar from "./widget/bar/Bar";
import Desktop from "./widget/desktop/Desktop";
import Applauncher from "./widget/applauncher/Applauncher";
import Profile from "./widget/profile/Profile";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Logout from "./widget/logout/Logout";
import OSD from "./widget/osd/OSD";
import Wallpaper from "./widget/bar/Wallpaper";
import { WallpaperManager } from "./widget/desktop/WallpaperManager";

WallpaperManager();

App.start({
  css: style,
  main() {
    Applauncher(App.get_monitors()[0]);
    // Profile(App.get_monitors()[0]);
    NotificationPopups(App.get_monitors()[0]);
    Logout(App.get_monitors()[0]);

    App.get_monitors().map(Bar);
    App.get_monitors().map(Desktop);
    App.get_monitors().map(OSD);
  },
});
