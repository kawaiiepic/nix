{ pkgs, ... }:
let
  screenshot = pkgs.writeShellScriptBin "screenshot" ''
      # Temporary file
      tmpfile=$(mktemp --suffix=.png)

      # Screenshot to temp file
      grimblast save output - > "$tmpfile"

      # Copy to clipboard
      wl-copy < "$tmpfile"

      canberra-gtk-play -i screen-capture

      # Show notification with screenshot
      notify-send -a "Screenshot" "📸 Screenshot copied" -i camera -h string:preview:true -h string:image-path:"$tmpfile"
  '';

  screenshot-area = pkgs.writeShellScriptBin "screenshot-area" ''
      # Temporary file
      tmpfile=$(mktemp --suffix=.png)

      # Screenshot to temp file
      grimblast --freeze save area - > "$tmpfile"

      # Copy to clipboard
      wl-copy < "$tmpfile"

      canberra-gtk-play -i screen-capture

      # Show notification with screenshot
      notify-send -a "Screenshot" "📸 Screenshot Area copied" -i camera -h string:preview:true -h string:image-path:"$tmpfile"
  '';
in
{
  home.packages = with pkgs; [
    grimblast
    wl-clipboard
    libcanberra-gtk3
    screenshot
    screenshot-area
    jq
    libnotify
  ];
}
