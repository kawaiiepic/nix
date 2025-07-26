export const [theme, setTheme] = createState("macchiato");

import { createState } from "ags";
import { Gtk } from "ags/gtk4";

export function setup_theme(widget: Gtk.Widget) {
  widget.add_css_class(theme.get());
  theme.subscribe(() => {
    widget.add_css_class(theme.get());
  });
}
