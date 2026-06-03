{pkgs,  lib, ...}: {
  boot.kernelModules = [
    "ntsync"
  ];

  boot.kernelPackages = pkgs.cachyosKernels.linuxPackages-cachyos-bore;

  services.power-profiles-daemon.enable = true;
  services.upower.enable = true;

  powerManagement.cpuFreqGovernor = "schedutil";

  services.scx = {
    enable = true;
    scheduler = lib.mkForce "scx_cosmos";
    extraArgs = [
      "-c 0 -p 0"
    ];
  };
}
