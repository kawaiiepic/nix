{
  config,
  pkgs,
  lib,
  inputs,
  ...
}:
let
  palette = {
    latte = {
      # Light theme: Catppuccin Latte
      base = "#eff1f5";
      mantle = "#e6e9ef";
      crust = "#dce0e8";
      surface0 = "#e6e9ef";
      surface1 = "#dce0e8";
      surface2 = "#c5c8d6";
      overlay0 = "#a5a9b8";
      overlay1 = "#8c8fa2";
      overlay2 = "#73758f";
      subtext0 = "#585b70";
      subtext1 = "#45475a";
      text = "#11111b";

      lavender = "#7287fd";
      blue = "#489bf0";
      sapphire = "#209fb5";
      sky = "#04a5e5";
      teal = "#1abc9c";
      green = "#40a02b";
      yellow = "#df8e1d";
      peach = "#fe640b";
      maroon = "#e64553";
      red = "#e64553";
      mauve = "#8839ef";
      pink = "#f2cdcd";
      flamingo = "#f5c2e7";
      rosewater = "#f5e0dc";
    };

    mocha = {
      # Dark theme: Catppuccin Mocha
      base = "#1e1e2e";
      mantle = "#181825";
      crust = "#11111b";
      surface0 = "#313244";
      surface1 = "#45475a";
      surface2 = "#585b70";
      overlay0 = "#6c7086";
      overlay1 = "#7f849c";
      overlay2 = "#9399b2";
      subtext0 = "#a6adc8";
      subtext1 = "#bac2de";
      text = "#cdd6f4";

      lavender = "#b4befe";
      blue = "#89b4fa";
      sapphire = "#74c7ec";
      sky = "#89dceb";
      teal = "#94d2d5";
      green = "#a6e3a1";
      yellow = "#f9e2af";
      peach = "#fab387";
      maroon = "#eba0ac";
      red = "#f38ba8";
      mauve = "#cba6f7";
      pink = "#f5c2e7";
      flamingo = "#f2cdcd";
      rosewater = "#f5e0dc";
    };

    default = {
      # Skeleton / temporary placeholder colors
      base = "#000001";
      mantle = "#000002";
      crust = "#000003";
      surface0 = "#000004";
      surface1 = "#000005";
      surface2 = "#000006";
      overlay0 = "#000007";
      overlay1 = "#000008";
      overlay2 = "#000009";
      subtext0 = "#00000A";
      subtext1 = "#00000B";
      text = "#00000C";
      lavender = "#00000D";
      blue = "#00000E";
      sapphire = "#00000F";
      sky = "#000010";
      teal = "#000011";
      green = "#000012";
      yellow = "#000013";
      peach = "#000014";
      maroon = "#000015";
      red = "#000016";
      mauve = "#000017";
      pink = "#000018";
      flamingo = "#000019";
      rosewater = "#00001A";
    };
  };
in
{
  home.packages = with pkgs; [

    (pkgs.writeShellScriptBin "change-firefox-theme" ''

    '')
  ];

  # #000001 Base
  # #000002 Mantle

  # home.file.".config/niri/config-light.kdl".text =
  #   builtins.replaceStrings [ palette.base "#ffffff" ] [ "GAY" "#000000" ]
  #     (config.programs.niri.finalConfig);

  # home.file.".config/niri/config-dark.kdl".text =
  #   builtins.replaceStrings [ "#000000" "#ffffff" ] [ "#ffffff" "#000000" ]
  #     (config.programs.niri.finalConfig);
  #
  home.file.".config/niri/config-latte.kdl".text =
    builtins.replaceStrings (builtins.attrValues palette.default) # from default skeleton
      (builtins.attrValues palette.latte) # to Latte
      config.programs.niri.finalConfig;

  home.file.".local/bin/change-niri-theme".text = ''
    #!/usr/bin/env bash
    set -e

    theme=$1
    if [ -z "$theme" ]; then
      echo "Usage: change-niri-theme <latte|mocha|default>"
      exit 1
    fi

    CONFIG_DIR="$HOME/.config/niri"
    TARGET="$CONFIG_DIR/a-config.kdl"

    case "$theme" in
      latte|mocha|default)
        ln -sf "$CONFIG_DIR/config-$theme.kdl" "$TARGET"
        ;;
      *)
        echo "Unknown theme: $theme"
        exit 1
        ;;
    esac

    echo "Switched Niri theme to $theme"
  '';
  home.file.".local/bin/change-niri-theme".executable = true;

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
      {
        argv = [
          "wvkbd-mobintl"
          "--hidden"
        ];
      }
    ];

    overview.backdrop-color = palette.default.base;
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
      focus-ring.enable = false;
      border = {
        enable = true;
        width = 4;
        active.gradient = {
          relative-to = "workspace-view";
          from = palette.default.crust;
          to = palette.default.mantle;
        };
        inactive.gradient = {
          relative-to = "workspace-view";
          from = palette.default.crust;
          to = palette.default.crust;
        };
        urgent.gradient = {
          relative-to = "workspace-view";
          from = palette.default.red;
          to = palette.default.pink;
        };
      };

      shadow = {
        enable = true;
        draw-behind-window = true;
      };
    };

    workspaces."1" = {
      open-on-output = "DP-2";
    };
    workspaces."2" = {
      open-on-output = "DP-2";
    };
    workspaces."3" = {
      open-on-output = "DP-2";
    };
    workspaces."4" = {
      open-on-output = "DP-2";
    };
    workspaces."5" = {
      open-on-output = "DP-2";
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
            title = "gsr ui";
          }
        ];
        open-floating = true;
        border.enable = false;
        opacity = 0.5;
      }
    ];

    binds =
      with config.lib.niri.actions;
      let
        binds =
          {
            suffixes,
            prefixes,
            substitutions ? { },
          }:
          let
            replacer = lib.replaceStrings (lib.attrNames substitutions) (lib.attrValues substitutions);
            format =
              prefix: suffix:
              let
                actual-suffix =
                  if lib.isList suffix.action then
                    {
                      action = lib.head suffix.action;
                      args = lib.tail suffix.action;
                    }
                  else
                    {
                      inherit (suffix) action;
                      args = [ ];
                    };

                action = replacer "${prefix.action}-${actual-suffix.action}";
              in
              {
                name = "${prefix.key}+${suffix.key}";
                value.action.${action} = actual-suffix.args;
              };
            pairs =
              attrs: fn:
              lib.concatMap (
                key:
                fn {
                  inherit key;
                  action = attrs.${key};
                }
              ) (lib.attrNames attrs);
          in
          lib.listToAttrs (pairs prefixes (prefix: pairs suffixes (suffix: [ (format prefix suffix) ])));
      in
      lib.attrsets.mergeAttrsList [
        {

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
            action = spawn "brightnessctl" "set" "10%+";
          };
          "XF86MonBrightnessDown" = {
            allow-when-locked = true;
            action = spawn "brightnessctl" "set" "10%-";
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

          "Alt+Z".action = spawn [
            "gsr-ui"
            "launch-daemon"
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
        }
        (binds {
          suffixes."Left" = "column-left";
          suffixes."Down" = "window-down";
          suffixes."Up" = "window-up";
          suffixes."Right" = "column-right";
          prefixes."Mod" = "focus";
          prefixes."Mod+Ctrl" = "move";
          prefixes."Mod+Shift" = "focus-monitor";
          prefixes."Mod+Shift+Ctrl" = "move-window-to-monitor";
          substitutions."monitor-column" = "monitor";
          substitutions."monitor-window" = "monitor";
        })

        (binds {
          suffixes = builtins.listToAttrs (
            map (n: {
              name = toString n;
              value = [
                "workspace"
                ("${toString n}")
              ]; # workspace 1 is empty; workspace 2 is the logical first.
            }) (lib.range 1 5)
          );
          prefixes."Mod" = "focus";
          prefixes."Mod+Ctrl" = "move-window-to";
        })
      ];
  };
}
