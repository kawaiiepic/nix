{
  pkgs,
  ...
}:
{

  home.packages = with pkgs; [
    (pkgs.callPackage ./gtk/colloid-theme.nix { })
  ];

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
