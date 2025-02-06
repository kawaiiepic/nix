{
  pkgs,
  lib,
  ...
}:
{
  imports = [
    ./hyprland
    ./software
    ./shell
    ./theme
  ];

  xdg.enable = true;
  xdg.portal = {
    enable = true;
    xdgOpenUsePortal = true;

    extraPortals = with pkgs; [
      xdg-desktop-portal-hyprland
      xdg-desktop-portal-gtk
    ];
    configPackages = with pkgs; [ xdg-desktop-portal-hyprland xdg-desktop-portal-gtk ];
  };

  xdg.userDirs = {
    enable = true;
  };

  programs.zed-editor = {
    enable = true;
    package = pkgs.zed-editor.fhsWithPackages (pkgs: [ pkgs.zlib ]);
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
      "catppuccin"
    ];
    userSettings = {
      autosave = {
        after_delay = {
          milliseconds = 1000;
        };
      };

      theme = {
        mode = "system";
        light = "One Light";
        dark = "Catppuccin Macchiato";
      };

      lsp = {
        nil = {
          settings = {
            formatting = {
              command = [ "nixfmt" ];
            };
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
