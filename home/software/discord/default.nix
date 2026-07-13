{
  inputs,
  pkgs,
  ...
}: let
  horizontalServerList = pkgs.fetchFromGitHub {
    owner = "DiscordStyles";
    repo = "HorizontalServerList";
    rev = "bf52103418c361414cd567366a2ce97ea86dbad6";
    sha256 = "sha256-qk95h7a6hvvlJ3piVqDYlsxoQj37Q44T9Zw3h9HsnnY=";
  };
in {
  imports = [
    inputs.nixcord.homeModules.nixcord
  ];

  xdg.configFile = {
    "Equicord/themes/HorizontalServerList.theme.css".source = "${horizontalServerList}/HorizontalServerList.theme.css";
  };

  programs.nixcord = {
    enable = true;
    # discord.enable = false;
    equibop.enable = true;
    discord.equicord.enable = true;
    # discord.equicord.package = pkgs.equicord;
    discord.krisp.enable = true;
    # discord.branch = "canary";
    discord.vencord.enable = false;

    config = {
      enabledThemes = [
        "HorizontalServerList.theme.css"
      ];
      plugins = {
        # UserPFP.enable = true;
        # customIdle.enable = true;
        # mentionAvatars.enable = true;
        # messageLinkEmbeds.enable = true;
        # messageLoggerEnhanced.enable = true;
        # openInApp.enable = true;
        # summaries.enable = true;
        # spotifyCrack.enable = true;
        # typingIndicator.enable = true;
        # typingTweaks.enable = true;
        # whoReacted.enable = true;
        # betterActivities.enable = true;
        # equibopStreamFixes.enable = true;
        # fakeProfileThemes.enable = true;
        # ghosted.enable = true;
        # USRBG.enable = true;
        # orbolayBridge.enable = true;
        # alwaysAnimate.enable = true;
      };
    };

    # userPlugins = {
    #   vc-orbolay-bridge = "github:SpikeHD/vc-orbolay-bridge/8dd34336feea23ccf796fa26074313e713965332";
    # };
  };
}
