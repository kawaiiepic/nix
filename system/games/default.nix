{
  inputs,
  pkgs,
  pkgs-master,
  amethyst-nixpkgs,
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

    amethyst-nixpkgs.amethyst-mod-manager

    # inputs.hytale-launcher.packages.${pkgs.system}.default
  ];

  programs.steam.protontricks.enable = true;

  services.syncthing = {
    enable = true;
    openDefaultPorts = true; # Open ports in the firewall for Syncthing. (NOTE: this will not open syncthing gui port)
    user = "mia";
    group = "users";
    dataDir = "/home/mia";
    configDir = "/home/mia/.config/syncthing";
  };

  services.wivrn.enable = true;
  services.wivrn.highPriority = true;
  services.wivrn.autoStart = true;
  services.wivrn.steam.importOXRRuntimes = true;
}
