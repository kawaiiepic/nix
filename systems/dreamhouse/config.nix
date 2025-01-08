# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).
{
  config,
  lib,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    ../../system/desktop/greetd.nix
    ./hardware.nix
    ../default.nix
  ];

  networking.hostName = "dreamhouse";
  
  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;
    steam.user = "mia";

    decky-loader.enable = true;
    decky-loader.user = "mia";
  };

  system.stateVersion = "23.11"; # Did you read the comment?
}
