{pkgs, ...}: {
  environment.variables.QT_QPA_PLATFORMTHEME = "qt5ct";
  environment.variables.ICON_THEME = "Papirus";
  environment.variables.QT_STYLE_OVERRIDE = "kvantum";
  # programs.dconf.enable = true;

  environment.systemPackages = with pkgs; [
    kdePackages.qtstyleplugin-kvantum
    qt6Packages.qtstyleplugin-kvantum
    libsForQt5.qt5ct
    kdePackages.qt6ct
  ];
}
