import { App } from "astal/gtk3";
import style from "./style.scss";
import Desktop from "./widget/desktop/Desktop";
import NotificationPopups from "./notifications/NotificationPopups";
import Profile from "./widget/profile/Profile";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/appLauncher/Applauncher";

// App.apply_css("/home/mia/.config/colors.css");
App.apply_css("colors.css");

App.start({
  icons: `${SRC}/style/assets`,
  css: style,
  main() {
    print(`source dir is ${SRC}`);
    App.get_monitors().map(Desktop);
    App.get_monitors().map(Bar);
    Profile(App.get_monitors()[0]);
    Applauncher(App.get_monitors()[0]);
    NotificationPopups(App.get_monitors()[0]);
  },
});
