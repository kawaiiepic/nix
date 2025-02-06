{pkgs, ...}:{
  services.xserver.enable = true;
  services.desktopManager.plasma6.enable = true;
  
  programs.ssh.askPassword = pkgs.lib.mkForce "${pkgs.seahorse.out}/libexec/seahorse/ssh-askpass";
}