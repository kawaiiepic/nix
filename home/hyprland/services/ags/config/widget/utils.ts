import { Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";

export function onHover(widget: Gtk.Widget) {
  widget.add_css_class("hover");
}

export function onHoverLost(widget: Gtk.Widget) {
  widget.remove_css_class("hover");
}
