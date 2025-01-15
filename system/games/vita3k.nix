{ stdenv
, clangStdenv
, lib
, fetchFromGitHub
, fetchurl
, makeDesktopItem
, copyDesktopItems
, cmake
, ninja
, openssl
, pkg-config
, boost
, python3
, SDL2
, dbus
, zlib
, curl
, git
, unzip
}:

clangStdenv.mkDerivation rec {
  pname = "vita3k";
  version = "unstable-2024-06-13";

  src = fetchFromGitHub {
    owner = "Vita3K";
    repo = "Vita3K";
    rev = "4abf877d43e08b35ff4a0a89f51338c3d1754b67";
    fetchSubmodules = true;
    hash = "sha256-Ey5J0WM5R0l6su1711hMa6ab6RWEX6ww7ZMbVeJa4uI=";
  };

  ffmpeg-src = fetchurl {
    url = "https://github.com/Vita3K/ffmpeg-core/releases/download/e30b7d7/ffmpeg-linux-x64.zip";
    hash = "sha256-SZCYB+SxO6OfmhCdgjyXjV1JGK0LSkaeQXmPW7WzijM=";
  };

  postPatch = "
    # Don't force the need for a static boost
    substituteInPlace CMakeLists.txt --replace-fail 'set(Boost_USE_STATIC_LIBS ON)' 'set(Boost_USE_STATIC_LIBS OFF)'
    # Fix the insane way ffmpeg is fetched
    substituteInPlace external/ffmpeg/CMakeLists.txt --replace-fail 'DOWNLOAD https://github.com/Vita3K/ffmpeg-core/releases/download/\${FFMPEG_GIT_SHA}/\${FFMPEG_PREBUILTS_NAME}' 'COPY ${ffmpeg-src} DESTINATION' --replace-fail 'SHOW_PROGRESS' '' --replace-fail 'STATUS FILE_STATUS' '' --replace-fail 'list(GET FILE_STATUS 0 STATUS_CODE)' 'set(STATUS_CODE 0)' --replace-fail '\${CMAKE_COMMAND} -E tar xzf \"\${CMAKE_BINARY_DIR}/external/ffmpeg.zip\"' 'unzip ${ffmpeg-src}'
    cat external/ffmpeg/CMakeLists.txt
  ";

  nativeBuildInputs = [
    cmake
    ninja
    pkg-config
    copyDesktopItems
  ];

  buildInputs = [
    openssl
    boost
    python3
    SDL2
    dbus
    zlib
    curl
    git
    unzip
  ];

  # This thrashes ir/opt/* source code paths in external/dynarmic/src/dynarmic/CMakeLists.txt
  dontFixCmake = true;

  cmakeFlags = [
    "-DUSE_VITA3K_UPDATE=OFF" # updates via nix
    "-DUSE_DISCORD_RICH_PRESENCE=OFF"
  ];

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{bin,lib}
    cp -r bin $out/lib/${pname}
    ln -s $out/{lib/${pname},bin}/Vita3K
    install -Dm644 ../data/image/icon.png $out/share/icons/hicolor/128x128/apps/${pname}.png

    runHook postInstall
  '';

  desktopItems = [
    (makeDesktopItem {
      name = pname;
      desktopName = "Vita3K";
      exec = "Vita3K";
      icon = pname;
    })
  ];

  meta = with lib; {
    description = "Experimental PlayStation Vita emulator";
    homepage = "https://vita3k.org/";
    license = licenses.gpl2Only;
    maintainers = with maintainers; [ annaaurora ];
  };
}