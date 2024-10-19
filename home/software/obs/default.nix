{pkgs, ...}: {
  programs = {
    obs-studio = {
      enable = true;
      plugins = with pkgs.obs-studio-plugins; [
        obs-pipewire-audio-capture
        wlrobs
        obs-vaapi
        obs-tuna
      ];
    };
  };
}
