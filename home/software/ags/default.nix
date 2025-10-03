{
  inputs,
  pkgs,
  ...
}:
{

  # services.xembed-sni-proxy.enable = true;

  imports = [ inputs.ags.homeManagerModules.default ];
  
  home.packages = with pkgs; [
    linux-wallpaperengine
    libnotify
    brightnessctl
    jq
  ];

  programs.ags = {
    enable = true;

    configDir = ./config;

    # additional packages to add to gjs's runtime
    extraPackages = with inputs.ags.packages.${pkgs.system}; [
      apps
      notifd
      mpris
      wireplumber
      network
      tray
      bluetooth
      battery
      powerprofiles
      cava
    ];
  };
}
