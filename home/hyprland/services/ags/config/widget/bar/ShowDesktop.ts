import { Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";

const hypr = Hyprland.get_default();

var showing = false;

export default () =>
  new Widget.EventBox({
    onClick: () => {
      if(!showing){
        hypr.message_async('keyword decoration:active_opacity 0.1');
      } else {
        hypr.message_async('keyword decoration:active_opacity 0.1');
      }
      
      showing = !showing;
      
    },
    child: new Widget.Label({
      label: " ",
      tooltip_text: "Show Desktop",
    }),
  });
