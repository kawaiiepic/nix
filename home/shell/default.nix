{pkgs, ...}: {
  imports = [
    ./starship.nix
  ];

  users.defaultUserShell = pkgs.fish;

  home.packages = with pkgs; [eza fzf fd bat];

  programs.fish = {
    enable = true;
    interactiveShellInit = ''
      set fish_greeting # Disable greeting
      fish_config theme choose CatppuccinMocha
      fastfetch

      direnv hook fish | source
    '';

    shellAliases = {
      g = "git";
      "..." = "cd ../..";
      ls = "eza --icons --group-directories-first -x";
      icat = "kitty icat";
      ssh = "kitten ssh";
    };

    plugins = [
      {
        name = "fish-autols";
        src = pkgs.fetchFromGitHub {
          owner = "rstacruz";
          repo = "fish-autols";
          rev = "6d704c0e33522335539bf6844ce9f7009b2ee6a2";
          sha256 = "sha256-tqAsc9J8xv0DMt5fTYaBO7tUQAG7Fnct/Rlq/Jx+/yU=";
        };
      }

      {
        name = "fzf.fish";
        src = pkgs.fetchFromGitHub {
          owner = "PatrickF1";
          repo = "fzf.fish";
          rev = "8920367cf85eee5218cc25a11e209d46e2591e7a";
          sha256 = "sha256-T8KYLA/r/gOKvAivKRoeqIwE2pINlxFQtZJHpOy9GMM=";
        };
      }
    ];
  };

  home.file.".config/fish/themes/CatppuccinMocha.theme".source = ./fish.theme;
}
