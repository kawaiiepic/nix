{ pkgs, inputs, ... }:
{
  imports = [
    ./zen
    ./ags
    ./kitty
    # ./vesktop
    ./discord
    # ./obs
    ./spotify
    ./vscode
    ./helix
    ./nautilus
    # ./nextcloud.nix
    ./gopass.nix
    ./wofi
  ];

  home.packages = with pkgs; [
    # (callPackage ./wvkbd.nix { })
    # (callPackage ./vicinae.nix { })
    # (callPackage ./nyaashows { })
    # stremio
    godot
    wvkbd
    # gammastep
  ];

}
