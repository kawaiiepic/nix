{pkgs, inputs, ...}:{
  
  programs.zed-editor = {
    enable = true;
    # package = pkgs.zed-editor.fhsWithPackages (pkgs: [ pkgs.zlib ]);
    extraPackages = with pkgs; [
      alejandra
      nixfmt
      kdePackages.qt5compat
    ];
    extensions = [
      "nix"
      #"discord-presence"
      "scss"
      "dart"
      "wakatime"
      "catppuccin"
      "kotlin"
      "lua"
      "catppuccin-icons"
      "qml"
    ];
    userSettings = {
      autosave = {
        after_delay = {
          milliseconds = 1000;
        };
      };

      load_direnv = "direct";

      icon_theme = "Catppuccin Mocha";

      theme = {
        mode = "dark";
        light = "One Light";
        dark = "Catppuccin Macchiato";
      };

      lsp = {
        qml = {
          binary = {
            arguments = ["-E"];
          };
        };
        
        kotlin-language-server = {
          binary = {
            path = "${pkgs.kotlin-language-server}/bin/kotlin-language-server";
          };
        };

        rust-analyzer = {
          binary = {
            path_lookup = true;
          };
        };

        wakatime-ls = {
          binary = {
            path_lookup = true;
          };
        };

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
              suppress = ["sema-extra-with"];
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
        Kotlin = {
          language_servers = ["kotlin-language-server"];
        };
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
}
