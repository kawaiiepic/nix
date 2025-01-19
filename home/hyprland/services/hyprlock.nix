{
  config,
  pkgs,
  osConfig,
  inputs,
  ...
}:
let
  variant = config.theme.name;
  font_family = "Lexend";
  music-uptime = pkgs.writeShellScriptBin "music-uptime" ''
    playerctl=$(playerctl -a status 2>/dev/null)
    if grep "Playing" <<< "$playerctl" >/dev/null; then
        playerctl -p "spotify,*" metadata --format "󰎆  {{title}} - {{artist}}" 2>/dev/null ||
        playerctl metadata --format "󰎆  {{title}} - {{artist}}"
    else
        echo -n "󱎫  "
        uptime | sed -E 's/^[^,]*up *//; s/, *[[:digit:]]* users?.*//; s/days/giorni/; s/day/giorno/; s/min/min./; s/([[:digit:]]+):0?([[:digit:]]+)/\1 Hours, \2 mins./;'
    fi
  '';
in
{
  home.packages = [
    music-uptime
  ];

  programs.hyprlock = {
    enable = if osConfig.networking.hostName == "steamdeck" then false else true;

    settings = {
      general = {
        disable_loading_bar = false;
        hide_cursor = true;
        grace = 15;
        ignore_empty_input = true;
      };

      background = [
        {
          monitor = "";
          path = "screenshot"; # ${config.home.homeDirectory}/.cache/background
          # color = "rgba(25, 20, 20, 1.0)";
          blur_size = 4;
          blur_passes = 3; # 0 disables blurring
          noise = 0.0117;
          contrast = 1.3000; # Vibrant!!!
          brightness = 0.8000;
          vibrancy = 0.2100;
          vibrancy_darkness = 0.0;
        }
      ];

      input-field = [

        {
          monitor = "";

          size = "270, 50";

          position = "0, 300";
          
          halign = "center";
          valign = "bottom";

          outline_thickness = 4;

          outer_color = "rgb(181825)";
          inner_color = "rgb(313244)";
          font_color = "rgb(cdd6f4)";

          fade_on_empty = true;
          placeholder_text = "<span font_family='Lexend' foreground='##cdd6f4'>Password...</span>";

          dots_spacing = 0.3;
          dots_center = true;
        }
      ];

      label = [
        {
          monitor = "";
          text = "cmd[update:1000] echo -e \"<b><big> $(date +\"%H\") </big></b>\"";
          # color =  $light_primary
          shadow_passes = 3;
          shadow_size = 4;
          font_size = 112;
          font_family = "Geist Mono 10";
          position = "0, 220";
          halign = "center";
          valign = "center";
        }

        {
          monitor = "";
          text = "cmd[update:1000] echo -e \"<b><big> $(date +\"%M\") </big></b>\"";
          # color =  $dark_primary
          shadow_passes = 3;
          shadow_size = 2;
          font_size = 100;
          font_family = "AlfaSlabOne";
          position = "0, 80";
          halign = "center";
          valign = "center";
        }
        
        {
          monitor = "";
          text = "cmd[update:18000000] echo -e \"<b><big> $(date +\"%A\") </big></b>\"";
          # color =  $dark_primary
          font_size = 22;
          font_family = "JetBrainsMono Nerd Font 10";
          position = "0, -20";
          halign = "center";
          valign = "center";
        }
        
        {
          monitor = "";
          text = "cmd[update:18000000] echo -e \"<b> $(date +\"%d %b\") </b>\"";
          # color =  $dark_primary
          font_size = 18;
          font_family = "JetBrainsMono Nerd Font 10";
          position = "0, -50";
          halign = "center";
          valign = "center";
        }

        {
          monitor = "";
          text = "cmd[update:18000000] echo -e \"<b>Feels like<big> $(curl -s 'wttr.in?format=%t' | tr -d '+') </big></b>\"";
          # color =  $dark_primary
          font_size = 18;
          font_family = "Geist Mono 10";
          position = "20, 20";
          halign = "left";
          valign = "bottom";
        }

        {
          monitor = "";
          text = "cmd[update:1000] echo -e \"$(playerctl metadata --format '{{title}}      {{artist}}')\"";
          # color =  $dark_primary
          shadow_passes = 3;
          shadow_size = 1;
          font_size = 14;
          font_family = "JetBrains Mono Nerd, SF Pro Display Bold";
          position = "-20, 20";
          halign = "right";
          valign = "bottom";
        }
      ];

      image = [
        {
          monitor = "";

          path = "${config.home.homeDirectory}/.face";
          size = "10px, 10px";
          rounding = -1;
          border_size = 0;
          shadow_passes = 3;
          
          shadow_size = 3;
          border_color = "rgb(221, 221, 221)";
          rotate = 0; # degrees, counter-clockwise
          reload_time = -1; # seconds between reloading, 0 to reload with SIGUSR2
          #    reload_cmd =  # command to get new path. if empty, old path will be used. don't run "follow" commands like tail -F
          position = "0, -250";
          halign = "center";
          valign = "center";
        }
      ];
    };
  };
}
