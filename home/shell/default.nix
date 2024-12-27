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
        source = ./42willow.gif;
        "width" = 42;
        "height" = 18;
        "padding" = {
          "top" = 1;
          "left" = 2;
        };
      };
      display = {
        separator = "";
      };
      modules = [
        {
          "type" = "custom";
          "format" = "╔══════════════════════════════════════════════════════╗";
        }
        {
          "type" = "os";
          "key" = "  󱄅  OS        ║";
          "format" = " {3}";
        }
        {
          "type" = "kernel";
          "key" = "    Kernel    ║ ";
          "format" = "{1} {2}";
        }
        {
          "type" = "uptime";
          "key" = "    Uptime    ║ ";
          "format" = "{2} hours; {3} mins";
        }

        {
          "type" = "packages";
          "key" = "  󰏗  Packages  ║ ";
          "format" = "{2} (pacman){?3}[{3}]{?}";
        }
        {
          "type" = "shell";
          "key" = "    Shell     ║ ";
          "format" = "{6}";
        }
        {
          "type" = "terminal";
          "key" = "    Terminal  ║ ";
          "format" = "{5}";
        }
        {
          "type" = "custom";
          "format" = "╚══════════════════════════════════════════════════════╝";
        }
        "break"
        {
          "type" = "colors";
          # "paddingLeft" = 20;
          "symbol" = "circle";
        }
        "break"
        {
          "type" = "custom";
          "format" = "╔══════════════════════════════════════════════════════╗";
        }
        {
          "type" = "display";
          "key" = "  󰍹  Display   ║ ";
          "format" = "{1}x{2}";
        }
        {
          "type" = "cpu";
          "key" = "    CPU       ║ ";
          "format" = "{1}";
        }
        {
          "type" = "gpu";
          "key" = "  󰊴  GPU       ║ ";
          "format" = "{2}";
        }
        {
          "type" = "memory";
          "key" = "    Memory    ║ ";
          "format" = "{1} / {2} ({3})";
        }
        {
          "type" = "custom";
          "format" = "╚══════════════════════════════════════════════════════╝";
        }
      ];
      # modules = [
      #   {
      #     type = "colors";
      #     symbol = "circle";
      #   }
      #   {
      #     type = "os";
      #   }
      #   {
      #     type = "kernel";
      #   }
      #   {
      #     type = "packages";
      #   }
      #   {
      #     type = "shell";
      #   }
      #   "separator"
      #   {
      #     type = "wm";
      #   }
      #   {
      #     type = "theme";
      #   }
      #   {
      #     type = "font";
      #   }
      #   {
      #     type = "terminal";
      #   }
      #   "separator"
      #   {
      #     type = "cpu";
      #   }
      #   {
      #     type = "gpu";
      #   }
      #   {
      #     type = "memory";
      #   }
      #   "separator"
      #   {
      #     type = "uptime";
      #   }
      #   "separator"
      #   "player"
      #   "media"
      # ];
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
