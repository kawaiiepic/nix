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
    ../../system/core/boot/cachyos.nix
    ../../system/core/boot.nix
    ../../system/core/packages.nix
    ../../system/core/shell.nix
    ../../system/core/users.nix
    ../../system/nix
    
    ./hardware.nix
  ];

  networking.hostName = "binarybarbie";

  system.stateVersion = "23.11"; # Did you read the comment?
}
