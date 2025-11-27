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
  home.file.".mozilla/native-messaging-hosts/themeswitch.json".force = true;
  home.file.".mozilla/native-messaging-hosts/themeswitch.json".source =
    pkgs.zen-theme-switch + "/lib/mozilla/native-messaging-hosts/themeswitch.json";

  xdg.mimeApps =
    let
      value =
        let
          zen-browser = inputs.zen-browser.packages."x86_64-linux".beta; # or twilight
        in
        zen-browser.meta.desktopFileName;

      associations = builtins.listToAttrs (
        map
          (name: {
            inherit name value;
          })
          [
            "application/x-extension-shtml"
            "application/x-extension-xhtml"
            "application/x-extension-html"
            "application/x-extension-xht"
            "application/x-extension-htm"
            "x-scheme-handler/unknown"
            "x-scheme-handler/mailto"
            "x-scheme-handler/chrome"
            "x-scheme-handler/about"
            "x-scheme-handler/https"
            "x-scheme-handler/http"
            "application/xhtml+xml"
            "application/json"
            "text/plain"
            "text/html"
          ]
      );
    in
    {
      associations.added = associations;
      defaultApplications = associations;
    };
  programs.zen-browser = {
    enable = true;
    nativeMessagingHosts = [
      pkgs.zen-theme-switch
      pkgs.passff-host
    ];
  };
}
