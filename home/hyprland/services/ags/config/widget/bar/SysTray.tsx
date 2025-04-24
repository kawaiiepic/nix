import { bind } from "astal";
import AstalTray from "gi://AstalTray?version=0.1";

export default () => {
  const tray = AstalTray.get_default();

  return bind(tray, "items").as((items) =>
    items.map((item) => (
      <menubutton
        cssClasses={["systray"]}
        tooltipMarkup={bind(item, "tooltipMarkup")}
        menuModel={bind(item, "menu_model")}
      >
        <image
          cssClasses={["systray"]}
          gicon={bind(item, "gicon")}
          pixelSize={14}
        />
      </menubutton>
    )),
  );
};
