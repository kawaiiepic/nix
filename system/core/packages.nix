{ pkgs, ... }:
{
  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    unrar
    wineWowPackages.staging
    toybox
    (pkgs.efibootmgr.overrideAttrs {
      src = fetchFromGitHub {
          owner = "rhboot";
          repo = "efibootmgr";
          tag = "17";
          hash = "sha256-A+DbfutRwXQtDaBu65sgNsS9iOdS58Fj1TmV12VkMdo=";
        };
    })
  ];

  programs.nautilus-open-any-terminal = {
    enable = true;
    terminal = "kitty";
  };
}
