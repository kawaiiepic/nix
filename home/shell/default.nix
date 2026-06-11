{pkgs, ...}: {
  imports = [
    ./starship.nix
  ];

  home.packages = with pkgs; [
    eza
    glow
    btop
    fish
    zsh
    grc
    elvish
    nitch
  ];



  xdg.configFile."elvish/rc.elv".text = ''
    use readline-binding
    eval (starship init elvish)
    set-env CARAPACE_BRIDGES 'zsh,fish,bash,inshellisense' # optional
    eval (carapace _carapace|slurp)
    eval (direnv hook elvish | slurp)

    nitch
  '';

  programs = {
    direnv = {
      enable = true;
      nix-direnv.enable = true;
    };
  };

  programs = {
    carapace.enable = true;
  };
}
