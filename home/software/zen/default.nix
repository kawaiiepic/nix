{
  inputs,
  pkgs,
  ...
}: {
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

  programs.zen-browser = {
    enable = true;
    setAsDefaultBrowser = true;
    nativeMessagingHosts = [
      pkgs.zen-theme-switch
      pkgs.passff-host
    ];

    policies = let
      mkExtensionSettings = builtins.mapAttrs (_: pluginId: {
        install_url = "https://addons.mozilla.org/firefox/downloads/latest/${pluginId}/latest.xpi";
        installation_mode = "force_installed";
      });
    in {
      ExtensionSettings = mkExtensionSettings {
        "wappalyzer@crunchlabz.com" = "wappalyzer";
        "{85860b32-02a8-431a-b2b1-40fbd64c9c69}" = "github-file-icons";
      };
      AutofillAddressEnabled = true;
      AutofillCreditCardEnabled = false;
      DisableAppUpdate = true;
      DisableFeedbackCommands = true;
      DisableFirefoxStudies = true;
      DisablePocket = true;
      DisableTelemetry = true;
      DontCheckDefaultBrowser = true;
      NoDefaultBookmarks = true;
      OfferToSaveLogins = false;
      EnableTrackingProtection = {
        Value = true;
        Locked = true;
        Cryptomining = true;
        Fingerprinting = true;
      };
      Preferences = {
        "browser.startup.homepage" = {
          Value = "about:blank";
          Status = "locked";
        };
        "browser.tabs.warnOnClose" = {
          Value = true;
          Status = "locked"; # User cannot change this
        };
      };
    };

    profiles.default = let
      containers = {
        Work = {
          color = "blue";
          icon = "briefcase";
          id = 1;
        };
        Life = {
          color = "green";
          icon = "tree";
          id = 2;
        };
      };
      spaces = {
        "Rendezvous" = {
          id = "572910e1-4468-4832-a869-0b3a93e2f165";
          icon = "🎭";
          position = 1000;
          container = containers.Life.id;
        };
        "Github" = {
          id = "08be3ada-2398-4e63-bb8e-f8bf9caa8d10";
          icon = "🐙";
          position = 2000;
          theme = {
            type = "gradient";
            colors = [
              {
                red = 185;
                green = 200;
                blue = 215;
                algorithm = "floating";
                type = "explicit-lightness";
              }
            ];
            opacity = 0.8;
            texture = 0.5;
          };
        };
        "Nix" = {
          id = "2441acc9-79b1-4afb-b582-ee88ce554ec0";
          icon = "❄️";
          position = 3000;
          theme = {
            type = "gradient";
            colors = [
              {
                red = 150;
                green = 190;
                blue = 230;
                algorithm = "floating";
                type = "explicit-lightness";
              }
            ];
            opacity = 0.2;
            texture = 0.5;
          };
        };
      };
      pins = {
        "mail" = {
          id = "9d8a8f91-7e29-4688-ae2e-da4e49d4a179";
          container = containers.Life.id;
          url = "https://outlook.live.com/mail/";
          isEssential = true;
          position = 101;
        };
        "Notion" = {
          id = "8af62707-0722-4049-9801-bedced343333";
          container = containers.Life.id;
          url = "https://notion.com";
          isEssential = true;
          position = 102;
        };
        "Folo" = {
          id = "fb316d70-2b5e-4c46-bf42-f4e82d635153";
          container = containers.Life.id;
          url = "https://app.folo.is/";
          isEssential = true;
          position = 103;
        };
        "Nix awesome" = {
          id = "d85a9026-1458-4db6-b115-346746bcc692";
          workspace = spaces.Nix.id;
          isGroup = true;
          isFolderCollapsed = false;
          editedTitle = true;
          position = 200;
        };
        "Nix Packages" = {
          id = "f8dd784e-11d7-430a-8f57-7b05ecdb4c77";
          workspace = spaces.Nix.id;
          folderParentId = pins."Nix awesome".id;
          url = "https://search.nixos.org/packages";
          position = 201;
        };
        "Nix Options" = {
          id = "92931d60-fd40-4707-9512-a57b1a6a3919";
          workspace = spaces.Nix.id;
          folderParentId = pins."Nix awesome".id;
          url = "https://search.nixos.org/options";
          position = 202;
        };
        "Home Manager Options" = {
          id = "2eed5614-3896-41a1-9d0a-a3283985359b";
          workspace = spaces.Nix.id;
          folderParentId = pins."Nix awesome".id;
          url = "https://home-manager-options.extranix.com";
          position = 203;
        };
      };
      search = {
        force = true;
        default = "ddg";
        engines = {
          mynixos = {
            name = "My NixOS";
            urls = [
              {
                template = "https://mynixos.com/search?q={searchTerms}";
                params = [
                  {
                    name = "query";
                    value = "searchTerms";
                  }
                ];
              }
            ];
            icon = "${pkgs.nixos-icons}/share/icons/hicolor/scalable/apps/nix-snowflake.svg";
            definedAliases = ["@nx"];
          };
          github = {
            name = "GitHub Search";
            urls = [
              {
                template = "https://github.com/search?q={searchTerms}";
              }
            ];
            definedAliases = ["@gh"];
          };
        };
      };
      settings = {
        "zen.workspaces.continue-where-left-off" = true;
        "zen.view.compact.hide-tabbar" = true;
        "zen.urlbar.behavior" = "float";
        "zen.welcome-screen.seen" = true;
      };
    in {
      containersForce = true;
      pinsForce = true;
      spacesForce = true;
      inherit containers pins spaces search;
      # ...
    };
  };
}
