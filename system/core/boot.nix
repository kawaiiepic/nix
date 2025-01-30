{ pkgs, ... }:
{
  # Use the systemd-boot EFI boot loader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # services.scx = {
  #   enable = true;
  #   scheduler = "scx_rustland";
  # };

  time.timeZone = "America/Detroit";

  zramSwap.enable = true;

  security.sudo.wheelNeedsPassword = false;

  services.ananicy = {
    enable = true;
    package = pkgs.ananicy-cpp;
    rulesProvider = pkgs.ananicy-rules-cachyos;
  };

  hardware.bluetooth.enable = true; # enables support for Bluetooth
  hardware.bluetooth.powerOnBoot = true; # powers up the default Bluetooth controller on boot

  # services.blueman.enable = true;

  programs.gnupg.agent.enable = true;
}
