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

    inputs.ro-nur.packages.${pkgs.system}.amethyst-mod-manager

    # inputs.hytale-launcher.packages.${pkgs.system}.default
  ];

  programs.steam.protontricks.enable = true;

  services.wivrn.enable = true;
  services.wivrn.highPriority = true;
  services.wivrn.autoStart = true;
  services.wivrn.steam.importOXRRuntimes = true;
}
