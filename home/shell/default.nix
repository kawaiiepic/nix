{ pkgs, ... }:
{
  imports = [
    ./starship.nix
  ];

  home.packages = with pkgs; [
    eza
    fzf
    fd
    bat
    btop
  ];

  programs = {
    direnv = {
      enable = true;
      nix-direnv.enable = true;
    };
  };

  # home.file.".config/fastfetch".source = ./42willow.gif;

  programs.fastfetch = {
    enable = true;
    settings = {
      logo = {
        source = "nixos_small";
        padding = {
          right = 2;
          top = 1;
        };
      };
      display = {
        size.binaryPrefix = "si";
        color = "cyan";
        separator = " ➜ ";
        brightColor = true;
      };
      modules = [
        {
          type = "title";
          keyColor = "magenta";
          valueColor = "cyan";
        }
        {
          type = "separator";
          string = "─────────────────────────────────";
        }
        {
          type = "os";
          key = "  OS";
          keyColor = "blue";
        }
        {
          type = "kernel";
          key = "  Kernel";
          keyColor = "blue";
        }
        {
          type = "uptime";
          key = "  Uptime";
          keyColor = "blue";
        }
        {
          type = "packages";
          key = "  Packages";
          keyColor = "blue";
        }
        {
          type = "shell";
          key = "  Shell";
          keyColor = "blue";
        }
        {
          type = "display";
          key = "  Display";
          keyColor = "blue";
        }
        {
          type = "de";
          key = "  DE";
          keyColor = "blue";
        }
        {
          type = "wm";
          key = "  WM";
          keyColor = "blue";
        }
        {
          type = "terminal";
          key = "  Terminal";
          keyColor = "blue";
        }
        {
          type = "cpu";
          key = "  CPU";
          keyColor = "green";
        }
        {
          type = "gpu";
          key = "  GPU";
          keyColor = "green";
        }
        {
          type = "memory";
          key = "  Memory";
          keyColor = "yellow";
        }
        {
          type = "disk";
          key = "  Disk";
          keyColor = "yellow";
        }
        "break"
        {
          type = "colors";
          paddingLeft = 2;
          symbol = "circle";
        }
      ];
    };
  };

  programs.fish = {
    enable = true;
    interactiveShellInit = ''
      set fish_greeting # Disable greeting
      fish_config theme choose CatppuccinMocha
      fastfetch

      direnv hook fish | source
    '';

    shellAliases = {
      g = "git";
      "..." = "cd ../..";
      ls = "eza --icons --group-directories-first -x";
      icat = "kitty icat";
      ssh = "kitten ssh";
    };

    plugins = [
      {
        name = "fish-autols";
        src = pkgs.fetchFromGitHub {
          owner = "rstacruz";
          repo = "fish-autols";
          rev = "6d704c0e33522335539bf6844ce9f7009b2ee6a2";
          sha256 = "sha256-tqAsc9J8xv0DMt5fTYaBO7tUQAG7Fnct/Rlq/Jx+/yU=";
        };
      }

      {
        name = "fzf.fish";
        src = pkgs.fetchFromGitHub {
          owner = "PatrickF1";
          repo = "fzf.fish";
          rev = "8920367cf85eee5218cc25a11e209d46e2591e7a";
          sha256 = "sha256-T8KYLA/r/gOKvAivKRoeqIwE2pINlxFQtZJHpOy9GMM=";
        };
      }
    ];
  };

  home.file.".config/fish/themes/CatppuccinMocha.theme".source = ./fish.theme;
}
