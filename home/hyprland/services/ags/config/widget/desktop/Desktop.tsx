import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { setup_theme } from "../theme";
import { bind, execAsync, exec, Variable, subprocess, Gio } from "astal";
import { background } from "./WallpaperManager";

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
              print(background);
              // App.apply_css(`
              //        box.wallpaper {
              //         background-image: url(file://${background});
              //       }
              //     `);

              return background;
            })}
          </label>
        </box>
      </box>
    </window>
  );
}
