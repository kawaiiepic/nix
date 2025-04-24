import { timeout } from "astal/time";
import Variable from "astal/variable";
import Brightness from "./brightness";
import Wp from "gi://AstalWp";
import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import { setup_theme } from "../theme";
import { bind } from "astal";

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
  const brightness = Brightness.get_default();
  const speaker = Wp.get_default()!.get_default_speaker();
   const speakers = Wp.get_default()?.audio.defaultSpeaker!;

  const iconName = Variable("");
  const value = Variable(0);

  let count = 0;
  function show(v: number, icon: string) {
    visible.set(true);
    value.set(v);
    iconName.set(icon);
    count++;
    timeout(2000, () => {
      count--;
      if (count === 0) visible.set(false);
    });
  }

  return (
    <revealer
      setup={(self) => {
        hook(self, brightness, "notify::screen", () =>
          show(brightness.screen, "display-brightness-symbolic"),
        );

        if (speaker) {
          hook(self, speaker, "notify::volume", () =>
            show(speaker.volume, speaker.volumeIcon),
          );
        }
      }}
      revealChild={visible()}
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
    >
      <box cssClasses={["OSD"]} spacing={12}>
        <image iconName={iconName()} />
        <box vertical spacing={12}>
          <label label={bind(speakers, "description").as((desc) => desc || "Unknown")} />
          <levelbar
            valign={Gtk.Align.CENTER}
            widthRequest={100}
            value={value()}
          />
        </box>
      </box>
    </revealer>
  );
}

export default function OSD(monitor: Gdk.Monitor) {
  const visible = Variable(false);

  return (
    <window
      visible={bind(visible)}
      gdkmonitor={monitor}
      cssClasses={["OSD"]}
      namespace="osd"
      application={App}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={Astal.WindowAnchor.BOTTOM}
    >
      <box setup={setup_theme} onButtonPressed={() => visible.set(false)}>
        <OnScreenProgress visible={visible} />
      </box>
    </window>
  );
}
