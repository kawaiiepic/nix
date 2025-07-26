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
import { onHover, onHoverLost } from "../utils";
import { Notification } from "./notification/Not";
import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";

const mpris = Mpris.get_default();
const notifd = Notifd.get_default();

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

// function MediaPlayer({ player }: { player: Mpris.Player }) {
//   const { START, END } = Gtk.Align;

//   const title = bind(player, "title").as((t) => t || "Unknown Track");

//   const artist = bind(player, "artist").as((a) => a || "Unknown Artist");

//   const coverArt = bind(player, "coverArt").as((c) => {
//     if (!c) {
//       return <image iconName="media-optical" pixelSize={64}></image>;
//     }

//     App.apply_css(`
//         .coverArt-${player.busName.replaceAll(".", "-")} {
//           background-image: url(file://${c});
//         }
//       `);

//     return (
//       <box
//         valign={Gtk.Align.CENTER}
//         cssClasses={[
//           "coverArt",
//           `coverArt-${player.busName.replaceAll(".", "-")}`,
//         ]}
//       />
//     );
//   });

//   const playerIcon = bind(player, "entry").as((entry) => {
//     if (entry == "zen") entry = "zen-beta";
//     return entry;
//   });

//   const position = bind(player, "position").as((p) =>
//     player.length > 0 ? p / player.length : 0,
//   );

//   const playIcon = bind(player, "playbackStatus").as((s) =>
//     s === Mpris.PlaybackStatus.PLAYING
//       ? "media-playback-pause-symbolic"
//       : "media-playback-start-symbolic",
//   );

//   return (
//     <box cssClasses={["MediaPlayer"]} spacing={8}>
//       {coverArt}
//       <box vertical>
//         <box cssClasses={["title"]}>
//           <label hexpand halign={START} tooltipText={title} label={title} />
//           <image iconName={playerIcon} />
//         </box>
//         <label halign={START} valign={START} vexpand wrap label={artist} />
//         <slider
//           visible={bind(player, "length").as((l) => l > 0)}
//           onChangeValue={({ value }) =>
//             (player.position = value * player.length)
//           }
//           value={position}
//         />
//         <centerbox cssClasses={["actions"]}>
//           <label
//             hexpand
//             cssClasses={["position"]}
//             halign={START}
//             visible={bind(player, "length").as((l) => l > 0)}
//             label={bind(player, "position").as(lengthStr)}
//           />
//           <box>
//             <button
//               onClicked={() => player.previous()}
//               visible={bind(player, "canGoPrevious")}
//             >
//               <image iconName="media-skip-backward-symbolic" />
//             </button>
//             <button
//               onClicked={() => player.play_pause()}
//               visible={bind(player, "canControl")}
//             >
//               <image iconName={playIcon} />
//             </button>
//             <button
//               onClicked={() => player.next()}
//               visible={bind(player, "canGoNext")}
//             >
//               <image iconName="media-skip-forward-symbolic" />
//             </button>
//           </box>
//           <label
//             cssClasses={["length"]}
//             hexpand
//             halign={END}
//             visible={bind(player, "length").as((l) => l > 0)}
//             label={bind(player, "length").as((l) =>
//               l > 0 ? lengthStr(l) : "0:00",
//             )}
//           />
//         </centerbox>
//       </box>
//     </box>
//   );
// }

function face() {
  var image = Gtk.Image.new_from_file(GLib.getenv("HOME") + "/.face");
  image.add_css_class("profile-pfp");
  image.overflow = Gtk.Overflow.HIDDEN;
  return image;
}

export default () => {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;
  const speakers = Wp.get_default()?.audio!;
  
  const box = new Gtk.Box({cssClasses: ["profile"], orientation: Gtk.Orientation.VERTICAL});
  
  const topBox = new Gtk.Box();
  
  const left = new Gtk.Box();
  left.append(face());
  left.append(Uptime());
  left.append(Battery());
  
  const right = new Gtk.Box();
  right.append(Screenshot());
  right.append(ShutdownButton());
  
  topBox.append(left);
  topBox.append(right);
  
  box.append(topBox);
  
  box.append(new Gtk.Separator());
  
  const grid = new Gtk.Grid({cssClasses: ["surface1"], rowSpacing: 10, columnSpacing: 10});
  grid.attach(InternetButton(), 0, 0, 1, 1);
  grid.attach(BluetoothButton(), 1, 0, 1, 1);
  grid.attach(NightLightButton(), 2, 0, 1, 1);
  grid.attach(Theme(), 3, 0, 1, 1);
  
  grid.attach(Caffeine(), 0, 1, 1, 1);
  grid.attach(DoNotDisturbButton(), 1, 1, 1, 1);
  grid.attach(Microphone(), 2, 1, 1, 1);
  grid.attach(Screenshare(), 3, 1, 1, 1);
  
  box.append(grid);
  
  
  
  const boxSpeaker = new Gtk.Box({cssClasses: ["surface1"], spacing: 6});
  const imageSpeaker = new Gtk.Image({iconName: speaker.volumeIcon});
  const sliderSpeaker = new Gtk.Scale({cssClasses: ["slider"], hexpand: true});
  sliderSpeaker.set_range(0, 1);
  sliderSpeaker.set_value(speaker.volume);
  
  const popover = new Gtk.Popover({ child: new Gtk.Label({label: "Boop"}), hasArrow: false});
  boxSpeaker.append(popover);
  
  const gestureClick = new Gtk.GestureClick();
  gestureClick.connect("pressed", () => {
    const speakersBox = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 12});
    speakersBox.append(new Gtk.Label({ label: "Speakers" }));
    speakers.speakers.forEach((speaker) => {
      const speakerBox = new Gtk.Box();
      speakerBox.append(new Gtk.Label({ label: speaker.description }));
      if(speaker.isDefault){
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
  
  return box;
  
  // return (
  //   <box cssClasses={["profile"]} vertical>
  //     <box>
  //       <box halign={Gtk.Align.START}>
  //         <box
  //           cssClasses={["profile-pfp"]}
  //           halign={Gtk.Align.CENTER}
  //           valign={Gtk.Align.CENTER}
  //           tooltipText={`${GLib.get_user_name()}@${GLib.get_host_name()}`}
  //         >
  //           {face()}
  //         </box>

  //         {Uptime()}
  //         {Battery()}
  //       </box>

  //       <box spacing={6} hexpand halign={Gtk.Align.END}>
  //         {Screenshot()}
  //         {ShutdownButton()}
  //       </box>
  //     </box>

  //     {Gtk.Separator.new(Gtk.Orientation.HORIZONTAL)}

  //     <Grid rowHomogeneous columnHomogeneous cssClasses={["surface1"]}>
  //       <box vertical spacing={12} halign={Gtk.Align.CENTER}>
  //         {InternetButton()}
  //         {Caffeine()}
  //       </box>

  //       <box vertical spacing={12} halign={Gtk.Align.CENTER}>
  //         {BluetoothButton()}
  //         {DoNotDisturbButton()}
  //       </box>

  //       <box vertical spacing={12} halign={Gtk.Align.CENTER}>
  //         {NightLightButton()}
  //         {Microphone()}
  //       </box>

  //       <box vertical spacing={12} halign={Gtk.Align.CENTER}>
  //         {Theme()}
  //         {Screenshare()}
  //       </box>
  //     </Grid>

  //     <box
  //       onButtonPressed={(box) => {
  //         (box.children[2] as Gtk.Popover).popup();
  //       }}
  //       cssClasses={["surface1"]}
  //       spacing={6}
  //     >
  //       <image iconName={bind(speaker, "volumeIcon")}></image>
  //       <slider
  //         cssClasses={["slider"]}
  //         hexpand
  //         onChangeValue={(slider) => speaker.set_volume(slider.value)}
  //         value={bind(speaker, "volume")}
  //       />
  //       <popover>
  //         <box vertical spacing={12}>
  //           <label label="Speakers" />
  //           {bind(speakers, "speakers").as((s) => {
  //             return s.map((speak) => {
  //               return (
  //                 <box
  //                   onButtonPressed={() => {
  //                     speak.set_is_default(true);
  //                   }}
  //                 >
  //                   <label label={speak.description} />
  //                   <label label="" visible={bind(speak, "is_default")} />
  //                 </box>
  //               );
  //             });
  //           })}
  //         </box>
  //       </popover>
  //     </box>

  //     <box
  //       cssClasses={["surface1"]}
  //       spacing={12}
  //       vertical
  //       visible={bind(mpris, "players").as(
  //         (players) =>
  //           players.filter((player) => !player.busName.includes("playerctld"))
  //             .length > 0,
  //       )}
  //     >
  //       {bind(mpris, "players").as((arr) =>
  //         arr.map((player) => {
  //           if (!player.busName.includes("playerctld")) {
  //             return <MediaPlayer player={player} />;
  //           } else {
  //             return <box />;
  //           }
  //         }),
  //       )}
  //     </box>

  //     <box cssClasses={["surface1"]} spacing={12} vertical>
  //       <box hexpand halign={Gtk.Align.FILL}>
  //         <label label="Notifications" />
  //         <label
  //           cssClasses={["dismiss-notifications"]}
  //           onHoverEnter={onHover}
  //           onHoverLeave={onHoverLost}
  //           hexpand
  //           halign={Gtk.Align.END}
  //           onButtonPressed={() => {
  //             notifs.clear();
  //           }}
  //           label="󰎟"
  //           tooltipText="Clear Notifications"
  //         />
  //       </box>

  //       <ScrolledWindow heightRequest={200}>
  //         <box vertical spacing={12}>
  //           {bind(notifs).as((w) =>
  //             w.length == 0 ? (
  //               <label
  //                 vexpand
  //                 valign={Gtk.Align.CENTER}
  //                 halign={Gtk.Align.CENTER}
  //                 label="No Notifications :)"
  //               />
  //             ) : (<box>
  //                 {w.reverse()}
  //             </box>
  //             ),
  //           )}
  //         </box>
  //       </ScrolledWindow>
  //     </box>
  //   </box>
  // );
};
