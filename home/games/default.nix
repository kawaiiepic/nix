{pkgs, ...}:{
  imports = [
    ./steam-shortcuts.nix
  ];

  home.packages = with pkgs; [
    faugus-launcher
  ];
}