{
  pkgs,
  lib,
  ...
}: let
  bgImageSection = name: ''
    #${name} {
      background-image: image(url("${pkgs.wlogout}/share/wlogout/icons/${name}.png"));
    }
  '';
in {
  programs.wlogout = {
    enable = true;

    style = ''
          * {
      	background-image: none;
      	box-shadow: none;
      }

      window {
      	background-color: transparent;
      }

            button {
              background: rgba(30, 30, 46, 0.9);
              border-radius: 20px;
              box-shadow: inset 0 0 0 1px rgba(17, 17, 27, .8), 0 0 rgba(30, 30, 46, 0.9);
              margin: 1rem;
              background-repeat: no-repeat;
              background-position: center;
              background-size: 25%;
              }

              button:focus, button:active, button:hover {
                background-color: rgba(49, 50, 68, 0.9);
                outline-style: none;
              }

              ${lib.concatMapStringsSep "\n" bgImageSection [
        "lock"
        "logout"
        "suspend"
        "hibernate"
        "shutdown"
        "reboot"
      ]}
    '';
  };
}
