{inputs, pkgs, ...}:
let
cat-girls = pkgs.fetchFromGitHub {
  owner = "miathetrain";
  repo = "transparent-catgirls";
  rev = "5b8ccf1cb44965af1595d311f45d1a853c6e80fe";
  sha256 = "sha256-6OX/PKgTWjbwaTBlAFe2fAsbh9l3Y0JCYE2fKbzD/8I=";
};

system24 = pkgs.fetchFromGitHub {
  owner = "refact0r";
  repo = "system24";
  rev = "67b5f7d283fa843c7f310b068fcf8cb100b3de5c";
  sha256 = "sha256-kHkySfpJaRQWEWcc4Lo5SFRiCslwt5fGB+iqYIY4FL0=";
};

krisp-patcher =
    pkgs.writers.writePython3Bin "krisp-patcher"
      {
        libraries = with pkgs.python3Packages; [
          capstone
          pyelftools
        ];
        flakeIgnore = [
          "E501" # line too long (82 > 79 characters)
          "F403" # 'from module import *' used; unable to detect undefined names
          "F405" # name may be undefined, or defined from star imports: module
        ];
      }
      (
        builtins.readFile (
          pkgs.fetchurl {
            url = "https://raw.githubusercontent.com/sersorrel/sys/7806b21ce74ef7953c3d38edb0116cc9d0851302/hm/discord/krisp-patcher.py";
            sha256 = "sha256-h8Jjd9ZQBjtO3xbnYuxUsDctGEMFUB5hzR/QOQ71j/E=";
          }
        )
      );
in {
  imports = [
      inputs.nixcord.homeManagerModules.nixcord
    ];

    xdg.configFile = {
      "Vencord/themes/cat-girls.theme.css".source = "${cat-girls}/cat-girls.theme.css";
      "Vencord/themes/system24.theme.css".source = "${system24}/theme/flavors/catppuccin-mocha.theme.css";
    };

    home.packages = [krisp-patcher];

    programs.nixcord = {
        enable = true;  # enable Nixcord. Also installs discord package
        # discord.package = inputs.nix-master.legacyPackages.${pkgs.system}.discord-canary;
        discord.package = pkgs.discord-canary;
        # quickCss = "some CSS";  # quickCSS file
        config = {
          useQuickCss = false;   # use out quickCSS
          # themeLinks = [];
          frameless = true; # set some Vencord options
          plugins = {
             # Enable a Vencord plugin
          };
        };
        # extraConfig = {
        #   # Some extra JSON config here
        #   # ...
        # };
      };
}
