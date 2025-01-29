{
  inputs,
  pkgs,
  ...
}: {
  imports = [
    inputs.spicetify-nix.homeManagerModules.default
  ];
  programs.spicetify = let
    spicePkgs = inputs.spicetify-nix.legacyPackages.${pkgs.system};
  in {
    enable = true;
    # theme = spicePkgs.themes.text;
    colorScheme = "CatppuccinMocha";

    enabledExtensions = with spicePkgs.extensions; [
      ({
            # The source of the extension
            # make sure you're using the correct branch
            # It could also be a sub-directory of the repo
            src = pkgs.fetchFromGitHub {
              owner = "BlafKing";
              repo = "spicetify-cat-jam-synced";
              rev = "e7bfd49fcc13457bbc98e696294cf5cf43eb6c31";
              hash = "sha256-pyYa5i/gmf01dkEF9I2awrTGLqkAjV9edJBsThdFRv8=";
            };
            # The actual file name of the extension usually ends with .js
            name = "marketplace/cat-jam.js";
        })
      shuffle # shuffle+ (special characters are sanitized out of ext names)
      playlistIcons
      lastfm
      adblock
    ];
  };
}
