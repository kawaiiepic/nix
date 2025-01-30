{
  buildFlutterApplication,
  fetchFromGithub,
  lib
}:

buildFlutterApplication rec {
  pname = "nyaashows";
  version = "0.1.0";

  src = fetchFromGithub {
    owner = "kawaiiepic";
    repo = "NyaaShows";
    rev = "727b1260db10f58ae99e06fc30ab3112d2123161";
    sha256 = "";
  };

  meta = with lib; {
    homepage = "https://github.com/kawaiiepic/NyaaShows";
    description = "Video Player which streams torrents using real-debrid ";
    platforms = platforms.linux;
    license = licenses.gpl3Plus;
  };
}
