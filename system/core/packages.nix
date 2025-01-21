{ pkgs, ... }:
{
  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    git
    unrar
    wineWowPackages.staging
    electrum-ltc
    toybox
  ];
}
