{
  imports = [
    #../system/core/boot/plymouth.nix
    #../system/core/boot/cachyos.nix
    #../system/core/boot/secureboot.nix

    ../system/core/audio.nix
    ../system/core/boot.nix
    ../system/core/fonts.nix
    ../system/core/network.nix
    ../system/core/packages.nix
    ../system/core/shell.nix
    ../system/core/users.nix

    ../system/core/extra/keyboard.nix

    ../system/desktop/theme
    # ../system/desktop/gdm.nix
    # # ../system/desktop/plasma.nix
    # # ../system/desktop/gnome.nix
    # ../system/desktop/hyprland.nix

    #../system/games

    ../system/nix
  ];
}
