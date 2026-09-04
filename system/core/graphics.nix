{pkgs, ...}: {
  systemd.tmpfiles.rules = [
    "L+    /opt/rocm/hip   -    -    -     -    ${pkgs.rocmPackages.clr}"
  ];

  environment.systemPackages = [pkgs.clinfo];

  hardware = {
    amdgpu = {
      opencl.enable = true;
      overdrive.enable = true;
    };
    graphics = {
      enable = true;
      enable32Bit = true;

      extraPackages = with pkgs; [
        rocmPackages.clr
        mangohud
        # low-latency-layer
      ];
    };
  };
}
