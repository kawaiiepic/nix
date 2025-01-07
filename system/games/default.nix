{ inputs, ... }:
{
  imports = [
    inputs.aagl.nixosModules.default
  ];
  
  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;
}
