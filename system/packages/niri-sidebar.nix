{
  lib,
  fetchFromGitHub,
  rustPlatform,
}:

rustPlatform.buildRustPackage {
  pname = "niri-sidebar";
  version = "git";

  src = fetchFromGitHub {
    owner = "Vigintillionn";
    repo = "niri-sidebar";
    rev = "954f62e7e395ae14f01af582296e25a548133dc0";
    hash = "sha256-MYP1ZiwV9+yJhl0zpuri6NQkQHlaYZjGBhXpZEaPZyI=";
  };

  cargoHash = "sha256-zZlfwAxWE1ZZy6k7QoBOamCGigGShd89sD27vfvgR00=";

  meta = with lib; {
    description = "A niri extension adding optional tiling layouts such as Master Stack. Provides similar experience to hyprland or mangowm.";
    homepage = "https://github.com/MintyDoggo/miri";
    platforms = platforms.linux;
    license = licenses.mit;
    maintainers = [ maintainers.puffnfresh ];
  };
}