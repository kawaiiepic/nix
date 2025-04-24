import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { setup_theme } from "../theme";
import { bind, execAsync, exec, Variable, subprocess, Gio } from "astal";
import { wallpaperEngine } from "../utils";

export const background = Variable("").poll(30 * 60 * 1000, [
  "bash",
  "-c",
  `find ${SRC}/widget/desktop/wallpaper-engine/ ${SRC}/widget/desktop/wallpapers/ -maxdepth 1 -type f,d | shuf -n 1`,
]);

export default function Desktop(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      layer={Astal.Layer.BOTTOM}
      visible
      cssClasses={["desktop"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
    >
      <box setup={setup_theme}>
        <box
          hexpand
          vexpand
          vertical
          cssClasses={["wallpaper"]}
          onButtonPressed={(box, state) => {
            if (state.triggers_context_menu()) {
              var rec = new Gdk.Rectangle({
                x: state.get_position()[1],
                y: state.get_position()[2],
              });

              (box.children[0] as Gtk.Popover).set_pointing_to(rec);
              (box.children[0] as Gtk.Popover).popup();
            }
          }}
        >
          <popover>
            <label label="Boop" />
          </popover>
          <label vexpand yalign={0.98}>
            {bind(background).as((background) => {
              if (background.includes("wallpaper-engine")) {
                App.apply_css(`
                     box.wallpaper {
                      background-image: none;
                    }
                  `);
                try {
                  if (gdkmonitor == App.get_monitors()[0]) {
                    subprocess([
                      "bash",
                      "-c",
                      "killall linux-wallpaperengine || echo Not Running",
                    ]);
                  }

                  subprocess([
                    "bash",
                    "-c",
                    `linux-wallpaperengine --silent --no-fullscreen-pause --screen-root ${gdkmonitor.connector} ${background}`,
                  ]);
                } catch (e) {
                  print(e);
                }
              } else {
                App.apply_css(`
                     box.wallpaper {
                      background-image: url(file://${background});
                    }
                  `);
              }
              return background;
            })}
          </label>
        </box>
      </box>
    </window>
  );
}
