export default () => Widget.Icon({
  class_name: "launcher",
  icon: `${App.configDir}/style/assets/nixos.svg`,
  tooltip_text: "NixOS " + Utils.exec("uname -r")
})