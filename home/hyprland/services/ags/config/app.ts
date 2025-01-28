import { App } from "astal/gtk3";
import style from "./style/scss/style.scss";
import Desktop from "./widget/desktop/Desktop";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Profile from "./widget/profile/Profile";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/appLauncher/Applauncher";
import Logout from "./widget/logout/Logout";

App.start({
  icons: `${SRC}/style/assets`,
  css: style,
  main() {
    App.get_monitors().map(Desktop);
    App.get_monitors().map(Bar);
    Profile(App.get_monitors()[0]);
    Logout(App.get_monitors()[0]);
    Applauncher(App.get_monitors()[0]);
    NotificationPopups(App.get_monitors()[0]);
  },
});
