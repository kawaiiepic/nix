import {
  App,
  Astal,
  Gtk,
  Gdk,
  Widget,
  astalify,
  type ConstructProps,
} from "astal/gtk3";
import RefreshButton from "./buttons/RefreshButton";
import LockButton from "./buttons/LockButton";
import ShutdownButton from "./buttons/ShutdownButton";
import InternetButton from "./buttons/InternetButton";
import BluetoothButton from "./buttons/BluetoothButton";
import NightLightButton from "./buttons/NightLightButton";
import DoNotDisturbButton from "./buttons/DoNotDisturbButton";
import { bind, GObject } from "astal";
import Wp from "gi://AstalWp";
import Theme from "./buttons/Theme";
import Caffeine from "./buttons/Caffeine";
import Microphone from "./indicators/Microphone";
import Screenshare from "./indicators/Screenshare";
import Screenshot from "./buttons/Screenshot";
import Record from "./buttons/Record";
import Battery from "./Battery";
import Uptime from "./Uptime";
import Mpris from "gi://AstalMpris";
import Notifd from "gi://AstalNotifd";
import Notification, {
  fileExists,
  isIcon,
} from "../notifications/Notification";

const mpris = Mpris.get_default();
const notifd = Notifd.get_default();

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

function MediaPlayer({ player }: { player: Mpris.Player }) {
  const { START, END } = Gtk.Align;

  const title = bind(player, "title").as((t) => t || "Unknown Track");

  const artist = bind(player, "artist").as((a) => a || "Unknown Artist");

  const coverArt = bind(player, "coverArt").as(
    (c) => `background-image: url('${c}')`,
  );

  const playerIcon = bind(player, "entry").as((e) =>
    Astal.Icon.lookup_icon(e) ? e : "audio-x-generic-symbolic",
  );

  const position = bind(player, "position").as((p) =>
    player.length > 0 ? p / player.length : 0,
  );

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === Mpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic",
  );

  return (
    <box className="MediaPlayer">
      <box className="cover-art" css={coverArt} />
      <box vertical>
        <box className="title">
          <label truncate hexpand halign={START} label={title} />
          <icon icon={playerIcon} />
        </box>
        <label halign={START} valign={START} vexpand wrap label={artist} />
        <slider
          visible={bind(player, "length").as((l) => l > 0)}
          onDragged={({ value }) => (player.position = value * player.length)}
          value={position}
        />
        <centerbox className="actions">
          <label
            hexpand
            className="position"
            halign={START}
            visible={bind(player, "length").as((l) => l > 0)}
            label={bind(player, "position").as(lengthStr)}
          />
          <box>
            <button
              onClicked={() => player.previous()}
              visible={bind(player, "canGoPrevious")}
            >
              <icon icon="media-skip-backward-symbolic" />
            </button>
            <button
              onClicked={() => player.play_pause()}
              visible={bind(player, "canControl")}
            >
              <icon icon={playIcon} />
            </button>
            <button
              onClicked={() => player.next()}
              visible={bind(player, "canGoNext")}
            >
              <icon icon="media-skip-forward-symbolic" />
            </button>
          </box>
          <label
            className="length"
            hexpand
            halign={END}
            visible={bind(player, "length").as((l) => l > 0)}
            label={bind(player, "length").as((l) =>
              l > 0 ? lengthStr(l) : "0:00",
            )}
          />
        </centerbox>
      </box>
    </box>
  );
}

export default (gdkmonitor: Gdk.Monitor) => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return new Widget.Window({
    name: "profile",
    className: "profile",
    visible: false,
    gdkmonitor: gdkmonitor,
    application: App,
    exclusivity: Astal.Exclusivity.EXCLUSIVE,
    marginRight: 50,
    marginBottom: 2,
    keymode: Astal.Keymode.EXCLUSIVE,
    onKeyPressEvent: (self, event) => {
      if (event.get_keyval()[1] === Gdk.KEY_Escape) {
        App.toggle_window("profile");
      }
    },
    anchor: Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,

    child: new Widget.Box({
      className: "profile macchiato",
      vertical: true,
      spacing: 6,
      children: [
        new Widget.CenterBox({
          start_widget: new Widget.Box({
            children: [
              new Widget.Box({
                className: "profile-pfp",
                hexpand: false,
                halign: Gtk.Align.CENTER,
                vexpand: false,
                valign: Gtk.Align.CENTER,
                tooltipText: "mia@dreamhouse",
                css: "background-image: url('/home/mia/.face');",
              }),

              Uptime(),
              Battery(),
            ],
          }),

          end_widget: new Widget.Box({
            spacing: 6,
            halign: Gtk.Align.END,
            children: [Screenshot(), ShutdownButton()],
          }),
        }),

        new Separator({}),

        new Widget.Box({
          className: "surface1",
          vertical: true,
          spacing: 6,
          children: [
            new Widget.Box({
              className: "surface1",
              spacing: 12,
              halign: Gtk.Align.CENTER,
              hexpand: false,
              vexpand: false,
              children: [
                // InternetButton(),
                // BluetoothButton(),
                NightLightButton(),
                Theme(),
              ],
            }),

            new Widget.Box({
              className: "surface1",
              spacing: 35,
              halign: Gtk.Align.CENTER,
              hexpand: false,
              vexpand: false,
              children: [
                Caffeine(),
                DoNotDisturbButton(),
                Microphone(),
                Screenshare(),
              ],
            }),
          ],
        }),

        new Widget.Box({
          className: "surface1",
          vertical: true,
          spacing: 12,
          children: [
            new Widget.Box({
              spacing: 15,
              children: [
                new Widget.Icon({ icon: bind(speaker, "volumeIcon") }),
                new Widget.Slider({
                  className: "slider",
                  hexpand: true,
                  onDragged: ({ value }) => (speaker.volume = value),
                  value: bind(speaker, "volume"),
                }),
              ],
            }),

            // new Widget.Box({
            //   className: "profile-progressbar",
            //   spacing: 15,
            //   children: [
            //     new Widget.Icon({ icon: bind(speaker, "volumeIcon") }),
            //     new Widget.Slider({
            //       className: "slider",
            //       hexpand: true,
            //       onDragged: ({ value }) => (speaker.volume = value),
            //       value: bind(speaker, "volume"),
            //     }),
            //   ],
            // }),
          ],
        }),

        new Separator({}),

        new Widget.Label({label: "Notifications"}),
        
        new Widget.Scrollable({
          hscroll: Gtk.PolicyType.NEVER,
          vscroll: Gtk.PolicyType.AUTOMATIC,
          css: "min-height: 300px",
          child: new Widget.Box({
            vertical: true,
            // spacing: 2,
            children: notifd.notifications.map((n) => (
              <eventbox className="Notification">
              <box>
                <box className="content">
                  {n.image && fileExists(n.image) && (
                    <box
                      valign={Gtk.Align.START}
                      className="image"
                      css={`
                        background-image: url("${n.image}");
                      `}
                    />
                  )}
                  {n.image && isIcon(n.image) && (
                    <box
                      expand={false}
                      valign={Gtk.Align.START}
                      className="icon-image"
                    >
                      <icon
                        icon={n.image}
                        expand
                        halign={Gtk.Align.CENTER}
                        valign={Gtk.Align.CENTER}
                      />
                    </box>
                  )}
                  <box vertical>
                    <label
                      className="summary"
                      halign={Gtk.Align.START}
                      xalign={0}
                      label={n.summary}
                      truncate
                    />
                    {n.body && (
                      <label
                        className="body"
                        wrap
                        useMarkup
                        halign={Gtk.Align.START}
                        xalign={0}
                        justifyFill
                        label={n.body.replaceAll('&', 'and')}
                      />
                    )}
                  </box>
                </box>
              </box>
              </eventbox>
            )),
          }),
        }),

        // <box className="surface1" vertical>
        //   {bind(mpris, "players").as((arr) => (
        //     <MediaPlayer player={arr[0]} />
        //   ))}
        // </box>,

        // new Widget.Box({
        //   className: "calendar surface0",
        //   child: new Calendar({
        //     hexpand: true,
        //   }),
        // }),
      ],
    }),
  });
};

export class Calendar extends astalify(Gtk.Calendar) {
  static {
    GObject.registerClass(this);
  }

  constructor(props: ConstructProps<Calendar, Gtk.Calendar.ConstructorProps>) {
    super(props as any);
  }
}

export class Separator extends astalify(Gtk.Separator) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<Separator, Gtk.Separator.ConstructorProps>,
  ) {
    super(props as any);
  }
}
