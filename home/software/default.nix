{ pkgs, inputs, ... }:
{
  imports = [
    inputs.nix-openclaw.homeManagerModules.openclaw

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
    winboat
    equibop
    feishin
    nodejs
    #inputs.airi.packages.${pkgs.system}.default
  ];

  programs.yazi.enable = true;

  programs.openclaw = {
    enable = true;
    package = inputs.nix-openclaw.packages.${pkgs.system}.openclaw-gateway;
  };

}
