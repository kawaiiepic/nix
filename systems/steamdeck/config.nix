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
  jovian.steam.desktopSession = "plasma6";
}
