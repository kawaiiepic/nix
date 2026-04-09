(final: prev: {
  # gpu-screen-recorder = prev.callPackage ./gpu-screen-recorder/gsr.nix { };

  gpu-screen-recorder-notification = prev.callPackage ./gpu-screen-recorder/notif.nix {};
  gpu-screen-recorder-ui = prev.callPackage ./gpu-screen-recorder/ui.nix {};
  zen-theme-switch = prev.callPackage ./zen-theme-switch/zen-theme-switch.nix {};
  kawaiimods-app = prev.callPackage ./kawaiimods/default.nix {};
  xdg-desktop-portal-wlr = (
    prev.xdg-desktop-portal-wlr.overrideAttrs {
      version = "git";
      src = prev.fetchFromGitHub {
        owner = "emersion";
        repo = "xdg-desktop-portal-wlr";
        rev = "a08b8516740e325ea14a738652693856cfffa011";
        sha256 = "sha256-0zIRCA1z7df9IU3PouwEJBHiETaJaYj9lwpmE1B1fOU=";
      };
    }
  );
  # steam = (
  #   prev.steam.override {
  #     extraEnv = {
  #       # LD_PRELOAD = "${prev.pkgs.extest}/lib/libextest.so:${prev.pkgsi686Linux.extest}/lib/libextest.so";
  #       LD_PRELOAD = "${prev.pkgsi686Linux.callPackage ./extest.nix { }}/lib/libextest.so";
  #     };
  #   }
  # );
})
