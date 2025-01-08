import { Process } from "astal";
import { App } from "astal/gtk3";

export default () => {
  return (
    <eventbox onClick={
      () => {
        Process.exec('wofi');
      }
    }>
    <icon
      className="launcher"
      icon="nixos-symbolic"
      tooltip_text={"NixOS " + Process.exec("uname -r")}
    ></icon>
    </eventbox>
  );
}
