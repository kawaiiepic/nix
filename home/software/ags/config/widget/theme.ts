import { createState } from "ags";
import { readFile, writeFile } from "ags/file";
import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { execAsync } from "ags/process";
import GLib from "gi://GLib?version=2.0";

export const themes = [
  { id: "latte", description: "Latte", scheme: "light" },
  { id: "frappe", description: "Frappe", scheme: "dark" },
];

export const [theme, setTheme] = createState(themes[1]);

export function gtkTheme(): string {
  if (theme.get().scheme === "light") {
    return "Colloid-Light";
  } else {
    return "Colloid-Dark";
  }
}

function saveTheme(theme: string) {
  const userConfig = GLib.get_user_config_dir();
  const themeFile = `${userConfig}/theme.json`;
  writeFile(themeFile, JSON.stringify({ theme: theme }));
}

function loadTheme() {
  const userConfig = GLib.get_user_config_dir();
  const themeFile = `${userConfig}/theme.json`;
  const content = readFile(themeFile);
  if (content) {
    const loadedTheme = JSON.parse(content);
    if (loadedTheme.theme) {
      console.log(`Loading theme ${loadedTheme.theme}`);
      for (const theme of themes) {
        if (theme.id === loadedTheme.theme) {
          setTheme(theme);
          break;
        }
      }
    }
  } else {
    setTheme(themes[1]);
  }
}

function setNiriTheme(theme: string) {
  const configDir = `${GLib.get_user_config_dir()}/niri`;
  const themeFile = `${configDir}/config-${theme}.kdl`;
  const target = `${configDir}/a-config.kdl`;

  if (GLib.file_test(themeFile, GLib.FileTest.EXISTS)) {
    execAsync(["bash", "-c", `ln -sf ${themeFile} ${target}`]);
  } else {
    console.log(`Theme file ${themeFile} does not exist`);
  }
}

export function Theme() {
  loadTheme();
  updateTheme();
  
  function updateTheme() {
    print("Theme updated");
    const userConfig = GLib.get_user_config_dir();
    setNiriTheme(theme.get().id);
    
    execAsync(["bash", "-c", `python scripts/firefox-theme-switch.py ${theme.get().scheme}`]);

    execAsync([
      "bash",
      "-c",
      `ln -sf /etc/profiles/per-user/mia/share/themes/${gtkTheme()}/gtk-3.0/gtk.css ${userConfig}/gtk-3.0/gtk.css`,
    ]);
    execAsync([
      "bash",
      "-c",
      `ln -sf /etc/profiles/per-user/mia/share/themes/${gtkTheme()}/gtk-4.0/gtk.css ${userConfig}/gtk-4.0/gtk.css`,
    ]);

    // Kill processes that are using the old theme
    execAsync(["nautilus", "-q"]).catch((error) => {});

    saveTheme(theme.get().id);
  }
  theme.subscribe(() => {
    updateTheme();
  });
}

export function setup_theme(widget: Gtk.Widget) {
  let currentClass = theme.get().id;

  widget.add_css_class(currentClass);

  theme.subscribe(() => {
    widget.remove_css_class(currentClass);

    currentClass = theme.get().id;
    widget.add_css_class(currentClass);
  });
}
