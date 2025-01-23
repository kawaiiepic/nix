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
  ];

  home.packages = with pkgs; [
    inputs.zen-browser.packages.${system}.default
    (callPackage ./wvkbd.nix { })
    stremio
  ];

}
