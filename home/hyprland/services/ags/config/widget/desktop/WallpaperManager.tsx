import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { setup_theme } from "../theme";
import {
  bind,
  execAsync,
  exec,
  Variable,
  subprocess,
  Gio,
  AstalIO,
  GLib,
} from "astal";

var previousProcess: AstalIO.Process;

export const background = Variable("").poll(10000, [ // 30 * 60 * 1000
  "bash",
  "-c",
  `find ${SRC}/widget/desktop/wallpaper-engine/ -maxdepth 1 -type d | shuf -n 1`,
]);

export function WallpaperManager() {
  
  App.monitors.forEach((monitor) => {
    print(monitor.connector);
  })

  background.subscribe((background) => {
    if (previousProcess != null) {
      previousProcess.kill();
    }

    previousProcess = subprocess(
      `linux-wallpaperengine --silent --no-fullscreen-pause --screen-root DP-2 --screen-root HDMI-A-2 ${background}`,
    );
  });
}
