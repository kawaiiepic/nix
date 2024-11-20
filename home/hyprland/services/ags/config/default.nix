{
  inputs,
  pkgs,
  ...
}: {
  services.xembed-sni-proxy.enable = true;

  home.packages = with pkgs; [
    (inputs.ags.lib.bundle {
          inherit pkgs;
          src = ./.;
          name = "my-shell"; # name of executable
          entry = "app.ts";

          # additional libraries and executables to add to gjs' runtime
          extraPackages = [
            # ags.packages.${system}.battery
            # pkgs.fzf
          ];
        })
  ];

  # systemd.user.services = {
  #   ags = {
  #     Unit = {
  #       Description = "ags service";
  #     };

  #     Install.WantedBy = ["hyprland-session.target"];

  #     Service = {
  #       ExecStart = ''${ags-wrap}'';
  #     };
  #   };
  # };
}
