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
    # steam-rom-manager
    # mangohud
    protonplus
    prismlauncher
    ryubing
    #lutris
    # xivlauncher
    steamtinkerlaunch
    
     inputs.hytale-launcher.packages.${pkgs.system}.default
  ];
  
  programs.steam.protontricks.enable = true;
}
