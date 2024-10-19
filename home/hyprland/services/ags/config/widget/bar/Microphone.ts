const audio = await Service.import("audio");

const recording_mic = Variable(false, {
  poll: [
    1000,
    "pinfo mic",
    (out) => {
      print(out);
      if (out == "true") return true;
      return false;
    },
  ],
});

const is_muted = audio["microphone"].bind("is_muted");

export default () =>
  Widget.EventBox({
    "on-primary-click": () => {
      Utils.exec(
        // TODO: Fix this.
        "swayosd-client --input-volume mute-toggle && canberra-gtk-play -i audio-volume-change"
      );
    },
    visible: recording_mic.bind(),
    child: Widget.Label({
      label: is_muted.as((v) => {
        if (v) return "";
        return "";
      }),
      class_name: is_muted.as((v) => {
        if (v) return "microphone-muted";
        return "microphone-open";
      }),
    }),
  });
