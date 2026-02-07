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
    ./services/stasis
  ];

  home.username = "mia";
  home.homeDirectory = "/home/mia";

  programs.home-manager.enable = true;

  home.packages = [
    inputs.tsutsumi.packages.${pkgs.stdenv.hostPlatform.system}.wakatime-ls
  ];

  programs.zed-editor = {
    enable = true;
    # package = pkgs.zed-editor.fhsWithPackages (pkgs: [ pkgs.zlib ]);
    extraPackages = with pkgs; [
      nixfmt
      nil
    ];
    extensions = [
      "nix"
      "discord-presence"
      "scss"
      "dart"
      "wakatime"
      # "catppuccin"
      "lua"
    ];
    userSettings = {
      autosave = {
        after_delay = {
          milliseconds = 1000;
        };
      };

      # theme = {
      #   mode = "dark";
      #   light = "One Light";
      #   dark = "Catppuccin Macchiato";
      # };

      lsp = {
        nil = {
          settings = {
            formatting = {
              command = [ "nixfmt" ];
            };
            nix = {
              flake = {
                autoArchive = true;
                autoEvalInputs = true;
              };
            };
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
          language_servers = [
            "!nixd"
            "nil"
          ];
        };
      };

      ui_font_size = 16;
      buffer_font_size = 16;
      buffer_font_family = "UbuntuSansMono Nerd Font";
    };
  };

  # The state version is required and should stay at the version you
  # originally installed.
  home.stateVersion = "24.05";
}
