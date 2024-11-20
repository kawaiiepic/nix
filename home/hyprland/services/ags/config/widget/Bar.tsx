import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable, GLib, bind, Process } from "astal";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";

import Launcher from "./launcher/launcher";

const time = Variable("").poll(1000, "date");

function Media() {
  const mpris = Mpris.get_default();

  return (
    <box className="Media">
      {bind(mpris, "players").as((ps) =>
        ps[0] ? (
          <box>
            <box
              className="Cover"
              valign={Gtk.Align.CENTER}
              css={bind(ps[0], "coverArt").as(
                (cover) => `background-image: url('${cover}');`
              )}
            />
            <label
              label={bind(ps[0], "title").as(
                () => `${ps[0].title} - ${ps[0].artist}`
              )}
            />
          </box>
        ) : (
          "Nothing Playing"
        )
      )}
    </box>
  );
}

function SysTray() {
  const tray = Tray.get_default();

  return (
    <box spacing="6">
      {bind(tray, "items").as((items) =>
        items.map((item) => {
          if (item.iconThemePath) App.add_icons(item.iconThemePath);

          const menu = item.create_menu();

          return (
            <button
              className="systray"
              tooltipMarkup={bind(item, "tooltipMarkup")}
              onDestroy={() => menu?.destroy()}
              onClickRelease={(self) => {
                menu?.popup_at_widget(
                  self,
                  Gdk.Gravity.SOUTH,
                  Gdk.Gravity.NORTH,
                  null
                );
              }}
            >
              <icon gIcon={bind(item, "gicon")} />
            </button>
          );
        })
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
    <box className="AudioSlider" css="min-width: 140px">
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

  return (
    <box className="workspaces">
      {bind(hypr, "workspaces").as((wss) =>
        wss
          .sort((a, b) => a.id - b.id)
          .map((ws) => (
            <eventbox>
              <label
                className={bind(hypr, "focusedWorkspace").as((fw) =>
                  ws === fw ? "active" : ""
                )}
                label="1"
                valign="3"
                vpack="center"
                hpack="center"
              ></label>
            </eventbox>
          ))
      )}
    </box>
  );
}

// (
//   <button

//     className={"workspace" + bind(hypr, "focusedWorkspace").as((fw) =>
//       ws === fw ? "focused" : ""
//     )}
//     onClicked={() => ws.focus()}
//   >
//     {ws.id}
//   </button>
// )

function FocusedClient() {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  return (
    <box className="client-title" visible={focused.as(Boolean)}>
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
          )
      )}
    </box>
  );
}

function Time({ format = "%H:%M — %A %x" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
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
        </box>
      </centerbox>
    </window>
  );
}
