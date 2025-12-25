{
  pkgs,
  ...
}:
{

  home.packages = with pkgs; [
    (pkgs.callPackage ./gtk/colloid-theme.nix { })
    (catppuccin-kvantum.override {
      accent = "blue";
      variant = "macchiato";
    })
    pkgs.utterly-nord-plasma
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

  # xdg.configFile = {
  #   "Kvantum/Catppuccin-Macchiato-Blue/Catppuccin-Macchiato-Blue/Catppuccin-Macchiato-Blue.kvconfig".source =
  #     "${pkgs.catppuccin-kvantum}/share/Kvantum/Catppuccin-Macchiato-Blue/Cattpuccin-Macchiato-Blue.kvconfig";
  #   "Kvantum/Catppuccin-Macchiato-Blue/Catppuccin-Macchiato-Blue/Catppuccin-Macchiato-Blue.svg".source =
  #     "${pkgs.catppuccin-kvantum}/share/Kvantum/Catppuccin-Macchiato-Blue/Cattpuccin-Macchiato-Blue.svg";
  # };

  # qt.enable = true;
  # qt.platformTheme = "qtct";
  # qt.style.name = "kvantum";

  # xdg.configFile."Kvantum/kvantum.kvconfig".source =
  #   (pkgs.formats.ini { }).generate "kvantum.kvconfig"
  #     {
  #       General.theme = "catppuccin-mocha-mauve";
  #     };

  gtk = {
    enable = true;

    font = {
      name = "Lexend";
      package = pkgs.lexend;
      size = 10;
    };

    cursorTheme = {
      name = "GoogleDot-Blue";
      package = pkgs.google-cursor;
    };

    # theme = {
    #   name = "Colloid-Dark";
    #   package = (pkgs.callPackage ./gtk/colloid-theme.nix { });
    # };

    iconTheme = {
      name = "Papirus";
      package = pkgs.papirus-icon-theme;
    };
  };
}
