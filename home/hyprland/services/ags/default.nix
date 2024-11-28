{
  inputs,
  pkgs,
  ...
}: {
  services.xembed-sni-proxy.enable = true;

  home.packages = with pkgs; [
    (inputs.ags.lib.bundle {
          inherit pkgs;
          src = ./config;
          name = "my-shell"; # name of executable
          entry = "app.ts";

          # additional libraries and executables to add to gjs' runtime
          extraPackages = with inputs.ags.packages.${system}; [
             hyprland
             notifd
             mpris
             wireplumber
             network
             tray
          ];
        })
  ];

  systemd.user.services = {
    ags = {
      Unit = {
        Description = "ags service";
      };

      Install.WantedBy = ["hyprland-session.target"];

      Service = {
        ExecStart = ''${(inputs.ags.lib.bundle {
              inherit pkgs;
              src = ./config;
              name = "my-shell"; # name of executable
              entry = "app.ts";
    
              # additional libraries and executables to add to gjs' runtime
              extraPackages = with inputs.ags.packages.${pkgs.system}; [
                 hyprland
                 notifd
                 mpris
                 wireplumber
                 network
                 tray
              ];
            })}/bin/my-shell'';
      };
    };
  };
}
