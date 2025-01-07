{ pkgs, ... }:
{
  fonts = {
    enableDefaultPackages = true;

    fontconfig = {
      defaultFonts = {
        sansSerif = [ "UbuntuSans Nerd Font" ];
        monospace = [ "UbuntuSansMono Nerd Font" ];
      };
    };
    packages = with pkgs; [
      # icon fonts
      material-symbols
      # normal fonts
      noto-fonts
      noto-fonts-cjk-sans
      noto-fonts-emoji

      # nerdfonts
      nerd-fonts.ubuntu-sans
      nerd-fonts.space-mono
      nerd-fonts.mononoki
      # (nerd-fonts.override {fonts = ["UbuntuSans" "SpaceMono" "Mononoki" "NerdFontsSymbolsOnly"];})
    ];
  };
}
