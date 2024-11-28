{
  description = "An example NixOS configuration";

  inputs = {
    nixpkgs = {url = "github:nixos/nixpkgs/nixos-unstable";};
    jovian-nixos = {url = "github:Jovian-Experiments/Jovian-NixOS";};
    home-manager = {url = "github:nix-community/home-manager"; inputs.nixpkgs.follows = "nixpkgs";};
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
    zen-browser.url = "github:matthewpi/nixpkgs/zen-browser";
    lix-module = {
          url = "https://git.lix.systems/lix-project/nixos-module/archive/2.91.1-1.tar.gz";
          inputs.nixpkgs.follows = "nixpkgs";
        };
        inputs.nixcord = {
            url = "github:kaylorben/nixcord";
          };
  };

  outputs = inputs:
  /*
  ignore::
  */
  let
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
    nixosConfigurations = {
      dreamhouse = inputs.nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          inputs.chaotic.nixosModules.default
          inputs.jovian-nixos.nixosModules.default
          inputs.lix-module.nixosModules.default
          inputs.home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
            home-manager.extraSpecialArgs = {inherit inputs;};

            home-manager.users.mia = import ./home;
          }
          ./configuration.nix
        ];
        specialArgs = {inherit inputs;};
      };
    };
  };
}
