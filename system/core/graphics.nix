{ pkgs, ... }:
{
  hardware = {
    graphics = {
      enable = true;
      enable32Bit = true;
      extraPackages = with pkgs; [
        libvdpau-va-gl
        # rocmPackages.clr.icd
      ];
    };

    amdgpu.amdvlk = {
      enable = true;
      support32Bit.enable = true;
    };
  };

  # systemd.tmpfiles.rules =
  #   let
  #     rocmEnv = pkgs.symlinkJoin {
  #       name = "rocm-combined";
  #       paths = with pkgs.rocmPackages; [
  #         rocblas
  #         hipblas
  #         clr
  #       ];
  #     };
  #   in
  #   [
  #     "L+    /opt/rocm   -    -    -     -    ${rocmEnv}"
  #   ];

  environment.systemPackages = with pkgs; [ lact ];
  systemd.packages = with pkgs; [ lact ];
  systemd.services.lactd.wantedBy = [ "multi-user.target" ];

  # chaotic.mesa-git = {
  #   # TODO: Move to Gaming.
  #   enable = true;
  #   #fallbackSpecialisation = false;

  #   extraPackages = with pkgs; [ mesa_git.opencl ];
  # };
}
