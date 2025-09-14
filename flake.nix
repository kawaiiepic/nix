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
    tsutsumi = {
      url = "github:Fuwn/tsutsumi";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    lanzaboote = {
      url = "github:nix-community/lanzaboote/v0.4.2";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixos-cosmic.url = "github:lilyinstarlight/nixos-cosmic";
    nix-vscode-extensions.url = "github:nix-community/nix-vscode-extensions";
    catppuccin-vsc.url = "https://flakehub.com/f/catppuccin/vscode/*.tar.gz";
    chaotic.url = "github:chaotic-cx/nyx/nyxpkgs-unstable";
    zen-browser = {
      url = "github:0xc000022070/zen-browser-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nixcord = {
      url = "github:kaylorben/nixcord";
    };
    
    niri = {
      url = "github:sodiboo/niri-flake";
    };
  };

  outputs =
    inputs:
    let
      ignoreme =
        {
          config,
          lib,
          ...
        }:
        with lib;
        {
          system.nixos.revision = mkForce null;
          system.nixos.versionSuffix = mkForce "pre-git";
        };
    in
    {
      nixosConfigurations = {
        dreamhouse = inputs.nixpkgs.lib.nixosSystem {
          system = "x86_64-linux";
          modules = [
            inputs.chaotic.nixosModules.default
            inputs.lanzaboote.nixosModules.lanzaboote
            inputs.home-manager.nixosModules.home-manager
            {
              home-manager.useGlobalPkgs = true;
              home-manager.useUserPackages = true;
              home-manager.extraSpecialArgs = { inherit inputs; };

              home-manager.users.mia = import ./home;
            }
            ./systems/dreamhouse/config.nix
          ];
          specialArgs = { inherit inputs; };
        };
        
        binarybarbie = inputs.nixpkgs.lib.nixosSystem {
          system = "x86_64-linux";
          modules = [
            inputs.chaotic.nixosModules.default
            inputs.home-manager.nixosModules.home-manager
            {
              home-manager.useGlobalPkgs = true;
              home-manager.useUserPackages = true;
              home-manager.extraSpecialArgs = { inherit inputs; };

              home-manager.users.mia = import ./home/server.nix;
            }
            ./systems/binarybarbie/config.nix
          ];
          specialArgs = { inherit inputs; };
        };

        steamdeck = inputs.nixpkgs.lib.nixosSystem {
          # pkgs = inputs.nixpkgs.legacyPackages.x86_64-linux ;
          # nixpkgs.config = {allowUnfree=true;};
          system = "x86_64-linux";
          modules = [
            inputs.chaotic.nixosModules.default
            inputs.jovian-nixos.nixosModules.default
            inputs.home-manager.nixosModules.home-manager
            {
              home-manager.useGlobalPkgs = true;
              home-manager.useUserPackages = true;
              home-manager.extraSpecialArgs = { inherit inputs; };

              home-manager.users.mia = import ./home;
            }
            ./systems/steamdeck/config.nix
          ];
          specialArgs = { inherit inputs; };
        };
      };
    };
}
