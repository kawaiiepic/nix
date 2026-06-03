{
  inputs,
  pkgs,
  ...
}: {
  imports = [
    inputs.niri.nixosModules.niri
  ];

  programs.niri.enable = true;
  nixpkgs.overlays = [inputs.niri.overlays.niri];
  programs.niri.package = pkgs.niri-unstable;
  services.gvfs = {
    enable = true;
  };
  services.gnome.sushi.enable = true;
  environment.variables.NIXOS_OZONE_WL = "1";
  environment.systemPackages = with pkgs; [
    wl-clipboard
    wayland-utils
    libsecret
    cage
    gamescope
    xwayland-satellite-unstable
  ];
}
