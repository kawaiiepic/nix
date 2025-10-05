import { exec, Process, subprocess } from "ags/process";
import app from "ags/gtk4/app";
import { interval } from "ags/time";
import { send_notification } from "../utils";
import { ParamSpec } from "ags/gobject";
import { createState } from "ags";

export var previousProcess: Process | null;
var exitCode: number | null;

var wallpaperType = "video";

// export var backgroundImage = createState("");
export const [backgroundImage, setBackgroundImage] = createState("");

export function update_wallpaper() {
  if (previousProcess != null) {
    if (exitCode != null) previousProcess.disconnect(exitCode);
    previousProcess.kill();
    previousProcess = null;
  }

  if (wallpaperType == "picture") {
    setBackgroundImage(
      exec([
        "bash",
        "-c",
        `find ${SRC}/widget/desktop/wallpapers/ -mindepth 1 -maxdepth 1 -type f | shuf -n 1`,
      ]),
    );

    app.apply_css(`
           box.wallpaper {
            background-image: url(file://${backgroundImage});
            background-size: cover;
            background-repeat: no-repeat;
          }
        `);
  } else if ((wallpaperType = "video")) {
    var screenRoot = "";
    setBackgroundImage(
      exec(
        `bash -c "find ${SRC}/widget/desktop/wallpaper-engine/ -mindepth 1 -maxdepth 1 -type d | shuf -n 1"`,
      ),
    );

    app.get_monitors().forEach((monitor) => {
      screenRoot += `--screen-root ${monitor.connector} `;
    });

    previousProcess = subprocess(
      `bash -c "linux-wallpaperengine --silent --no-fullscreen-pause ${screenRoot} ${backgroundImage.get()} >/dev/null 2>&1"`,
    );

    exitCode = previousProcess.connect("exit", (code, signal) => {
      update_wallpaper();
      console.log(
        `Wallpaper(${backgroundImage.get()}) process exited with code ${code} and signal ${signal}`,
      );
    });
  }

  send_notification("Wallpaper", `Wallpaper set to ${backgroundImage.get()}`);
}
export function shutdown() {
  if (previousProcess != null) {
    previousProcess.kill();
    previousProcess = null;
  }
}
export function WallpaperManager() {
  console.log("started WallpaperManager service");

  interval(30 * 60 * 1000, () => {
    update_wallpaper();
  });
}
