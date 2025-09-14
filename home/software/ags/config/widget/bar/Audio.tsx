import { Gtk } from "ags/gtk4";
import AstalWp from "gi://AstalWp?version=0.1";

export default () => {
  const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;
  
  const box = new Gtk.Box({cssClasses: ["entry"]});
  const image = new Gtk.Image({pixelSize: 14});
  
  box.append(image);
  
  speaker.connect("notify::volume", (source) => {
    box.tooltipText = Math.round(source.volume * 100).toString() + "%";
  });
  
  speaker.connect("notify::volume-icon", (source) => {
    image.iconName = source.volumeIcon;
  });
  
  return box;
};
