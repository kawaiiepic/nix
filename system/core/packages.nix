{ pkgs, ... }:
{

  services.flatpak.enable = true;

  environment.systemPackages = with pkgs; [
    wget
    unrar
    file
    devenv
    zip
    unzip
    winboat
    podman-compose
  ];

  virtualisation = {
  containers.enable = true;
  podman = {
    enable = true;
    dockerCompat = true;
    defaultNetwork.settings.dns_enabled = true;
  };
};

}
