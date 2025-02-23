{ pkgs, ... }:
{
  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    unrar
    wineWowPackages.staging
    toybox
  ];

  programs.nautilus-open-any-terminal = {
    enable = true;
    terminal = "kitty";
  };
}
