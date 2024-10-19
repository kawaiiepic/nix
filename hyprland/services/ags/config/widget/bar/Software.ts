export default () =>
  Widget.EventBox({
    "on-primary-click": () => {
      Utils.exec("nix-software-center");
    },
    child: Widget.Label({
      label: " ",
      tooltip_text: "Nix Software Center",
    }),
  });
