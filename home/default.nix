{pkgs, ...}: {
  imports = [
    ./hyprland
    ./software
    ./shell
  ];

  # The state version is required and should stay at the version you
  # originally installed.
  home.stateVersion = "24.05";
}
