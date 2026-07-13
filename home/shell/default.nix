{ pkgs, ... }:
let
  xonshRc = pkgs.writeText "rc.xsh" ''
    from prompt_toolkit.keys import Keys
    from prompt_toolkit.filters import Condition, EmacsInsertMode, ViInsertMode

    execx($(any-nix-shell xonsh --info-right))

    @events.on_command_not_found
    def my_handler(cmd: list[str]) -> None:
        print(f"Oops! The command '{cmd[0]}' does not exist.")
        print("")
        return ["bash", "-c", f"NIX_AUTO_RUN=True; source /nix/store/vbb340a5czm0hsm0f9fb2lijzbqsgr2w-nix-index-0.1.10/etc/profile.d/command-not-found.sh; command_not_found_handle \'{cmd[0]}\' 2> /dev/null"]
        # Add your own fallback logic or suggestion logic here

    @events.on_chdir
    def _list_dir(olddir, newdir) -> None:
        print()
        eza --icons --group-directories-first --across

    aliases['s'] = 'kitten ssh'


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
    xontrib load direnv

    exec($(carapace _carapace))
    execx($(zoxide init xonsh), 'exec', __xonsh__.ctx, filename='zoxide')

    nitch
  '';
in
{
  imports = [
    ./starship.nix
  ];

  home.packages = with pkgs; [
    eza
    glow
    btop
    fish
    zsh
    grc
    elvish
    nitch
  ];

  xdg.configFile."xonsh/rc.xsh".source = xonshRc;

  programs = {
    direnv = {
      enable = true;
      nix-direnv.enable = true;
    };
  };

  programs = {
    carapace.enable = true;
  };
}
