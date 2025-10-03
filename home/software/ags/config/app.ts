import app from "ags/gtk4/app";
import style from "./style/style.scss";
import Bar from "./widget/bar/Bar";
import Desktop from "./widget/desktop/Desktop";
import Applauncher from "./widget/applauncher/Applauncher";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Logout from "./widget/logout/Logout";
import OSD from "./widget/osd/OSD";
import { previousProcess, WallpaperManager } from "./widget/desktop/WallpaperManager";
import { NotificationUtils } from "./widget/notifications/NotificationUtils";
import { Niri } from "./widget/services/niri";
import { writeFile, writeFileAsync } from "ags/file";

WallpaperManager();
Niri();

// Initialize notification utilities and log keybind information
NotificationUtils.registerKeybinds();

app.start({
  // icons: `./icons`,
  css: style,
  main() {
    Applauncher(app.get_monitors()[1]);
    NotificationPopups(app.get_monitors()[1]);
    Logout(app.get_monitors()[1]);

    Bar(app.get_monitors()[1]);
    app.get_monitors().map(Desktop);
    app.get_monitors().map(OSD);
  },
});

app.connect("shutdown", () => {
  console.log("Application closed");
});

app.connect("request", (app, [cmd, arg, ...rest], response) => {
  if (cmd === "close") {
    response("Closing Application");
    console.log("Closing application...");
    previousProcess?.kill();
    app.quit();
  }
});
