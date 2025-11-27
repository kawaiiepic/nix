{ pkgs, ... }:
{
  boot.kernelModules = [
    "ntsync"
  ];

  powerManagement.cpuFreqGovernor = "powersave";

  boot.kernelPackages = pkgs.linuxPackages_cachyos;
}
