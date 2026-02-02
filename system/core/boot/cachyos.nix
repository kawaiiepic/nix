{ pkgs, ... }:
{
  boot.kernelModules = [
    "ntsync"
  ];

  boot.kernelPackages = pkgs.cachyosKernels.linuxPackages-cachyos-latest;

  services.power-profiles-daemon.enable = true;

  # services.scx = {
  #   enable = true;
  #   scheduler = "scx_bpfland";
  # };
}
