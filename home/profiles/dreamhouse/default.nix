{
  imports = [
    ../../default.nix
    # Software
    ../../software

    # Desktop
    ../../desktop/niri
    # Services
    ../../services/hyprlock.nix
    ../../services/wlogout.nix
    ../../services/stasis
  ];
}
