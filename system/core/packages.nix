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
    
    androidenv.androidPkgs.platform-tools
    
  ];
  
  programs.nix-ld.enable = true;

  virtualisation = {
  containers.enable = true;
  podman = {
    enable = true;
    dockerCompat = true;
    defaultNetwork.settings.dns_enabled = true;
  };
};

}
