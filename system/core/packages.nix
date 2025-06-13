{ pkgs, ... }:
{
  services.usbmuxd = {
    enable = true;
    package = pkgs.usbmuxd2;
  };

  services.flatpak.enable = true;
  xdg.portal.enable = true;
  xdg.portal.extraPortals = [ pkgs.xdg-desktop-portal-gtk ];

  environment.systemPackages = with pkgs; [
    libimobiledevice
    wget
    unrar
    wineWowPackages.staging
    toybox
    comma
    (pkgs.efibootmgr.overrideAttrs {
      version = "git";
      src = fetchFromGitHub {
        owner = "rhboot";
        repo = "efibootmgr";
        rev = "0a85e9baaac8a34e4a0bb9c23dfcc9c4f759e061";
        hash = "sha256-XHfErh99UV68oC7gIfg5UIAB2L/X4Dj4EzqKu4QNpBw=";
      };

      patches = [

      ];

      makeFlags = [
        "CFLAGS=-Wno-pointer-sign"
        "EFIDIR=nixos"
        "PKG_CONFIG=${stdenv.cc.targetPrefix}pkg-config"
      ];
    })
  ];

  programs.nautilus-open-any-terminal = {
    enable = true;
    terminal = "kitty";
  };
}
