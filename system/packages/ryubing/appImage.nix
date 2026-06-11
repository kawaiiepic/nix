{
  appimageTools,
  fetchurl,
}: let
  pname = "ryubing";
  version = "1.3.309";

  src = fetchurl {
    url = "https://git.ryujinx.app/Ryubing/Canary/releases/download/${version}/ryujinx-canary-${version}-x64.AppImage";
    hash = "sha256-3tKiRQdlQMP7HYQn1rj8FAC9rryOtQ0zhY75MZRjQso=";
  };

  contents = appimageTools.extractType2 {
    inherit pname version src;
  };
in
  appimageTools.wrapType2 {
    inherit pname version src;
    extraPkgs = pkgs:
      with pkgs; [
        icu
        lttng-ust
      ];

    extraInstallCommands = ''
      mkdir -pv $out/share/applications $out/share/icons/hicolor/512x512/apps

      install -m 444 ${contents}/app.ryujinx.Ryujinx.desktop \
        $out/share/applications/${pname}.desktop
      install -m 444 ${contents}/app.ryujinx.Ryujinx.png \
        $out/share/icons/hicolor/512x512/apps/${pname}.png

      substituteInPlace $out/share/applications/${pname}.desktop \
        --replace-fail 'Exec=Ryujinx.sh' 'Exec=${pname}' \
        --replace-fail 'Icon=app.ryujinx.Ryujinx' 'Icon=${pname}'
    '';

    meta = {
      description = "Ryujinx is an open-source Nintendo Switch emulator, originally created by gdkchan, written in C#.";
      homepage = "https://git.ryujinx.app/Ryubing";
      platforms = ["x86_64-linux"];
    };
  }
