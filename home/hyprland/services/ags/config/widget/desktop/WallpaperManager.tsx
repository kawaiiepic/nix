import AstalIO from "gi://AstalIO?version=0.1";
import { setup_theme } from "../theme";
import { exec, subprocess } from "ags/process";
import app from "ags/gtk4/app";
import { interval } from "ags/time";

var previousProcess: AstalIO.Process;

var wallpaperType = "picture";

export function WallpaperManager() {
  interval(30 * 60 * 1000, () => {
    if (wallpaperType == "picture") {
      var backgroundImage = exec([
        "bash",
        "-c",
        `find ${SRC}/widget/desktop/wallpapers/ -mindepth 1 -maxdepth 1 -type f | shuf -n 1`,
      ]);

      app.apply_css(`
             box.wallpaper {
              background-image: url(file://${backgroundImage});
            }
          `);
    } else if ((wallpaperType = "video")) {
      var screenRoot = "";
      var backgroundImage = exec(
        `find ${SRC}/widget/desktop/wallpaper-engine/ -mindepth 1 -maxdepth 1 -type d | shuf -n 1`,
      );

      app.get_monitors().forEach((monitor) => {
        screenRoot += `--screen-root ${monitor.connector} `;
      });

      if (previousProcess != null) {
        previousProcess.kill();
      }

      previousProcess = subprocess(
        `linux-wallpaperengine --silent --no-fullscreen-pause ${screenRoot} ${backgroundImage}`,
      );
    }
  });
}
