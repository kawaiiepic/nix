{ stdenv, fetchFromGitHub }:

stdenv.mkDerivation {
  pname = "arashi-icon-theme";
  version = "unstable-2025-08-14";

  src = fetchFromGitHub {
    owner = "0hStormy";
    repo = "Arashi";
    tag = "25.08.3";
    sha256 = "sha256-wmYsAfgdwn6ZLF70avNmjoU5VZNBZdV7dPSe8ycNdHE=";
  };

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share/icons
    cp -r . $out/share/icons/Arashi

    runHook postInstall
  '';
}