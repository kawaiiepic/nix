{ inputs, pkgs, ... }:
let
  stasis = inputs.stasis.packages.${pkgs.stdenv.hostPlatform.system}.stasis;
in
{
  home.packages = [ stasis ];

  xdg.configFile."stasis/stasis.rune" = {
    force = true;
    source = ./stasis.rune;
  };

  systemd.user.services.stasis = {
    Unit = {
      Description = "My custom background service";
    };
    Service = {
      ExecStart = "${stasis}/bin/stasis";
    };
    Install = {
      WantedBy = [ "default.target" ];
    };
  };
}
