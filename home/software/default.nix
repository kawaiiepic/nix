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
    # ./vscode
    ./helix
    ./nautilus
    # ./nextcloud.nix
    ./gopass.nix
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
