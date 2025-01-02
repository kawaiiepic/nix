import {
  App,
  Astal,
  Gtk,
  Gdk,
  Widget,
  astalify,
  type ConstructProps,
} from "astal/gtk3";

export default function Profile(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      name="profile"
      className="profile"
      visible={false}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox>
        <label label="Cutie" />
      </centerbox>
    </window>
  );
}