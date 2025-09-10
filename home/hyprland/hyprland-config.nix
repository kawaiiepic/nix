{
  pkgs,
  osConfig,
  inputs,
  lib,
  ...
}:
{
  wayland.windowManager.hyprland = {
    settings = lib.mkMerge [
      {
        "$MOD" = "SUPER";

        exec-once = [
          "systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP NIXOS_OZONE_WL"
          "uwsm app -- my-shell"
          #"uwsm app -- hyprlock --immediate"
          "uwsm app -- wvkbd-mobintl --hidden --alpha 50 -L 200"
          "uwsm app -- ${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1"
          "uwsm app -- ${pkgs.networkmanagerapplet}/bin/nm-applet"
          "uwsm app -- ${pkgs.joystickwake}/bin/joystickwake"
          "uwsm app -- ${pkgs.hyprsunset}/bin/hyprsunset"
          "uwsm app -- ${pkgs.hyprpolkitagent}/bin/hyprpolkitagent"
          "uwsm app -- ags run"
          "uwsm app -- systemctl start --user hypridle"
          "uwsm app -- vicinae server"
          "sleep 5 && start"
        ];

        master = {
          mfact = "0.60";
          orientation = "right";
        };

        general = {
          gaps_in = 4;
          gaps_out = 8;
          border_size = 2;
          "col.active_border" = "rgb(181926)";
          "col.inactive_border" = "rgb(181926)";
          layout = "master";
          resize_on_border = true;
          allow_tearing = true;
          monitor = [
            "DP-2,2560x1440@143.97Hz,0x0,1,vrr,1"
            "HDMI-A-2,1920x1080@74.97Hz,2048x0,auto,vrr,0"
            "HDMI-A-1,highres,3968x0,2,vrr,0,transform,2"
            "eDP-1,highrr,0x0,1,transform,3"
          ];

          workspace = [
            "1,monitor:DP-2,persistent:true,default:true"
            "2,monitor:DP-2,persistent:true"
            "3,monitor:DP-2,persistent:true"
            "4,monitor:DP-2,persistent:true"
            "5,monitor:DP-2,persistent:true"
            "6,monitor:HDMI-A-1,gapsin:0,gapsout:0,rounding:false,border:false,default:true"
          ];
        };

        animation = {
          bezier = [
            "fluent_decel, 0, 0.2, 0.4, 1"
            "easeOutCirc, 0, 0.55, 0.45, 1"
            "easeOutCubic, 0.33, 1, 0.68, 1"
            "easeinoutsine, 0.37, 0, 0.63, 1"
            "easeOutBounce, 0.27, 1.25, 0.64, 1"
          ];

          animation = [
            "windowsIn, 1, 1.7, easeOutBounce, slide" # window open
            "windowsOut, 1, 1.7, easeOutBounce, slide" # window close
            "windowsMove, 1, 2.5, easeOutBounce, slide" # everything in between, moving, dragging, resizing

            # fading
            "fadeIn, 1, 3, easeOutCubic" # fade in (open) -> layers and windows
            "fadeOut, 1, 3, easeOutCubic" # fade out (close) -> layers and windows
            "fadeSwitch, 1, 5, easeOutCirc" # fade on changing activewindow and its opacity
            "fadeShadow, 1, 5, easeOutCirc" # fade on changing activewindow for shadows
            "fadeDim, 1, 6, fluent_decel" # the easing of the dimming of inactive windows
            "border, 1, 2.7, easeOutCirc" # for animating the border's color switch speed
            "workspaces, 1, 5, easeOutBounce, slide" # styles: slide, slidevert, fade, slidefade, slidefadevert
            "specialWorkspace, 1, 3, easeOutBounce, slidevert"
          ];
        };

        misc = {
          disable_hyprland_logo = true;
          disable_splash_rendering = true;
          key_press_enables_dpms = true;
          disable_autoreload = true;
          enable_swallow = false;
          swallow_regex = "kitty";
          focus_on_activate = true;
        };

        cursor = {
          inactive_timeout = 15;
          hide_on_key_press = true;
        };

        decoration = {
          rounding = 12;

          blur = {
            size = 2;
            passes = 3;
          };
        };

        xwayland = {
          force_zero_scaling = true;
        };

        dwindle = {
          default_split_ratio = 0.9;
        };

        layerrule = [
          # "blur,logout_dialog"
          # "blurpopups,logout_dialog"
          # "dimaround,logout_dialog"
        ];

        bind = [
          "${builtins.concatStringsSep "\n" (
            builtins.genList (
              x:
              let
                ws =
                  let
                    c = (x + 1) / 10;
                  in
                  builtins.toString (x + 1 - (c * 10));
              in
              ''
                bind = $MOD, ${ws}, workspace, ${toString (x + 1)}
                bind = $MODSHIFT, ${ws}, movetoworkspace, ${toString (x + 1)}
                bind = $MOD+CTRL, ${ws}, focusworkspaceoncurrentmonitor, ${toString (x + 1)}
              ''
            ) 10
          )}"

          "$MOD, mouse_down, workspace, e-1"
          "$MOD, mouse_up, workspace, e+1"

          "$MODSHIFT, Q, exec, hyprexit"
          "$MOD, Q, killactive"
          "$MOD, F, fullscreen,2"
          "$MODSHIFT, F, fullscreen, 1"
          "$MOD, L, exec, pidof hyprlock || uwsm app -- hyprlock"
          "$MOD, O, exec, pkill -RTMIN wvkbd"
          "$MOD, Space, togglefloating"
          # "$MOD, R,  overview:toggle, all"
          # "$MODSHIFT, R, hyprexpo:expo, toggle"
          "$MOD, T, exec, uwsm app -- tessen -p gopass -d wofi"
          "$MOD, P, pin"
          "$MOD, S, togglesplit"

          "$MOD, Tab, cyclenext, hist"
          "$MOD, Tab, bringactivetotop"
          "$MOD, A, togglespecialworkspace"
          "$MODSHIFT, A, movetoworkspace, special"
          "$MOD, K, movefocus, u"
          "$MOD, J, movefocus, d"
          "$MODSHIFT, L, movefocus, r"
          "$MOD, H, movefocus, l"

          "$MOD, J, togglegroup"
          "$MODSHIFT, J, changegroupactive, f"

          # Minimize App
          "$MOD, S, togglespecialworkspace, magic"
          "$MOD, S, movetoworkspace, +0"
          "$MOD, S, togglespecialworkspace, magic"
          "$MOD, S, movetoworkspace, special:magic"
          "$MOD, S, togglespecialworkspace, magic"

          "$MOD, P, exec, uwsm app -- screenshot"
          "$MODSHIFT, P, exec, uwsm app -- screenshot-area"
          "$MOD, Return, exec, uwsm app -- kitty"
          "$MODSHIFT, Return, exec, [float] uwsm app -- kitty "
          "$MOD, D, exec, uwsm app -- vicinae vicinae://toggle"
          "$MOD, E, exec, uwsm app -- nautilus --new-window"
          ", XF86AudioPlay, exec, playerctl play-pause"
          ", XF86AudioNext, exec, playerctl next"
          ", XF86AudioPrev, exec, playerctl previous"

          "CTRL+SHIFT,G,pass,^(com\.obsproject\.Studio)$"
        ];

        bindel = [
          ", XF86AudioRaiseVolume, exec, wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+"
          ", XF86AudioLowerVolume, exec, wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"
          ", XF86MonBrightnessUp, exec, notify-send Brightness up"
          ", XF86MonBrightnessDown, exec, notify-send Brightness down"
        ];

        bindl = [
          ", XF86AudioMute, exec, wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"
        ];

        bindm = [
          "$MOD, mouse:272, movewindow"
          "$MOD, mouse:273, resizewindow"
        ];

        windowrulev2 = [
          "opacity 0.98 0.98,class:^(zen)$"
          "opacity 0.95 0.95,class:^(steam)$"
          "opacity 0.95 0.95,class:^(steamwebhelper)$"
          "opacity 0.95 0.95,title:^(Spotify Premium)$"

          "float,class:^(file_progress)$"
          "float,class:^(confirm)$"
          "float,class:^(dialog)$"
          "float,class:^(download)$"
          "float,class:^(notification)$"
          "float,class:^(error)$"
          "float,class:^(confirmreset)$"
          "float,title:^(Open File)$"
          "float,title:^(branchdialog)$"
          "float,title:^(Confirm to replace files)$"
          "float,title:^(File Operation Progress)$"

          "float,class:^(org.gnome.Nautilus)$"
          "float,class:^(yad)$"
          "float,class:^(kitty-float)$"
          "float,class:^(gthumb)$"
          "float,class:^(xdg-desktop-portal-gtk)$"
          "float,class:^(mpv)$"
          "float,class:^(com.nextcloud.desktopclient.nextcloud)$"
          "float,class:^(Ryujinx)$"
          "float,class:^(org.gnome.NautilusPreviewer)$"
          "float,class:^(pavucontrol)$"
          "float,class:^(steam)$"
          "float,class:^(nyaa_shows)$"
          "float,class:^(org.gnome.TextEditor)$"
          "float,class:^(electrum-ltc)$"

          "tile,class:^(steam)$,title:^(Steam)$"
          "tile,class:^(steam)$,title:^(Steam)$"

          "size 1298 797,class:^(mpv)$"
          "size 1298 797,class:^(gthumb)$"

          "float, title:^(Picture-in-Picture)$"
          "pin, title:^(Picture-in-Picture)$"

          "pin, class:^(Kodi)$,floating:1"

          "opacity 1,class:^(kitty)$"

          # "stayfocused, class:^(com.nextcloud.desktopclient.nextcloud)$"
          "move 100%-w-20 100%-w-20, class:^(com.nextcloud.desktopclient.nextcloud)$"

          "workspace 5 silent,class:(steam)"
          "immediate, class:^(steam_app.*)$"
          "immediate, class:^(rocketleague.exe)$"
        ];

        plugin = {
          hyprtrails = {
            color = "rgba(aa336a80)";
          };

          hyprexpo = {
            columns = 2;
            gap_size = 5;
            bg_col = "rgba(aa336a80)";
            workspace_method = "center m+1"; # [center/first] [workspace] e.g. first 1 or center m+1

            enable_gesture = true; # laptop touchpad, 4 fingers
            gesture_distance = 300; # how far is the "max"
            gesture_positive = true; # positive = swipe down. Negative = swipe up.
          };

          # hyprbars = {
          #   # bar_text_size = 10;
          #   bar_text_font = "UbuntuSans Nerd Font";
          #   bar_height = 25;
          #   bar_part_of_window = true;
          #   bar_precedence_over_border = true;
          #   bar_color = "rgba(1e1e2eff)";
          #   bar_button_padding = 10;

          #   hyprbars-button = [
          #     "rgb(F5A9B8), 14, , hyprctl dispatch killactive"
          #     "rgb(5BCEFA), 14, , hyprctl dispatch fullscreen 1"
          #   ];
          # };
        };

        gestures = {
          workspace_swipe = true;
          workspace_swipe_create_new = true;
          workspace_swipe_touch = true;
        };

        render = {
          direct_scanout = 1;
        };

        debug = {
          full_cm_proto = true;
        };

        experimental = {
          xx_color_management_v4 = true;
        };

        input = {
          kb_layout = "us";
          accel_profile = "flat";

          touchdevice = {
            transform = 3;
            output = "eDP-1";
          };
        };
      }

      (lib.mkIf (osConfig.networking.hostName == "dreamhouse") {
        general = {
          monitor = [
            "DP-2,2560x1440@143.97Hz,0x0,1.25,vrr,1"
            "HDMI-A-2,1920x1080@74.97Hz,2048x0,auto,vrr,0"
            "HDMI-A-1,highres,3968x0,2,vrr,0,transform,2"
            "eDP-1,highrr,0x0,1,transform,3"
          ];
        };
      })

      (lib.mkIf (osConfig.networking.hostName == "blossom") {
        general = {
          monitor = [
            "HDMI-A-1,1920x1080@180Hz,0x0,1,vrr,1"
            "DP-1,1920x1080@60Hz,1920x0,1,vrr,0"
          ];
        };

      })

      (lib.mkIf (osConfig.networking.hostName == "steamdeck") {
        general = {
          monitor = [
            "eDP-1,highrr,0x0,1,transform,3"
          ];
        };

      })

      (lib.mkIf (osConfig.networking.hostName == "ken") {
        device = {
          name = "bcm5974";
          accel_profile = "adaptive";
          natural_scroll = true;
          sensitivity = 0.35;
          disable_while_typing = false;
        };

        gestures = {
          workspace_swipe = true;
          workspace_swipe_create_new = true;
        };

        input = {
          kb_layout = "us";
          kb_model = "apple";
          kb_variant = "mac";
          kb_options = "['ctrl:swap_lwin_lctl', 'ctrl:swap_rwin_rctl']";
        };
      })
    ];

    plugins = with pkgs; [
      # hyprlandPlugins.hyprbars
      # hyprlandPlugins.hyprtrails
      # hyprlandPlugins.hyprexpo
      # hyprlandPlugins.hyprfocus
      # inputs.hyprfocus.packages.${system}.default
      # hyprlandPlugins.hyprspace
    ];
  };
}
