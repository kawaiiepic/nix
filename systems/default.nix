{
  imports = [
    ../system/core/boot/plymouth.nix
    ../system/core/boot/cachyos.nix

    ../system/core/audio.nix
    ../system/core/boot.nix
    ../system/core/fonts.nix
    # ../system/core/graphics.nix
    ../system/core/network.nix
    ../system/core/packages.nix
    ../system/core/shell.nix
    ../system/core/users.nix

    # ../system/desktop/gdm.nix
    # # ../system/desktop/plasma.nix
    # # ../system/desktop/gnome.nix
    # ../system/desktop/hyprland.nix

    ../system/games

    ../system/nix
  ];
}
