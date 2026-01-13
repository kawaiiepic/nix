{ pkgs, ... }:
{

  services.flatpak.enable = true;

  programs.dms-shell = {
    enable = true;

    systemd = {
      enable = true; # Systemd service for auto-start
      restartIfChanged = true; # Auto-restart dms.service when dms-shell changes
    };

    # Core features
    enableSystemMonitoring = true; # System monitoring widgets (dgop)
    enableClipboard = true; # Clipboard history manager
    enableVPN = true; # VPN management widget
    enableDynamicTheming = true; # Wallpaper-based theming (matugen)
    enableAudioWavelength = true; # Audio visualizer (cava)
    enableCalendarEvents = true; # Calendar integration (khal)
  };

  environment.systemPackages = with pkgs; [
    wget
    unrar
    file
    devenv
    zip
    unzip
    # (pkgs.efibootmgr.overrideAttrs {
    #   version = "git";
    #   src = fetchFromGitHub {
    #     owner = "rhboot";
    #     repo = "efibootmgr";
    #     rev = "0a85e9baaac8a34e4a0bb9c23dfcc9c4f759e061";
    #     hash = "sha256-XHfErh99UV68oC7gIfg5UIAB2L/X4Dj4EzqKu4QNpBw=";
    #   };

    #   patches = [

    #   ];

    #   makeFlags = [
    #     "CFLAGS=-Wno-pointer-sign"
    #     "EFIDIR=nixos"
    #     "PKG_CONFIG=${stdenv.cc.targetPrefix}pkg-config"
    #   ];
    # })
  ];
}
