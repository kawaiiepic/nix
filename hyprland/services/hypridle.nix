{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  # screen idle
  services.hypridle = {
    enable = true;
    settings = {
      before_sleep_cmd = "loginctl lock-session";
      after_sleep_cmd = "hyprctl dispatch dpms on";
      lock_cmd = "pidof hyprlock || hyprlock";

      listener = [
        {
          timeout = 150;
          onTimeout = "dimmer"; ## Brightness Dim.
          onResume = "pkill dimmer; dimmer -r"; ## Brightness restore.
        }

        {
          timeout = 300;
          onTimeout = "loginctl lock-session";
        }

        {
          timeout = 330;
          onTimeout = "notify-send 'Hypridle' 'Display turned off.'"; ## Turn off display
          onResume = "notify-send 'Hypridle' 'Display turned back on.'";
        }

        {
          timeout = 1800; # 30min
          on-timeout = "systemctl suspend"; # suspend pc
        }

        # {
        #   timeout = 380;
        #   onTimeout = "${pkgs.hyprland}/bin/hyprctl dispatch dpms off";
        #   onResume = "${pkgs.hyprland}/bin/hyprctl dispatch dpms on";
        # }
      ];
    };
  };
}
