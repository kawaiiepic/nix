{
  inputs,
  pkgs,
  pkgs-master,
  ...
}: {
  imports = [
    inputs.aagl.nixosModules.default
  ];

  environment.systemPackages = with pkgs; [
    protontricks
    lutris
    steam-rom-manager

    pkgs-master.shadps4-qtlauncher
    (pkgs.callPackage ./vita3k.nix {})
    protonplus
    prismlauncher
    ryubing-appimage
    ludusavi
    heroic

    inputs.hytale-launcher.packages.${pkgs.system}.default
  ];

  programs.steam.protontricks.enable = true;
}
