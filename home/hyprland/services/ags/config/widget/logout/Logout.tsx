import { exec } from "astal";
import { App, Astal, Gdk, Widget } from "astal/gtk3";

export default (gdkmonitor: Gdk.Monitor, hostname: String) =>
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
            tooltipText: "Shutdown",
            onClick: () => {
              exec(["bash", "-c", "shutdown"]);
            },
            child: new Widget.Label({ label: "󰐥" }),
          }),
          
          new Widget.Button({
            className: "circular",
            tooltipText: "Reboot",
            onClick: () => {
              exec(["bash", "-c", "reboot"]);
            },
            child: new Widget.Label({ label: "󰜉" }),
          }),
          
          // new Widget.Button({
          //   className: "circular",
          //   tooltipText: "Lock",
          //   onClick: () => {
          //     exec(["bash", "-c", "loginctl lock-session"]);
          //   },
          //   child: new Widget.Label({ label: "" }),
          // }),

          // new Widget.Button({
          //   className: "circular",
          //   tooltipText: "Sleep",
          //   onClick: () => {
          //     exec(["bash", "-c", "systemctl suspend"]);
          //   },
          //   child: new Widget.Label({ label: "󰤄" }),
          // }),
          
          new Widget.Button({
            className: "circular",
            tooltipText:
              hostname == "dreamhouse" || hostname == "blossom"
                ? "Logout"
                : "Return to Steam",
            onClick: () => {
              exec(["bash", "-c", "hyprexit"]);
            },

            child: new Widget.Label({
              label:
                hostname == "dreamhouse" || hostname == "blossom" ? "󰍃" : "",
            }),
          }),

          new Widget.Button({
            className: "circular",
            tooltipText: "Reboot to Windows",
            onClick: () => {
              exec(["bash", "-c", "reboot-to-windows"]);
            },
            child: new Widget.Label({ label: "" }),
          }),

          new Widget.Button({
            className: "circular",
            tooltipText: "Cancel",
            child: new Widget.Label({ label: "" }),
            onClick: () => {
              App.toggle_window("logout");
            },
          }),
        ],
      }),
    }),
  });
