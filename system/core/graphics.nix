{ pkgs, ... }:
{
    systemd.tmpfiles.rules =
  let
    rocmEnv = pkgs.symlinkJoin {
      name = "rocm-combined";
      paths = with pkgs.rocmPackages; [
        rocblas
        hipblas
        clr
      ];
    };
  in [
    "L+    /opt/rocm   -    -    -     -    ${rocmEnv}"
  ];
  
  hardware = {
    amdgpu = {
      opencl.enable = true;
      overdrive.enable = true;
    };
    graphics = {
      enable = true;
      enable32Bit = true;
    };
  };
}
