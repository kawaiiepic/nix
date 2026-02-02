{ pkgs, inputs, ... }:
{
  imports = [
    ./zen
    ./kitty
    # ./vesktop
    ./discord
    ./obs
    # ./spotify
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
    #stremio
    kodi

    # inputs.helium-browser.packages."${pkgs.system}".helium
    godot
    wvkbd
    lmstudio
    libreoffice-qt6-fresh
    mission-center
    jetbrains.idea
    # gammastep
  ];

  programs.yazi.enable = true;


}
