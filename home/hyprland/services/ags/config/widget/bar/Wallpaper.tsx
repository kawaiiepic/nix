import { background } from "../desktop/Desktop";

export default () => (
  <box onButtonPressed={() => {
    background.poll(30 * 60 * 1000, [
      "bash",
      "-c",
      `find ${SRC}/widget/desktop/wallpaper-engine/ ${SRC}/widget/desktop/wallpapers/ -maxdepth 1 -type f,d | shuf -n 1`,
    ])
  }}>
    <label label="󰸉" tooltipText="Change wallpaper" />
  </box>
);
