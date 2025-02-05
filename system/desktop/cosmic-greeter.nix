{inputs, ...}:{
  imports = [
    inputs.nixos-cosmic.nixosModules.default
  ];
  
  services.displayManager.cosmic-greeter.enable = true;

  nix.settings = {
    substituters = [ "https://cosmic.cachix.org/" ];
    trusted-public-keys = [ "cosmic.cachix.org-1:Dya9IyXD4xdBehWjrkPv6rtxpmMdRel02smYzA85dPE=" ];
  };
}
