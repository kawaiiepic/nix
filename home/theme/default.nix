{
  pkgs,
  ...
}:
let
  colloid = pkgs.callPackage ./gtk/colloid-theme.nix { };
in
{

  home.packages = with pkgs; [
    adw-gtk3
    (catppuccin-kvantum.override {
      accent = "blue";
      variant = "macchiato";
    })
    # pkgs.utterly-nord-plasma
  ];

  qt = {
    enable = true;
    platformTheme.name = "qtct";
    style.name = "kvantum";

  };
  xdg.configFile = {
    "Kvantum/kvantum.kvconfig".text = ''
      [General]
      theme=catppuccin-mocha-teal
    '';

    "Kvantum/catppuccin-mocha-teal".source = "${
      pkgs.catppuccin-kvantum.override {
        accent = "teal";
        variant = "mocha";
      }
    }/share/Kvantum/catppuccin-mocha-teal";
  };

  gtk = {
    enable = true;

    font = {
      name = "UbuntuSans Nerd Font";
      package = pkgs.nerd-fonts.ubuntu-sans;
      size = 10;
    };

    cursorTheme = {
      name = "GoogleDot-Blue";
      package = pkgs.google-cursor;
    };

    theme = {
      name = "adw-gtk";
      package = pkgs.adw-gtk3;
    };

    iconTheme = {
      name = "Papirus-Dark";
      package = pkgs.papirus-icon-theme;
    };
  };
}
