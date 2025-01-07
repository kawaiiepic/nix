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
    xivlauncher
  ];
  
  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;
  
  nix.settings = inputs.aagl.nixConfig;
}
