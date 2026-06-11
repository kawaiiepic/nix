{
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    inputs.aagl.nixosModules.default
  ];

  environment.systemPackages = with pkgs; [
    protontricks
    steam-rom-manager

     shadps4
     (pkgs.callPackage ./vita3k.nix { })
    protonplus
    prismlauncher
    ryubing-appimage
    ludusavi
    
     inputs.hytale-launcher.packages.${pkgs.system}.default
  ];
  
  programs.steam.protontricks.enable = true;
}
