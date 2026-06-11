{ pkgs, ... }:
{
  fonts = {
    enableDefaultPackages = true;

    fontDir.enable = true;

    fontconfig = {
      enable = true;
      # defaultFonts = {
      #   sansSerif = [ "UbuntuSans Nerd Font" ];
      #   monospace = [ "UbuntuSansMono Nerd Font Mono" ];
      # };
    };
    packages = with pkgs; [
      # Fix apps
      dejavu_fonts
      corefonts
      vista-fonts
      # icon fonts
      material-symbols
      # normal fonts
      noto-fonts
      noto-fonts-cjk-sans
      noto-fonts-color-emoji

      # nerdfonts
      nerd-fonts.ubuntu-sans
      nerd-fonts.space-mono
      nerd-fonts.mononoki
      # (nerd-fonts.override {fonts = ["UbuntuSans" "SpaceMono" "Mononoki" "NerdFontsSymbolsOnly"];})
    ];
  };
}
