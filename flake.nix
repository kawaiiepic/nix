{
  description = "Mia's Ultimate Setup";

  inputs = {
    nixos-hardware = {
      url = "github:NixOS/nixos-hardware";
    };
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };
    jovian-nixos = {
      url = "github:Jovian-Experiments/Jovian-NixOS";
    };
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    aagl = {
      url = "github:ezKEa/aagl-gtk-on-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:Aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    spicetify-nix = {
      url = "github:Gerg-L/spicetify-nix";
    };
    hyprfocus = {
      url = "github:avih7531/hyprfocus";
    };

    lanzaboote = {
      url = "github:nix-community/lanzaboote/v1.0.0";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixos-cosmic.url = "github:lilyinstarlight/nixos-cosmic";
    nix-vscode-extensions.url = "github:nix-community/nix-vscode-extensions";
    catppuccin-vsc.url = "https://flakehub.com/f/catppuccin/vscode/*.tar.gz";
    nix-cachyos-kernel.url = "github:xddxdd/nix-cachyos-kernel/release";
    hytale-launcher.url = "github:JPyke3/hytale-launcher-nix";
    zen-browser = {
      url = "github:0xc000022070/zen-browser-flake";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.home-manager.follows = "home-manager";
    };

    nixcord = {
      url = "github:FlameFlag/nixcord";
    };

    niri = {
      url = "github:sodiboo/niri-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    qml-niri = {
      url = "github:imiric/qml-niri/main";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.quickshell.follows = "quickshell";
    };

    nix-openclaw.url = "github:openclaw/nix-openclaw";

    noctalia = {
      url = "github:noctalia-dev/noctalia-shell";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    helium-browser = {
      url = "github:ominit/helium-browser-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    quickshell = {
      url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    stasis.url = "github:saltnpepper97/stasis";

    millennium = {
      url = "git+https://github.com/yipfluoric/Millennium?dir=packages/nix";

      inputs = {
        nixpkgs.follows = "nixpkgs";
        millennium-src.url = "github:SteamClientHomebrew/Millennium/1bc62c94a06f25f7e8d7e269f11cd968cf576bff";
        zlib-src.url = "github:zlib-ng/zlib-ng/2.2.5";
        luajit-src.url = "github:SteamClientHomebrew/LuaJIT/v2.1";
        luajson-src.url = "github:SteamClientHomebrew/LuaJSON/0c1fabf07c42f3907287d1e4f729e0620c1fe6fd";
        minhook-src.url = "github:TsudaKageyu/minhook/v1.3.4";
        mini-src.url = "github:metayeti/mINI/0.9.18";
        websocketpp-src.url = "github:zaphoyd/websocketpp/0.8.2";
        fmt-src.url = "github:fmtlib/fmt/12.0.0";
        json-src.url = "github:nlohmann/json/v3.12.0";
        libgit2-src.url = "github:libgit2/libgit2/v1.9.1";
        minizip-src.url = "github:zlib-ng/minizip-ng/4.0.10";
        curl-src.url = "github:curl/curl/curl-8_13_0";
        incbin-src.url = "github:graphitemaster/incbin/22061f51fe9f2f35f061f85c2b217b55dd75310d";
        asio-src.url = "github:chriskohlhoff/asio/asio-1-30-0";
      };
    };

    airi = {
      url = "github:moeru-ai/airi";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs: let
    system = "x86_64-linux";
    overlays = [(import ./system/packages/overlay.nix)];
    pkgs = import inputs.nixpkgs {
      system = "x86_64-linux";
      overlays = overlays;
    };

    ignoreme = {
      config,
      lib,
      ...
    }:
      with lib; {
        system.nixos.revision = mkForce null;
        system.nixos.versionSuffix = mkForce "pre-git";
      };
  in {
    packages.${system}.zen-theme-switch = pkgs.zen-theme-switch;

    nixosConfigurations = {
      dreamhouse = inputs.nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          inputs.lanzaboote.nixosModules.lanzaboote
          inputs.home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};

            home-manager.users.mia = import ./home;
          }
          ./systems/dreamhouse/config.nix
        ];
        specialArgs = {inherit inputs;};
      };

      lain = inputs.nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          inputs.lanzaboote.nixosModules.lanzaboote
          inputs.home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};

            home-manager.users.mia = import ./home;
          }
          ./systems/lain/config.nix
        ];
        specialArgs = {inherit inputs;};
      };

      macbook = inputs.nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          inputs.nixos-hardware.nixosModules.apple-t2
          inputs.home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};

            home-manager.users.mia = import ./home/profiles/macbook;
          }
          ./systems/macbook/config.nix
        ];
        specialArgs = {inherit inputs;};
      };

      binarybarbie = inputs.nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          inputs.home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};

            home-manager.users.mia = import ./home/server.nix;
          }
          ./systems/binarybarbie/config.nix
        ];
        specialArgs = {inherit inputs;};
      };

      steamdeck = inputs.nixpkgs.lib.nixosSystem {
        # pkgs = inputs.nixpkgs.legacyPackages.x86_64-linux ;
        # nixpkgs.config = {allowUnfree=true;};
        system = "x86_64-linux";
        modules = [
          inputs.jovian-nixos.nixosModules.default
          inputs.home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};

            home-manager.users.mia = import ./home;
          }
          ./systems/steamdeck/config.nix
        ];
        specialArgs = {inherit inputs;};
      };
    };
  };
}
