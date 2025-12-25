{ inputs, pkgs, ... }:
let
  catppuccin-discord = pkgs.fetchFromGitHub {
    owner = "catppuccin";
    repo = "discord";
    rev = "70acffa079429bc4a0290d6699b66471c3ec4fd3";
    sha256 = "sha256-oyVZxdr4UacRMOCDdjSl2B/X5ySYTOD5iCOq0MLSxD4=";
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
in
{
  imports = [
    inputs.nixcord.homeModules.nixcord
  ];

  xdg.configFile = {
    "Vencord/themes/latte.theme.css".source = "${catppuccin-discord}/themes/latte.theme.css";
    "Vencord/themes/macchiato.theme.css".source = "${catppuccin-discord}/themes/macchiato.theme.css";
  };

  home.packages = [ krisp-patcher ];

  programs.nixcord = {
    enable = true; # enable Nixcord. Also installs discord package
    # vesktop.enable = true; # Vesktop
    # dorion.enable = true; # Dorion
    # discord.package = pkgs.discord-canary;
    #
    config = {
      # themeLinks = [
      #   "https://raw.githubusercontent.com/kawaiiepic/transparent-catgirls/refs/heads/main/cat-girls.theme.css"
      #   # "https://raw.githubusercontent.com/refact0r/system24/refs/heads/main/theme/flavors/catppuccin-macchiato.theme.css"
      # ];
      # enabledThemes = [
      #   "cat-girls.theme.css"
      #   "catppuccin-mocha.theme.css"
      # ];
      plugins = {
        alwaysAnimate.enable = true;
        betterSessions.enable = true;
        blurNsfw.enable = true;
        customIdle.enable = true;
        mentionAvatars.enable = true;
        messageLinkEmbeds.enable = true;
        messageLogger.enable = true;
        openInApp.enable = true;
        summaries.enable = true;
        spotifyCrack.enable = true;
        typingIndicator.enable = true;
        typingTweaks.enable = true;
        whoReacted.enable = true;
      };

    };

    # userPlugins = {
    #   betterActivities = "github:D3SOX/vc-betterActivities/044b504666b8b753ab45d82c0cd0d316b1ea7e60";
    # };

    # extraConfig = {
    #   plugins = {
    #     betterActivities.enable = true;
    #   };
    # };
  };
}
