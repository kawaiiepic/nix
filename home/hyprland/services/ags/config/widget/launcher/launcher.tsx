import { Variable, GLib, bind, Process } from "astal";

export default function Launcher(): JSX.Element {
  return (
    <icon
      className="launcher"
      icon="nixos-symbolic"
      tooltip_text={"NixOS " + Process.exec("uname -r")}
    ></icon>
  );
}
