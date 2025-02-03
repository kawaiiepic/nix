{pkgs, ...}:{
  programs.fish.enable = true;
  users.defaultUserShell = pkgs.fish;
  users.users.mia.shell = pkgs.fish;
  users.users.wyntor.shell = pkgs.fish
}