import { Variable, GLib, bind, Process } from "astal";
import {
  App,
  Astal,
  Gtk,
  Gdk,
  Widget,
  astalify,
  type ConstructProps,
} from "astal/gtk3";
import Mpris from "gi://AstalMpris";

export default () => {
  const mpris = Mpris.get_default();
  
  return (
    <box className="media">
      {bind(mpris, "players").as((ps) =>
        ps[0] ? (
          <box spacing={6}>
            <box
              tooltipText={bind(ps[0], "title").as(
                () => `${ps[0].title} - ${ps[0].artist}`,
              )}
              className="media cover"
              valign={Gtk.Align.CENTER}
              css={bind(ps[0], "cover_art").as(
                (cover) => `background-image: url('${cover}');`,
              )}
            />
            <label
              tooltipText={bind(ps[0], "title").as(
                () => `${ps[0].title} - ${ps[0].artist}`,
              )}
              label={bind(ps[0], "title").as(
                () => `${ps[0].title} - ${ps[0].artist}`,
              )}
            />
          </box>
        ) : (
          "Nothing Playing"
        ),
      )}
    </box>
  );
}