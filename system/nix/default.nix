{ pkgs, ... }:
{

  environment.systemPackages = [ pkgs.git ];

  documentation.nixos.enable = false;

  # Remove xterm
  services.xserver.excludePackages = with pkgs; [ xterm ];

  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.rocmSupport = true;
  nixpkgs.config.permittedInsecurePackages = [
    "freeimage-unstable-2021-11-01"
  ];
  programs.nh = {
    enable = true;
    # weekly cleanup
    clean = {
      enable = true;
      extraArgs = "--keep-since 4d --keep 3";
    };
  };

  nix.settings = {
    auto-optimise-store = true;
    experimental-features = [
      "nix-command"
      "flakes"
    ];
    substituters = [
      # high priority since it's almost always used
      "https://cache.nixos.org?priority=10"
      "https://fufexan.cachix.org"
      "https://helix.cachix.org"
      "https://hyprland.cachix.org"
      "https://nix-community.cachix.org"
      "https://ezkea.cachix.org"
      "https://t2linux.cachix.org"
      "https://miathetrain.cachix.org"
      "https://cache.soopy.moe"
      "https://cache.lix.systems"
    ];

    trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "fufexan.cachix.org-1:LwCDjCJNJQf5XD2BV+yamQIMZfcKWR9ISIFy5curUsY="
      "helix.cachix.org-1:ejp9KQpR1FBI2onstMQ34yogDm4OgU2ru6lIwPvuCVs="
      "hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
      "ezkea.cachix.org-1:ioBmUbJTZIKsHmWWXPe1FSFbeVe+afhfgqgTSNd34eI="
      "t2linux.cachix.org-1:P733c5Gt1qTcxsm+Bae0renWnT8OLs0u9+yfaK2Bejw="
      "miathetrain.cachix.org-1:YnISmBIljKxDFkswh1GbvQFx3gN+7jfGFcgEPz635W8="
      "cache.soopy.moe-1:0RZVsQeR+GOh0VQI9rvnHz55nVXkFardDqfm4+afjPo="
      "cache.lix.systems:aBnZUw8zA7H35Cz2RyKFVs3H4PlGTLawyY5KRbvJR8o="
    ];
  };
}
