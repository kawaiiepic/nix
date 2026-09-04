{
  pkgs,
  config,
  lib,
  inputs,
  ...
}: let
  cacheDir = config.xdg.cacheHome;
  palette = {
    latte = {
      base = "rgb(239,241,245)";
      mantle = "rgb(230,233,239)";
      crust = "rgb(220,224,232)";
      surface0 = "rgb(230,233,239)";
      surface1 = "rgb(220,224,232)";
      surface2 = "rgb(197,200,214)";
      overlay0 = "rgb(165,169,184)";
      overlay1 = "rgb(140,143,162)";
      overlay2 = "rgb(115,117,143)";
      subtext0 = "rgb(88,91,112)";
      subtext1 = "rgb(69,71,90)";
      text = "rgb(17,17,27)";

      lavender = "rgb(114,135,253)";
      blue = "rgb(72,155,240)";
      sapphire = "rgb(32,159,181)";
      sky = "rgb(4,165,229)";
      teal = "rgb(26,188,156)";
      green = "rgb(64,160,43)";
      yellow = "rgb(223,142,29)";
      peach = "rgb(254,100,11)";
      maroon = "rgb(230,69,83)";
      red = "rgb(230,69,83)";
      mauve = "rgb(136,57,239)";
      pink = "rgb(242,205,205)";
      flamingo = "rgb(245,194,231)";
      rosewater = "rgb(245,224,220)";
    };

    frappe = {
      base = "rgb(48,52,70)";
      mantle = "rgb(41,44,60)";
      crust = "rgb(35,38,52)";
      surface0 = "rgb(65,69,89)";
      surface1 = "rgb(81,87,109)";
      surface2 = "rgb(98,104,128)";
      overlay0 = "rgb(115,121,148)";
      overlay1 = "rgb(131,139,167)";
      overlay2 = "rgb(148,156,187)";
      subtext0 = "rgb(165,173,206)";
      subtext1 = "rgb(181,191,226)";
      text = "rgb(198,208,245)";

      lavender = "rgb(186,187,241)";
      blue = "rgb(140,170,238)";
      sapphire = "rgb(133,193,220)";
      sky = "rgb(153,209,219)";
      teal = "rgb(129,200,190)";
      green = "rgb(166,209,137)";
      yellow = "rgb(229,200,144)";
      peach = "rgb(239,159,118)";
      maroon = "rgb(234,153,156)";
      red = "rgb(231,130,132)";
      mauve = "rgb(202,158,230)";
      pink = "rgb(244,184,228)";
      flamingo = "rgb(238,190,190)";
      rosewater = "rgb(242,213,207)";
    };

    macchiato = {
      base = "rgb(36,39,58)";
      mantle = "rgb(30,32,48)";
      crust = "rgb(24,25,38)";
      surface0 = "rgb(54,58,79)";
      surface1 = "rgb(73,77,100)";
      surface2 = "rgb(91,96,120)";
      overlay0 = "rgb(110,115,141)";
      overlay1 = "rgb(128,135,162)";
      overlay2 = "rgb(147,154,183)";
      subtext0 = "rgb(165,173,203)";
      subtext1 = "rgb(184,192,224)";
      text = "rgb(202,211,245)";

      lavender = "rgb(183,189,248)";
      blue = "rgb(138,173,244)";
      sapphire = "rgb(125,196,228)";
      sky = "rgb(145,215,227)";
      teal = "rgb(139,213,202)";
      green = "rgb(166,218,149)";
      yellow = "rgb(238,212,159)";
      peach = "rgb(245,169,127)";
      maroon = "rgb(238,153,160)";
      red = "rgb(237,135,150)";
      mauve = "rgb(198,160,246)";
      pink = "rgb(245,189,230)";
      flamingo = "rgb(240,198,198)";
      rosewater = "rgb(244,219,214)";
    };

    mocha = {
      base = "rgb(30,30,46)";
      mantle = "rgb(24,24,37)";
      crust = "rgb(17,17,27)";
      surface0 = "rgb(49,50,68)";
      surface1 = "rgb(69,71,90)";
      surface2 = "rgb(88,91,112)";
      overlay0 = "rgb(108,112,134)";
      overlay1 = "rgb(127,132,156)";
      overlay2 = "rgb(147,153,178)";
      subtext0 = "rgb(166,173,200)";
      subtext1 = "rgb(186,194,222)";
      text = "rgb(205,214,244)";

      lavender = "rgb(180,190,254)";
      blue = "rgb(137,180,250)";
      sapphire = "rgb(116,199,236)";
      sky = "rgb(137,220,235)";
      teal = "rgb(148,210,213)";
      green = "rgb(166,227,161)";
      yellow = "rgb(249,226,175)";
      peach = "rgb(250,179,135)";
      maroon = "rgb(235,160,172)";
      red = "rgb(243,139,168)";
      mauve = "rgb(203,166,247)";
      pink = "rgb(245,194,231)";
      flamingo = "rgb(242,205,205)";
      rosewater = "rgb(245,224,220)";
    };

    default = {
      base = "rgb(0,0,1)";
      mantle = "rgb(0,0,2)";
      crust = "rgb(0,0,3)";
      surface0 = "rgb(0,0,4)";
      surface1 = "rgb(0,0,5)";
      surface2 = "rgb(0,0,6)";
      overlay0 = "rgb(0,0,7)";
      overlay1 = "rgb(0,0,8)";
      overlay2 = "rgb(0,0,9)";
      subtext0 = "rgb(0,0,10)";
      subtext1 = "rgb(0,0,11)";
      text = "rgb(0,0,12)";
      lavender = "rgb(0,0,13)";
      blue = "rgb(0,0,14)";
      sapphire = "rgb(0,0,15)";
      sky = "rgb(0,0,16)";
      teal = "rgb(0,0,17)";
      green = "rgb(0,0,18)";
      yellow = "rgb(0,0,19)";
      peach = "rgb(0,0,20)";
      maroon = "rgb(0,0,21)";
      red = "rgb(0,0,22)";
      mauve = "rgb(0,0,23)";
      pink = "rgb(0,0,24)";
      flamingo = "rgb(0,0,25)";
      rosewater = "rgb(0,0,26)";
    };
  };
  inherit (lib.generators) mkLuaInline;

  # key: plain string ("XF86AudioMute") or mkLuaInline for concatenation exprs
  # dispatchExpr: raw Lua source for the hl.dsp.* call
  mkBind = key: dispatchExpr: {_args = [key (mkLuaInline dispatchExpr)];};
  mkBindOpts = key: dispatchExpr: opts: {
    _args = [key (mkLuaInline dispatchExpr) opts];
  };

  # SUPER + [SHIFT +] 0-9 workspace switch/move (10 maps to key "0")
  workspaceBinds = lib.concatMap (
    i: let
      key =
        if i == 10
        then "0"
        else toString i;
    in [
      (mkBind (mkLuaInline ''mainMod .. " + ${key}"'') "hl.dsp.focus({ workspace = ${toString i} })")
      (mkBind (mkLuaInline ''
        mainMod .. " + SHIFT + ${key}"
      '') "hl.dsp.window.move({ workspace = ${toString i} })")
    ]
  ) (lib.range 1 10);
in {
  imports = [
    ./scripts/screenshot.nix
  ];
  home = {
    packages = with pkgs; [
      # Quickshell
      gthumb

      hyprshutdown
      stasis
      inputs.icy-shell.packages.${pkgs.system}.default
      inputs.snappy-switcher.packages.${pkgs.system}.default
      # (pkgs.writeShellScriptBin "hypr-screenshot" ''
      #   grimblast save output - > ${cacheDir}/sc.png && cat ${cacheDir}/sc.png | wl-copy && notify-send -u low -a 'screenshot' "📸 Screenshot copied" 'Copied to clipboard.' -i camera -h "string:preview:true" -h "string:image-path:${cacheDir}/sc.png" && canberra-gtk-play -i screen-capture
      # '')
      # (pkgs.writeShellScriptBin "hypr-screenshot-area" ''
      #   grimblast --freeze save area - > ${cacheDir}/sc.png && cat ${cacheDir}/sc.png | wl-copy && notify-send -u low -a 'screenshot' "📸 Screenshot Area copied" 'Copied to clipboard.' -i camera -h "string:preview:true" -h 'string:image-path:${cacheDir}/sc.png' && canberra-gtk-play -i screen-capture
      # '')
    ];

    sessionVariables = {
      HYPRCURSOR_THEME = "GoogleDot-Violet";
      HYPRCURSOR_SIZE = 24;
      XCURSOR_THEME = "GoogleDot-Blue";
      XCURSOR_SIZE = 24;
      NIXOS_OZONE_WL = "1";
      MOZ_ENABLE_WAYLAND = "1";
    };
  };

  xdg.configFile."hypr/xdph.conf".text = ''
    screencopy {
        allow_token_by_default = true
    }
  '';

  xdg.portal = {
    enable = true;
    xdgOpenUsePortal = true;

    extraPortals = with pkgs; [
      xdg-desktop-portal-hyprland
    ];

    config.common.default = "hyprland";

    config = {
      hyprland = {
        default = ["hyprland"];
        "org.freedesktop.impl.portal.Screenshot" = ["hyprland"];
        "org.freedesktop.impl.portal.ScreenCast" = ["hyprland"];
      };
    };
  };

  # xdg.configFile."hypr/hyprland.lua".source = ./hyprland.lua;

  services.hyprsunset = {
    enable = true;
    settings = {
      sunrise = {
        calendar = "*-*-* 05:00:00";
        requests = [
          ["temperature" "6500"]
          ["gamma 100"]
        ];
      };
      sunset = {
        calendar = "*-*-* 19:00:00";
        requests = [
          ["temperature" "3500"]
          ["gamma 50"]
        ];
      };
    };
  };

  wayland.windowManager.hyprland = {
    enable = true;
    systemd.variables = ["--all"];

    settings = {
      monitor = [
        {
          output = "DP-2";
          mode = "highres";
          position = "auto";
          scale = "1.25";
          vrr = 1;
          bitdepth = 10;
        }
        {
          output = "";
          mode = "highres";
          position = "auto";
          scale = "1.25";
        }
      ];

      # MY PROGRAMS
      terminal = {_var = "kitty";};
      fileManager = {_var = "nautilus";};
      menu = {_var = "hyprlauncher";};

      # AUTOSTART
      on = {
        _args = with pkgs; [
          "hyprland.start"
          (mkLuaInline ''
            function()
              hl.exec_cmd("icy-shell")
              hl.exec_cmd("${hyprpolkitagent}/bin/hyprpolkitagent")
              hl.exec_cmd("${pkgs.joystickwake}/bin/joystickwake")
              hl.exec_cmd("${pkgs.hyprsunset}/bin/hyprsunset")
              hl.exec_cmd("stasis")
            end
          '')
        ];
      };

      # ENVIRONMENT VARIABLES
      env = [
        {_args = ["XCURSOR_SIZE" "24"];}
        {_args = ["HYPRCURSOR_SIZE" "24"];}
      ];

      # PERMISSIONS / LOOK AND FEEL / LAYOUTS / MISC / INPUT
      # (one list element per original hl.config({...}) call)
      config = [
        {
          ecosystem = {
            enforce_permissions = true;
          };
        }
        {
          general = {
            gaps_in = 4;
            gaps_out = 15;
            border_size = 2;
            float_gaps = 10;
            col = {
              active_border = {
                colors = [palette.mocha.crust palette.mocha.crust];
                angle = 45;
              };
              inactive_border = palette.mocha.crust;
            };
            resize_on_border = true;
            allow_tearing = true;
            layout = "scrolling";

            snap = {
              enabled = true;
              border_overlap = true;
              respect_gaps = true;
            };
          };
          decoration = {
            rounding = 12;
            rounding_power = 2;
            active_opacity = 1.0;
            inactive_opacity = 1.0;
            shadow = {
              enabled = true;
              range = 4;
              render_power = 3;
              color = "0xee1a1a1a";
            };
            blur = {
              enabled = true;
              size = 3;
              passes = 1;
              vibrancy = 0.1696;
            };
          };
          animations = {
            enabled = true;
          };
        }
        {dwindle = {preserve_split = true;};}
        {master = {new_status = "master";};}
        {scrolling = {fullscreen_on_one_column = true;};}
        {xwayland = {force_zero_scaling = true;};}
        {
          misc = {
            force_default_wallpaper = -1;
            disable_hyprland_logo = false;
            mouse_move_enables_dpms = true;
            key_press_enables_dpms = true;
            focus_on_activate = true;
            vrr = 3;
          };

          render = {
            direct_scanout = 2;
          };
        }
        {
          input = {
            kb_layout = "us";
            kb_variant = "";
            kb_model = "";
            kb_options = "";
            kb_rules = "";
            follow_mouse = 1;
            sensitivity = 0;
            touchpad = {
              natural_scroll = false;
            };
          };
        }
      ];

      # CURVES (beziers + spring)
      curve = [
        {
          _args = [
            "easeOutQuint"
            {
              type = "bezier";
              points = [[0.23 1] [0.32 1]];
            }
          ];
        }
        {
          _args = [
            "easeInOutCubic"
            {
              type = "bezier";
              points = [[0.65 0.05] [0.36 1]];
            }
          ];
        }
        {
          _args = [
            "linear"
            {
              type = "bezier";
              points = [[0 0] [1 1]];
            }
          ];
        }
        {
          _args = [
            "almostLinear"
            {
              type = "bezier";
              points = [[0.5 0.5] [0.75 1]];
            }
          ];
        }
        {
          _args = [
            "quick"
            {
              type = "bezier";
              points = [[0.15 0] [0.1 1]];
            }
          ];
        }
        {
          _args = [
            "easy"
            {
              type = "spring";
              mass = 1;
              stiffness = 238.1191;
              dampening = 24.21279333;
            }
          ];
        }
      ];

      # ANIMATIONS
      animation = [
        {
          leaf = "global";
          enabled = true;
          speed = 10;
          bezier = "default";
        }
        {
          leaf = "border";
          enabled = true;
          speed = 5.39;
          bezier = "easeOutQuint";
        }
        {
          leaf = "windows";
          enabled = true;
          speed = 4.79;
          spring = "easy";
        }
        {
          leaf = "windowsIn";
          enabled = true;
          speed = 4.1;
          spring = "easy";
          style = "popin 87%";
        }
        {
          leaf = "windowsOut";
          enabled = true;
          speed = 1.49;
          bezier = "linear";
          style = "popin 87%";
        }
        {
          leaf = "fadeIn";
          enabled = true;
          speed = 1.73;
          bezier = "almostLinear";
        }
        {
          leaf = "fadeOut";
          enabled = true;
          speed = 1.46;
          bezier = "almostLinear";
        }
        {
          leaf = "fade";
          enabled = true;
          speed = 3.03;
          bezier = "quick";
        }
        {
          leaf = "layers";
          enabled = true;
          speed = 3.81;
          bezier = "easeOutQuint";
        }
        {
          leaf = "layersIn";
          enabled = true;
          speed = 4;
          bezier = "easeOutQuint";
          style = "fade";
        }
        {
          leaf = "layersOut";
          enabled = true;
          speed = 1.5;
          bezier = "linear";
          style = "fade";
        }
        {
          leaf = "fadeLayersIn";
          enabled = true;
          speed = 1.79;
          bezier = "almostLinear";
        }
        {
          leaf = "fadeLayersOut";
          enabled = true;
          speed = 1.39;
          bezier = "almostLinear";
        }
        {
          leaf = "workspaces";
          enabled = true;
          speed = 1.94;
          bezier = "almostLinear";
          style = "fade";
        }
        {
          leaf = "workspacesIn";
          enabled = true;
          speed = 1.21;
          bezier = "almostLinear";
          style = "fade";
        }
        {
          leaf = "workspacesOut";
          enabled = true;
          speed = 1.94;
          bezier = "almostLinear";
          style = "fade";
        }
        {
          leaf = "zoomFactor";
          enabled = true;
          speed = 7;
          bezier = "quick";
        }
      ];

      # WORKSPACE RULES
      workspace_rule = [
        {
          workspace = "1";
          monitor = "DP-2";
          default = true;
        }
        {
          workspace = "2";
          monitor = "DP-2";
          default = true;
        }
        {
          workspace = "3";
          monitor = "DP-2";
          default = true;
        }
        {
          workspace = "4";
          monitor = "DP-2";
          default = true;
        }
        {
          workspace = "5";
          monitor = "DP-2";
          default = true;
        }
        {
          workspace = "6";
          monitor = "HDMI-A-1";
          gaps_in = 0;
          gaps_out = 0;
          no_rounding = true;
          no_border = true;
          default = true;
        }
      ];

      # GESTURES
      gesture = {
        fingers = 3;
        direction = "horizontal";
        action = "workspace";
      };

      # KEYBINDINGS
      mainMod = {_var = "SUPER";};

      bind =
        [
          (mkBind (mkLuaInline ''mainMod .. " + Return"'') "hl.dsp.exec_cmd(terminal)")
          (mkBind (mkLuaInline ''mainMod .. " + Q"'') "hl.dsp.window.close()")
          (
            mkBind
            (mkLuaInline ''mainMod .. " + SHIFT + Q"'')
            ''hl.dsp.exec_cmd("command -v hyprshutdown >/dev/null 2>&1 && hyprshutdown || hyprctl dispatch 'hl.dsp.exit()'")''
          )
          (mkBind (mkLuaInline ''mainMod .. " + L"'') ''hl.dsp.exec_cmd("icy-shell ipc call lockscreen showLockscreen")'')
          (mkBind (mkLuaInline ''mainMod .. " + E"'') "hl.dsp.exec_cmd(fileManager)")
          (mkBind (mkLuaInline ''mainMod .. " + T"'') ''hl.dsp.window.float({ action = "toggle" })'')
          (mkBind (mkLuaInline ''mainMod .. " + R"'') "hl.dsp.exec_cmd(menu)")
          (mkBind (mkLuaInline ''mainMod .. " + O"'') "hl.dsp.window.pseudo()")
          (mkBind (mkLuaInline ''mainMod .. " + J"'') ''hl.dsp.layout("togglesplit")'')
          (mkBind (mkLuaInline ''mainMod .. " + F"'') "hl.dsp.window.fullscreen()")
          (mkBind (mkLuaInline ''mainMod .. " + P"'') ''hl.dsp.exec_cmd("screenshot")'')
          (mkBind (mkLuaInline ''mainMod .. " + Y"'') ''hl.dsp.exec_cmd("tessen -p gopass -d wofi")'')
          (mkBind (mkLuaInline ''mainMod .. " + SHIFT + L"'') ''hl.dsp.exec_cmd("screenshot-area")'')

          (mkBind (mkLuaInline ''mainMod .. " + A"'') ''hl.dsp.focus({ direction = "left" })'')
          (mkBind (mkLuaInline ''mainMod .. " + D"'') ''hl.dsp.focus({ direction = "right" })'')
          (mkBind (mkLuaInline ''mainMod .. " + W"'') ''hl.dsp.focus({ direction = "up" })'')
          (mkBind (mkLuaInline ''mainMod .. " + S"'') ''hl.dsp.focus({ direction = "down" })'')
        ]
        ++ workspaceBinds
        ++ [
          (mkBind (mkLuaInline ''mainMod .. " + V"'') ''hl.dsp.workspace.toggle_special("magic")'')
          (
            mkBind
            (mkLuaInline ''mainMod .. " + SHIFT + S"'')
            ''hl.dsp.window.move({ workspace = "special:magic" })''
          )

          (mkBind (mkLuaInline ''mainMod .. " + mouse_down"'') ''hl.dsp.focus({ workspace = "e+1" })'')
          (mkBind (mkLuaInline ''mainMod .. " + mouse_up"'') ''hl.dsp.focus({ workspace = "e-1" })'')

          (mkBindOpts (mkLuaInline ''mainMod .. " + mouse:272"'') "hl.dsp.window.drag()" {mouse = true;})
          (mkBindOpts (mkLuaInline ''mainMod .. " + mouse:273"'') "hl.dsp.window.resize()" {mouse = true;})

          (mkBindOpts "XF86AudioRaiseVolume" ''hl.dsp.exec_cmd("wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+")'' {
            locked = true;
            repeating = true;
          })
          (mkBindOpts "XF86AudioLowerVolume" ''hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-")'' {
            locked = true;
            repeating = true;
          })
          (mkBindOpts "XF86AudioMute" ''hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle")'' {
            locked = true;
            repeating = true;
          })
          (mkBindOpts "XF86AudioMicMute" ''hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle")'' {
            locked = true;
            repeating = true;
          })
          (mkBindOpts "XF86MonBrightnessUp" ''hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%+")'' {
            locked = true;
            repeating = true;
          })
          (mkBindOpts "XF86MonBrightnessDown" ''hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%-")'' {
            locked = true;
            repeating = true;
          })

          (mkBindOpts "XF86AudioNext" ''hl.dsp.exec_cmd("playerctl next")'' {locked = true;})
          (mkBindOpts "XF86AudioPause" ''hl.dsp.exec_cmd("playerctl play-pause")'' {locked = true;})
          (mkBindOpts "XF86AudioPlay" ''hl.dsp.exec_cmd("playerctl play-pause")'' {locked = true;})
          (mkBindOpts "XF86AudioPrev" ''hl.dsp.exec_cmd("playerctl previous")'' {locked = true;})
        ];

      # WINDOWS AND WORKSPACES
      window_rule = [
        {
          name = "floating-windows";
          match = {class = "^(file_progress)$|^(confirm)$|^(dialog)$|^(download)$|^(notification)$|^(error)$|^(confirmreset)$|^(org.gnome.Nautilus)$|^(gthumb)$|^(org.gnome.TextEditor)$";};
          float = true;
        }
        {
          name = "suppress-maximize-events";
          match = {class = ".*";};
          suppress_event = "maximize";
        }
        {
          name = "fix-xwayland-drags";
          match = {
            class = "^$";
            title = "^$";
            xwayland = true;
            float = true;
            fullscreen = false;
            pin = false;
          };
          no_focus = true;
        }
        {
          name = "move-hyprland-run";
          match = {class = "hyprland-run";};
          move = "20 monitor_h-120";
          float = true;
        }
        {
          match = {class = "steam_app_.*";};
          immediate = true;
        }
      ];
    };
  };
}
