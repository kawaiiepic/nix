import GObject from "gi://GObject";
import {
  App,
  Astal,
  Gtk,
  Gdk,
  Widget,
  astalify,
  type ConstructProps,
} from "astal/gtk3";
import { Variable, GLib, bind, Process } from "astal";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import Apps from "gi://AstalApps";

import Launcher from "./launcher/launcher";
import Profile from "./profile/Profile";

const time = Variable("").poll(1000, "date");

const profileInstance = Profile(App.get_monitors()[0]);

function Media() {
  const mpris = Mpris.get_default();

  return (
    <box className="media">
      {bind(mpris, "players").as((ps) =>
        ps[0] ? (
          <box spacing="6">
            <box
              className="media cover"
              valign={Gtk.Align.CENTER}
              css={bind(ps[0], "cover_art").as(
                (cover) => `background-image: url('${cover}');`,
              )}
            />
            <label
              label={bind(ps[0], "title").as(
                () => `${ps[0].title} - ${ps[0].artist}`,
              )}
            />
          </box>
        ) : (
          "Nothing Playing"
        ),
      )}
    </box>
  );
}

function SysTray() {
  const tray = Tray.get_default();

  return (
    <box className="systray" spacing={6}>
      {bind(tray, "items").as((items) =>
        items.map((item) => (
          <menubutton
            className="systray"
            tooltipMarkup={bind(item, "tooltipMarkup")}
            usePopover={false}
            actionGroup={bind(item, "action-group").as((ag) => [
              "dbusmenu",
              ag,
            ])}
            menuModel={bind(item, "menu-model")}
          >
            <icon gicon={bind(item, "gicon")} />
          </menubutton>
        )),
      )}
    </box>
  );
}

function Wifi() {
  const { wifi } = Network.get_default();

  return (
    <icon
      tooltipText={bind(wifi, "ssid").as(String)}
      className="Wifi"
      icon={bind(wifi, "iconName")}
    />
  );
}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return (
    <box className="AudioSlider" css="min-width: 100px">
      <icon icon={bind(speaker, "volumeIcon")} />
      <slider
        hexpand
        onDragged={({ value }) => (speaker.volume = value)}
        value={bind(speaker, "volume")}
      />
    </box>
  );
}

function Workspaces() {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedWorkspace");

  const listItems: JSX.Element[] = [];

  for (let i = 1; i <= 5; i++) {
    const workspace = hypr.get_workspace(i);
    listItems.push(
      <eventbox>
        <label
          className={focused.as((fw) =>
            workspace == fw
              ? "focused"
              : workspace.clients.length > 0
                ? "occupied"
                : "",
          )}
          label="1"
          valign="3"
          vpack="center"
          hpack="center"
        ></label>
      </eventbox>,
    );
  }

  return <box className="workspaces">{listItems}</box>;
}

function UserProfile() {
  return (
    <eventbox onClick={ () => { App.toggle_window("profile") } }>
    <box
      halign={Gtk.Align.CENTER}
      hexpand={false}
      vexpand={false}
      valign={Gtk.Align.CENTER}
      className="profile-pic"
      css="background-image: url('/home/mia/.face');"
    ></box>
    </eventbox>
  );
}

function FocusedClient() {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  const apps = new Apps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
  });

  return (
    <box spacing={6} className="client-title" visible={focused.as(Boolean)}>
      {focused.as(
        (client) =>
          client && (
            <icon
              className="client-icon"
              icon={bind(client, "class").as((title) => {
                switch (title) {
                  case "dev.zed.Zed":
                    title = "Zed";
                }
                const title_query = apps.fuzzy_query(client.initial_title);
                const class_query = apps.fuzzy_query(title);

                print(title);
                print(client.title);

                if (class_query.length > 0) {
                  return class_query[0].iconName;
                } else if (title_query.length > 0) {
                  return title_query[0].iconName;
                } else {
                  return client.class;
                }
              })}
            />
          ),
      )}
      {focused.as(
        (client) =>
          client && (
            <label
              label={bind(client, "title").as((title: String) => {
                return title.length <= 40
                  ? title
                  : title.substring(0, 40) + "…";
              })}
            />
          ),
      )}
    </box>
  );
}

function Time({ format = "%H:%M — %a %d %b" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!,
  );

  return (
    <label className="time" onDestroy={() => time.drop()} label={time()} />
  );
}

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
        <box spacing="8">
          <Media></Media>
        </box>
        <box spacing="8" hexpand halign={Gtk.Align.END}>
          <AudioSlider></AudioSlider>
          <SysTray></SysTray>
          <Time></Time>
          <UserProfile></UserProfile>
        </box>
      </centerbox>
    </window>
  );
}
