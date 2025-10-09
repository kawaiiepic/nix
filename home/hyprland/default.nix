{
  pkgs,
  inputs,
  osConfig,
  ...
}:
{
  imports = [
    ./services/ags
    # ./services/wallpapers
    ./services/pfp
    ./services/hypridle.nix
    ./services/hyprlock.nix
    # ./services/wlogout.nix
    ./services/gnome-keyring.nix

    ./hyprland-config.nix

    ./scripts
  ];

  home = {
    packages = with pkgs; [
      libnotify
      pinentry-gnome3

      nautilus
      file-roller

      kitty
      grimblast # Screenshot utility
      libcanberra-gtk3 # Sound utility
      wtype # Auto-typing
      wlr-randr # Randr Wayland
      seahorse # Password manager
      gthumb
      linux-wallpaperengine

      wl-clipboard
      (pkgs.writeShellScriptBin "launcher" ''
        ${inputs.ags.packages.${system}.default}/bin/ags toggle launcher
      '')
      (pkgs.writeShellScriptBin "hyprexit" ''
        ${hyprland}/bin/hyprctl dispatch exit
        ${systemd}/bin/loginctl terminate-user ${
          if osConfig.networking.hostName == "blossom" then "wyntor" else "mia"
        }
      '')
      (pkgs.writeShellScriptBin "start" ''
        hyprctl dispatch exec "[workspace 1] uwsm app -- zen"
        hyprctl dispatch exec "[workspace 3] uwsm app -- discordcanary"
        hyprctl dispatch exec "[workspace 5] uwsm app -- steam"
      '')
      (pkgs.writeShellScriptBin "screenshot" ''
        grimblast save output - > ~/.cache/sc.png && cat ~/.cache/sc.png | wl-copy && notify-send -u low -a 'screenshot' 'Screenshot' 'Copied to clipboard.' -h 'string:image-path:/home/${
          if osConfig.networking.hostName == "blossom" then "wyntor" else "mia"
        }/.cache/sc.png' -i ~/.cache/sc.png && canberra-gtk-play -i screen-capture
      '')
      (pkgs.writeShellScriptBin "screenshot-area" ''
        grimblast --freeze save area - > ~/.cache/sc.png && cat ~/.cache/sc.png | wl-copy && notify-send -u low -a 'screenshot' 'Screenshot Area' 'Copied to clipboard.' -h 'string:image-path:/home/${
          if osConfig.networking.hostName == "blossom" then "wyntor" else "mia"
        }/.cache/sc.png' -i ~/.cache/sc.png && canberra-gtk-play -i screen-capture
      '')
    ];

    sessionVariables = {
      HYPRCURSOR_THEME = "GoogleDot-Violet";
      HYPRCURSOR_SIZE = 24;
      NIXOS_OZONE_WL = "1";
      MOZ_ENABLE_WAYLAND = "1";
    };
  };

  xdg.enable = true;
  xdg.portal = {
    enable = true;
    xdgOpenUsePortal = true;

    extraPortals = with pkgs; [
      xdg-desktop-portal-gtk
      xdg-desktop-portal-wlr
    ];

    config = {
      niri = {
        default = [ "gtk" ];
        "org.freedesktop.impl.portal.Screenshot" = [ "wlr" ];
        "org.freedesktop.impl.portal.ScreenCast" = [ "wlr" ];
      };
    };
    # configPackages = with pkgs; [
    #   xdg-desktop-portal-gtk
    # ];
  };

  xdg.userDirs = {
    enable = true;
  };

  # enable hyprland
  wayland.windowManager.hyprland = {
    enable = true;
    systemd.enable = false;
  };


}
