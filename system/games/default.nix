{ inputs, pkgs, ... }:
{
  imports = [
    inputs.aagl.nixosModules.default
  ];

  programs.steam.extest.enable = true;

  environment.systemPackages = with pkgs; [
    protontricks
    nexusmods-app-unfree
    lutris
    heroic
    #emulationstation-de
    steam-rom-manager
    mangohud
    prismlauncher
    ryujinx
    # shadps4
    (pkgs.callPackage ./vita3k.nix { })
  ];

  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;

  nix.settings = inputs.aagl.nixConfig;
}
