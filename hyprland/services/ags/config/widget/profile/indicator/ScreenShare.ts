const sharing_screen = Variable(false, {
  poll: [
    1000,
    "pinfo screenshare",
    (out) => {
      print(out);
      if (out == "true") return true;
      return false;
    },
  ],
});

const widget = Widget.ToggleButton({
  class_name: "indicator circular",
  tooltip_text: sharing_screen.bind().as((value) => {
    if (value) return "Your Screen is currently being shared.";
    return "";
  }),
  active: sharing_screen.bind(),
  child: Widget.Label({
    class_name: "profile-normal-button-label",
    label: "󰹑",
  }),
});

widget.set_sensitive(false);

export default () => widget;
