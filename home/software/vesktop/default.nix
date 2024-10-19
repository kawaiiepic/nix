{pkgs, ...}: let
  cat-girls = pkgs.fetchFromGitHub {
    owner = "miathetrain";
    repo = "transparent-catgirls";
    rev = "5b8ccf1cb44965af1595d311f45d1a853c6e80fe";
    sha256 = "sha256-6OX/PKgTWjbwaTBlAFe2fAsbh9l3Y0JCYE2fKbzD/8I=";
  };
in {
  home.packages = with pkgs; [vesktop];

  xdg.configFile = {
    "vesktop/themes/cat-girls.theme.css".source = "${cat-girls}/cat-girls.theme.css";
  };
}
