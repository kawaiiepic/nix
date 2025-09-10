{ pkgs, inputs, ... }:
{
  imports = [
    ./ags
    ./kitty
    ./vesktop
    ./discord
    ./obs
    ./spotify
    ./vscode
    ./helix
    ./nautilus
    # ./nextcloud.nix
    ./gopass.nix
  ];

  home.packages = with pkgs; [
    inputs.zen-browser.packages.${system}.twilight
    # (callPackage ./wvkbd.nix { })
    (callPackage ./vicinae.nix { })
    (callPackage ./nyaashows { })
    stremio
    godot
    wvkbd
  ];

  
  

}
