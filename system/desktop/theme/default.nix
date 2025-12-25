{ pkgs, ... }:
{
  environment.variables.QT_QPA_PLATFORMTHEME = "qt5ct";
  environment.variables.ICON_THEME = "Papirus";
  environment.variables.QT_STYLE_OVERRIDE = "kvantum";

  environment.systemPackages = with pkgs; [
    kdePackages.qtstyleplugin-kvantum
    qt6Packages.qtstyleplugin-kvantum
    libsForQt5.qt5ct
    kdePackages.qt6ct
  ];

  # qt = {
  #   enable = true;
  #   platformTheme = "qt5ct";
  #   style = {
  #     package = pkgs.catppuccin-kvantum;
  #     name = "kvantum";
  #   };
  # };
}
