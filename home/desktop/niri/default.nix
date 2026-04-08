{
  config,
  pkgs,
  lib,
  inputs,
  ...
}: let
  custom_quickshell =
    inputs.quickshell.packages.${pkgs.stdenv.hostPlatform.system}.default.withModules
    [
      pkgs.kdePackages.qt5compat
      pkgs.kdePackages.qtimageformats
      pkgs.kdePackages.qtmultimedia
      inputs.qml-niri.packages.${pkgs.stdenv.hostPlatform.system}.default
    ];

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

    frappe = {
      # Medium-dark theme: Catppuccin Frappé
      base = "#303446";
      mantle = "#292c3c";
      crust = "#232634";
      surface0 = "#414559";
      surface1 = "#51576d";
      surface2 = "#626880";
      overlay0 = "#737994";
      overlay1 = "#838ba7";
      overlay2 = "#949cbb";
      subtext0 = "#a5adce";
      subtext1 = "#b5bfe2";
      text = "#c6d0f5";

      lavender = "#babbf1";
      blue = "#8caaee";
      sapphire = "#85c1dc";
      sky = "#99d1db";
      teal = "#81c8be";
      green = "#a6d189";
      yellow = "#e5c890";
      peach = "#ef9f76";
      maroon = "#ea999c";
      red = "#e78284";
      mauve = "#ca9ee6";
      pink = "#f4b8e4";
      flamingo = "#eebebe";
      rosewater = "#f2d5cf";
    };

    macchiato = {
      # Dark-mid theme: Catppuccin Macchiato
      base = "#24273a";
      mantle = "#1e2030";
      crust = "#181926";
      surface0 = "#363a4f";
      surface1 = "#494d64";
      surface2 = "#5b6078";
      overlay0 = "#6e738d";
      overlay1 = "#8087a2";
      overlay2 = "#939ab7";
      subtext0 = "#a5adcb";
      subtext1 = "#b8c0e0";
      text = "#cad3f5";

      lavender = "#b7bdf8";
      blue = "#8aadf4";
      sapphire = "#7dc4e4";
      sky = "#91d7e3";
      teal = "#8bd5ca";
      green = "#a6da95";
      yellow = "#eed49f";
      peach = "#f5a97f";
      maroon = "#ee99a0";
      red = "#ed8796";
      mauve = "#c6a0f6";
      pink = "#f5bde6";
      flamingo = "#f0c6c6";
      rosewater = "#f4dbd6";
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
in {
  imports = [./scripts/screenshot.nix];

  home.packages = with pkgs; [
    #inputs.noctalia.packages.${pkgs.stdenv.hostPlatform.system}.default
    gthumb
    libcanberra-gtk3
    custom_quickshell
    cava
    brightnessctl
    #inputs.quickshell.packages.${pkgs.stdenv.hostPlatform.system}.default
  ];

  home.file.".config/niri/config-latte.kdl".text =
    builtins.replaceStrings (builtins.attrValues palette.default) (builtins.attrValues palette.latte)
    config.programs.niri.finalConfig;

  home.file.".config/niri/config-frappe.kdl".text =
    builtins.replaceStrings (builtins.attrValues palette.default) (builtins.attrValues palette.frappe)
    config.programs.niri.finalConfig;

  xdg.enable = true;

  xdg.mimeApps.enable = true;
  xdg.mimeApps.defaultApplications = {
    "inode/directory" = "org.gnome.Nautilus.desktop";
  };

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
        default = ["gtk"];
        "org.freedesktop.impl.portal.Screenshot" = ["wlr"];
        "org.freedesktop.impl.portal.ScreenCast" = ["wlr"];
      };
    };
  };

  programs.niri.settings = {
    spawn-at-startup = [
      #{
      #  argv = [
      #    "ags"
      #    "run"
      #    "--gtk"
      #    "4"
      #  ];
      #}
      {
        argv = [
          "quickshell"
        ];
      }
      {
        argv = [
          "stasis"
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

    xwayland-satellite = {
      enable = true;
      path = lib.getExe pkgs.xwayland-satellite-unstable;
    };

    # overview.backdrop-color = palette.default.base;
    prefer-no-csd = false;
    hotkey-overlay.skip-at-startup = true;
    cursor.theme = "GoogleDot-Blue";
    screenshot-path = null;

    input = {
      focus-follows-mouse.enable = false;
      
      touchpad = {
        dwt = true;
        click-method = "clickfinger";
        tap-button-map = "left-right-middle";
        accel-profile = "adaptive";
        drag-lock = true;
      };
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
        scale = 1.25;
      };

      #"eDP-1" = {
      #  transform.rotation = 270;
      #};
    };

    layout = {
      focus-ring = {
        enable = false;
        width = 2;
        active = {
          color = palette.default.pink;
        };
      };

      border = {
        enable = true;
        width = 1;
        active.gradient = {
          relative-to = "workspace-view";
          from = palette.default.crust;
          to = palette.default.pink;
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
        draw-behind-window = false;
        color = palette.default.crust;
        spread = 8;
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

    layer-rules = [
      {
        matches = [
          {
            namespace = "^wallpaper-overview$";
          }
        ];

        place-within-backdrop = true;
      }
    ];

    window-rules = [
      {
        geometry-corner-radius = let
          r = 8.0;
        in {
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
            app-id = "gsr-ui$";
          }
        ];
        open-floating = true;

        border.enable = false;
        # opacity = 0.5;
      }

      {
        matches = [
          {
            title = "AIRI";
          }
        ];

        border.enable = false;
      }

      {
        matches = [
          {
            title = "";
          }
        ];

        variable-refresh-rate = true;
        draw-border-with-background = false;
        opacity = 0.98;
      }

      {
        matches = [
          {
            is-floating = true;
          }
        ];

        baba-is-float = false;
      }
    ];

    binds = with config.lib.niri.actions; let
      binds = {
        suffixes,
        prefixes,
        substitutions ? {},
      }: let
        replacer = lib.replaceStrings (lib.attrNames substitutions) (lib.attrValues substitutions);
        format = prefix: suffix: let
          actual-suffix =
            if lib.isList suffix.action
            then {
              action = lib.head suffix.action;
              args = lib.tail suffix.action;
            }
            else {
              inherit (suffix) action;
              args = [];
            };

          action = replacer "${prefix.action}-${actual-suffix.action}";
        in {
          name = "${prefix.key}+${suffix.key}";
          value.action.${action} = actual-suffix.args;
        };
        pairs = attrs: fn:
          lib.concatMap (
            key:
              fn {
                inherit key;
                action = attrs.${key};
              }
          ) (lib.attrNames attrs);
      in
        lib.listToAttrs (pairs prefixes (prefix: pairs suffixes (suffix: [(format prefix suffix)])));
    in
      lib.attrsets.mergeAttrsList [
        {
          "XF86AudioPlay" = {
            allow-when-locked = true;
            action = spawn "playerctl" "play-pause";
          };

          "XF86AudioNext" = {
            allow-when-locked = true;
            action = spawn "playerctl" "next";
          };

          "XF86AudioPrev" = {
            allow-when-locked = true;
            action = spawn "playerctl" "previous";
          };

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

          "Mod+W".action = spawn [
            "tessen"
            "-p"
            "gopass"
          ];

          "Mod+P".action = spawn "screenshot";
          "Mod+Shift+P".action = spawn "screenshot";

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
          "Mod+Ctrl+Shift+E".action = quit {skip-confirmation = true;};
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
                "${toString n}"
              ]; # workspace 1 is empty; workspace 2 is the logical first.
            }) (lib.range 1 5)
          );
          prefixes."Mod" = "focus";
          prefixes."Mod+Ctrl" = "move-window-to";
        })
      ];
  };
}
