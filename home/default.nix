{
  pkgs,
  inputs,
  ...
}: {
  imports = [
    ./shell
    ./theme
    ./services/pfp
  ];

  home.username = "mia";
  home.homeDirectory = "/home/mia";

  programs.home-manager.enable = true;

  # The state version is required and should stay at the version you
  # originally installed.
  home.stateVersion = "26.05";
}
