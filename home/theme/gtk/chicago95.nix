{
  stdenv,
  sassc,
  win2xcur,
  fetchFromGitHub,
}:

stdenv.mkDerivation {
  pname = "Chicago95";
  version = "v3.0.1";

  src = fetchFromGitHub {
    owner = "grassmunk";
    repo = "Chicago95";
    rev = "v3.0.1";
    sha256 = "sha256-EHcDIct2VeTsjbQWnKB2kwSFNb97dxuydAu+i/VquBA=";
  };

  nativeBuildInputs = [ sassc win2xcur ];

  dontBuild = true;

  installPhase = ''
    runHook preInstall
  
    shopt -s nullglob   # globs that match nothing expand to empty, not an error
  
    mkdir -p $out/share/themes
    cp -r Theme/Chicago95 $out/share/themes/

    cp -r $out/share/themes/Chicago95/gtk-3.0 $out/share/themes/Chicago95/gtk-4.0
  
    mkdir -p $out/share/icons
    cp -r Icons/Chicago95 $out/share/icons/
  
    declare -A cursorMap=(
      [Arrow]="left_ptr default"
      [Beam]="xterm text ibeam"
      [Wait]="watch wait"
      [Busy]="left_ptr_watch half-busy progress"
      [Help]="left_ptr_help help question_arrow"
      [Move]="fleur move all-scroll"
      [No]="not-allowed forbidden"
      [Pen]="pencil"
      [Crosshair]="crosshair cross tcross"
      [SizeNS]="ns-resize n-resize s-resize row-resize size_ver"
      [SizeWE]="ew-resize e-resize w-resize col-resize size_hor"
      [SizeNWSE]="nwse-resize nw-resize se-resize size_fdiag"
      [SizeNESW]="nesw-resize ne-resize sw-resize size_bdiag"
      [Hand]="pointer hand1 hand2 pointing_hand"
      [UpArrow]="up-arrow center_ptr"
    )
  
    for cursorDir in Cursors/*/; do
      themeName=$(basename "$cursorDir")
      cursorOut="$out/share/icons/$themeName/cursors"
      mkdir -p "$cursorOut"
  
      curFiles=("$cursorDir"/build/95/*.cur "$cursorDir"/build/95/*.ani)
      if [ ''${#curFiles[@]} -gt 0 ]; then
        win2xcur "''${curFiles[@]}" -o "$cursorOut"
      fi
  
      for winName in "''${!cursorMap[@]}"; do
        if [ -f "$cursorOut/$winName" ]; then
          for x11Name in ''${cursorMap[$winName]}; do
            ln -sf "$winName" "$cursorOut/$x11Name"
          done
        fi
      done
  
      if [ -f "$cursorDir/index.theme" ]; then
        cp "$cursorDir/index.theme" "$out/share/icons/$themeName/index.theme"
      fi
    done
  
    runHook postInstall
  '';

  dontFixup = true; 
}
