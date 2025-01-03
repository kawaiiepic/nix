import {
  App,
  Astal,
  Gtk,
  Gdk,
  Widget,
  astalify,
  type ConstructProps,
} from "astal/gtk3";

export default () => {
  return (
    <eventbox
      onClick={() => {
        print("Toggle Profile");
        App.toggle_window("profile");
      }}
    >
      <box
        halign={Gtk.Align.CENTER}
        hexpand={false}
        vexpand={false}
        valign={Gtk.Align.CENTER}
        className="profile-pic"
        css="background-image: url('/home/mia/.face');"
      ></box>
    </eventbox>
  );
}