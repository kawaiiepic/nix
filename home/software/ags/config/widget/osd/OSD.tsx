import Brightness from "./brightness";
import Wp from "gi://AstalWp";
import { setup_theme } from "../theme";
import { Accessor, createState, Setter } from "ags";
import { timeout } from "ags/time";
import { Astal, Gdk, Gtk } from "ags/gtk4";

function OnScreenProgress({
  visible,
  setVisible,
}: {
  visible: Accessor<boolean>;
  setVisible: Setter<boolean>;
}): Gtk.Revealer {
  const brightness = Brightness.get_default();
  const speaker = Wp.get_default()!.get_default_speaker();
  const speakers = Wp.get_default()?.audio.defaultSpeaker!;

  const [iconName, setIconName] = createState("");
  const [value, setValue] = createState(0);

  let count = 0;

  const box = new Gtk.Box({ cssClasses: ["OSD"], spacing: 12 });
  const image = new Gtk.Image({ iconName: iconName.get() });
  const innerBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
  const innerBoxLabel = new Gtk.Label({ label: speaker?.description });
  const innerBoxLevelBar = new Gtk.LevelBar({
    valign: Gtk.Align.CENTER,
    widthRequest: 100,
  });

  const revealer = new Gtk.Revealer({
    transitionType: Gtk.RevealerTransitionType.SLIDE_UP,
  });

  revealer.child = box;

  box.append(image);
  box.append(innerBox);

  innerBox.append(innerBoxLabel);
  innerBox.append(innerBoxLevelBar);

  visible.subscribe(() => {
    revealer.revealChild = visible.get();
  });

  function show(v: number, icon: string) {
    setVisible(true);
    setValue(v);
    setIconName(icon);

    image.iconName = iconName.get();
    innerBoxLabel.label = speaker?.description ?? "Unknown";
    innerBoxLevelBar.value = value.get();

    count++;
    timeout(2000, () => {
      count--;
      if (count === 0) setVisible(false);
    });
  }

  brightness.connect("notify", () => {
    // Brightness changed
  });

  speaker?.connect("notify::volume", () => {
    show(speaker.volume, speaker.volumeIcon);
  });

  return revealer;
}

export default function OSD(monitor: Gdk.Monitor) {
  const [v, setV] = createState(false);

  const window = new Astal.Window({
    cssClasses: ["OSD"],
    namespace: "osd",
    layer: Astal.Layer.OVERLAY,
    keymode: Astal.Keymode.ON_DEMAND,
    anchor: Astal.WindowAnchor.BOTTOM,
  });
  const box = new Gtk.Box();
  setup_theme(box);
  box.append(OnScreenProgress({ visible: v, setVisible: setV }));

  window.child = box;

  v.subscribe(() => {
    window.visible = v.get();
  });

  return window;
}
