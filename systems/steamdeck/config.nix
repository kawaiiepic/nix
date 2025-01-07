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
    ../default.nix
  ];

  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;
    steam.user = "mia";

    decky-loader.enable = true;

    devices.steamdeck = {
      enable = true;
      autoUpdate = true;
    };
  };
  jovian.steam.autoStart = true;
  jovian.steam.desktopSession = "hyprland";
}
