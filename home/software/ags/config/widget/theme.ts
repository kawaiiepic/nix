export const [theme, setTheme] = createState("latte");

import { createState } from "ags";
import { Gtk } from "ags/gtk4";

export function setup_theme(widget: Gtk.Widget) {
  let currentClass = theme.get();

  widget.add_css_class(currentClass);

  theme.subscribe(() => {
    widget.remove_css_class(currentClass);

    currentClass = theme.get();
    widget.add_css_class(currentClass);
  });
}
