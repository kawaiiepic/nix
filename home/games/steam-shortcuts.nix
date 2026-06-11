{ config, pkgs, lib, ... }:

let
  pythonEnv = pkgs.python3.withPackages (ps: with ps; [ vdf ]);
  desktopEntries = config.xdg.desktopEntries;
  desktopEntryList = lib.attrValues desktopEntries;

  entriesFromHM = builtins.toJSON (map (entry: {
    name = entry.name;
    exec = entry.exec;
    icon = entry.icon;
  }) desktopEntryList);
in {
  home.packages = [ pythonEnv ];

  home.file.".local/bin/add-steam-shortcuts".text = ''
    #!/bin/sh
    export HOME_MANAGER_XDG_DESKTOP_ENTRIES=${lib.escapeShellArg desktopEntryList}
    exec ${pythonEnv}/bin/python3 ~/.local/share/add-steam-shortcuts.py
  '';
  home.file.".local/bin/add-steam-shortcuts".executable = true;

  home.file.".local/share/add-steam-shortcuts.py".text = ''
    #!/usr/bin/env python3

    import os
    import vdf
    import json
    import sys
    import zlib
    import configparser
    from glob import glob

    # Load entries passed from Home Manager
    entries_from_hm = []
    try:
        env_json = os.environ.get("HOME_MANAGER_XDG_DESKTOP_ENTRIES")
        if env_json:
            entries_from_hm = json.loads(env_json)
    except Exception as e:
        print("⚠️ Failed to load Home Manager desktop entries:", e)

    # Directories to scan for .desktop files
    XDG_DATA_DIRS = [
        os.path.expanduser("~/.local/share/applications"),
        os.path.expanduser("~/.local/share/flatpak/exports/share/applications"),
        "/var/lib/flatpak/exports/share/applications",
        "/usr/share/applications"
    ]

    def parse_desktop_file(path):
        filename = os.path.basename(path)
        if filename.startswith("steam-") or filename == "steam.desktop":
            return None

        config = configparser.ConfigParser(interpolation=None)
        try:
            config.read(path)
            entry = config["Desktop Entry"]

            if entry.get("NoDisplay", "false").lower() == "true":
                return None
            if "Exec" not in entry or "Name" not in entry:
                return None

            exec_line = entry["Exec"]
            if exec_line.strip().startswith("steam") or "steam://" in exec_line:
                return None

            return {
                "name": entry["Name"],
                "exec": exec_line.split()[0],
                "icon": entry.get("Icon", "")
            }
        except Exception as e:
            print(f"⚠️ Failed to parse {path}: {e}")
            return None

    desktop_entries = []
    seen = set()

    # Parse files from disk
    for dir in XDG_DATA_DIRS:
        if os.path.isdir(dir):
            for file in glob(os.path.join(dir, "*.desktop")):
                parsed = parse_desktop_file(file)
                if parsed:
                    key = (parsed["name"], parsed["exec"])
                    if key not in seen:
                        seen.add(key)
                        desktop_entries.append(parsed)

    # Merge in entries from Home Manager
    for entry in entries_from_hm:
        key = (entry["name"], entry["exec"])
        if key not in seen:
            seen.add(key)
            desktop_entries.append(entry)

    # Locate Steam userdata
    try:
        user_dirs = [
            d for d in os.listdir(os.path.expanduser("~/.steam/steam/userdata"))
            if d.isdigit()
        ]
        steam_user_id = user_dirs[0]
    except Exception:
        print("❌ Could not find Steam userdata directory.")
        sys.exit(1)

    steam_shortcut_file = os.path.expanduser(
        f"~/.steam/steam/userdata/{steam_user_id}/config/shortcuts.vdf"
    )

    def generate_appid(name, exe):
        base = f"{exe}{name}".encode("utf-8") + b"\\0"
        crc = zlib.crc32(base) & 0xFFFFFFFF
        val = crc | 0x80000000
        return val if val < 0x80000000 else val - 0x100000000

    if os.path.exists(steam_shortcut_file):
        with open(steam_shortcut_file, "rb") as f:
            try:
                existing = vdf.binary_loads(f.read())
            except Exception as e:
                print("⚠️ Failed to parse existing shortcuts.vdf:", e)
                existing = {"shortcuts": {}}
    else:
        existing = {"shortcuts": {}}

    existing["shortcuts"] = {}
    shortcuts = existing["shortcuts"]
    count = 0

    for entry in desktop_entries:
        name = entry["name"]
        exec_path = entry["exec"]
        icon_path = entry["icon"]

        shortcut = {
            "appid": generate_appid(name, exec_path),
            "appname": name,
            "exe": exec_path,
            "StartDir": os.path.expanduser("~"),
            "icon": icon_path,
            "ShortcutPath": "",
            "LaunchOptions": "gamemoderun %command%",
            "IsHidden": 0,
            "AllowDesktopConfig": 1,
            "AllowOverlay": 1,
            "OpenVR": 0,
            "Devkit": 0,
            "DevkitGameID": "",
            "LastPlayTime": 0,
            "tags": {
                "0": "Game"
            }
        }

        shortcuts[str(count)] = shortcut
        count += 1
        print(f"✅ Added: {name}")

    with open(steam_shortcut_file, "wb") as f:
        f.write(vdf.binary_dumps(existing))

    print("✅ All Steam shortcuts updated.")
  '';
  home.file.".local/share/add-steam-shortcuts.py".executable = true;

  # home.activation.addSteamShortcuts =
  #   lib.hm.dag.entryAfter [ "reloadSystemd" ] ''
  #     echo "🔁 Scanning for XDG desktop entries..."
  #     ~/.local/bin/add-steam-shortcuts || true
  #   '';
}