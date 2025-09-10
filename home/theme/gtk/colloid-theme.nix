{ stdenv, fetchFromGitHub }:

stdenv.mkDerivation {
  pname = "Colloid-gtk-theme";
  version = "unstable-2025-02-11";

  src = fetchFromGitHub {
    owner = "linuxmobile";
    repo = "Colloid-gtk-theme";
    rev = "b2109bb37d70185636fee488f627ef9f22a9dc3e";
    sha256 = "sha256-y4G8WNppJyVVUkGlCponwaS9cg5rZC+8EZTwS4NqwF0=";
  };

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share/theme
    cp -r . $out/share/theme/Colloid

    runHook postInstall
  '';
}