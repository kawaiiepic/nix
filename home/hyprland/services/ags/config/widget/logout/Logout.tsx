import { exec } from "astal";
import { App, Astal, Gdk, Widget } from "astal/gtk3";

export default (gdkmonitor: Gdk.Monitor) =>
  new Widget.Window({
    name: "logout",
    className: "logout",
    gdkmonitor: gdkmonitor,
    visible: false,
    application: App,
    exclusivity: Astal.Exclusivity.IGNORE,
    keymode: Astal.Keymode.EXCLUSIVE,
    onKeyPressEvent: (self, event) => {
      if (event.get_keyval()[1] === Gdk.KEY_Escape) {
        App.toggle_window("logout");
      }
    },
    anchor: Astal.WindowAnchor.TOP,
    child: new Widget.Box({
      className: "macchiato",
      hexpand: false,
      spacing: 12,
      child: new Widget.Box({
        className: "logout",
        spacing: 12,
        children: [
          new Widget.Button({
            className: "circular",
            onClick: () => {
              exec(["bash", "-c", "shutdown"]);
            },
            child: new Widget.Label({ label: "󰐥" }),
          }),
          new Widget.Button({
            className: "circular",
            onClick: () => {
              exec(["bash", "-c", "reboot"]);
            },
            child: new Widget.Label({ label: "󰜉" }),
          }),
          new Widget.Button({
            className: "circular",
            onClick: () => {
              exec(["bash", "-c", "loginctl lock-session"]);
            },
            child: new Widget.Label({ label: "" }),
          }),

          new Widget.Button({
            className: "circular",
            onClick: () => {
              exec(["bash", "-c", "systemctl suspend"]);
            },
            child: new Widget.Label({ label: "󰤄" }),
          }),
          new Widget.Button({
            className: "circular",
            onClick: () => {
              exec(["bash", "-c", "hyprexit"]);
            },
            child: new Widget.Label({ label: "󰍃" }),
          }),
          new Widget.Button({
            className: "circular",
            child: new Widget.Label({ label: "" }),
            onClick: () => {
              App.toggle_window("logout");
            },
          }),
        ],
      }),
    }),
  });
