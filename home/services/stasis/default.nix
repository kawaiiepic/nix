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
}
