{
  config,
  lib,
  inputs,
  pkgs,
  ...
}:
{
  services.xserver.enable = true;
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;

    devices.steamdeck = {
      enable = true;
      autoUpdate = true;
    };
  };
}
