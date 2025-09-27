{ pkgs, ... }:
{
  imports = [
    ./starship.nix
  ];

  home.packages = with pkgs; [
    eza
    # fzf
    # fd
    # bat
    btop
    nushell
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

  programs = {
    nushell = {
      enable = true;
      shellAliases = {
        vi = "hx";
        vim = "hx";
        nano = "hx";
      };
    };
    
    carapace.enable = true;
    carapace.enableNushellIntegration = true;

    starship = {
      enable = true;
      settings = {
        add_newline = true;
        character = {
          success_symbol = "[➜](bold green)";
          error_symbol = "[➜](bold red)";
        };
      };
    };
  };
}
