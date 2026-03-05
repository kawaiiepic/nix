{ pkgs, inputs, ... }:
{
  imports = [
    ./zen
    ./kitty
    # ./discord
    ./obs
    ./vscode
    ./helix
    ./nautilus
    ./gopass.nix
    ./wofi
  ];

  home.packages = with pkgs; [
    kodi
    godot
    wvkbd
    mission-center
    jetbrains.idea
    winboat
    equibop
    feishin
    nodejs
  ];

  programs.yazi.enable = true;

  programs.openclaw = {
    enable = true;
    channels.telegram = {
      tokenFile = "/home/you/.secrets/telegram-bot-token";
      allowFrom = [ 123456789 ]; # your Telegram chat ID
    };
    anthropic.keyFile = "/home/you/.secrets/anthropic-api-key";
    documentsDir = "/home/mia/code/openclaw-local/documents";
  };

}
