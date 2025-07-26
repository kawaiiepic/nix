import Launcher from "./Launcher";
import FocusedClient from "./FocusedClient";
import Workspaces from "./Workspaces";
import ShowDesktop from "./ShowDesktop";
import { setup_theme, theme } from "../theme";
import Time from "./Time";
import Wallpaper from "./Wallpaper";
import { createPoll } from "ags/time";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import SysTray from "./SysTray";
import Notifications from "./Notifications";
import Battery from "./Battery";
import Bluetooth from "./Bluetooth";
import Audio from "./Audio";
import Profile from "../profile/Profile";

const time = createPoll("", 1000, (prev) => "Fake Date");
export default function Bar(gdkmonitor: Gdk.Monitor) {
  const window = new Astal.Window({
    visible: true,
    cssClasses: ["bar"],
    gdkmonitor,
    exclusivity: Astal.Exclusivity.EXCLUSIVE,
    anchor:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT,
  });

  const start = new Gtk.Box({
    hexpand: true,
    halign: Gtk.Align.START,
    spacing: 8,
  });
  start.append(Launcher());
  start.append(FocusedClient());

  const center = new Gtk.Box({ hexpand: false });
  center.append(Workspaces());

  const end = new Gtk.Box({
    hexpand: true,
    halign: Gtk.Align.END,
    spacing: 8,
  });

  const mb = new Gtk.MenuButton({
    cssClasses: ["clean", "surface1"],
    valign: Gtk.Align.CENTER,
  });
  mb.popover = new Gtk.Popover({ child: Profile() });

  const mbBox = new Gtk.Box({ spacing: 8 });

  mbBox.append(Audio());
  mbBox.append(Bluetooth());
  mbBox.append(Battery());

  const notificationsWrapper = new Gtk.Box({
    cssClasses: ["notifications"],
  });
  notificationsWrapper.append(Notifications());
  mbBox.append(notificationsWrapper);

  mb.child = mbBox;

  end.append(mb);

  end.append(SysTray());

  end.append(Time());
  end.append(Wallpaper());
  end.append(ShowDesktop());

  const centerbox = new Gtk.CenterBox({
    cssClasses: ["centerbox"],
    startWidget: start,
    centerWidget: center,
    endWidget: end,
  });
  setup_theme(centerbox);

  window.set_child(centerbox);

  return window;
}
