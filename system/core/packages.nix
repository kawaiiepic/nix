{ pkgs, ... }:
{
  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    unrar
    wineWowPackages.staging
    toybox
    (pkgs.efibootmgr.overrideAttrs {
      version = "boop";
      src = fetchFromGitHub {
          owner = "rhboot";
          repo = "efibootmgr";
          tag = "16";
          hash = "sha256-cRvM2gDd1zjTz/xIq7o+CHr/JxSTA1ssVdSs4DaCRyw=";
        };
        
        patches = [
            (fetchpatch {
              name = "remove-extra-decl.patch";
              url = "https://github.com/rhboot/efibootmgr/commit/99b578501643377e0b1994b2a068b790d189d5ad.patch";
              sha256 = "1sbijvlpv4khkix3vix9mbhzffj8lp8zpnbxm9gnzjz8yssz9p5h";
            })
          ];
    })
  ];

  programs.nautilus-open-any-terminal = {
    enable = true;
    terminal = "kitty";
  };
}
