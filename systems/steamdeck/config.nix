{
  config,
  lib,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    ./hardware.nix
    # ../default.nix
    
    ../system/core/audio.nix
    ../system/core/boot.nix
    ../system/core/fonts.nix
    ../system/core/graphics.nix
    ../system/core/network.nix
    ../system/core/packages.nix
    ../system/core/shell.nix
    ../system/core/users.nix

    #../system/desktop/greetd.nix
    ../system/desktop/hyprland.nix

    ../system/games

    ../system/nix
  ];

  networking.hostName = "steamdeck";

  hardware.steam-hardware.enable = true;

  services.desktopManager.plasma6.enable = true;

  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;
    steam.user = "mia";

    decky-loader.enable = true;
    decky-loader.user = "mia";

    devices.steamdeck = {
      enable = true;
      autoUpdate = true;
    };
  };
  jovian.steam.autoStart = true;
  jovian.steam.desktopSession = "hyprland";
}
