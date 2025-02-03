{osConfig, ...}:{
  
  home.file.".face".source = if osConfig.networking.hostName == "blossom" then ./wyntor.jpg else ./mia.jpg;
}
