{ pkgs, inputs, ... }:
{
  imports = [
    ./kitty
    ./vesktop
    ./discord
    ./obs
    ./spotify
    ./vscode
    ./helix
    ./nextcloud.nix
    ./gopass.nix
  ];

  home.packages = with pkgs; [
    inputs.zen-browser.packages.${system}.default
    (callPackage ./wvkbd.nix { })
    (callPackage ./nyaashows { })
    # (pkgs.electrum-ltc.overrideAttrs (
    #   finalAttrs: previousAttrs: {
    #     propagatedBuildInputs = previousAttrs.propagatedBuildInputs ++ [ python3.pkgs.distutils ];
    #   }
    # ))
    stremio
  ];

}
