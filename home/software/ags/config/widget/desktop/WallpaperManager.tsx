import { exec, Process, subprocess } from "ags/process";
import app from "ags/gtk4/app";
import { interval, timeout } from "ags/time";
import { send_notification } from "../utils";
import { ParamSpec } from "ags/gobject";
import { createState } from "ags";

export var previousProcess: Process | null;

var wallpaperType = "video";

// export var backgroundImage = createState("");
export const [backgroundImage, setBackgroundImage] = createState("");

export async function update_wallpaper() {
  if (previousProcess != null) {
    previousProcess.kill();
    previousProcess = null;
  }

  app.apply_css(`
         box.wallpaper {
          background-image: none;
          background-size: cover;
          background-repeat: no-repeat;
        }
      `);
  if (Math.random() < 0.5) {
    setBackgroundImage(
      exec([
        "bash",
        "-c",
        `find ${SRC}/widget/desktop/wallpapers/ -mindepth 1 -maxdepth 1 -type f | shuf -n 1`,
      ]),
    );

    app.apply_css(`
           box.wallpaper {
            background-image: url(file://${backgroundImage.get()});
            background-size: cover;
            background-repeat: no-repeat;
          }
        `);

    send_notification(
      "Wallpaper",
      `Wallpaper set to picture: ${backgroundImage.get()}`,
    );
  } else {
    var screenRoot = "";
    var wallpaperFailed = false;

    app.get_monitors().forEach((monitor) => {
      screenRoot += `--screen-root ${monitor.connector} `;
    });

    tryWallpaper();

    async function tryWallpaper() {
      var wallpaperPath = exec([
        "nu",
        "-c",
        `ls ${SRC}/widget/desktop/wallpaper-engine/ | where type == dir | shuffle | first 1 | get name | grid -c`,
      ]);

      var process = subprocess(
        `linux-wallpaperengine --silent --no-fullscreen-pause ${screenRoot} ${wallpaperPath} > /dev/null 2>&1`, (output) => {
          if(output.includes("Cannot setup image")) {
            wallpaperFailed = true;
            tryWallpaper();
          }
          // console.log(`Wallpaper(${wallpaperPath}) output: ${output}`);
        }
      );

      var exit = process.connect("exit", (code, signal) => {
        wallpaperFailed = true;
        tryWallpaper();
        console.log(
          `Wallpaper(${backgroundImage.get()}) process exited with code ${code} and signal ${signal}`,
        );
      });

      timeout(3000, () => {
        if (!wallpaperFailed) {
          print(`Wallpaper(${wallpaperPath}) set successfully`);
          previousProcess = process;
          setBackgroundImage(wallpaperPath);
          send_notification(
            "Wallpaper",
            `Wallpaper set to video: ${backgroundImage.get()}`,
          );
        }
        process.disconnect(exit);
      });
    }
  }
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
