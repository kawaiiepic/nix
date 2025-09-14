{
  stdenv,
  sassc,
  fetchFromGitHub,
}:

stdenv.mkDerivation {
  pname = "Colloid-gtk-theme";
  version = "unstable-2025-02-11";

  src = fetchFromGitHub {
    owner = "linuxmobile";
    repo = "Colloid-gtk-theme";
    rev = "b2109bb37d70185636fee488f627ef9f22a9dc3e";
    sha256 = "sha256-y4G8WNppJyVVUkGlCponwaS9cg5rZC+8EZTwS4NqwF0=";
  };

  nativeBuildInputs = [ sassc ];

  installPhase = ''
    runHook preInstall

    cp -rf src/sass/_tweaks.scss src/sass/_tweaks-temp.scss
    cp -rf src/sass/gnome-shell/_common.scss src/sass/gnome-shell/_common-temp.scss

    sed -i "/\@import/s/color-palette-default/color-palette-catppuccin/" "src/sass/_tweaks-temp.scss"
    sed -i "/\$colorscheme:/s/default/catppuccin/" "src/sass/_tweaks-temp.scss"

    sassc $SASSC_OPT src/main/gtk-3.0/gtk-Dark.{scss,css}
    echo "==> Generating the 3.0 gtk-Dark.css..."
    sassc $SASSC_OPT src/main/gtk-4.0/gtk-Dark.{scss,css}
    echo "==> Generating the 4.0 gtk-Dark.css..."
    mkdir -p $out/share/themes/Colloid/gtk-3.0
    mkdir -p $out/share/themes/Colloid/gtk-4.0

    cp -r src/main/gtk-3.0/gtk-Dark.css $out/share/themes/Colloid/gtk-3.0/gtk.css
    cp -r src/main/gtk-4.0/gtk-Dark.css $out/share/themes/Colloid/gtk-4.0/gtk.css

    runHook postInstall
  '';
}
