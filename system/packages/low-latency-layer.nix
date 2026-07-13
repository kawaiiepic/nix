{
  lib,
  stdenv,
  fetchFromGitHub,
  cmake,
  pkg-config,
  vulkan-headers,
  vulkan-loader,
  vulkan-utility-libraries,
}:
stdenv.mkDerivation {
  pname = "low-latency-layer";
  version = "0.2.0";

  src = fetchFromGitHub {
    owner = "Korthos-Software";
    repo = "low_latency_layer";
    rev = "3138b14ebd059cd540444771dd184fbf7ead2a12";
    hash = "sha256-bhrgpTiyxil3mlzgWWf0r7LUasHzXIUctoaEQvCKWXE=";
  };

  nativeBuildInputs = [
    cmake
    pkg-config
  ];

  buildInputs = [
    vulkan-loader
    vulkan-headers
    vulkan-utility-libraries
  ];

  buildPhase = ''
    make
  '';

  installPhase = ''
    make install PREFIX=$out
  '';
}
