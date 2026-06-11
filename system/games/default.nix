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
    steam-rom-manager

    pkgs-master.shadps4
    pkgs-master.shadps4-qtlauncher
    (pkgs.callPackage ./vita3k.nix {})
    protonplus
    prismlauncher
    ryubing-appimage
    ludusavi

    inputs.hytale-launcher.packages.${pkgs.system}.default
  ];

  programs.steam.protontricks.enable = true;
}
