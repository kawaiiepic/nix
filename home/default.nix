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
    ./desktop/niri.nix
    ./services/pfp
    ./services/hyprlock.nix
  ];
  
  home.packages = [
    # (pkgs.rustPlatform.buildRustPackage rec {
    #   pname = "discord-presence-lsp";
    #   version = "b5c89758c0564814fd70fc704f5347e5feaa20a3";
    #   cargoHash = "sha256-H6elDMyS2b4aRpEkVLwCCsagIEtbPIv+h3tqun4+Eo8=";
    
    #   src = pkgs.fetchFromGitHub {
    #     owner = "xhyrom";
    #     repo = "zed-discord-presence";
    #     rev = version;
    #     hash = "sha256-auPTrBWmNW3EKQ51O8WXmpBt5Taaijo9c+hT++MuCMs=";
    #   };
    
    #   cargoBuildFlags = "--package discord-presence-lsp";
    # })
    inputs.tsutsumi.packages.${pkgs.system}.wakatime-ls
  ];

  programs.zed-editor = {
    enable = true;
    # package = pkgs.zed-editor.fhsWithPackages (pkgs: [ pkgs.zlib ]);
    extraPackages = with pkgs; [
      nixfmt-rfc-style
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
