{ pkgs, ... }:
{
  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    unrar
    wineWowPackages.staging
    toybox
  ];
}
