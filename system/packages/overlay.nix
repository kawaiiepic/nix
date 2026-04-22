(final: prev: {
  # gpu-screen-recorder = prev.callPackage ./gpu-screen-recorder/gsr.nix { };

  gpu-screen-recorder-notification = prev.callPackage ./gpu-screen-recorder/notif.nix {};
  gpu-screen-recorder-ui = prev.callPackage ./gpu-screen-recorder/ui.nix {};
  zen-theme-switch = prev.callPackage ./zen-theme-switch/zen-theme-switch.nix {};
  kawaiimods-app = (prev.callPackage ./kawaiimods/default.nix {}).override {_7zz = prev._7zz-rar;};
  adw-gtk3 = prev.callPackage ./adw-gtk3.nix {};
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
  davinci-resolve = prev.davinci-resolve.override (old: {
      buildFHSEnv = a: (old.buildFHSEnv (a // {
        extraBwrapArgs = a.extraBwrapArgs ++ [
          "--bind /run/opengl-driver/etc/OpenCL /etc/OpenCL"
        ];
      }));
    });

  steam = (
    prev.steam.override {
      extraLibraries = p:
        with p; [
          # Fixes installing vcrun2022
          # https://github.com/Matoking/protontricks/issues/461
          freetype
        ];
      # extraEnv = {
      #   # LD_PRELOAD = "${prev.pkgs.extest}/lib/libextest.so:${prev.pkgsi686Linux.extest}/lib/libextest.so";
      #   LD_PRELOAD = "${prev.pkgsi686Linux.callPackage ./extest.nix { }}/lib/libextest.so";
      # };
    }
  );
})
