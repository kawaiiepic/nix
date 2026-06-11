{
  lib,
  fetchFromGitHub,
  rustPlatform,
}:

rustPlatform.buildRustPackage {
  pname = "miri";
  version = "git";

  src = fetchFromGitHub {
    owner = "MintyDoggo";
    repo = "miri";
    rev = "0445f268524bb0eec21a5b04cc6052c9dd9839ac";
    hash = "sha256-Pekw8sELhEfFqIh2Os3FTusBtQJpWYAjfVNLDjYlozY=";
  };

  cargoHash = "sha256-S6VtkM+RJn2QPIgryjG1iC+45jrqxNwHnMr2Y6/m2P4=";

  meta = with lib; {
    description = "A niri extension adding optional tiling layouts such as Master Stack. Provides similar experience to hyprland or mangowm.";
    homepage = "https://github.com/MintyDoggo/miri";
    platforms = platforms.linux;
    license = licenses.mit;
    maintainers = [ maintainers.puffnfresh ];
  };
}