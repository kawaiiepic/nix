{
  lib,
  flutter,
  pkgs,
  fetchFromGitHub,
}:

flutter.buildFlutterApplication rec {
  pname = "petal";
  version = "git";

  src = fetchFromGitHub {
    owner = "kawaiiepic";
    repo = "Petal";
    rev = "6803cfefb627f867c6444c65f84e5bad16572d7f";
    hash = "";
  };

  pubspecLock = lib.importJSON ./pubspec.lock.json;

  meta = with lib; {
    description = "X11 XTEST reimplementation primarily for Steam Controller on Wayland";
    homepage = "https://github.com/Supreeeme/extest";
    platforms = platforms.linux;
    license = licenses.mit;
    maintainers = [ maintainers.puffnfresh ];
  };
}