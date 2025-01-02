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
