{ inputs, pkgs, ... }:
{
  imports = [
    inputs.aagl.nixosModules.default
  ];

  programs.steam.extest.enable = true;

  environment.systemPackages = with pkgs; [
    protontricks
    nexusmods-app-unfree
    lutris
    heroic
    #emulationstation-de
    steam-rom-manager
    mangohud
    prismlauncher
    ryujinx
    xivlauncher
    shadps4
    (pkgs.callPackage ./vita3k.nix { })
    (pkgs.steamtinkerlaunch.overrideAttrs  {
      src = fetchFromGitHub {
        owner = "sonic2kk";
        repo = "steamtinkerlaunch";
        rev = "89af3c89e8bad3b9eb4c07f09796e34ad57c7492";
        hash = "sha256-M1v5rt19Z2UPyPaGaddw7VpV8W678NbxoIzCHD0b0Ug=";
      };
    })
  ];

  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;

  nix.settings = inputs.aagl.nixConfig;
}
