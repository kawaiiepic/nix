(final: prev: {
  gpu-screen-recorder-notification = prev.callPackage ./gpu-screen-recorder/notif.nix {};
  gpu-screen-recorder-ui = prev.callPackage ./gpu-screen-recorder/ui.nix {};
  zen-theme-switch = prev.callPackage ./zen-theme-switch/zen-theme-switch.nix {};
  kawaiimods-app = (prev.callPackage ./kawaiimods/default.nix {}).override {_7zz = prev._7zz-rar;};
  adw-gtk3 = prev.callPackage ./adw-gtk3.nix {};
  miri = prev.callPackage ./miri.nix {};
  low-latency-layer = prev.callPackage ./low-latency-layer.nix {};
  ryubing = prev.callPackage ./ryubing {};
  ryubing-appimage = prev.callPackage ./ryubing/appImage.nix {};

  sushi = prev.sushi.overrideAttrs {
    version = "git";
    src = prev.fetchurl {
      url = "https://gitlab.gnome.org/GNOME/sushi/-/archive/main/sushi-master.tar.gz";
      hash = "sha256-d1/XpedMHpzJgKJAOXUHBCjr7zAvb2e0AG/PJDnHCrI=";
    };

    nativeBuildInputs = with final; [
      pkg-config
      meson
      ninja
      gettext
      wrapGAppsHook4
    ];

    buildInputs = with final; [
      papers
      libadwaita
      libglycin
      libglycin-gtk4
      glycin-loaders
      blueprint-compiler
      gobject-introspection

      fribidi
      gjs
      gtk4
      gtksourceview5
      webkitgtk_6_0
      gst_all_1.gstreamer
      gst_all_1.gst-plugins-base
      (gst_all_1.gst-plugins-good.override {gtkSupport = true;})
      gst_all_1.gst-plugins-bad
      gst_all_1.gst-plugins-ugly
    ];
  };

  glycin-loaders = prev.callPackage ./gnome/glycin-loaders.nix {};
  libglycin = prev.callPackage ./gnome/libglycin.nix {};
  libglycin-gtk4 = prev.callPackage ./gnome/libglycin-gtk4.nix {};

  niri-sidebar = prev.callPackage ./niri-sidebar.nix {};

  linux-wallpaperengine = (
    prev.linux-wallpaperengine.overrideAttrs {
      version = "git";

      src = prev.fetchFromGitHub {
        owner = "Almamu";
        repo = "linux-wallpaperengine";
        rev = "b016d7d1fdcf4e5fd2f9c9fa420a8aaa07fee02d";
        fetchSubmodules = true;
        hash = "sha256-ExWAYdSFW5plPuS3/jxTPMXIly6zVb5GojE3e37imZM=";
      };

      buildInputs = with prev; [
        SDL2
        SDL2_mixer
        egl-wayland
        ffmpeg
        fftw
        freetype
        glew
        glfw
        glm
        gmp
        kissfftFloat
        libxau
        libxdmcp
        libxpm
        libxrandr
        libxxf86vm
        libdecor
        libffi
        libglut
        libpng
        libpulseaudio
        lz4
        mpv
        wayland
        wayland-protocols
        wayland-scanner
        zlib
        dbus
      ];
    }
  );

  # petal = prev.callPackage ./petal {};
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

  gamescope-session = prev.gamescope-session.overrideAttrs (old: {
    postPatch =
      (old.postPatch or "")
      + ''
        ls -al
        sed -i "s/-O '\*',eDP-1/-O DP-1,DP-2,DP-3,HDMI-A-1/" gamescope-session
      '';
  });

  steam = (
    prev.steam.override {
      extraLibraries = p:
        with p; [
          # Fixes installing vcrun2022
          # https://github.com/Matoking/protontricks/issues/461
          freetype
        ];
    }
  );
})
