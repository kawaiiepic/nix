import { Widget } from "astal/gtk3";
import { background } from "../desktop/Desktop";

export default () =>
  new Widget.EventBox({
    onClick: () => {
      background.poll(30 * 60 * 1000, [
        "bash",
        "-c",
        `WALL="$(find ${SRC}/style/wallpapers -type f | shuf -n 1)" && ln -sf $WALL $HOME/.cache/background && echo $WALL`,
      ]);
    },
    child: new Widget.Label({
      label: "󰸉 ",
      tooltip_text: "Change wallpaper",
    }),
  });
