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
    inputs.zen-browser.packages.${system}.twilight
    (callPackage ./wvkbd.nix { })
    (callPackage ./vicinae.nix { })
    (callPackage ./nyaashows { })
    stremio
    mpv
    wootility
  ];
  
  

}
