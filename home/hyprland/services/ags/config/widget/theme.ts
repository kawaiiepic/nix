import { Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";

export const theme = Variable("macchiato");

export function setup_theme(widget: Gtk.Widget) {
  widget.add_css_class(theme.get());
  theme.subscribe((value: string) => {
    console.log("Theme changed to: " + value);
    widget.add_css_class(value);
  });
}
