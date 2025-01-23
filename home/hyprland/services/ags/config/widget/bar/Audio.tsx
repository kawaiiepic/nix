import { Variable, GLib, bind, Process, timeout } from "astal";
import { Gtk, Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";

export default () => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  // const revealer = new Widget.Revealer({
  //   transitionDuration: 1000,
  //   transitionType: Gtk.RevealerTransitionType.SLIDE_RIGHT,

  //   child: new Widget.Box({
  //     tooltipText: bind(speaker, "volume").as((volume) => `Volume: ${volume}`),
  //     css: "min-width: 140px",
  //     child: new Widget.Slider({
  //       hexpand: true,
  //       onDragged: ({ value }) => (speaker.volume = value),
  //       value: bind(speaker, "volume"),
  //     }),
  //   }),
  // });

  return new Widget.Box({
    className: "AudioSlider",
    tooltipText: bind(speaker, "volume").as((volume) => Math.round(volume * 100).toString() + '%'),
    children: [new Widget.Icon({ icon: bind(speaker, "volumeIcon") })],
  });
};
