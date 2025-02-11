{
  flutter,
  fetchFromGitHub,
  lib,
  pkgs,
}:

flutter.buildFlutterApplication rec {
  pname = "nyaashows";
  version = "0.1.0";

  src = fetchFromGitHub {
    owner = "kawaiiepic";
    repo = "NyaaShows";
    rev = "727b1260db10f58ae99e06fc30ab3112d2123161";
    hash = "sha256-Pdi4dOt8d4g+fSrpm4ZeY/m6vYkxjGwnc9MvGDvzWY4=";
  };

  pubspecLock = lib.importJSON ./pubspec.lock.json;

  buildInputs = with pkgs; [
    # libarchive.dev
    # openssl.dev
    # libxml2.dev
    # libepoxy.dev
    # xorg.libXtst
    # libsysprof-capture
    # sqlite.dev
    # libpsl.dev
    # nghttp2.dev
    # libepoxy
    # pcre2
    # gtk3

    # util-linux
    # libselinux
    # libsepol
    # libthai
    # libdatrie
    # xorg.libXdmcp
    # lerc
    # libxkbcommon
    # cmake
    mpv
    libass
    # mimalloc
    ffmpeg.dev
    libplacebo
    libunwind
    shaderc
    vulkan-loader
    lcms
    libdovi
    libdvdnav
    libdvdread
    mujs
    libbluray
    lua
    rubberband
    SDL2
    libuchardet
    zimg
    alsa-lib
    openal
    pipewire
    pulseaudio
    libcaca
    libdrm
    mesa
    xorg.libXScrnSaver
    xorg.libXpresent
    xorg.libXv
    nv-codec-headers-12
    libva
    libvdpau
    # ninja
    # webkitgtk_4_1
  ];

  meta = with lib; {
    homepage = "https://github.com/kawaiiepic/NyaaShows";
    description = "Video Player which streams torrents using real-debrid ";
    platforms = platforms.linux;
    license = licenses.gpl3Plus;
  };
}
