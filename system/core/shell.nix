{pkgs, ...}: {
  users.defaultUserShell = pkgs.xonsh;

  environment.systemPackages = with pkgs; [zoxide fzf];

  programs.nix-index.enable = true;

  programs.xonsh = {
    enable = true;
    extraPackages = ps:
      with ps; [
        requests
        numpy
        xonsh.xontribs.xonsh-direnv
        xonsh.xontribs.xontrib-fish-completer
        (ps.buildPythonPackage rec {
          name = "xontrib-prompt-bar";
          version = "0.5.8";

          pyproject = true;
          build-system = [setuptools];

          src = pkgs.fetchFromGitHub {
            owner = "anki-code";
            repo = "${name}";
            rev = "${version}";
            sha256 = "sha256-n80XDApfoUJQORSzIY1FACLeL++HKmIxcz4MAeQ3CZ0=";
          };
        })
        (ps.buildPythonPackage rec {
          name = "xontrib-prompt-starship";
          version = "0.3.8";
          format = "pyproject";

          nativeBuildInputs = with pkgs; [
            setuptools
          ];

          src = pkgs.fetchFromGitHub {
            owner = "anki-code";
            repo = "${name}";
            rev = "${version}";
            sha256 = "sha256-JEVSXVYg90R0gvP88bwcDTdMrQKV5Jh00cdJKB85fPM=";
          };
          
          # patchPhase = "sed -i -e 's/^dependencies.*$/dependencies = []/' pyproject.toml";
          doCheck = false;
          dontCheckRuntimeDeps = true;
        })
      ];
    config = ''
      from xonsh.completers.emoji import get_emoji_cache
      from prompt_toolkit.keys import Keys
      from prompt_toolkit.filters import Condition, EmacsInsertMode, ViInsertMode
      
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
      @events.on_postcommand
      def _prompt_err_command_again(cmd, rtn, out, ts) -> None:
          if rtn != 0:
              $XONSH_PROMPT_NEXT_CMD = cmd.rstrip()

      @events.on_ptk_create
      def custom_keybindings(bindings, **kw) -> None:
          @bindings.add(Keys.ControlW)  # or just "c-w" string
          def say_hi(event):
              event.current_buffer.insert_text('hi')

      $PROMPT_FIELDS['random_emoji'] = lambda: @.imp.random.choice(get_emoji_cache())[0]

      
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

      $STARSHIP_CONFIG = '~/.config/starship.toml'

      $PROMPT = "@ "
      
      xontrib load prompt_starship
      xontrib load direnv

      exec($(carapace _carapace))
      execx($(zoxide init xonsh), 'exec', __xonsh__.ctx, filename='zoxide')

      nitch
    '';
  };
}
