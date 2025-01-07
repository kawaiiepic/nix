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
  #services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  networking.networkmanager.enable = true;

  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;
    steam.user = "mia";

    devices.steamdeck = {
      enable = true;
      autoUpdate = true;
    };
  };
  jovian.steam.autoStart = true;
  jovian.steam.desktopSession = "hyprland";
  users.users.mia = {
    isNormalUser = true;
    extraGroups = [
      "wheel"
      "input"
    ]; # Enable ‘sudo’ for the user.
  };

  programs.hyprland = {
    enable = true;
  };

  environment.systemPackages = with pkgs; [
    wget
    git

  ];
  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [
    "nix-command"
    "flakes"
  ];
}
