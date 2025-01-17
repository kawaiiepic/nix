{
  pkgs,
  lib,
  ...
}:
{

  home.file = {
    ".icons/GoogleDot-Violet" = {
      source = files/GoogleDot-Violet;
    };
  };

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
    
    theme = {
      name = "Catppuccin-GTK-Dark";
      package = pkgs.magnetic-catppuccin-gtk;
    };

    iconTheme = {
      name = "rose-pine";
      package = pkgs.rose-pine-icon-theme;
    };
  };
}
