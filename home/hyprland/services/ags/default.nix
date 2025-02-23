{
  inputs,
  pkgs,
  ...
}:
{
  
  services.xembed-sni-proxy.enable = true;
  
  home.packages = [
    (inputs.ags.lib.bundle {
      inherit pkgs;
      src = ./config;
      name = "my-shell"; # name of executable
      entry = "app.ts";

      # additional libraries and executables to add to gjs' runtime
      extraPackages = with inputs.ags.packages.${pkgs.system}; [
        apps
        hyprland
        notifd
        mpris
        wireplumber
        network
        tray
        bluetooth
        battery
      ];

    })
  ];
}
