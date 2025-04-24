import { bind } from "astal";
import { Gtk, Widget } from "astal/gtk4";
import AstalWp from "gi://AstalWp?version=0.1";

export default () => {
  const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

  return (
    <box
      tooltipText={bind(speaker, "volume").as(
        (volume) => Math.round(volume * 100).toString() + "%",
      )}
    >
      <image iconName={bind(speaker, "volumeIcon")} pixelSize={14}></image>
    </box>
  );
};
