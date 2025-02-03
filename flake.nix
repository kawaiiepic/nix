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
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-vscode-extensions.url = "github:nix-community/nix-vscode-extensions";
    catppuccin-vsc.url = "https://flakehub.com/f/catppuccin/vscode/*.tar.gz";
    chaotic.url = "github:chaotic-cx/nyx/nyxpkgs-unstable";
    zen-browser.url = "github:0xc000022070/zen-browser-flake";
    lix-module = {
      url = "https://git.lix.systems/lix-project/nixos-module/archive/2.91.1-1.tar.gz";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixcord = {
      url = "github:kaylorben/nixcord";
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
          # pkgs = inputs.nixpkgs.legacyPackages.x86_64-linux ;
          # nixpkgs.config = {allowUnfree=true;};
          system = "x86_64-linux";
          modules = [
            inputs.chaotic.nixosModules.default
            inputs.jovian-nixos.nixosModules.default
            inputs.lix-module.nixosModules.default
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
        
        blossom = inputs.nixpkgs.lib.nixosSystem {
          # pkgs = inputs.nixpkgs.legacyPackages.x86_64-linux ;
          # nixpkgs.config = {allowUnfree=true;};
          system = "x86_64-linux";
          modules = [
            inputs.chaotic.nixosModules.default
            inputs.jovian-nixos.nixosModules.default
            inputs.lix-module.nixosModules.default
            inputs.home-manager.nixosModules.home-manager
            {
              home-manager.useGlobalPkgs = true;
              home-manager.useUserPackages = true;
              home-manager.extraSpecialArgs = { inherit inputs; };

              home-manager.users.wyntor = import ./home;
            }
            ./systems/dreamhouse/config.nix
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
            inputs.lix-module.nixosModules.default
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
