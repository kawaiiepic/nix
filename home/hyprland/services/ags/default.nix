{
  inputs,
  pkgs,
  ...
}: let
  pinfo = pkgs.writeShellScriptBin "pinfo" ''
    if [ $1 == "cpu" ]; then
      read cpu user nice system idle iowait irq softirq steal guest< /proc/stat

      # compute active and total utilizations
      cpu_active_prev=$((user+system+nice+softirq+steal))
      cpu_total_prev=$((user+system+nice+softirq+steal+idle+iowait))

      usleep 50000

      # Read /proc/stat file (for second datapoint)
      read cpu user nice system idle iowait irq softirq steal guest< /proc/stat

      # compute active and total utilizations
      cpu_active_cur=$((user+system+nice+softirq+steal))
      cpu_total_cur=$((user+system+nice+softirq+steal+idle+iowait))

      # compute CPU utilization (%)
      cpu_util=$((100*( $cpu_active_cur - $cpu_active_prev ) / ( $cpu_total_cur - $cpu_total_prev )))

      printf "%s" "$cpu_util"

    elif [ $1 == "memory" ]; then
      mem_total=$(awk '/MemTotal/ { printf "%.3f \n", $2/1024/1024 }' /proc/meminfo)
      mem_ava=$(awk '/MemAvailable/ { printf "%.3f \n", $2/1024/1024 }' /proc/meminfo)
      mem_util=$(echo "$mem_total $mem_ava" | awk '{print ($1 - $2) / $1}')

      printf "%s" "$mem_util"

    elif [ $1 == "freememory" ]; then
      mem_total=$(awk '/MemTotal/ { printf "%.3f \n", $2/1024/1024 }' /proc/meminfo)
      mem_ava=$(awk '/MemAvailable/ { printf "%.3f \n", $2/1024/1024 }' /proc/meminfo)
      mem_util=$(echo "$mem_total $mem_ava" | awk '{print ($1 - $2)}')

      printf "%s" "$mem_util"

    elif [ $1 == "gpu" ]; then
      s=$(amdgpu_top -n 1 --json | jq -c -r '(.devices[] | .gpu_activity | .GFX | .value )')
      echo $s

    elif [ $1 == "screenshare" ]; then
      boop=$(pw-dump | jq -r 'map(.info?.props?) | map(select(.["media.class"]? == "Stream/Input/Video")) | map(.["stream.is-live"]? == true) | .[]?')
      echo $boop

      elif [ $1 == "mic" ]; then
      boop=$(pw-dump | jq -r 'map(.info?.props?) | map(select(.["media.class"]? == "Stream/Input/Audio")) | map(.["stream.is-live"]? == true) | .[]?')
      echo $boop

    elif [ $1 == "gpumemory" ]; then
      total=$(amdgpu_top -n 1 --json | jq -c -r '(.devices[] | .VRAM | ."Total VRAM" | .value)')
      current=$(amdgpu_top -n 1 --json | jq -c -r '(.devices[] | .VRAM | ."Total VRAM Usage" | .value)')
      math=$(($current / $total))
      echo $math
    fi
  '';

  ags = inputs.ags.packages.${pkgs.system}.default;

  addBins = list: builtins.concatStringsSep ":" (builtins.map (p: "${p}/bin") list);

  ags-wrap = pkgs.writeShellScript "ags-wrap" ''
    export PATH=$PATH:${addBins dependencies}
    ${ags}/bin/ags -c ${toString ./config/config.js} $@
  '';

  dependencies = with pkgs; [
    dart-sass
    esbuild
    bun
    pinfo
    jq
    pipewire
    swayosd
    # ags-wrap
    pywal

    toybox
    amdgpu_top
    pavucontrol
  ];
in {
  services.xembed-sni-proxy.enable = true;
  

  systemd.user.services = {
    ags = {
      Unit = {
        Description = "ags service";
      };

      Install.WantedBy = ["hyprland-session.target"];

      Service = {
        ExecStart = ''${ags-wrap}'';
      };
    };
  };
}
