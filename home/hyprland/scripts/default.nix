{ pkgs, ... }:
{
  imports = [
    ./keybinds.nix
  ];

  home.packages = [
    (pkgs.writeShellScriptBin "update-nix" ''
        if test -d ~/Documents/nixtest; then
          git clone git@github.com:kawaiiepic/nix.git ~/Documents/nixtest
        fi

    '')
  ];
}
