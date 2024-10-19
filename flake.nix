{
  description = "An example NixOS configuration";

  inputs = {
    nixpkgs = {url = "github:nixos/nixpkgs/nixos-unstable";};
    nur = {url = "github:nix-community/NUR";};
    jovian-nixos = {url = "github:Jovian-Experiments/Jovian-NixOS";};
    home-manager = {url = "github:nix-community/home-manager";};
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
          inputs.jovian-nixos.nixosModules.default
          inputs.home-manager.nixosModules.default
          ./configuration.nix
        ];
        specialArgs = {inherit inputs;};
      };
    };
  };
}
