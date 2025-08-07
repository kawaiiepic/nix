{
  inputs,
  pkgs,
  ...
}:
{

  # services.xembed-sni-proxy.enable = true;

  imports = [ inputs.ags.homeManagerModules.default ];

  home.packages = with pkgs; [
    cava
  ];

  programs.ags = {
    enable = true;

    # symlink to ~/.config/ags
    configDir = ./config;

    # additional packages to add to gjs's runtime
    extraPackages = with inputs.ags.packages.${pkgs.system}; [
      pkgs.mpvpaper
      apps
      hyprland
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

  # home.packages = [
  #   (inputs.ags.lib.bundle {
  #     inherit pkgs;
  #     src = ./config;
  #     name = "my-shell"; # name of executable
  #     entry = "app.ts";
  #     gtk4 = true;

  #     # additional libraries and executables to add to gjs' runtime
  #     extraPackages = with inputs.ags.packages.${pkgs.system}; [
  # apps
  # hyprland
  # notifd
  # mpris
  # wireplumber
  # network
  # tray
  # bluetooth
  # battery
  #     ];

  #   })
  # ];
}
