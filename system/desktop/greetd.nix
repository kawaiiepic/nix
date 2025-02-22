{
  config,
  lib,
  osConfig,
  ...
}: {
  # greetd display manager
  services.greetd = let
    session = {
      command = "Hyprland";
      
      user = if config.networking.hostName == "blossom" then "wyntor" else "mia";
    };
  in {
    enable = lib.mkDefault true;
    settings = {
      terminal.vt = 1;
      default_session = session;
      initial_session = session;
    };
  };

  # unlock GPG keyring on login
  security.pam.services.greetd.enableGnomeKeyring = true;
}
