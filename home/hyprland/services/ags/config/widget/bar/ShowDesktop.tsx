import { Gtk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hypr = AstalHyprland.get_default(); 

var showing = false;

export default () => {
  const box = new Gtk.Box({
    // onClick: () => {
    //   if (!showing) {
    //     hypr.message_async("keyword decoration:active_opacity 0.1", null);
    //     hypr.message_async("keyword decoration:inactive_opacity 0.1", null);
    //     hypr.message_async("keyword decoration:blur:enabled false", null);
    //   } else {
    //     hypr.message_async("keyword decoration:active_opacity 1", null);
    //     hypr.message_async("keyword decoration:inactive_opacity 1", null);
    //     hypr.message_async("keyword decoration:blur:enabled true", null);
    //   }

    //   showing = !showing;
    // },
  });
  box.append(new Gtk.Label({
    label: " ",
    tooltip_text: "Show Desktop",
  }));
  
  return box;
}