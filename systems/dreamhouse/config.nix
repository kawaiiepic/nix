# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).
{
  config,
  lib,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    # ../../system/desktop/greetd.nix
    ./hardware.nix
    ../default.nix
    ./storage.nix
    ../../system/desktop/greetd.nix
    ../../system/desktop/hyprland.nix

    inputs.nixos-hardware.nixosModules.common-pc-ssd
    inputs.nixos-hardware.nixosModules.common-gpu-amd
    inputs.nixos-hardware.nixosModules.common-cpu-amd-pstate
    inputs.nixos-hardware.nixosModules.common-cpu-amd-zenpower
  ];

  networking.hostName = "dreamhouse";

  hardware.opentabletdriver.enable = true;

  # hardware.i2c.enable = true;
  
  # hardware.wooting.enable = true;

  # boot.extraModulePackages = [ config.boot.kernelPackages.ddcci-driver ];
  # boot.kernelModules = [
  #   "i2c-dev"
  #   "ddcci_backlight"
  # ];

  hardware = {
    graphics = {
      enable = true;
      enable32Bit = true;
      extraPackages = with pkgs; [
        libvdpau-va-gl
      ];
    };

    # amdgpu.amdvlk = {
    #   enable = true;
    #   support32Bit.enable = true;
    # };
  };

  environment.systemPackages = with pkgs; [
    lact
    ddcutil
  ];
  
  hardware.i2c.enable = true;
    users.users.mia.extraGroups = [ "i2c" "video" ];
    boot.extraModulePackages = [ config.boot.kernelPackages.ddcci-driver ];
    boot.kernelModules = [ "i2c-dev" "ddcci_backlight" ];
    services.udev.packages = [ pkgs.ddcutil ];
  
    services.udev.extraRules = ''
      ACTION=="add", SUBSYSTEM=="i2c-dev", ATTR{name}=="AMDGPU DM*", TAG+="ddcci", TAG+="systemd", ENV{SYSTEMD_WANTS}+="ddcci@$kernel.service"
      ACTION=="add", SUBSYSTEM=="backlight", KERNEL=="ddcci*", RUN+="${pkgs.coreutils-full}/bin/chgrp video /sys/class/backlight/%k/brightness"
      ACTION=="add", SUBSYSTEM=="backlight", KERNEL=="ddcci*", RUN+="${pkgs.coreutils-full}/bin/chmod a+w /sys/class/backlight/%k/brightness"
    '';
  
    systemd.services."ddcci@" = {
      scriptArgs = "%i";
      script = ''
        echo Trying to attach ddcci to $1
        id=$(echo $1 | cut -d "-" -f 2)
        counter=5
        while [ $counter -gt 0 ]; do
          if ${pkgs.ddcutil}/bin/ddcutil getvcp 10 -b $id; then
            echo ddcci 0x37 > /sys/bus/i2c/devices/$1/new_device
            echo Successfully attached ddcci to $1
            break
          fi
          sleep 1
          counter=$((counter - 1))
        done
      '';
      serviceConfig.Type = "oneshot";
    };
    
  systemd.packages = with pkgs; [ lact ];
  systemd.services.lactd.wantedBy = [ "multi-user.target" ];

  programs.steam = {
    enable = true;
    remotePlay.openFirewall = true; # Open ports in the firewall for Steam Remote Play
    dedicatedServer.openFirewall = true; # Open ports in the firewall for Source Dedicated Server
    localNetworkGameTransfers.openFirewall = true; # Open ports in the firewall for Steam Local Network Game Transfers
  };

  system.stateVersion = "23.11"; # Did you read the comment?
}
