{
  pkgs,
  config,
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
      pkgs.kdePackages.qtwebsockets
      inputs.qml-niri.packages.${pkgs.stdenv.hostPlatform.system}.default
    ];
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
in {
  home = {
    packages = with pkgs; [
      
      # Quickshell
      gthumb
      libcanberra-gtk3
      custom_quickshell
      cava
      brightnessctl

      hyprshutdown
      inputs.snappy-switcher.packages.${pkgs.system}.default
      grimblast
      linux-wallpaperengine
      (pkgs.writeShellScriptBin "hypr-screenshot" ''
        grimblast save output - > ${cacheDir}/sc.png && cat ${cacheDir}/sc.png | wl-copy && notify-send -u low -a 'screenshot' "📸 Screenshot copied" 'Copied to clipboard.' -i camera -h "string:preview:true" -h "string:image-path:${cacheDir}/sc.png" && canberra-gtk-play -i screen-capture
      '')
      (pkgs.writeShellScriptBin "hypr-screenshot-area" ''
        grimblast --freeze save area - > ${cacheDir}/sc.png && cat ${cacheDir}/sc.png | wl-copy && notify-send -u low -a 'screenshot' "📸 Screenshot Area copied" 'Copied to clipboard.' -i camera -h "string:preview:true" -h 'string:image-path:${cacheDir}/sc.png' && canberra-gtk-play -i screen-capture
      '')
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

  xdg.portal = {
    enable = true;
    xdgOpenUsePortal = true;

    extraPortals = with pkgs; [
      xdg-desktop-portal-gtk
      xdg-desktop-portal-wlr
    ];

    config = {
      niri = {
        default = ["gtk"];
        "org.freedesktop.impl.portal.Screenshot" = ["wlr"];
        "org.freedesktop.impl.portal.ScreenCast" = ["wlr"];
      };
    };
  };

  services.xembed-sni-proxy.enable = true;

  xdg.configFile."hypr/xdph.conf".text = ''
    screencopy {
        allow_token_by_default = true
    }
  '';

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
    package = inputs.hyprland.packages.${pkgs.stdenv.hostPlatform.system}.hyprland;
    portalPackage = inputs.hyprland.packages.${pkgs.stdenv.hostPlatform.system}.xdg-desktop-portal-hyprland;
    settings = lib.mkMerge [
      {
        "$MOD" = "SUPER";

        exec-once = with pkgs; [
          "${hyprpolkitagent}/bin/hyprpolkitagent"
          "${hyprsunset}/bin/hyprsunset"
          "snappy-switcher --daemon"
          "stasis"
          "quickshell"
          "hyprlock --immediate"
        ];

        # exec-once = [
        #
        #   "systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP NIXOS_OZONE_WL"
        #   "uwsm app -- my-shell"
        #   #"uwsm app -- hyprlock --immediate"
        #   "uwsm app -- wvkbd-mobintl --hidden --alpha 50 -L 200"
        #   "uwsm app -- ${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1"
        #   "uwsm app -- ${pkgs.networkmanagerapplet}/bin/nm-applet"
        #   "uwsm app -- ${pkgs.joystickwake}/bin/joystickwake"
        #   "uwsm app -- ${pkgs.hyprsunset}/bin/hyprsunset"
        #   "uwsm app -- ${pkgs.hyprpolkitagent}/bin/hyprpolkitagent"
        #   "uwsm app -- ags run"
        #   "uwsm app -- systemctl start --user hypridle"
        #   "uwsm app -- vicinae server"
        #   "sleep 5 && start"
        # ];

        master = {
          mfact = "0.60";
          orientation = "right";
        };

        general = {
          gaps_in = 4;
          gaps_out = 8;
          border_size = 2;
          float_gaps = 10;
          "col.active_border" = palette.mocha.crust;
          "col.inactive_border" = palette.mocha.crust;
          layout = "scrolling";
          resize_on_border = true;
          allow_tearing = true;

          snap = {
            enabled = true;
            border_overlap = true;
            respect_gaps = true;
          };

          monitor = [
            "DP-2,2560x1440@143.97Hz,0x0,1.25,vrr,1,bitdepth,10,sdrbrightness, 1.2, sdrsaturation, 0.98"
            ",preferred,auto,1"
          ];

          workspace = [
            "1,monitor:DP-2,persistent:true,default:true"
            "2,monitor:DP-2,persistent:true"
            "3,monitor:DP-2,persistent:true"
            "4,monitor:DP-2,persistent:true"
            "5,monitor:DP-2,persistent:true"
            # "6,monitor:HDMI-A-1,gapsin:0,gapsout:0,rounding:false,border:false,default:true"
          ];
        };

        decoration = {
          rounding = 12;

          blur = {
            size = 1;
            passes = 3;
          };

          shadow = {
            color = palette.mocha.crust;
          };
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
          vrr = 2;
          mouse_move_enables_dpms = true;
          key_press_enables_dpms = true;
          enable_swallow = false;
          swallow_regex = "^(kitty)$";
          focus_on_activate = true;
        };

        xwayland = {
          force_zero_scaling = true;
        };

        render = {
          direct_scanout = 2;
          cm_auto_hdr = true;
        };

        cursor = {
          hide_on_key_press = true;
        };

        ecosystem = {
          enforce_permissions = true;
        };

        bind = [
          "${builtins.concatStringsSep "\n" (
            builtins.genList (
              x: let
                ws = let
                  c = (x + 1) / 10;
                in
                  builtins.toString (x + 1 - (c * 10));
              in ''
                bind = $MOD, ${ws}, workspace, ${toString (x + 1)}
                bind = $MODSHIFT, ${ws}, movetoworkspace, ${toString (x + 1)}
                bind = $MOD+CTRL, ${ws}, focusworkspaceoncurrentmonitor, ${toString (x + 1)}
              ''
            )
            10
          )}"

          "$MOD, mouse_down, workspace, e-1"
          "$MOD, mouse_up, workspace, e+1"

          "ALT, Tab, exec, snappy-switcher next"
          "ALT SHIFT, Tab, exec, snappy-switcher prev"

          "$MODSHIFT, Q, exec, hyprshutdown"
          "$MOD, Q, killactive"
          # "$MOD, F, fullscreen,2"
          "$MOD, F, layoutmsg, colresize +conf"
          "$MODSHIFT, F, fullscreen, 2"
          "$MOD, L, exec, pidof hyprlock || hyprlock"
          "$MOD, O, exec, pkill -RTMIN wvkbd"
          "$MOD, T, togglefloating"
          # "$MOD, R,  overview:toggle, all"
          # "$MODSHIFT, R, hyprexpo:expo, toggle"
          "$MOD, Y, exec, tessen -p gopass -d wofi"
          "$MOD, P, pin"
          # "$MOD, S, togglesplit"

          "$MOD, Tab, cyclenext, hist"
          "$MOD, Tab, bringactivetotop"
          "$MOD, A, layoutmsg, move -col"
          "$MOD, D, layoutmsg, move +col"
          # "$MOD, A, togglespecialworkspace"
          # "$MODSHIFT, A, movetoworkspace, special"
          "$MOD, K, movefocus, u"
          "$MOD, J, movefocus, d"
          "$MODSHIFT, L, movefocus, r"
          "$MOD, H, movefocus, l"

          "$MOD, P, exec, hypr-screenshot"
          "$MODSHIFT, P, exec, hypr-screenshot-area"
          "$MOD, Return, exec, kitty"
          "$MODSHIFT, Return, exec, [float] kitty "
          "$MOD, E, exec, [float] nautilus --new-window"
          ", XF86AudioPlay, exec, playerctl play-pause"
          ", XF86AudioNext, exec, playerctl next"
          ", XF86AudioPrev, exec, playerctl previous"

          "$MOD, G, togglegroup"
          "$MODSHIFt, G, changegroupactive"

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

        permission = [
          "permission = ${(lib.getExe config.programs.hyprlock.package)}, screencopy, allow"
          "permission = ${pkgs.xdg-desktop-portal-hyprland}/libexec/.xdg-desktop-portal-hyprland-wrapped, screencopy, allow"
          "permission = ${pkgs.grimblast}/bin/grimblast, screencopy, allow"
        ];

        layerrule = [
          "blur on, match:namespace controlcenter"
          "ignore_alpha 0.5, match:namespace controlcenter"
        ];

        windowrule = [
          "match:class steam_app_252950, immediate yes"
        ];

        # windowrulev2 = [
        #   "opacity 0.98 0.98,class:^(zen)$"
        #   "opacity 0.95 0.95,class:^(steam)$"
        #   "opacity 0.95 0.95,class:^(steamwebhelper)$"
        #   "opacity 0.95 0.95,title:^(Spotify Premium)$"

        #   "float,class:^(file_progress)$"
        #   "float,class:^(confirm)$"
        #   "float,class:^(dialog)$"
        #   "float,class:^(download)$"
        #   "float,class:^(notification)$"
        #   "float,class:^(error)$"
        #   "float,class:^(confirmreset)$"
        #   "float,title:^(Open File)$"
        #   "float,title:^(branchdialog)$"
        #   "float,title:^(Confirm to replace files)$"
        #   "float,title:^(File Operation Progress)$"

        #   "float,class:^(org.gnome.Nautilus)$"
        #   "float,class:^(yad)$"
        #   "float,class:^(kitty-float)$"
        #   "float,class:^(gthumb)$"
        #   "float,class:^(xdg-desktop-portal-gtk)$"
        #   "float,class:^(mpv)$"
        #   "float,class:^(com.nextcloud.desktopclient.nextcloud)$"
        #   "float,class:^(Ryujinx)$"
        #   "float,class:^(org.gnome.NautilusPreviewer)$"
        #   "float,class:^(pavucontrol)$"
        #   "float,class:^(steam)$"
        #   "float,class:^(nyaa_shows)$"
        #   "float,class:^(org.gnome.TextEditor)$"
        #   "float,class:^(electrum-ltc)$"

        #   "tile,class:^(steam)$,title:^(Steam)$"
        #   "tile,class:^(steam)$,title:^(Steam)$"

        #   "size 1298 797,class:^(mpv)$"
        #   "size 1298 797,class:^(gthumb)$"

        #   "float, title:^(Picture-in-Picture)$"
        #   "pin, title:^(Picture-in-Picture)$"

        #   "pin, class:^(Kodi)$,floating:1"

        #   "opacity 1,class:^(kitty)$"

        #   "move 100%-w-20 100%-w-20, class:^(com.nextcloud.desktopclient.nextcloud)$"

        #   "workspace 5 silent,class:(steam)"
        #   "immediate, class:^(steam_app.*)$"
        #   "immediate, class:^(rocketleague.exe)$"
        # ];
      }
    ];

    plugins = with inputs.hyprland-plugins.packages.${pkgs.stdenv.hostPlatform.system}; [
      # hyprbars
      # hyprtrails
      # hyprexpo
      # hypr-dynamic-cursors
      # hyprfocus
      # hyprspace
    ];
  };
}
