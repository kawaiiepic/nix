{ inputs, pkgs, ... }:
{
  imports = [
    inputs.zen-browser.homeModules.beta
    # or inputs.zen-browser.homeModules.twilight
    # or inputs.zen-browser.homeModules.twilight-official
  ];

  home.packages = with pkgs; [
    pkgs.zen-theme-switch
    pkgs.passff-host
  ];

  home.file.".mozilla/native-messaging-hosts/themeswitch.json".source =
    pkgs.zen-theme-switch + "/lib/mozilla/native-messaging-hosts/themeswitch.json";

  programs.zen-browser = {
    enable = true;
    nativeMessagingHosts = [
      pkgs.zen-theme-switch
      pkgs.passff-host
    ];
  };
}
