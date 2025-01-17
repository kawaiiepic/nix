{pkgs,... }:{
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
    (pkgs.callPackage ./wvkbd.nix { })
    
  ];

}
