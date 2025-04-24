import RefreshButton from "./buttons/RefreshButton";
import LockButton from "./buttons/LockButton";
import ShutdownButton from "./buttons/ShutdownButton";
import InternetButton from "./buttons/InternetButton";
import BluetoothButton from "./buttons/BluetoothButton";
import NightLightButton from "./buttons/NightLightButton";
import DoNotDisturbButton from "./buttons/DoNotDisturbButton";
import { bind, GLib, GObject, interval, timeout, Variable } from "astal";
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
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { setup_theme } from "../theme";
import { ScrolledWindow } from "../custom/Scrollable";
import { onHover, onHoverLost } from "../utils";
import { Grid } from "../custom/Grid";
import { Subscribable } from "astal/binding";
import { NotificationMap } from "./notification/NotificationMap";
import { Notification } from "./notification/Not";

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

  const coverArt = bind(player, "coverArt").as((c) => {
    if (!c) {
      return <image iconName="media-optical" pixelSize={64}></image>;
    }

    App.apply_css(`
        .coverArt-${player.busName.replaceAll(".", "-")} {
          background-image: url(file://${c});
        }
      `);

    return (
      <box
        valign={Gtk.Align.CENTER}
        cssClasses={[
          "coverArt",
          `coverArt-${player.busName.replaceAll(".", "-")}`,
        ]}
      />
    );
  });

  const playerIcon = bind(player, "entry").as((entry) => {
    if (entry == "zen") entry = "zen-beta";
    return entry;
  });

  const position = bind(player, "position").as((p) =>
    player.length > 0 ? p / player.length : 0,
  );

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === Mpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic",
  );

  return (
    <box cssClasses={["MediaPlayer"]} spacing={8}>
      {coverArt}
      <box vertical>
        <box cssClasses={["title"]}>
          <label hexpand halign={START} tooltipText={title} label={title} />
          <image iconName={playerIcon} />
        </box>
        <label halign={START} valign={START} vexpand wrap label={artist} />
        <slider
          visible={bind(player, "length").as((l) => l > 0)}
          onChangeValue={({ value }) =>
            (player.position = value * player.length)
          }
          value={position}
        />
        <centerbox cssClasses={["actions"]}>
          <label
            hexpand
            cssClasses={["position"]}
            halign={START}
            visible={bind(player, "length").as((l) => l > 0)}
            label={bind(player, "position").as(lengthStr)}
          />
          <box>
            <button
              onClicked={() => player.previous()}
              visible={bind(player, "canGoPrevious")}
            >
              <image iconName="media-skip-backward-symbolic" />
            </button>
            <button
              onClicked={() => player.play_pause()}
              visible={bind(player, "canControl")}
            >
              <image iconName={playIcon} />
            </button>
            <button
              onClicked={() => player.next()}
              visible={bind(player, "canGoNext")}
            >
              <image iconName="media-skip-forward-symbolic" />
            </button>
          </box>
          <label
            cssClasses={["length"]}
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

function face() {
  var image = Gtk.Image.new_from_file(GLib.getenv("HOME") + "/.face");
  image.add_css_class("profile-pfp");
  image.overflow = Gtk.Overflow.HIDDEN;
  return image;
}

export default () => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  const speakers = Wp.get_default()?.audio!;
  return (
    <box cssClasses={["profile"]} vertical>
      <box>
        <box halign={Gtk.Align.START}>
          <box
            cssClasses={["profile-pfp"]}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            tooltipText={`${GLib.get_user_name()}@${GLib.get_host_name()}`}
          >
            {face()}
          </box>

          {Uptime()}
          {Battery()}
        </box>

        <box spacing={6} hexpand halign={Gtk.Align.END}>
          {Screenshot()}
          {ShutdownButton()}
        </box>
      </box>

      {Gtk.Separator.new(Gtk.Orientation.HORIZONTAL)}

      <Grid rowHomogeneous columnHomogeneous cssClasses={["surface1"]}>
        <box vertical spacing={12} halign={Gtk.Align.CENTER}>
          {InternetButton()}
          {Caffeine()}
        </box>

        <box vertical spacing={12} halign={Gtk.Align.CENTER}>
          {BluetoothButton()}
          {DoNotDisturbButton()}
        </box>

        <box vertical spacing={12} halign={Gtk.Align.CENTER}>
          {NightLightButton()}
          {Microphone()}
        </box>

        <box vertical spacing={12} halign={Gtk.Align.CENTER}>
          {Theme()}
          {Screenshare()}
        </box>
      </Grid>

      <box
        onButtonPressed={(box) => {
          (box.children[2] as Gtk.Popover).popup();
        }}
        cssClasses={["surface1"]}
        spacing={6}
      >
        <image iconName={bind(speaker, "volumeIcon")}></image>
        <slider
          cssClasses={["slider"]}
          hexpand
          onChangeValue={(slider) => speaker.set_volume(slider.value)}
          value={bind(speaker, "volume")}
        />
        <popover>
          <box vertical spacing={12}>
            <label label="Speakers" />
            {bind(speakers, "speakers").as((s) => {
              return s.map((speak) => {
                return (
                  <box
                    onButtonPressed={() => {
                      speak.set_is_default(true);
                    }}
                  >
                    <label label={speak.description} />
                    <label label="D" visible={bind(speak, "is_default")} />
                  </box>
                );
              });
            })}
          </box>
        </popover>
      </box>

      <box
        cssClasses={["surface1"]}
        spacing={12}
        vertical
        visible={bind(mpris, "players").as(
          (players) =>
            players.filter((player) => !player.busName.includes("playerctld"))
              .length > 0,
        )}
      >
        {bind(mpris, "players").as((arr) =>
          arr.map((player) => {
            if (!player.busName.includes("playerctld")) {
              return <MediaPlayer player={player} />;
            } else {
              return <box />;
            }
          }),
        )}
      </box>

      <box cssClasses={["surface1"]} spacing={12} vertical>
        <box hexpand halign={Gtk.Align.FILL}>
          <label label="Notifications" />
          <label
            cssClasses={["dismiss-notifications"]}
            onHoverEnter={onHover}
            onHoverLeave={onHoverLost}
            hexpand
            halign={Gtk.Align.END}
            onButtonPressed={() => {
              notifs.clear();
            }}
            label="󰎟"
            tooltipText="Clear Notifications"
          />
        </box>

        <ScrolledWindow heightRequest={200}>
          <box vertical spacing={12}>
            {bind(notifs).as((w) =>
              w.length == 0 ? (
                <label
                  vexpand
                  valign={Gtk.Align.CENTER}
                  halign={Gtk.Align.CENTER}
                  label="No Notifications :)"
                />
              ) : (<box>
                  {w.reverse()}
              </box>
              ),
            )}

            {/* {bind(notifd, "notifications").as((notifications) => {
              if (notifications.length == 0) {
                return (
                  <label
                    valign={Gtk.Align.CENTER}
                    label="No Notifications :)"
                  />
                );
              } else {
                return notifications.map((notification) => {
                  if (
                    notification.image &&
                    GLib.file_test(notification.image, GLib.FileTest.EXISTS)
                  ) {
                    App.apply_css(`
                           .image-${notification.id} {
                           background-image: url(file://${notification.image});
                           }
                        `);
                  }

                  return (
                    <revealer
                      revealChild={
                        Math.floor(Date.now() / 1000) != notification.time
                      }
                      setup={(self) =>
                        timeout(100, () => (self.revealChild = true))
                      }
                      transitionType={Gtk.RevealerTransitionType.SWING_RIGHT}
                    >

                    </revealer>
                  );
                });
              }
            })} */}
          </box>
        </ScrolledWindow>
      </box>
    </box>
  );
};

class NotificationMap implements Subscribable {
  // the underlying map to keep track of id widget pairs
  private map: Map<number, Gtk.Widget> = new Map();

  // it makes sense to use a Variable under the hood and use its
  // reactivity implementation instead of keeping track of subscribers ourselves
  private var: Variable<Array<Gtk.Widget>> = Variable([]);

  // notify subscribers to rerender when state changes
  private notifiy() {
    this.var.set([...this.map.values()]);
  }

  public clear() {
    this.map.clear();
    this.notifiy();
  }

  public constructor() {
    const notifd = Notifd.get_default();

    // notifd.notifications.forEach((n) => {
    //   var id = n.id;
    //   this.set(
    //     id,
    //     Notification({
    //       notification: notifd.get_notification(id)!,
    //       onHoverLost: () => {
    //         print("HoverLost");
    //       }, // this.delete(id)
    //     }),
    //   );
    // });

    notifd.connect("notified", (_, id) => {
      this.set(
        id,
        Notification({
          notification: notifd.get_notification(id)!,
          onHoverLost: () => {
            print("HoverLost");
          }, // this.delete(id)
        }),
      );
    });

    notifd.connect("resolved", (_, id) => {
      print("Notifications Resolved");
      this.delete(id);
    });
  }

  private set(key: number, value: Gtk.Widget) {
    this.map.set(key, value);
    this.notifiy();
  }

  private delete(key: number) {
    this.map.delete(key);
    this.notifiy();
  }

  get() {
    return this.var.get();
  }

  subscribe(callback: (list: Array<Gtk.Widget>) => void) {
    return this.var.subscribe(callback);
  }
}

const notifs = new NotificationMap();
