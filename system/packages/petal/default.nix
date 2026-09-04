{ lib
, stdenv
, autoPatchelfHook
, copyDesktopItems
, makeDesktopItem
, fetchurl
, gtk3
, glib
, mpv
}:

stdenv.mkDerivation  rec {
  pname = "petal";
  version = "0.3.0";

  src = fetchurl {
    url = "https://github.com/kawaiiepic/Petal/releases/download/build-92/petal-linux-x64.tar.gz";
    hash = "sha256-fJJk9PjekzgzAUiPxpN9RD2OFQFgm4UyM29Qgq3IFAM=";
  };

  nativeBuildInputs = [
    autoPatchelfHook
    copyDesktopItems
  ];

  autoPatchelfIgnoreMissingDeps = [ "libjvm.so" ];

  buildInputs = [
    gtk3
    glib
    mpv
  ];

  sourceRoot = ".";

  desktopItems = [
      (makeDesktopItem {
        name = pname;
        desktopName = "Petal";
        exec = "blssmpetal";
        icon = "blssmpetal";
        comment = meta.description;
        categories = [ "Utility" "AudioVideo" ];
        terminal = false;
      })
    ];

  installPhase = ''
    runHook preInstall
  
    # 1. Create a dedicated directory for the app bundle inside the nix store
    mkdir -p $out/lib/petal
    
    # 2. Copy the entire contents of the release package there
    cp -r ./* $out/lib/petal/
  
    # 3. Create the standard binary folder and symlink the executable
    mkdir -p $out/bin
    ln -s $out/lib/petal/blssmpetal $out/bin/blssmpetal

    if [ -f data/flutter_assets/assets/images/logo.png ]; then
        install -m644 -D data/flutter_assets/assets/images/logo-clean.svg $out/share/icons/hicolor/scalable/apps/blssmpetal.svg
      fi
  
    runHook postInstall
  '';

  preFixup = ''
    addAutoPatchelfSearchPath $out/lib
  '';
  
  meta = {
    description = "Petal";
    platforms = lib.platforms.linux;
  };
}