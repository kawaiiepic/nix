{inputs, ...}: {
  # networking.firewall.enable = false;

  # Define your hostname.
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  # networking.networkmanager.enable = true; # Easiest to use and most distros use this by default.

  services.openssh = {
    enable = true;
    ports = [ 22 ];
  };

  services.geoclue2 = {
    enable = true;
    # enableStatic = true;
  };

  services.zerotierone = {
    enable = true;
    joinNetworks = [
      "b9a18a606f3a8a06"
    ];
  };
}
