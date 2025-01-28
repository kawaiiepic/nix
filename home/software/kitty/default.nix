{
  lib,
  pkgs,
  ...
}:
{
  programs.kitty = {
    enable = true;
    shellIntegration.enableFishIntegration = true;

    font = {
      name = "SpaceMono Nerd Font Mono";
      size = 11;
    };

    themeFile = "Catppuccin-Mocha";
    keybindings = {
      "ctrl+c" = "copy_or_interrupt";
      "ctrl+v" = "paste_from_clipboard";
      "ctrl+shift+v" = "paste_from_selection";
      "ctrl+t" = "new_window";
      "ctrl+w" = "close_window";
      "ctrl+alt+a" = "previous_window";
      "ctrl+alt+d" = "next_window";
      "alt+r" = "start_resizing_window";
      "ctrl+u" = "kitten unicode_input";
      "ctrl+shift+e" = "open_url_with_hints";
      "f5" = "launch";
    };

    settings = {
      enable_audio_bell = true;
      window_padding_width = 20;
      strip_trailing_spaces = "smart";
      confirm_os_window_close = 0;
      cursor_shape = "underline";
      background_opacity = "0.85";
      # background_opacity = lib.mkForce "0.50";
      # background_blur = 10;
      # background_tint = "0.5";
      tab_bar_min_tabs = 2;
      tab_bar_edge = "bottom";
      tab_bar_style = "powerline";
      tab_powerline_style = "slanted";
      tab_title_template = "{title}{' :{}:'.format(num_windows) if num_windows > 1 else ''}";

      notify_on_cmd_finish = "invisible";
      "enabled_layouts tall:bias=50;full_size=1;mirrored=false" = "";
      "mouse_map left click ungrabbed mouse_handle_click" = "selection link prompt";
    };
  };
}
