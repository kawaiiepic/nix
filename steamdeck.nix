{
  config,
  lib,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    ./deck-hardware.nix
  ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  services.xserver.enable = true;
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  networking.networkmanager.enable = true;

  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;

    devices.steamdeck = {
      enable = true;
      autoUpdate = true;
    };
  };
  
  users.users.mia = {
    isNormalUser = true;
    extraGroups = [
      "wheel"
      "input"
    ]; # Enable ‘sudo’ for the user.
  };
}
