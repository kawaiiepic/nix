import { App, Astal, Gtk, Gdk } from "astal/gtk3";

import Media from "./Media";
import Launcher from "./Launcher";
import Workspaces from "./Workspaces";
import FocusedClient from "./FocusedClient";
import Audio from "./Audio";
import SysTray from "./SysTray";
import Time from "./Time";
import UserProfile from "./UserProfile";
import Bluetooth from "./Bluetooth";
import Wallpaper from "./Wallpaper";
import ShowDesktop from "./ShowDesktop";
import DefaultApplication from "./DefaultApplication";
import Wifi from "./Wifi";
import Battery from "../profile/Battery";
import Notifications from "./Notifications";

export default function Bar(gdkmonitor: Gdk.Monitor, hostname: string) {
  if (hostname == "wyntor") {
    return (
      <window
        name="bar"
        className="bar macchiato"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={
          Astal.WindowAnchor.BOTTOM |
          Astal.WindowAnchor.LEFT |
          Astal.WindowAnchor.RIGHT
        }
        application={App}
      >
        <centerbox className="macchiato">
          <box css="padding-left: 2px;" hexpand halign={Gtk.Align.START}>
            <Launcher hostname={hostname}/>
            <FocusedClient></FocusedClient>
          </box>

          <box className="surface" spacing={8}>
            <Workspaces />
          </box>

          <box spacing={8} hexpand halign={Gtk.Align.END}>
            <Media></Media>
            <SysTray></SysTray>
            <eventbox
              onClick={() => {
                App.toggle_window("profile");
              }}
            >
              <box className="surface1" spacing={6}>
                {/* <Wifi/> */}
                <Audio />
                {/* <Bluetooth/> */}
                <Battery />
                <Notifications />
              </box>
            </eventbox>
            <box className="surface1">
              <Time />
            </box>
            <Wallpaper />
            <box css="padding-right: 10px;">
              <ShowDesktop />
            </box>
          </box>
        </centerbox>
      </window>
    );
  } else {
    return (
      <window
        name="bar"
        className="bar macchiato"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={
          Astal.WindowAnchor.BOTTOM |
          Astal.WindowAnchor.LEFT |
          Astal.WindowAnchor.RIGHT
        }
        application={App}
      >
        <centerbox className="macchiato">
          <box css="padding-left: 2px;" hexpand halign={Gtk.Align.START}>
            <Launcher />
            <FocusedClient></FocusedClient>
          </box>

          <box className="surface" spacing={8}>
            <Workspaces />
          </box>

          <box spacing={8} hexpand halign={Gtk.Align.END}>
            <Media></Media>
            <SysTray></SysTray>
            <eventbox
              onClick={() => {
                App.toggle_window("profile");
              }}
            >
              <box className="surface1" spacing={6}>
                {/* <Wifi/> */}
                <Audio />
                {/* <Bluetooth/> */}
                <Battery />
                <Notifications />
              </box>
            </eventbox>
            <box className="surface1">
              <Time />
            </box>
            <Wallpaper />
            <box css="padding-right: 10px;">
              <ShowDesktop />
            </box>
          </box>
        </centerbox>
      </window>
    );
  }
}
