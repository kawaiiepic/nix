{ pkgs, ... }:
{
  home.packages = [
    (pkgs.writeShellScriptBin "keybinds" ''
      config_file=~/.config/hypr/hyprland.conf
      keybinds=$(printf "󰌌 win + enter — 󰌧 Launch Terminal\nboop")
      wofi --dmenu -p "Keybinds" <<< "$keybinds"
    '')
  ];
}
