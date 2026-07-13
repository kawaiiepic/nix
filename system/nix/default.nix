{
  pkgs,
  options,
  inputs,
  lib,
  ...
}: {
  programs.git = {
    enable = true;
    lfs.enable = true;
  };

  # nix.package = pkgs.lixPackageSets.stable.lix;

  documentation.nixos.enable = false;

  # Remove xterm
  services.xserver.excludePackages = with pkgs; [xterm];

  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.rocmSupport = true;
  nixpkgs.config.permittedInsecurePackages = [
    "freeimage-unstable-2021-11-01"
    "qtwebengine-5.15.19"
  ];

  nixpkgs.overlays = [
    (
      self: super: rec {
        # https://github.com/NixOS/nixpkgs/blob/c339c066b893e5683830ba870b1ccd3bbea88ece/nixos/modules/programs/nix-ld.nix#L44
        # > We currently take all libraries from systemd and nix as the default.
        pythonldlibpath = lib.makeLibraryPath (with super; [
          zlib
          zstd
          stdenv.cc.cc
          curl
          openssl
          attr
          libssh
          bzip2
          libxml2
          acl
          libsodium
          util-linux
          xz
          systemd
        ]);
        # here we are overriding python program to add LD_LIBRARY_PATH to it's env
        python = super.stdenv.mkDerivation {
          name = "python";
          buildInputs = [super.makeWrapper];
          src = super.python311;
          installPhase = ''
            mkdir -p $out/bin
            cp -r $src/* $out/
            wrapProgram $out/bin/python3 --set LD_LIBRARY_PATH ${pythonldlibpath}
            wrapProgram $out/bin/python3.11 --set LD_LIBRARY_PATH ${pythonldlibpath}
          '';
        };
        poetry = super.stdenv.mkDerivation {
          name = "poetry";
          buildInputs = [super.makeWrapper];
          src = super.poetry;
          installPhase = ''
            mkdir -p $out/bin
            cp -r $src/* $out/
            wrapProgram $out/bin/poetry --set LD_LIBRARY_PATH ${pythonldlibpath}
          '';
        };
      }
    )
    inputs.nix-cachyos-kernel.overlays.pinned
    (import ../packages/overlay.nix)
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
      #   "https://nix-community.cachix.org"
      "https://ezkea.cachix.org"
      "https://t2linux.cachix.org"
      "https://miathetrain.cachix.org"
      # "https://cache.lix.systems"
      "https://attic.xuyh0120.win/lantian"
    ];

    trusted-users = [
      "root"
      "mia"
    ];

    trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "fufexan.cachix.org-1:LwCDjCJNJQf5XD2BV+yamQIMZfcKWR9ISIFy5curUsY="
      "helix.cachix.org-1:ejp9KQpR1FBI2onstMQ34yogDm4OgU2ru6lIwPvuCVs="
      "hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="
      #"nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
      "ezkea.cachix.org-1:ioBmUbJTZIKsHmWWXPe1FSFbeVe+afhfgqgTSNd34eI="
      "t2linux.cachix.org-1:P733c5Gt1qTcxsm+Bae0renWnT8OLs0u9+yfaK2Bejw="
      "miathetrain.cachix.org-1:YnISmBIljKxDFkswh1GbvQFx3gN+7jfGFcgEPz635W8="
      # "cache.lix.systems:aBnZUw8zA7H35Cz2RyKFVs3H4PlGTLawyY5KRbvJR8o="
      "lantian:EeAUQ+W+6r7EtwnmYjeVwx5kOGEBpjlBfPlzGlTNvHc="
    ];
  };
}
