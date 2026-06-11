{
  inputs,
  pkgs,
  ...
}: {
  imports = [
    ./hardware.nix
    ../default.nix
    ./storage.nix
    ../../system/desktop/greetd.nix
    ../../system/desktop/niri.nix
    ../../system/core/graphics.nix

    ../../modules/gpu-screen-recorder-ui.nix

    ../../system/games

    inputs.nixos-hardware.nixosModules.common-pc-ssd
    inputs.nixos-hardware.nixosModules.common-gpu-amd
    inputs.nixos-hardware.nixosModules.common-cpu-amd-pstate
    inputs.nixos-hardware.nixosModules.common-cpu-amd-zenpower
  ];

  # nixpkgs.overlays = [inputs.millennium.overlays.default];

  programs.gpu-screen-recorder-ui.enable = true;

  networking.hostName = "dreamhouse";

  hardware.opentabletdriver.enable = true;

  services.usbmuxd = {
    enable = false;
    # package = pkgs.usbmuxd2;
  };

  environment.systemPackages = with pkgs; [
    libimobiledevice
    usbmuxd2
  ];

  services.ollama = {
    enable = false;
    package = pkgs.ollama-rocm;
    environmentVariables = {
      OLLAMA_ORIGINS = "*";
      OLLAMA_HOST = "0.0.0.0"; # used to be necessary, but doesn't seem to anymore
    };
  };

  programs.steam = {
    enable = true;
    remotePlay.openFirewall = true; # Open ports in the firewall for Steam Remote Play
    dedicatedServer.openFirewall = true; # Open ports in the firewall for Source Dedicated Server
    localNetworkGameTransfers.openFirewall = true; # Open ports in the firewall for Steam Local Network Game Transfers
    # package = pkgs.millennium-steam;
  };

  system.stateVersion = "23.11"; # Did you read the comment?
}
