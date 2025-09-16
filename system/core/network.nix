{
  networking.firewall.enable = false;
  
   # Define your hostname.
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  networking.networkmanager.enable = true; # Easiest to use and most distros use this by default.
  
  services.openssh = {
    enable = true;
    ports = [ 22 ];
  };
  
  networking.extraHosts =
    ''
      192.168.1.126 whoami.blossomvale.dev dashboard.blossomvale.dev cloud.blossomvale.dev watch.blossomvale.dev panel.blossomvale.dev
    '';
  
  services.geoclue2 = {
    enable = true;
    # enableStatic = true;
  };

}