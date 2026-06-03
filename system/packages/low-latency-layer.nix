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
  version = "0.1.0";

  src = fetchFromGitHub {
    owner = "Korthos-Software";
    repo = "low_latency_layer";
    rev = "4633ada4cba4facafeeb91f473bce0c59401d91a";
    hash = "sha256-dDZVQqVL47cWSZOwcavqR1Cmh8rsCdlbm+vPhUZklhw=";
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
    ls
    make
  '';

  installPhase = ''
    make install PREFIX=$out
  '';
}
