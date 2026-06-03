{pkgs, ...}: {
  users.defaultUserShell = pkgs.elvish;

  environment.systemPackages = with pkgs; [zoxide fzf];

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
      $CARAPACE_BRIDGES='zsh,fish,bash,inshellisense'
      $COMPLETIONS_CONFIRM=True
      $MULTILINE_MODE = 'backslash'
      $XONTRIB_PROMPT_BAR_THEME = {
          'left':       '{hostname}{user}{cwd_abs#accent}',
          'right':      '{curr_branch#section}{env_name#strip_brackets#section}{date_time_tz}',
          'bar_bg':     '{BACKGROUND_#11111b}',
          'bar_fg':     '{#AAA}',
          'section_bg': '{BACKGROUND_#444}',
          'section_fg': '{#CCC}',
          'accent_fg':  '{BOLD_#DDD}',
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
