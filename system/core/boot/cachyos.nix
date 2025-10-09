{ pkgs, ... }:
{
  boot.kernelModules = [
    "ntsync"
  ];
  boot.kernelPackages = pkgs.linuxPackages_cachyos;
}
