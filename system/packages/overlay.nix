(final: prev: {
  gpu-screen-recorder = prev.callPackage ./gpu-screen-recorder/gsr.nix { };
  gpu-screen-recorder-notification = prev.callPackage ./gpu-screen-recorder/notif.nix { };
  gpu-screen-recorder-ui = prev.callPackage ./gpu-screen-recorder/ui.nix { };

  # steam = (prev.steam.override (
  #          prev:
  #          {
  #            extraEnv = {LD_PRELOAD = "${prev.pkgsi686Linux.extest}/lib/libextest.so";};});
  steam = (
    prev.steam.override {
      extraEnv = {
        # LD_PRELOAD = "${prev.pkgs.extest}/lib/libextest.so:${prev.pkgsi686Linux.extest}/lib/libextest.so";
        LD_PRELOAD = "${prev.pkgsi686Linux.callPackage ./extest.nix { }
        }/lib/libextest.so";
      };
    }
  );
})
