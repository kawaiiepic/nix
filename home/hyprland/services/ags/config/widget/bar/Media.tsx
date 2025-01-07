import { Variable, GLib, bind, Process, timeout } from "astal";
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

  const revealer = new Widget.Revealer({
    transitionDuration: 1000,
    transitionType: Gtk.RevealerTransitionType.SLIDE_RIGHT,
    child: bind(mpris, "players").as((players) => {
      if (players[0]) {
        return new Widget.Box({
          children: [
            new Widget.EventBox({
              className: "media-buttons",
              child: new Widget.Label({
                label: "",
                tooltipText: "Previous",
              }),
            }),
            new Widget.EventBox({
              className: "media-buttons",
              child: new Widget.Label({
                label: bind(players[0], "playbackStatus").as((status) =>
                  status == Mpris.PlaybackStatus.PLAYING ? "" : "",
                ),

                tooltipText: bind(players[0], "playbackStatus").as((status) =>
                  status == Mpris.PlaybackStatus.PLAYING ? "Play" : "Pause",
                ),
              }),
            }),
            new Widget.EventBox({
              className: "media-buttons",
              child: new Widget.Label({
                label: "",
                tooltipText: "Next",
              }),
            }),
          ],
        });
      }
    }),
  });

  return new Widget.EventBox({
    onHover: () => {
      if (mpris.players[0]) {
        revealer.reveal_child = true;
        timeout(6000, () => {
          revealer.reveal_child = false;
        });
      }
    },
    child: bind(mpris, "players").as((players) => {
      print(players.length);
      if (players[0]) {
        return new Widget.Box({
          className: "media",
          spacing: 6,
          tooltipText: `${players[0]?.title} - ${players[0]?.artist}`,
          children: [
            new Widget.Box({
              className: "media cover",
              valign: Gtk.Align.CENTER,
              css: `background-image: url('${players[0]?.coverArt}')`,
            }),
            new Widget.Label({
              label: players[0]?.title,
            }),
            revealer,
          ],
        });
      } else {
        return new Widget.Label({ label: "Nothing Playing" });
      }
    }),
  });
};
