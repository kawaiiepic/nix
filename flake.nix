{
  description = "Mia's Ultimate Setup";

  inputs = {
    nixos-hardware = {
      url = "github:NixOS/nixos-hardware";
    };
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };
    nur = {
      url = "github:nix-community/NUR";
      inputs.nixpkgs.follows = "nixpkgs";
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
    spicetify-nix = {
      url = "github:Gerg-L/spicetify-nix";
    };

    nfsm-flake = {
      url = "github:gvolpe/nfsm";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nirinit = {
      url = "github:amaanq/nirinit";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    lanzaboote = {
      url = "github:nix-community/lanzaboote/v1.0.0";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-vscode-extensions.url = "github:nix-community/nix-vscode-extensions";
    catppuccin-vsc.url = "https://flakehub.com/f/catppuccin/vscode/*.tar.gz";
    nix-cachyos-kernel.url = "github:xddxdd/nix-cachyos-kernel/release";
    hytale-launcher.url = "github:JPyke3/hytale-launcher-nix";
    snappy-switcher.url = "github:OpalAayan/snappy-switcher";
    hyprland.url = "github:hyprwm/Hyprland";
    hyprland-plugins = {
      url = "github:hyprwm/hyprland-plugins";
      inputs.hyprland.follows = "hyprland";
    };

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

    airi = {
      url = "github:moeru-ai/airi";
    };

    qml-niri = {
      url = "github:imiric/qml-niri/main";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.quickshell.follows = "quickshell";
    };

    quickshell = {
      url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    stasis.url = "github:saltnpepper97/stasis";

    millennium.url = "github:SteamClientHomebrew/Millennium?dir=packages/nix";
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
          # inputs.jovian-nixos.nixosModules.default
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
