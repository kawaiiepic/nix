{
  inputs,
  config,
  lib,
  pkgs,
  ...
}:
{
  imports = [
    inputs.aagl.nixosModules.default
  ];

  programs.steam.extest.enable = true;

  boot.kernelPatches = lib.mkIf (config.networking.hostName == "dreamhouse") [
    {
      name = "amdgpu-ignore-ctx-privileges";
      patch = pkgs.fetchpatch {
        name = "cap_sys_nice_begone.patch";
        url = "https://github.com/Frogging-Family/community-patches/raw/master/linux61-tkg/cap_sys_nice_begone.mypatch";
        hash = "sha256-Y3a0+x2xvHsfLax/uwycdJf3xLxvVfkfDVqjkxNaYEo=";
      };
    }
  ];

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
    alvr
    sidequest
    (pkgs.callPackage ./vita3k.nix { })
    (pkgs.steamtinkerlaunch.overrideAttrs {
      src = fetchFromGitHub {
        owner = "sonic2kk";
        repo = "steamtinkerlaunch";
        rev = "89af3c89e8bad3b9eb4c07f09796e34ad57c7492";
        hash = "sha256-M1v5rt19Z2UPyPaGaddw7VpV8W678NbxoIzCHD0b0Ug=";
      };
    })
  ];

  programs.adb.enable = true;

  programs.envision = {
    enable = true;
    openFirewall = true; # This is set true by default
  };

  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;

  nix.settings = inputs.aagl.nixConfig;
}
