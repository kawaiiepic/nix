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
    #jetbrains.idea
    equibop
    arrpc
    feishin
    nodejs
    mpv
    vtsls
    libreoffice
    android-studio
    #davinci-resolve
    #inputs.airi.packages.${pkgs.system}.default
    kawaiimods-app
    distrobox
    lshw
  ];

  programs.yazi.enable = true;

}
