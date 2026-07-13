{ pkgs, ... }: {
  users.defaultUserShell = pkgs.xonsh;

  environment.systemPackages = with pkgs; [
    zoxide
    fzf
    any-nix-shell
  ];

  programs.nix-index.enable = true;

  programs.xonsh = {
    enable = true;
    extraPackages =
      ps: with ps; [
        requests
        numpy
        xonsh.xontribs.xonsh-direnv
        xonsh.xontribs.xontrib-fish-completer
        (ps.buildPythonPackage rec {
          name = "xontrib-prompt-bar";
          version = "0.5.8";

          pyproject = true;
          build-system = [ setuptools ];

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
  };
}
