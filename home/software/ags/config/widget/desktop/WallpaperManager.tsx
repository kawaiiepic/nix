import { exec, Process, subprocess } from "ags/process";
import app from "ags/gtk4/app";
import { interval } from "ags/time";

var previousProcess: Process;

var wallpaperType = "video";

export function WallpaperManager() {
  interval(30 * 60 * 1000, () => {
    
    // exec(["notify-send", "-i", "wallpaper", "Wallpaper", "Wallpaper-updated"]);

    if (wallpaperType == "picture") {
      var backgroundImage = exec([
        "bash",
        "-c",
        `find ${SRC}/widget/desktop/wallpapers/ -mindepth 1 -maxdepth 1 -type f | shuf -n 1`,
      ]);

      console.log(backgroundImage);

      app.apply_css(`
             box.wallpaper {
              background-image: url(file://${backgroundImage});
              background-size: cover;
              background-repeat: no-repeat;
            }
          `);
    } else if ((wallpaperType = "video")) {
      var screenRoot = "";
      var backgroundImage = exec(
        `bash -c "find ${SRC}/widget/desktop/wallpaper-engine/ -mindepth 1 -maxdepth 1 -type d | shuf -n 1"`,
      );

      print(backgroundImage);

      app.get_monitors().forEach((monitor) => {
        screenRoot += `--screen-root ${monitor.connector} `;
      });

      if (previousProcess != null) {
        previousProcess.kill();
      }

      previousProcess = subprocess(
        `bash -c "linux-wallpaperengine --silent --no-fullscreen-pause ${screenRoot} ${backgroundImage} >/dev/null 2>&1"`,
      );
    }
  });
}
