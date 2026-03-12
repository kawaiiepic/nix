{ pkgs, ... }:
{
  fonts = {
    enableDefaultPackages = true;

    fontconfig = {
      defaultFonts = {
        sansSerif = [ "SpaceMono Nerd Font" ];
        monospace = [ "SpaceMono Nerd Font Mono" ];
      };
    };
    packages = with pkgs; [
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
