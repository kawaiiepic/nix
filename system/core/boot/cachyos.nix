{
  pkgs,
  lib,
  ...
}: {
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

  boot.kernel.sysctl = {
    # Bypassing Verizon Throttling
    "net.ipv4.ip_default_ttl" = 129;
    "net.ipv6.conf.wlp15s0.hop_limit" = 129;

    # Enable IP forwarding
    "net.ipv4.ip_forward" = 1;
  };
}
