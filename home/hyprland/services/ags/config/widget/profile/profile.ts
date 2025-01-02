import { App } from "astal/gtk3";
import style from "./style.scss";
import { exec } from "astal/process";
import Profile from "./Profile";

App.start({
  icons: `${SRC}/style/assets`,
  // gtkTheme: "rose-pine",
  // iconTheme: "rose-pine",
  css: style,
  main() {
    App.get_monitors().map(Profile);
  },
});
