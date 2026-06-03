{pkgs, inputs, ...}: {
  imports = [
    ./zen
    ./kitty
    ./discord
    ./obs
    ./spotify
    ./vscode
    ./helix
    ./nautilus
    ./gopass.nix
    ./wofi
  ];

  home.packages = with pkgs; [
    papers
    # petal
    # spotify
    # kodi
    # godot
    # wvkbd
    mission-center
    #jetbrains.idea
    # equibop
    # feishin
    # nodejs
    mpv
    # vtsls
    # libreoffice
    android-studio
    #davinci-resolve
    # inputs.airi.packages.${pkgs.system}.default
    kawaiimods-app
    distrobox
    lshw
    # lmstudio
    # dotnetCorePackages.sdk_9_0
    gnome-text-editor
    easyeffects
  ];

  programs.yazi.enable = true;
}
