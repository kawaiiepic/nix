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
    inputs.aagl.nixosModules.default
    ./hardware-configuration.nix
    ./greetd.nix
  ];

  # Use the systemd-boot EFI boot loader.
  boot.kernelPackages = pkgs.linuxPackages_cachyos;
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # virtualisation.docker.enable = true;
  # virtualisation.docker.storageDriver = "btrfs";

  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment this
    #jack.enable = true;
  };

  # services.scx = {
  #       enable = true;
  #       scheduler = "scx_rustland";
  #     };

  networking.firewall.enable = false;

  environment.sessionVariables.NIXOS_OZONE_WL = "1";

  hardware.graphics = {
    enable = true;
    enable32Bit = true;
  };

  chaotic.mesa-git = {
    # TODO: Move to Gaming.
    enable = true;
    #fallbackSpecialisation = false;

    extraPackages = with pkgs; [ mesa_git.opencl ];
  };

  # programs.steam = {
  #   enable = true;
  #   gamescopeSession.enable = true;
  #   remotePlay.openFirewall = true; # Open ports in the firewall for Steam Remote Play
  #   dedicatedServer.openFirewall = true; # Open ports in the firewall for Source Dedicated Server
  #   localNetworkGameTransfers.openFirewall = true; # Open ports in the firewall for Steam Local Network Game Transfers
  # };

  # programs = {
  #   gamescope = {
  #     enable = true;
  #     capSysNice = true;
  #     args = ["-"];
  #   };
  # };

  programs.honkers-railway-launcher.enable = true;
  programs.wavey-launcher.enable = true;
  programs.sleepy-launcher.enable = true;

  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [
    "nix-command"
    "flakes"
  ];
  networking.hostName = "dreamhouse"; # Define your hostname.
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  networking.networkmanager.enable = true; # Easiest to use and most distros use this by default.

  # Set your time zone.
  time.timeZone = "America/Detroit";

  services.flatpak.enable = true;

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  # i18n.defaultLocale = "en_US.UTF-8";
  # console = {
  #   font = "Lat2-Terminus16";
  #   keyMap = "us";
  #   useXkbConfig = true; # use xkb.options in tty.
  # };

  # Enable the X11 windowing system.
  services.xserver.enable = true;

  # hardware.wooting.enable = true;

  services.gvfs = {
    enable = true;
  };

  # Enable the GNOME Desktop Environment.
  #  services.xserver.displayManager.gdm.enable = true;
  #  services.xserver.desktopManager.gnome.enable = true;
  # services.displayManager.sddm.enable = true;

  # Configure keymap in X11
  # services.xserver.xkb.layout = "us";
  # services.xserver.xkb.options = "eurosign:e,caps:escape";

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # sound.enable = true;
  # hardware.pulseaudio.enable = true;

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.mia = {
    isNormalUser = true;
    extraGroups = [
      "wheel"
      "input"
      "docker"
    ]; # Enable ‘sudo’ for the user.
    packages = with pkgs; [
      helix
    ];
  };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    wget
    git
    alejandra
    unrar
    wineWowPackages.staging
    jq
    zenity
    mangohud
    rclone
    toybox
    playerctl
    clang-tools
    # scx
    latencyflex-vulkan
    openssl_3
    tessen
    gthumb
    nexusmods-app-unfree
    # inputs.zen-browser.legacyPackages.${system}.zen-browser
  ];

  zramSwap.enable = true;

  security.sudo.wheelNeedsPassword = false;

  fonts = {
    enableDefaultPackages = true;

    fontconfig = {
      defaultFonts = {
        sansSerif = [ "UbuntuSans Nerd Font" ];
        monospace = [ "UbuntuSansMono Nerd Font" ];
      };
    };
    packages = with pkgs; [
      # icon fonts
      material-symbols
      # normal fonts
      noto-fonts
      noto-fonts-cjk-sans
      noto-fonts-emoji

      # nerdfonts
      nerd-fonts.ubuntu-sans
      nerd-fonts.space-mono
      nerd-fonts.mononoki
      # (nerd-fonts.override {fonts = ["UbuntuSans" "SpaceMono" "Mononoki" "NerdFontsSymbolsOnly"];})
    ];
  };

  services.ananicy = {
    enable = true;
    package = pkgs.ananicy-cpp;
    rulesProvider = pkgs.ananicy-rules-cachyos;
  };

  nixpkgs.overlays = [ inputs.catppuccin-vsc.overlays.default ];

  programs.fish.enable = true;
  users.defaultUserShell = pkgs.fish;
  users.users.mia.shell = pkgs.fish;

  programs.nh = {
    enable = true;
    # weekly cleanup
    clean = {
      enable = true;
      extraArgs = "--keep-since 4d --keep 3";
    };
  };

  programs.hyprland = {
    enable = true;
  };

  hardware.bluetooth.enable = true; # enables support for Bluetooth
  hardware.bluetooth.powerOnBoot = true; # powers up the default Bluetooth controller on boot

  services.blueman.enable = true;

  programs.gnupg.agent.enable = true;

  jovian.decky-loader.enable = true;

  jovian.steam = {
    enable = true;
    user = "mia";
    desktopSession = "hyprland";
  };

  jovian.hardware.has.amd.gpu = true;
  jovian.steam.updater.splash = "jovian";

  nix.settings = {
    substituters = [ "https://ezkea.cachix.org" ];
    trusted-public-keys = [ "ezkea.cachix.org-1:ioBmUbJTZIKsHmWWXPe1FSFbeVe+afhfgqgTSNd34eI=" ];
  };

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  # services.openssh.enable = true;

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  system.stateVersion = "23.11"; # Did you read the comment?
}
