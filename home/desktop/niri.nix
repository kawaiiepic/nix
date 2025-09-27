{
  config,
  pkgs,
  ...
}:
{

  home.file.".config/niri/config-dark.kdl".text =
    builtins.replaceStrings [ "#000000" "#ffffff" ] [ "#ffffff" "#000000" ]
      (config.programs.niri.finalConfig);

  xdg.enable = true;
  xdg.portal = {
    enable = true;
    xdgOpenUsePortal = true;

    extraPortals = with pkgs; [
      xdg-desktop-portal-gtk
      xdg-desktop-portal-wlr
    ];

    config.common.default = "wlr";

    config = {
      niri = {
        default = [ "gtk" ];
        "org.freedesktop.impl.portal.Screenshot" = [ "wlr" ];
        "org.freedesktop.impl.portal.ScreenCast" = [ "wlr" ];
      };
    };
  };

  programs.niri.settings = {
    spawn-at-startup = [
      {
        argv = [
          "ags"
          "run"
          "--gtk"
          "4"
        ];
      }
      {
        argv = [
          "gsr-ui"
          "launch-demon"
        ];
      }
      { argv = [ "wvkbd-mobintl" ]; }
    ];

    overview.backdrop-color = "#003300";
    hotkey-overlay.skip-at-startup = true;
    cursor.theme = "GoogleDot-Blue";

    input = {
      focus-follows-mouse.enable = true;
    };

    outputs = {
      "DP-2" = {
        mode.width = 2560;
        mode.height = 1440;
        mode.refresh = 143.97200;
        variable-refresh-rate = true;
        scale = 1.25;
        position.x = 0;
        position.y = 0;

      };

      "HDMI-A-2" = {
        mode.width = 1920;
        mode.height = 1080;
        mode.refresh = 74.986;
      };

      "eDP-1" = {
        transform.rotation = 270;
      };
    };

    layout = {
      border = {
        width = 4;
        active.gradient = {
          gradiant = {
            relative-to = "workspace-view";
            from = "white";
            to = "black";
          };
        };
        inactive.gradient = {
          gradiant = {
            relative-to = "workspace-view";
            from = "white";
            to = "black";
          };
        };
        urgent.gradient = {
          gradiant = {
            relative-to = "workspace-view";
            from = "white";
            to = "black";
          };
        };
      };

      shadow = {
        enable = true;
        draw-behind-window = true;
      };
    };

    window-rules = [
      {
        draw-border-with-background = false;
        geometry-corner-radius =
          let
            r = 8.0;
          in
          {
            top-left = r;
            top-right = r;
            bottom-left = r;
            bottom-right = r;
          };
        clip-to-geometry = true;
      }
      {
        matches = [
          {
            title = "^gsr ui$";
          }
        ];
        open-floating = true;
        border.enable = false;
        opacity = 0.5;
      }
    ];

    binds = with config.lib.niri.actions; {

      "XF86AudioRaiseVolume" = {
        allow-when-locked = true;
        action = spawn "wpctl" "set-volume" "@DEFAULT_AUDIO_SINK@" "0.1+";
      };
      "XF86AudioLowerVolume" = {
        allow-when-locked = true;
        action = spawn "wpctl" "set-volume" "@DEFAULT_AUDIO_SINK@" "0.1-";
      };

      "XF86AudioMute" = {
        allow-when-locked = true;
        action = spawn "wpctl" "set-mute" "@DEFAULT_AUDIO_SINK@" "toggle";
      };
      "XF86MonBrightnessUp" = {
        allow-when-locked = true;
        action = spawn "brightnessctl set 10%+";
      };
      "XF86MonBrightnessDown" = {
        allow-when-locked = true;
        action = spawn "brightnessctl set 10%-";
      };

      "Mod+Insert".action = set-dynamic-cast-window;
      "Mod+Shift+Insert".action = set-dynamic-cast-monitor;
      "Mod+Delete".action = clear-dynamic-cast-target;

      "Mod+I".action = spawn [
        "pkill"
        "-RTMIN"
        "wvkbd"
      ];

      "Mod+Q".action = close-window;
      "Mod+T".action = toggle-window-floating;

      "Mod+P".action = screenshot-window { write-to-disk = false; };
      "Mod+Shift+P".action = screenshot;

      "Mod+Return".action = spawn "kitty";
      "Mod+1".action = focus-workspace 1;
      "Mod+2".action = focus-workspace 2;
      "Mod+3".action = focus-workspace 3;
      "Mod+4".action = focus-workspace 4;
      "Mod+5".action = focus-workspace 5;
    
      # "Mod+Shift+5".action = "move-window-to-workspace 5";

      "Mod+A".action = focus-column-left;
      "Mod+D".action = focus-column-right;
      "Mod+Tab".action = focus-window-down-or-column-right;
      "Mod+Shift+Tab".action = focus-window-up-or-column-left;

      "Mod+L".action = spawn "hyprlock";

      "Mod+Escape".action = spawn [
        "ags"
        "toggle"
        "logout"
      ];
      "Mod+E".action = spawn [
        "ags"
        "toggle"
        "launcher"
      ];
      "Mod+G".action = spawn "nautilus";
      "Mod+H".action = show-hotkey-overlay;

      "Mod+WheelScrollUp".action = focus-window-up;
      "Mod+WheelScrollDown".action = focus-window-down;

      "Mod+R".action = switch-preset-column-width;
      "Mod+F".action = maximize-column;
      "Mod+Shift+F".action = fullscreen-window;
      "Mod+C".action = center-column;

      "Mod+Minus".action = set-column-width "-10%";
      "Mod+Plus".action = set-column-width "+10%";
      "Mod+Shift+Minus".action = set-window-height "-10%";
      "Mod+Shift+Plus".action = set-window-height "+10%";

      "Mod+Shift+Escape".action = toggle-keyboard-shortcuts-inhibit;
      "Mod+Shift+E".action = quit;
      "Mod+Ctrl+Shift+E".action = quit { skip-confirmation = true; };
      "Mod+Alt+P".action = power-off-monitors;
    };
  };
}
