import RefreshButton from "./buttons/RefreshButton";
import LockButton from "./buttons/LockButton";
import ShutdownButton from "./buttons/ShutdownButton";
import InternetButton from "./buttons/InternetButton";
import BluetoothButton from "./buttons/BluetoothButton";
import NightLightButton from "./buttons/NightLightButton";
import DoNotDisturbButton from "./buttons/DoNotDisturbButton";
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
import { setup_theme } from "../theme";
import { Notification } from "./notification/Not";
import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";
import { createBinding, createConnection } from "ags";
import app from "ags/gtk4/app";
import Pango from "gi://Pango?version=1.0";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { interval } from "ags/time";
import Apps from "gi://AstalApps";

const mpris = Mpris.get_default();
const notifd = Notifd.get_default();

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

function timeAgo(timestamp: number) {
  const now = GLib.DateTime.new_now_local();
  const then = GLib.DateTime.new_from_unix_local(timestamp);

  const diff = now.difference(then) / GLib.TIME_SPAN_SECOND; // seconds difference
  const seconds = Math.floor(diff);

  if (seconds < 5) return "now";
  if (seconds < 60) return `${seconds} secs ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  // fallback to date for older timestamps
  return then.format("%b %d, %I:%M %p")!;
}

function face() {
  var image = Gtk.Image.new_from_file(GLib.getenv("HOME") + "/.face");
  image.add_css_class("profile-pfp");
  image.tooltipText = `${GLib.get_user_name()}@${GLib.get_host_name()}`;
  image.overflow = Gtk.Overflow.HIDDEN;
  return image;
}

function mprisRebuild(mprisBox: Gtk.Box) {
  const playerBuses: string[] = [];

  rebuild();

  mpris.connect("notify::players", () => {
    rebuild();
  });

  function rebuild() {
    mpris.players
      .filter((p) => p.busName !== "org.mpris.MediaPlayer2.playerctld")
      .forEach((player) => {
        if (!playerBuses.includes(player.busName)) {
          playerBuses.push(player.busName);
          mprisWidget(player);
        }
      });
  }

  function mprisWidget(player: Mpris.Player) {
    const connectIds: number[] = [];

    const playerBox = new Gtk.Box({
      cssClasses: ["MediaPlayer", "surface1"],
      spacing: 8,
    });
    const titleBox = new Gtk.Box({ cssClasses: ["title"], spacing: 6 });
    const title = new Gtk.Label({
      max_width_chars: 20,
      ellipsize: Pango.EllipsizeMode.END,
    });
    const artist = new Gtk.Label({
      max_width_chars: 20,
      ellipsize: Pango.EllipsizeMode.END,
    });
    const scale = new Gtk.Scale();
    scale.set_range(0, 1);
    const playerIcon = new Gtk.Image();
    const coverArt = new Gtk.Box({ valign: Gtk.Align.CENTER });
    const content = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

    const position = new Gtk.Label({ cssClasses: ["position"], label: "Boop" });
    const actions = new Gtk.Box({
      cssClasses: ["actions"],
      halign: Gtk.Align.CENTER,
    });

    const previous = new Gtk.Button({
      child: new Gtk.Image({ iconName: "media-skip-backward-symbolic" }),
    });
    const playPauseImage = new Gtk.Image();
    const playPause = new Gtk.Button({ child: playPauseImage });

    const next = new Gtk.Button({
      child: new Gtk.Image({ iconName: "media-skip-forward-symbolic" }),
    });

    const prevClick = new Gtk.GestureClick();
    prevClick.connect("pressed", () => player.previous());
    previous.child.add_controller(prevClick);

    const playPauseClick = new Gtk.GestureClick();
    playPauseClick.connect("pressed", () => {
      player.play_pause();
    });
    playPauseImage.add_controller(playPauseClick);

    const nextClick = new Gtk.GestureClick();
    nextClick.connect("pressed", () => player.next());
    next.child.add_controller(nextClick);

    actions.append(previous);
    actions.append(playPause);
    actions.append(next);

    titleBox.append(title);
    titleBox.append(playerIcon);

    content.append(titleBox);
    content.append(artist);
    content.append(scale);
    content.append(position);
    content.append(actions);

    updateTitle();
    updateArtist();
    updateScale();
    updatePlayerIcon();
    updateCoverArt();
    updatePlayPauseImage();

    playerBox.append(coverArt);
    playerBox.append(content);

    mprisBox.append(playerBox);

    connectIds.push(
      player.connect("notify::title", () => {
        updateTitle();
      }),
    );

    connectIds.push(
      player.connect("notify::artist", () => {
        updateArtist();
      }),
    );

    connectIds.push(
      player.connect("notify::position", () => {
        updateScale();
      }),
    );

    connectIds.push(
      player.connect("notify::entry", () => {
        // updatePlayerIcon();
      }),
    );

    connectIds.push(
      player.connect("notify::cover-art", () => {
        updateCoverArt();
      }),
    );

    connectIds.push(
      player.connect("notify::playback-status", (source) => {
        updatePlayPauseImage();
      }),
    );

    connectIds.push(
      player.connect("notify::available", () => {
        print("Available: " + player.available + " | Bus: " + player.busName);
        if (!player.available) {
          mprisBox.remove(playerBox);

          connectIds.forEach((id) => {
            print("ID has been disconnected: " + id);
            player.disconnect(id);
          });
        }
      }),
    );

    connectIds.push(
      player.connect("notify::can-go-previous", () => {
        updatePrevious();
      }),
    );

    connectIds.push(
      player.connect("notify::can-go-next", () => {
        updatePlayPauseVisibility;
      }),
    );

    connectIds.push(
      player.connect("notify::entry", () => {
        updatePlayPauseImage();
      }),
    );

    connectIds.push(
      player.connect("notify::can-go-next", () => {
        updateNext();
      }),
    );

    function updateTitle() {
      title.tooltipText = player.title;
      title.label = player.title;
    }

    function updateArtist() {
      artist.tooltipText = player.artist;
      artist.label = player.artist;
    }

    function updateScale() {
      if (player.length > 0 && !scale.visible) {
        scale.visible = true;
      } else if (player.length == 0 && scale.visible) {
        scale.visible = false;
      }

      scale.set_value(player.position / player.length);
    }

    function updatePlayerIcon() {
      print(player.entry);

      const apps = new Apps.Apps({
        nameMultiplier: 2,
        entryMultiplier: 0,
        executableMultiplier: 2,
      });

      for (const app of apps.fuzzy_query(player.entry)) {
        playerIcon.iconName = app.iconName;
        return;
      }
    }

    function updateCoverArt() {
      if (player.coverArt) {
        app.apply_css(`
                .coverArt-${player.busName.replaceAll(".", "-")} {
                  background-image: url(file://${player.coverArt});
                }
              `);
        coverArt.set_css_classes([
          "coverArt",
          `coverArt-${player.busName.replaceAll(".", "-")}`,
        ]);
      }
    }

    function updatePrevious() {
      previous.visible = player.canGoPrevious;
    }

    function updatePlayPauseVisibility() {
      playPause.visible = player.canControl;
    }

    function updatePlayPauseImage() {
      playPauseImage.iconName =
        player.playbackStatus === Mpris.PlaybackStatus.PLAYING
          ? "media-playback-pause-symbolic"
          : "media-playback-start-symbolic";
    }

    function updateNext() {
      next.visible = player.canGoNext;
    }
  }
}

function notificationList() {
  const notificationBox = new Gtk.Box({
    cssClasses: ["surface1"],
    spacing: 12,
    orientation: Gtk.Orientation.VERTICAL,
  });

  const topBar = new Gtk.Box();
  topBar.append(new Gtk.Label({ label: "Notifications" }));

  const dismissButton = new Gtk.Label({
    cssClasses: ["dismiss-all"],
    halign: Gtk.Align.END,
    hexpand: true,
    label: "󰎟",
    tooltipText: "Clear Notifications",
  });

  const dismissGesture = new Gtk.GestureClick();
  dismissGesture.connect("pressed", () => {
    notifd.notifications.forEach((notification) => {
      notification.dismiss();
    });
  });

  dismissButton.add_controller(dismissGesture);

  topBar.append(dismissButton);
  notificationBox.append(topBar);

  const scrollWindow = new Gtk.ScrolledWindow({
    heightRequest: 150,
  });

  const notificationsList = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 12,
  });

  notificationBox.append(scrollWindow);

  rebuildNotifications(notificationsList);

  scrollWindow.child = notificationsList;

  const noNotification = new Gtk.Label({
    vexpand: true,
    valign: Gtk.Align.CENTER,
    halign: Gtk.Align.CENTER,
    label: "No Notifications :)",
    visible: notifd.notifications.length === 0,
  });

  notificationsList.append(noNotification);

  notifd.connect("notified", (_, id) => {
    if (noNotification.visible) {
      noNotification.visible = false;
    }
    addNotification(notifd.get_notification(id), notificationsList);
  });

  function rebuildNotifications(outer: Gtk.Box) {
    notifd.notifications.forEach((notification) => {
      addNotification(notification, outer);
    });
  }

  function addNotification(notification: Notifd.Notification, outer: Gtk.Box) {
    const box = new Gtk.Box({
      cssClasses: ["Notification"],
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 3,
    });

    const header = new Gtk.Box({ cssClasses: ["header"], spacing: 12 });

    if (
      notification.image &&
      Gtk.IconTheme.get_for_display(app.get_monitors()[0].display).has_icon(
        notification.image,
      )
    ) {
      header.append(
        new Gtk.Image({
          cssClasses: ["app-icon"],
          iconName: notification.image,
        }),
      );
    } else {
      header.append(
        new Gtk.Image({
          cssClasses: ["app-icon"],
          iconName:
            notification.appIcon ||
            notification.desktopEntry ||
            "dialog-information",
        }),
      );
    }

    header.append(
      new Gtk.Label({
        cssClasses: ["app-name"],
        label: notification.appName || "Unknown",
      }),
    );

    const timeLabel = new Gtk.Label({
      cssClasses: ["time"],
      halign: Gtk.Align.END,
      hexpand: true,
    });

    header.append(timeLabel);

    interval(1000, () => {
      timeLabel.label = timeAgo(notification.time);
    });

    const closeButton = new Gtk.Label({
      cssClasses: ["dismiss"],
      halign: Gtk.Align.END,
      visible: false,
      label: "󰎟",
      tooltipText: "Dismiss Notification",
    });

    const click = new Gtk.GestureClick();
    click.connect("pressed", () => {
      notification.dismiss();
    });

    closeButton.add_controller(click);

    const hover = new Gtk.EventControllerMotion();
    hover.connect("enter", () => {
      closeButton.visible = true;
    });

    hover.connect("leave", () => {
      closeButton.visible = false;
    });

    box.add_controller(hover);

    header.append(closeButton);

    box.append(header);

    const content = new Gtk.Box({ cssClasses: ["content"], spacing: 6 });

    print(notification.image);

    if (
      notification.image &&
      notification.get_hint("image-size") == null &&
      GLib.file_test(notification.image, GLib.FileTest.EXISTS)
    ) {
      app.apply_css(`
               .image-${notification.id} {
               background-image: url(file://${notification.image});
               }
            `);

      content.append(
        new Gtk.Box({ cssClasses: ["image", `image-${notification.id}`] }),
      );
    }
    // } else if (
    //   notification.image &&
    //   Gtk.IconTheme.get_for_display(app.get_monitors()[1].display).has_icon(
    //     notification.image,
    //   )
    // ) {
    //   const iconBox = new Gtk.Box({ cssClasses: ["icon-image"] });
    //   iconBox.append(new Gtk.Image({ iconName: notification.image }));
    //   content.append(iconBox);
    // }

    const innerContent = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      halign: Gtk.Align.FILL,
    });

    innerContent.append(
      new Gtk.Label({
        cssClasses: ["summary"],
        halign: Gtk.Align.START,
        wrap: true,
        wrapMode: Pango.WrapMode.CHAR,
        useMarkup: true,
        label: notification.summary,
      }),
    );

    if (notification.body) {
      innerContent.append(
        new Gtk.Label({
          cssClasses: ["body"],
          halign: Gtk.Align.START,
          wrap: true,
          wrapMode: Pango.WrapMode.CHAR,
          useMarkup: true,
          label: notification.body,
        }),
      );
    }

    content.append(innerContent);

    if (
      notification.image &&
      notification.get_hint("image-size")?.get_string()[0] == "huge" &&
      GLib.file_test(notification.image, GLib.FileTest.EXISTS)
    ) {
      app.apply_css(`
               .image-${notification.id} {
               background-image: url(file://${notification.image});
               }
            `);

      innerContent.append(
        new Gtk.Box({
          cssClasses: ["image-huge", `image-${notification.id}`],
          halign: Gtk.Align.FILL,
          hexpand: true,
        }),
      );
    }

    box.append(content);

    if (notification.actions.length > 0) {
      const actions = new Gtk.Box({ cssClasses: ["actions"] });
      notification.actions.forEach((action) => {
        const actionButton = new Gtk.Button({});
        const click = new Gtk.GestureClick();
        click.connect("pressed", () => {
          notification.invoke(action.id);
        });
        actionButton.child = new Gtk.Label({ label: action.label });
        actions.append(actionButton);
      });

      box.append(actions);
    }

    outer.prepend(box);

    const id = notification.connect("resolved", (source) => {
      if (notifd.notifications.length === 1) {
        noNotification.visible = true;
      }

      if (source === notification) {
        print(`Removed notification ${notification.appName}`);
        outer.remove(box);
        notification.disconnect(id);
      }
    });
  }

  return notificationBox;
}

export default () => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  const speakers = Wp.get_default()?.audio!;

  const box = new Gtk.Box({
    cssClasses: ["profile"],
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 8,
  });

  const topBox = new Gtk.Box();

  const left = new Gtk.Box();
  left.append(face());
  left.append(Uptime());
  left.append(Battery());

  const right = new Gtk.Box({
    spacing: 8,
    hexpand: true,
    halign: Gtk.Align.END,
  });
  right.append(Screenshot());
  right.append(ShutdownButton());

  topBox.append(left);
  topBox.append(right);

  box.append(topBox);

  box.append(new Gtk.Separator());

  const grid = new Gtk.Grid({
    cssClasses: ["surface1"],
    halign: Gtk.Align.START,
    rowSpacing: 10,
    columnSpacing: 10,
  });
  grid.attach(InternetButton(), 0, 0, 1, 1);
  grid.attach(BluetoothButton(), 1, 0, 1, 1);
  grid.attach(NightLightButton(), 2, 0, 1, 1);
  grid.attach(Theme(), 3, 0, 1, 1);

  grid.attach(Caffeine(), 0, 1, 1, 1);
  grid.attach(DoNotDisturbButton(), 1, 1, 1, 1);
  grid.attach(Microphone(), 2, 1, 1, 1);
  grid.attach(Screenshare(), 3, 1, 1, 1);

  box.append(grid);

  const boxSpeaker = new Gtk.Box({ cssClasses: ["surface1"], spacing: 6 });
  const imageSpeaker = new Gtk.Image({ iconName: speaker.volumeIcon });
  const sliderSpeaker = new Gtk.Scale({
    cssClasses: ["slider"],
    hexpand: true,
  });
  sliderSpeaker.set_range(0, 1);
  sliderSpeaker.set_value(speaker.volume);

  speaker.connect("notify::volume", (source) => {
    imageSpeaker.iconName = source.volumeIcon;
    sliderSpeaker.set_value(source.volume);
  });

  sliderSpeaker.connect("change-value", (_, __, value) => {
    speaker.set_volume(value);
  });

  const popover = new Gtk.Popover();
  boxSpeaker.append(popover);

  const gestureClick = new Gtk.GestureClick();
  gestureClick.connect("pressed", () => {
    const speakersBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 12,
    });
    speakersBox.append(new Gtk.Label({ label: "Speakers" }));
    speakers.speakers.forEach((speaker) => {
      const click1 = new Gtk.GestureClick();
      click1.connect("pressed", () => {
        speaker.set_is_default(true);
        popover.popdown();
      });
      const speakerBox = new Gtk.Box();
      speakerBox.add_controller(click1);
      speakerBox.append(new Gtk.Label({ label: speaker.description }));
      if (speaker.isDefault) {
        speakerBox.append(new Gtk.Label({ label: "" }));
      }
      speakersBox.append(speakerBox);
    });

    popover.child = speakersBox;
    popover.popup();
  });

  boxSpeaker.add_controller(gestureClick);

  boxSpeaker.append(imageSpeaker);
  boxSpeaker.append(sliderSpeaker);

  box.append(boxSpeaker);

  const mprisBox = new Gtk.Box({ spacing: 12 });
  box.append(mprisBox);

  mprisRebuild(mprisBox);

  box.append(notificationList());

  return box;
};
