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

  home.packages = [
    inputs.zen-browser.packages.${pkgs.system}.default
    (pkgs.callPackage ./wvkbd.nix { })
  ];

}
