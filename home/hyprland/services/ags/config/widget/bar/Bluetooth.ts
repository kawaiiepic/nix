const bluetooth = await Service.import('bluetooth')

export default () => Widget.Box({
  class_name: "bluetooth",
  setup: self => self.hook(bluetooth, self => {
    self.children = bluetooth.connected_devices
      .map(({ icon_name, name, battery_percentage }) => Widget.Box({
        tooltip_text: name + "\n" + battery_percentage + "%",
        children: [
          Widget.Icon(icon_name + '-symbolic'),
          // Widget.Label(name),
        ]
      }));


    self.visible = bluetooth.connected_devices.length > 0;
  }, 'notify::connected-devices'),
})