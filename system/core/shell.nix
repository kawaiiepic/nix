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
      @events.on_command_not_found
      def my_handler(cmd: list[str]) -> None:
          print(f"Oops! The command '{cmd[0]}' does not exist.")
          bash -c "source ${pkgs.nix-index}/etc/profile.d/command-not-found.sh; command_not_found_handler"
          # Add your own fallback logic or suggestion logic here
          
      $CARAPACE_BRIDGES='zsh,fish,bash,inshellisense'
      $COMPLETIONS_CONFIRM=True
      $MULTILINE_MODE = 'backslash'
      $XONTRIB_PROMPT_BAR_THEME = {
          'left':       '{hostname}{user}{cwd_abs#accent}',
          'right':      '{curr_branch#section}{env_name#strip_brackets#section}{date_time_tz}',
          'bar_bg':     '{BACKGROUND_#313244}',
          'bar_fg':     '{#bac2de}',
          'section_bg': '{BACKGROUND_#45475a}',
          'section_fg': '{#a6adc8}',
          'accent_fg':  '{BOLD_#f5c2e7}',
      }

      mkdir -p ~/.config && echo @("""
      [character]
      success_symbol = ""
      error_symbol = ""
      [status]
      symbol = ""
      """.strip()) > ~/.config/starship_xonsh_right.toml

      $XONTRIB_PROMPT_STARSHIP_RIGHT_CONFIG = "~/.config/starship_xonsh_right.toml"
      $XONTRIB_PROMPT_STARSHIP_REPLACE_PROMPT = False
      $XONTRIB_PROMPT_BAR_RIGHT = '{starship_right#noesc#nonl#strip}'
      
      xontrib load prompt_starship prompt_bar
      xontrib load direnv

      exec($(carapace _carapace))
      execx($(zoxide init xonsh), 'exec', __xonsh__.ctx, filename='zoxide')

      nitch
    '';
  };
}
