export default () =>
  Widget.Button({
    class_name: "battery circular",
    child: Widget.Box([
      Widget.Icon({ class_name: "battery-icon", icon: "battery" }),
      // Widget.Label({
      //   class_name: "battery-text",
      //   label: "56% - 1:54 until full",
      //   visible: false,
      // }),
    ]),
  });
