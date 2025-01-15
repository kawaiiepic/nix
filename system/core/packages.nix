{ pkgs, ... }:
{
  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    git
    unrar
    wineWowPackages.staging
    # alejandra
    # unrar
    # wineWowPackages.staging
    # jq
    # zenity
    # mangohud
    # rclone
    toybox
    # playerctl
    # clang-tools
    # # scx
    # latencyflex-vulkan
    # openssl_3
    # tessen
    # gthumb
    # nexusmods-app-unfree
    # lutris

    # aseprite
    # godot_4
  ];
}
