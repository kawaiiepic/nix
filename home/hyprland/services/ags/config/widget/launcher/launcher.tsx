import { Variable, GLib, bind, Process } from "astal";

export default function Launcher(): JSX.Element {
  return (
    <icon
      class_name="launcher"
      icon="nixos"
      tooltip_text={"NixOS " + Process.exec("uname -r")}
    ></icon>
  );
}
