{lib, ...}: {
  # greetd display manager
  #
  environment.variables.NIRI_CONFIG = "/home/mia/.config/niri/current.kdl";

  services.greetd = let
    session = {
      command = "niri-session";
      user = "mia";
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
