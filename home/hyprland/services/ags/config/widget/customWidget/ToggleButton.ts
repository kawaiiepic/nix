import { GObject } from "astal";
import { astalify, ConstructProps, Gtk } from "astal/gtk3";

export class ToggleButton extends astalify(Gtk.ToggleButton) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<ToggleButton, Gtk.ToggleButton.ConstructorProps>,
  ) {
    super(props as any);
  }
}
