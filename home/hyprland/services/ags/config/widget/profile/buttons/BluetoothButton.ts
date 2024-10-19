const bluetooth = await Service.import("bluetooth");

export default () =>
  Widget.ToggleButton({
    class_name: "profile-normal-button circular",
      tooltip_text: "Toggle Bluetooth",
      on_toggled(self) {
          if (self.active) {
              bluetooth.enabled = true;
          } else {
              bluetooth.enabled = false;
          }
      },
    active: true,
    child: Widget.Icon({
      class_name: "profile-normal-button-icon",
      icon: bluetooth
        .bind("enabled")
        .as((on) => `bluetooth-${on ? "active" : "disabled"}-symbolic`),
    }),
  });
