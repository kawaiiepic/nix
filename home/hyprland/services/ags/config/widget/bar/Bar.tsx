import { App, Astal, Gtk, Gdk } from "astal/gtk3";

import Media from "./Media";
import Launcher from "./Launcher";
import Workspaces from "./Workspaces";
import FocusedClient from "./FocusedClient";
import Audio from "./Audio";
import SysTray from "./SysTray";
import Time from "./Time";
import UserProfile from "./UserProfile";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      className="bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox>
        <box hexpand halign={Gtk.Align.START}>
          <Launcher></Launcher>
          <Workspaces></Workspaces>
          <FocusedClient></FocusedClient>
        </box>
        <box spacing={8}>
          <Media></Media>
        </box>
        <box spacing={8} hexpand halign={Gtk.Align.END}>
          <Audio></Audio>
          <SysTray></SysTray>
          <Time></Time>
          <UserProfile></UserProfile>
        </box>
      </centerbox>
    </window>
  );
}
