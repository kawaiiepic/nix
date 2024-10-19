{
  config,
  pkgs,
  inputs,
  ...
}: let
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
in {
  home.packages = [
    music-uptime
  ];

  programs.hyprlock = {
    enable = true;

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
          path = "${config.home.homeDirectory}/.cache/background"; # only png supported for now
          color = "rgba(25, 20, 20, 1.0)";

          # all these options are taken from hyprland, see https://wiki.hyprland.org/Configuring/Variables/#blur for explanations
          blur_passes = 3;
          blur_size = 1;
        }
      ];

      input-field = [
        {
          monitor = "DP-2";

          size = "270, 50";

          position = "0, -100";

          outline_thickness = 4;

          outer_color = "rgb(181825)";
          inner_color = "rgb(313244)";
          font_color = "rgb(cdd6f4)";

          fade_on_empty = true;
          placeholder_text = "<span font_family='Lexend' foreground='##cdd6f4'>Password...</span>";

          dots_spacing = 0.3;
          dots_center = true;
        }

        {
          monitor = "eDP-1";

          size = "270, 50";

          position = "0, -100";

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
          text = "<span font_weight='bold'>$TIME</span>";
          inherit font_family;
          font_size = 100;
          color = "rgb(cdd6f4)";

          position = "0, 120";

          valign = "center";
          halign = "center";
        }

        {
          monitor = "";
          text = "cmd[update:1000] echo \"<span><i>$(date \"+%D\")</i></span>\"";
          inherit font_family;
          font_size = 20;
          color = "rgb(cdd6f4)";

          position = "0, -20";

          valign = "center";
          halign = "center";
        }

        {
          monitor = "DP-2";

          text = "cmd[update:500] echo \"<span><i>$(music-uptime)</i></span>\"";
          inherit font_family;
          font_size = 25;
          color = "rgb(a6adc8)";

          position = "0, 50";

          valign = "bottom";
          halign = "center";
        }

        {
          monitor = "eDP-2";

          text = "cmd[update:500] echo \"<span><i>$(music-uptime)</i></span>\"";
          inherit font_family;
          font_size = 25;
          color = "rgb(a6adc8)";

          position = "0, 50";

          valign = "bottom";
          halign = "center";
        }
      ];

      image = [
        {
          monitor = "DP-2";

          path = "${config.home.homeDirectory}/.face";
          size = 180;
          border_size = 5;
          border_color = "rgb(11111b)";
          rotate = 0.0;

          position = "0, -320";

          valign = "top";
          halign = "center";

          shadow_passes = 1;
        }

        {
          monitor = "eDP-2";

          path = "${config.home.homeDirectory}/.face";
          size = 180;
          border_size = 5;
          border_color = "rgb(11111b)";
          rotate = 0.0;

          position = "0, -320";

          valign = "top";
          halign = "center";

          shadow_passes = 1;
        }
      ];
    };
  };
}
