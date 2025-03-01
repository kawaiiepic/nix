{ pkgs, ... }:
{
  imports = [
    ./keybinds.nix
  ];

  home.packages = [
    (pkgs.writeShellScriptBin "update-nix" ''
        if ! test -d ~/Documents/nix; then
          git clone git@github.com:kawaiiepic/nix.git ~/Documents/nix
        fi
        
        cd ~/Documents/nix
        git pull
        
        kitty --class kitty-update-nix3 nh os switch --update .
    '')
  ];
}
