import { App } from "astal/gtk3";
import style from "./style.scss";
import Bar from "./widget/Bar";
import Desktop from "./widget/desktop/Desktop";
import { exec } from "astal/process";
import NotificationPopups from "./notifications/NotificationPopups";

App.start({
  icons: `${SRC}/style/assets`,
  css: style,
  main() {
    print(`source dir is ${SRC}`);
    App.get_monitors().map(Desktop);
    App.get_monitors().map(Bar);
    App.get_monitors().map(NotificationPopups);
  },
});
