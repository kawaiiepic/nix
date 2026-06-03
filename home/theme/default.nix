{
  pkgs,
  config,
  lib,
  ...
}: let
  colloid = pkgs.callPackage ./gtk/colloid-theme.nix {};
in {
  home.packages = with pkgs; [
    # config.gtk.theme.package
    # (catppuccin-kvantum.override {
    #   accent = "blue";
    #   variant = "macchiato";
    # })
  ];

  # qt = {
  #   enable = true;
  #   platformTheme.name = "qt6ct";
  #   style.name = "kvantum";
  # };

  # home.file = {
  #   ".local/share/icons/GoogleDot-Violet" = {
  #     source = ./files/GoogleDot-Violet;
  #   };
  # };

  # xdg.configFile = {
  #   "Kvantum/kvantum.kvconfig".text = ''
  #     [General]
  #     theme=catppuccin-mocha-teal
  #   '';

  #   "Kvantum/catppuccin-mocha-teal".source = "${
  #     pkgs.catppuccin-kvantum.override {
  #       accent = "teal";
  #       variant = "mocha";
  #     }
  #   }/share/Kvantum/catppuccin-mocha-teal";
  # };

  # dconf.settings."org/gnome/desktop/interface".gtk-theme = lib.mkForce config.gtk.theme.name;
  dconf.settings."org/gnome/desktop/interface".color-scheme = lib.mkForce "prefer-dark";

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

    # theme = {
    #   name = "adw-gtk3";
    #   package = pkgs.adw-gtk3;
    # };
    #

    iconTheme = {
      name = "Adwaita";
      package = pkgs.adwaita-icon-theme-legacy;
    };
    # iconTheme = {
    #   name = "Papirus-Dark";
    #   package = pkgs.papirus-icon-theme;
    # };
  };

  qt = {
    enable = true;
    platformTheme.name = "Adwaita-dark";
    style = {
      name = "Adwaita-dark";
      package = pkgs.adwaita-qt;
    };
  };
}
