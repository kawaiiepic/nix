{
  config,
  lib,
  inputs,
  pkgs,
  ...
}:
{
  imports = [
    inputs.nixos-hardware.nixosModules.common-pc-ssd
    inputs.nixos-hardware.nixosModules.common-gpu-amd
    inputs.nixos-hardware.nixosModules.common-cpu-amd-pstate
    inputs.nixos-hardware.nixosModules.common-cpu-amd-zenpower

    ./hardware.nix
    # ../default.nix

    ../../system/core/boot/plymouth.nix

    ../../system/core/audio.nix
    ../../system/core/boot.nix
    ../../system/core/fonts.nix
    #../../system/core/graphics.nix
    ../../system/core/network.nix
    ../../system/core/packages.nix
    ../../system/core/shell.nix
    ../../system/core/users.nix

    #../../system/desktop/greetd.nix
    # ../../system/desktop/hyprland.nix
    # ../../system/desktop/gnome.nix

    ../../system/desktop/niri.nix

    # ../../modules/gpu-screen-recorder-ui.nix

    ../../system/games

    ../../system/nix
  ];

  networking.hostName = "steamdeck";

  # programs.gsr.enable = true;

  jovian = {
    hardware.has.amd.gpu = true;
    steam.enable = true;
    steam.user = "mia";

    decky-loader.enable = true;
    decky-loader.user = "mia";

    devices.steamdeck = {
      enable = true;
      autoUpdate = true;
    };
  };

  services = {
    desktopManager.plasma6.enable = true;

    # displayManager.sddm.enable = true;

    # displayManager.sddm.wayland.enable = true;
  };

  # environment.systemPackages = with pkgs;
  #   [
  #     # KDE
  #     kdePackages.discover # Optional: Install if you use Flatpak or fwupd firmware update sevice
  #     kdePackages.kcalc # Calculator
  #     kdePackages.kcharselect # Tool to select and copy special characters from all installed fonts
  #     kdePackages.kclock # Clock app
  #     kdePackages.kcolorchooser # A small utility to select a color
  #     kdePackages.kolourpaint # Easy-to-use paint program
  #     kdePackages.ksystemlog # KDE SystemLog Application
  #     kdePackages.sddm-kcm # Configuration module for SDDM
  #     kdiff3 # Compares and merges 2 or 3 files or directories
  #     kdePackages.isoimagewriter # Optional: Program to write hybrid ISO files onto USB disks
  #     kdePackages.partitionmanager # Optional: Manage the disk devices, partitions and file systems on your computer
  #     # Non-KDE graphical packages
  #     hardinfo2 # System information and benchmarks for Linux systems
  #     vlc # Cross-platform media player and streaming server
  #     wayland-utils # Wayland utilities
  #     wl-clipboard # Command-line copy/paste utilities for Wayland
  #   ];

  jovian.steam.autoStart = true;
  jovian.steam.desktopSession = "plasma";
}
