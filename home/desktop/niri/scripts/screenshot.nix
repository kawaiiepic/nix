{ pkgs, ... }:
let
  screenshot = pkgs.writeShellScriptBin "screenshot" ''
      # Temporary file
      tmpfile=$(mktemp --suffix=.png)

      # Get focused monitor name
      output=$(niri msg --json focused-output | jq -r '.name')

      # Screenshot to temp file
      grim -o "$output" "$tmpfile"

      # Copy to clipboard
      wl-copy < "$tmpfile"

      echo "$tmpfile"

      # Show notification with screenshot
      notify-send -a "Screenshot" "📸 Screenshot copied" "Monitor: $output" -i camera -h string:preview:true -h string:image-path:"$tmpfile"
  '';
in
{
  home.packages = with pkgs; [
    grim
    screenshot
  ];
}
