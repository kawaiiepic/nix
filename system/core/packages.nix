{ pkgs, ... }:
{

  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    unrar
    # (pkgs.efibootmgr.overrideAttrs {
    #   version = "git";
    #   src = fetchFromGitHub {
    #     owner = "rhboot";
    #     repo = "efibootmgr";
    #     rev = "0a85e9baaac8a34e4a0bb9c23dfcc9c4f759e061";
    #     hash = "sha256-XHfErh99UV68oC7gIfg5UIAB2L/X4Dj4EzqKu4QNpBw=";
    #   };

    #   patches = [

    #   ];

    #   makeFlags = [
    #     "CFLAGS=-Wno-pointer-sign"
    #     "EFIDIR=nixos"
    #     "PKG_CONFIG=${stdenv.cc.targetPrefix}pkg-config"
    #   ];
    # })
  ];
}
