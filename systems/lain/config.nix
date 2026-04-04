# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).
{
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    ./hardware.nix
    ../default.nix
    ../../system/desktop/greetd.nix
    ../../system/desktop/niri.nix
    #../../system/core/graphics.nix

    ../../modules/gpu-screen-recorder-ui.nix

    ../../system/games

    inputs.nixos-hardware.nixosModules.common-pc-ssd
  ];

  programs.gpu-screen-recorder-ui.enable = true;

  networking.hostName = "lain";

  environment.systemPackages = with pkgs; [

  ];

  programs.steam = {
    enable = true;
    remotePlay.openFirewall = true; # Open ports in the firewall for Steam Remote Play
    dedicatedServer.openFirewall = true; # Open ports in the firewall for Source Dedicated Server
    localNetworkGameTransfers.openFirewall = true; # Open ports in the firewall for Steam Local Network Game Transfers
  };

  services.xserver.videoDrivers = [ "modesetting" ];

  hardware.graphics = {
    enable = true;
    extraPackages32 = with pkgs.pkgsi686Linux; [ intel-vaapi-driver ];
    extraPackages = with pkgs; [
      intel-ocl
      intel-media-driver
      vpl-gpu-rt
      intel-compute-runtime
    ];
  };

  environment.sessionVariables = {
    LIBVA_DRIVER_NAME = "iHD"; # Prefer the modern iHD backend
  };

  # May help if FFmpeg/VAAPI/QSV init fails (esp. on Arc with i915):
  hardware.enableRedistributableFirmware = true;
  boot.kernelParams = [ "i915.enable_guc=3" ];
  boot.initrd.kernelModules = [ "xe" ];

  system.stateVersion = "23.11"; # Did you read the comment?
}
