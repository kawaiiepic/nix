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

      kitty --class kitty-update-nix nh os switch --update .
    '')

    (pkgs.writeShellScriptBin "reboot-to-windows" ''
      sudo efibootmgr --bootnext $(efibootmgr | grep Windows | tail -n1 | cut -d' ' -f1 | cut -d't' -f2 | sed s/.$//) && systemctl reboot
    '')

  ];
}
