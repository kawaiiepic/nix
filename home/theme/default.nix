{
  pkgs,
  lib,
  ...
}:
{

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
      name = "Colloid";
      package = (pkgs.callPackage ./gtk/colloid-theme.nix { });
    };

    iconTheme = {
      name = "Arashi";
      package = (pkgs.callPackage ./icons/arashi-icon-theme.nix { });
    };
  };
}
