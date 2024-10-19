{
  pkgs,
  lib,
  ...
}: {
  imports = [
    ./qt.nix
  ];

  home.packages = with pkgs; [flat-remix-icon-theme];

  gtk = {
    enable = true;

    theme = {
      name = "Fluent-pink-Dark";
      package = pkgs.fluent-gtk-theme.override {
        themeVariants = ["pink"];
        colorVariants = ["dark"];
        sizeVariants = ["standard"];
      };
    };

    iconTheme = {
      name = "Fluent-dark";
      package = pkgs.fluent-icon-theme;
    };
  };
}
