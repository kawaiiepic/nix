{ lib, config, ... }:
{

  users.users = lib.mkMerge [
    (lib.mkIf (config.networking.hostName == "dreamhouse" || config.networking.hostName == "steamdeck")
      {
        mia = {
          isNormalUser = true;
          extraGroups = [
            "wheel"
            "input"
          ];
        };
      }
    )

    (lib.mkIf (config.networking.hostName == "blossom") {
      wyntor = {
        isNormalUser = true;
        extraGroups = [
          "wheel"
          "input"
        ];
      };
    })
  ];
}
