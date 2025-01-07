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
    ./hardware.nix
    ../default.nix
  ];

  networking.hostName = "dreamhouse";
  
  system.stateVersion = "23.11"; # Did you read the comment?
}
