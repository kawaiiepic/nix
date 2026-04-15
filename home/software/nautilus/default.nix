{ pkgs, ... }:
{
  home.packages = with pkgs; [
    nemo
    pcmanfm
    nautilus
    file-roller
  ];
}
