{
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    ./hardware.nix
    ../default.nix
    #../../system/desktop/gdm.nix
    #../../system/desktop/gnome.nix

    ../../system/desktop/greetd.nix
    ../../system/desktop/niri.nix

    inputs.nixos-hardware.nixosModules.common-pc-ssd
  ];

  networking.hostName = "macbook";

  environment.systemPackages = with pkgs; [

  ];

  system.stateVersion = "23.11"; # Did you read the comment?
}
