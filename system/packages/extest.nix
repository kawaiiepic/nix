{
  lib,
  fetchFromGitHub,
  rustPlatform,
}:

rustPlatform.buildRustPackage rec {
  pname = "extest";
  version = "git";

  src = fetchFromGitHub {
    owner = "Supreeeme";
    repo = "extest";
    rev = "0d068672fdaefd6f6565036ddd8e6949ee82eb63";
    hash = "sha256-4SVZD0aHKsn97B5bhCf7URR6iQhJlYGALKWhDg+lGhU=";
  };

  cargoHash = "sha256-OBWgNQ3OfqztaQwbK4fjOp7Lbu58U6j8tbStJ17bIko=";

  meta = with lib; {
    description = "X11 XTEST reimplementation primarily for Steam Controller on Wayland";
    homepage = "https://github.com/Supreeeme/extest";
    platforms = platforms.linux;
    license = licenses.mit;
    maintainers = [ maintainers.puffnfresh ];
  };
}