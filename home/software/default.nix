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
  ];

  home.packages = with pkgs; [
    inputs.zen-browser.packages.${system}.default
    (callPackage ./wvkbd.nix { })
    stremio
  ];

}
