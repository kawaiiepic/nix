{
  pkgs,
  ...
}:
{
  home.packages = with pkgs; [ gopass tessen];

  programs.gpg = {
    enable = true;
  };

  services.gpg-agent = {
    enable = true;
    enableSshSupport = true;
  };
}
