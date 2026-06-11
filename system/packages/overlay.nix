(final: prev: {
  # gpu-screen-recorder = prev.callPackage ./gpu-screen-recorder/gsr.nix { };

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
      hash = "sha256-TeNNxOsPGSTVFp6P/7pKFu0bEr1HZt169BRoJF9Tuxw=";
    };

    nativeBuildInputs = with prev; [
      pkg-config
      meson
      ninja
      gettext
      gobject-introspection
      wrapGAppsHook4
    ];

    buildInputs = with prev; [
      glib
      gtk4
      evince
      icu
      harfbuzz
      gjs
      gdk-pixbuf
      librsvg
      libsoup_3
      webkitgtk_4_1
      libglycin
      libglycin-gtk4
      blueprint-compiler
      libepoxy
      gst_all_1.gstreamer
      gst_all_1.gst-plugins-base
      (gst_all_1.gst-plugins-good.override {gtkSupport = true;})
      gst_all_1.gst-plugins-bad
      gst_all_1.gst-plugins-ugly
      papers
      gtksourceview5
      webkitgtk_6_0
      libadwaita
    ];

    propagatedBuildInputs = with prev; [
      gtk4
    ];
  };
  papers = prev.papers.overrideAttrs {
    version = "50.1";
    src = prev.fetchurl {
      url = "mirror://gnome/sources/papers/50/papers-50.1.tar.xz";
      hash = "sha256-95zkuVDPURHcSOi33BcosWUcgPMvDiTc5VNxmTzKsnA=";
    };

    cargoDeps = prev.rustPlatform.fetchCargoVendor {
      inherit
        (final.papers)
        src
        pname
        version
        ;
      hash = "sha256-6Fd6V0Ksl8jqoM1znyYI0Mve2QQU+JBf3yn2C2Bcda8=";
    };
  };
  nautilus = prev.nautilus.overrideAttrs {
    version = "50.1";
    src = prev.fetchurl {
      url = "mirror://gnome/sources/nautilus/50/nautilus-50.1.tar.xz";
      hash = "sha256-1ieTuWWXcbZqa24FK1Iin4aN2+wTiKC2ae7wvSESEu4=";
    };

    buildInputs = with prev; [
      gexiv2
      glib-networking
      icu
      gnome-desktop
      adwaita-icon-theme
      gsettings-desktop-schemas
      gnome-user-share
      gst_all_1.gst-plugins-base
      gtk4
      libadwaita
      libportal-gtk4
      libexif
      libnotify
      libseccomp
      libselinux
      gdk-pixbuf
      libcloudproviders
      shared-mime-info
      tinysparql
      localsearch
      gnome-autoar
      libglycin
      libglycin-gtk4
      blueprint-compiler
      gexiv2_0_16
    ];
  };
  niri-sidebar = prev.callPackage ./niri-sidebar.nix {};
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
