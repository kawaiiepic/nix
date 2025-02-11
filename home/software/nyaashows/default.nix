{
  callPackage,
  fetchurl,
  lib,
  stdenv,
  gtk3,
  zlib,
  pango,
  harfbuzz,
  atk,
  cairo,
  gdk-pixbuf,
  glib,
  mpv,
  libepoxy,
  fontconfig,
  makeDesktopItem,
  makeWrapper,
  wrapGAppsHook,
  gobject-introspection,
  gsettings-desktop-schemas,
  gnome-user-share,
}:

stdenv.mkDerivation rec {
  pname = "NyaaShows";
  version = "0.1.1";

  src = fetchurl {
    url = "https://github.com/kawaiiepic/NyaaShows/archive/refs/tags/0.1.1.tar.gz";
    hash = "sha256-C48Ay2ej3RyBqsc7OJluSWKdWLKzOx0VHHWpZRpeAF8=";
  };

  dontBuild = true;

  nativeBuildInputs = [
    makeWrapper
    wrapGAppsHook
    gobject-introspection
  ];

  buildInputs = [
    gsettings-desktop-schemas
    gnome-user-share

    gdk-pixbuf
  ];

  installPhase = ''
    mkdir -p $out/build
    cp -r ./ $out/build
    ls $out

    mkdir -p $out/bin
    mv $out/build/build/linux/x64/release/bundle/* $out/bin/

    # Create Desktop Item
    mkdir -p "$out/share/applications"
    ln -s "${desktopItem}"/share/applications/* "$out/share/applications/"
    mkdir -p "$out/share/icons/hicolor/128x128/apps"  # the long folder path is crucial, just using $out/share/icons does not work
    ln -s "$out/build/assets/nyaa.png" "$out/share/icons/hicolor/128x128/apps/nyaashows.png"
  '';

  postFixup = ''
    wrapProgram $out/bin/nyaa_shows \
      --set LD_LIBRARY_PATH ${
        lib.makeLibraryPath [
          gtk3
          zlib
          pango
          harfbuzz
          atk
          cairo
          gdk-pixbuf
          glib
          stdenv.cc.cc.lib
          mpv
          libepoxy
          fontconfig.lib
        ]
      }
  '';

  preFixup = ''
    gappsWrapperArgs+=(
      # Thumbnailers
      --prefix XDG_DATA_DIRS : "${gdk-pixbuf}/share"
    )
  '';

  desktopItem = makeDesktopItem {
    name = "NyaaShows";
    desktopName = "Nyaa Shows";
    exec = "nyaa_shows";
    icon = "nyaashows";
    comment = "nyaashows";
    genericName = "Video player.";
    categories = [
      "GNOME"
      "GTK"
      "Utility"
    ];
  };

  meta = with lib; {
    platforms = platforms.linux;
    license = licenses.gpl3Plus;
    mainProgram = "nyaa_shows";
  };
}
