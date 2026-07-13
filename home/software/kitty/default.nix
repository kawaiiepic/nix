{ pkgs, ... }:
let
  xonshRc = pkgs.writeText ".xonshrc" ''
    @events.on_chdir
    def _list_dir(olddir, newdir) -> None:
        print()
        eza --icons --group-directories-first --across

    $CARAPACE_BRIDGES='zsh,fish,bash,inshellisense'
    $COMPLETIONS_CONFIRM=True
    $MULTILINE_MODE = 'backslash'
    $XONTRIB_PROMPT_BAR_THEME = {
        'left':       '{hostname}{user}{cwd_abs#accent}',
        'right':      '{curr_branch#section}{env_name#strip_brackets#section}{date_time_tz}',
        'bar_bg':     '{BACKGROUND_#585b70}',
        'bar_fg':     '{PURPLE}',
        'section_bg': '{BACKGROUND_#585b70}',
        'section_fg': '{#cdd6f4}',
        'accent_fg':  '{#cdd6f4}',
    }

    mkdir -p ~/.config

    echo @("""
    [character]
    success_symbol = ""
    error_symbol = ""
    """.strip()) > ~/.config/starship_xonsh_right.toml

    $PROMPT = "@ "

    xontrib load prompt_starship

    exec($(carapace _carapace))
    execx($(zoxide init xonsh), 'exec', __xonsh__.ctx, filename='zoxide')

    nitch
  '';
in
{

  xdg.configFile."kitty/ssh.conf".text = ''
    copy --dest .config/xonsh/rc.xsh ${xonshRc}
  '';

  programs.kitty = {
    enable = true;
    enableGitIntegration = true;

    font = {
      name = "SpaceMono Nerd Font Mono";
      size = 12;
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

      "ctrl+up" = "scroll_line_up smooth";
      "ctrl+down" = "scroll_line_down smooth";

      "f1" = "new_window_with_cwd";
    };

    settings = {
      window_border_width = "0px";
      enable_audio_bell = true;
      window_padding_width = 20;
      strip_trailing_spaces = "smart";
      confirm_os_window_close = 0;
      cursor_shape = "underline";
      background_opacity = "0.95";
      background_blur = 1;
      background_tint = "0.2";
      tab_bar_min_tabs = 1;
      tab_bar_background = "#1E1E2E";
      tab_bar_edge = "bottom";
      tab_bar_style = "powerline";
      tab_powerline_style = "slanted";
      auto_reload_config = -1;
      # tab_title_template = "{title}{' :{}:'.format(num_windows) if num_windows > 1 else ''}";
      tab_title_template = " {f'{title[:4]}' if title.rindex(title[-1]) + 1 > 30 else (title.center(6) if (title.rindex(title[-1]) + 1) % 2 == 0 else title.center(5))}";

      # notify_on_cmd_finish = "invisible";
      "enabled_layouts tall:bias=50;full_size=1;mirrored=false" = "";
      "mouse_map left click ungrabbed mouse_handle_click" = "selection link prompt";
    };
  };
}
