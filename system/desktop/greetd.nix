{
  lib,
  ...
}: {
  # greetd display manager
  services.greetd = let
    session = {
      command = "niri-session -c /home/mia/.config/niri/a-config.kdl";
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
