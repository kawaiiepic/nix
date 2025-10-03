{ stdenv, python3 }:

stdenv.mkDerivation {
  pname = "theme-toggle-host";
  version = "20.0";

  src = ./.;

  buildInputs = [ python3 ];

  installPhase = ''
    cp $src/themeswitch.py .
    cp $src/theme-switcher.py .
    cp $src/themeswitch.json .

    substituteInPlace themeswitch.json \
      --replace-fail PLACEHOLDER $out/share/themeswitch/themeswitch.py

    install -Dt $out/share/themeswitch \
      themeswitch.{py,json}
      
    # install -Dm755 themeswitch.py $out/bin/themeswitch
    install -Dm755 theme-switcher.py $out/bin/themeswitch

    install -d $out/lib/mozilla/native-messaging-hosts
    ln -s $out/share/themeswitch/themeswitch.json $out/lib/mozilla/native-messaging-hosts/
  '';
}
