import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { bind, Variable } from "astal";
import Launcher from "./Launcher";
import FocusedClient from "./FocusedClient";
import Workspaces from "./Workspaces";
import SysTray from "./SysTray";
import Audio from "./Audio";
import Bluetooth from "./Bluetooth";
import Battery from "./Battery";
import Notifications from "./Notifications";
import ShowDesktop from "./ShowDesktop";
import { setup_theme, theme } from "../theme";
import Time from "./Time";
import Wallpaper from "./Wallpaper";
import Profile from "../profile/Profile";

const time = Variable("").poll(1000, "date");

export default function Bar(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      visible
      cssClasses={["bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox setup={setup_theme}>
        <box hexpand halign={Gtk.Align.START} spacing={8}>
          <Launcher />
          <FocusedClient />
        </box>

        <box>
          <Workspaces />
        </box>

        <box hexpand halign={Gtk.Align.END} spacing={8}>
          <box>
            <menubutton
              cssClasses={["clean", "surface1"]}
            >
              <popover>
                <Profile />
              </popover>
              <box spacing={8}>
              <Audio />
              <Bluetooth />
              <Battery />
              <Notifications />
              </box>
            </menubutton>
            {Gtk.Separator.new(Gtk.Orientation.VERTICAL)}
            <box spacing={8}>
              <SysTray />
            </box>
            
          </box>
          <box spacing={12}>
            <Time />
            <Wallpaper />
            <ShowDesktop />
          </box>

          <box widthRequest={10} />
        </box>
      </centerbox>
    </window>
  );
}
