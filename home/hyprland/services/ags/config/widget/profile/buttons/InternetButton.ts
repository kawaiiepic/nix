const network = await Service.import("network");

const WifiIndicator = () =>
  Widget.Icon({
    icon: Utils.watch(network.wifi.icon_name, network.wifi, function () {
      return network.wifi.icon_name;
    }),

    setup: (self) =>
      self.hook(network.wifi, () => {
        const wifi = network.wifi;
        if (wifi.internet === "disconnected") {
          self.tooltip_text = "Disconnected";
        } else {
          self.tooltip_text = `ssid: ${wifi.ssid}\nstrength: ${wifi.strength}\nstate: ${wifi.state}\ninternet: ${wifi.internet}`;
        }
      }),
  });

const WiredIndicator = () =>
  Widget.Icon({
    icon: Utils.watch(network.wired.icon_name, network.wired, function () {
      return network.wired.icon_name;
    }),

    setup: (self) =>
      self.hook(network.wired, () => {
        const wired = network.wired;
        if (wired.internet === "disconnected") {
          self.tooltip_text = "Disconnected";
        } else {
          self.tooltip_text = `state: ${wired.state}\ninternet: ${wired.internet}`;
        }
      }),
  });

const Icon = () =>
  Widget.Stack({
    class_name: "profile-normal-button-icon",
    children: {
      wifi: WifiIndicator(),
      wired: WiredIndicator(),
    },
    shown: network.bind("primary").as((p) => p || "wifi"),
  });

export default () =>
  Widget.ToggleButton({
    class_name: "profile-normal-button circular",
    active: true,
    child: Icon(),
  });
