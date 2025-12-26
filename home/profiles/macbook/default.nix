{
imports = [
    ../../software
    ../../shell
    ../../desktop/niri
  ];

  home.username = "mia";
  home.homeDirectory = "/home/mia";
  
  programs.home-manager.enable = true;
  home.stateVersion = "24.05";
}
