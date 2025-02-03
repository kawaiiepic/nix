{
  pkgs,
  lib,
  config,
  osConfig,
  inputs,
  ...
}:
{

  home.packages = with pkgs; [ brightnessctl ];

  # screen idle
  services.hypridle = {
    enable = true;
    settings = {
      before_sleep_cmd = "loginctl lock-session";
      after_sleep_cmd = "hyprctl dispatch dpms on";
      lock_cmd = "pidof hyprlock || hyprlock";

      listener =
        if osConfig.networking.hostName == "steamdeck" then
          [
            {
              timeout = 150;
              on-timeout = "brightnessctl -s set 10";
              on-resume = "brightnessctl -r";
            }
            {
              timeout = 330;
              on-timeout = "hyprctl dispatch dpms off"; # # Turn off display
              on-resume = "hyprctl dispatch dpms on";
            }

            {
              timeout = 400;
              on-timeout = "systemctl suspend";
            }
          ]
        else
          [
            {
              timeout = 150;
              on-timeout = "brightnessctl -s set 10";
              on-resume = "brightnessctl -r";
            }
            {
              timeout = 300;
              on-timeout = "hyprlock";
            }

            # {
            #   timeout = 330;
            #   on-timeout = "hyprctl dispatch dpms off"; # # Turn off display
            #   on-resume = "hyprctl dispatch dpms on";
            # }

            {
              timeout = 1800; # 30min
              on-timeout = "systemctl suspend"; # suspend pc
            }
          ];
    };
  };
}
