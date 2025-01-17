{ inputs, pkgs, ... }:
{
  imports = [
    inputs.aagl.nixosModules.default
  ];
  
  
  
  environment.systemPackages = with pkgs; [
    
    nexusmods-app-unfree
    lutris
    heroic
    emulationstation-de
    ryujinx
    shadps4
    (pkgs.callPackage ./vita3k.nix { })
  ];
  
  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;
  
  nix.settings = inputs.aagl.nixConfig;
}
