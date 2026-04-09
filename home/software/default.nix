{ pkgs, inputs, ... }:
{
  imports = [
    ./zen
    ./kitty
    # ./discord
    ./obs
    ./vscode
    ./helix
    ./nautilus
    ./gopass.nix
    ./wofi
  ];

  home.packages = with pkgs; [
    kodi
    godot
    wvkbd
    mission-center
    jetbrains.idea
    equibop
    feishin
    nodejs
    mpv
    vtsls
    libreoffice
    android-studio
    #inputs.airi.packages.${pkgs.system}.default
    kawaiimods-app
  ];

  programs.yazi.enable = true;

}
