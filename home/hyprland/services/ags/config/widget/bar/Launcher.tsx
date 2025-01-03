import { Process } from "astal";

export default () => {
  return (
    <icon
      className="launcher"
      icon="nixos-symbolic"
      tooltip_text={"NixOS " + Process.exec("uname -r")}
    ></icon>
  );
}
