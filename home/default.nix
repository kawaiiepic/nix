{
  pkgs,
  inputs,
  ...
}:
{
  imports = [
    # ./hyprland
    ./software
    ./shell
    ./theme
    ./games
    ./desktop/niri
    ./services/pfp
    ./services/hyprlock.nix
    ./services/wlogout.nix
    # ./services/stasis
  ];

  home.username = "mia";
  home.homeDirectory = "/home/mia";

  programs.home-manager.enable = true;

  home.packages = with pkgs; [
  ];

  programs.zed-editor = {
    enable = true;
    # package = pkgs.zed-editor.fhsWithPackages (pkgs: [ pkgs.zlib ]);
    extraPackages = with pkgs; [
      alejandra
      nixfmt-rfc-style
    ];
    extensions = [
      "nix"
      "discord-presence"
      "scss"
      "dart"
      "wakatime"
      "catppuccin"
      "lua"
      "catppuccin-icons"
    ];
    userSettings = {
      autosave = {
        after_delay = {
          milliseconds = 1000;
        };
      };

      icon_theme = "Catppuccin Mocha";

      theme = {
        mode = "dark";
        light = "One Light";
        dark = "Catppuccin Macchiato";
      };

      lsp = {
        nixd = {
          initialization_options = {
            formatting = {
              command = [
                "alejandra"
                "--quiet"
                "--"
              ];
            };
          };
          binary = {
            path = "${pkgs.nixd}/bin/nixd";
          };
          settings = {
            diagnostic = {
              suppress = [ "sema-extra-with" ];
            };
          };
        };

        dart = {
          binary = {
            path = "${pkgs.dart}/bin/dart";
            arguments = [
              "language-server"
              "--protocol=lsp"
            ];
          };
        };

        nix = {
          binary = {
            path_lookup = true;
          };
        };

        discord_presence = {
          initialization_options = {
            idle = {
              timeout = 600;
              action = "clear_activity";
            };

            git_integration = true;
          };
        };
      };

      languages = {
        Nix = {
          formatter = {
            external = {
              command = "alejandra";
              arguments = ["--quiet" "--"];
            };
          };
          language_servers = [
            "nixd"
            "!nil"
          ];
        };
      };

      ui_font_size = 16;
      buffer_font_size = 16;
      buffer_font_family = "UbuntuSansMono Nerd Font Mono";
    };
  };

  # The state version is required and should stay at the version you
  # originally installed.
  home.stateVersion = "24.05";
}
