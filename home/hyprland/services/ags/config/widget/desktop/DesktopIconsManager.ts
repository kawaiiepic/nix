import AstalApps from "gi://AstalApps";
import GLib from "gi://GLib";
import { execAsync } from "ags/process";
import { readFile, writeFile } from "ags/file";

export interface DesktopIconConfig {
  iconSize: number;
  iconSpacing: number;
  gridColumns: number;
  showLabels: boolean;
  labelMaxChars: number;
  favoriteApps: string[];
  hiddenApps: string[];
  customPositions: Record<string, { x: number; y: number }>;
  autoArrange: boolean;
}

export interface DesktopIconTheme {
  name: string;
  iconSize: number;
  spacing: number;
  showLabels: boolean;
  labelStyle: "below" | "overlay" | "none";
  hoverEffect: "scale" | "glow" | "lift" | "none";
}

const DEFAULT_CONFIG: DesktopIconConfig = {
  iconSize: 32,
  iconSpacing: 16,
  gridColumns: 6,
  showLabels: true,
  labelMaxChars: 10,
  favoriteApps: [
    "firefox",
    "org.gnome.Nautilus",
    "code",
    "org.gnome.Terminal",
    "discord",
    "spotify",
    "steam",
    "obsidian",
  ],
  hiddenApps: [
    "htop",
    "nvtop",
    "vim",
    "nano",
    "avahi-discover",
    "qv4l2",
    "qvidcap",
  ],
  customPositions: {},
  autoArrange: true,
};

const PREDEFINED_THEMES: DesktopIconTheme[] = [
  {
    name: "Windows Classic",
    iconSize: 32,
    spacing: 16,
    showLabels: true,
    labelStyle: "below",
    hoverEffect: "none",
  },
  {
    name: "Windows Large",
    iconSize: 48,
    spacing: 20,
    showLabels: true,
    labelStyle: "below",
    hoverEffect: "none",
  },
  {
    name: "Windows Small",
    iconSize: 24,
    spacing: 12,
    showLabels: true,
    labelStyle: "below",
    hoverEffect: "none",
  },
  {
    name: "Classic",
    iconSize: 48,
    spacing: 24,
    showLabels: true,
    labelStyle: "below",
    hoverEffect: "lift",
  },
  {
    name: "Minimal",
    iconSize: 36,
    spacing: 20,
    showLabels: false,
    labelStyle: "none",
    hoverEffect: "scale",
  },
  {
    name: "Large",
    iconSize: 64,
    spacing: 32,
    showLabels: true,
    labelStyle: "below",
    hoverEffect: "glow",
  },
  {
    name: "Compact",
    iconSize: 32,
    spacing: 16,
    showLabels: true,
    labelStyle: "overlay",
    hoverEffect: "scale",
  },
];

export class DesktopIconsManager {
  private config: DesktopIconConfig;
  private configPath: string;
  private apps: AstalApps.Apps;
  private changeCallbacks: (() => void)[] = [];

  constructor() {
    this.configPath = `${GLib.get_user_config_dir()}/ags-settings/desktop-icons.json`;
    this.config = DEFAULT_CONFIG;
    this.apps = new AstalApps.Apps();
    this.loadConfig();
  }

  /**
   * Load configuration from disk
   */
  private loadConfig(): void {
    try {
      const configData = readFile(this.configPath);
      this.config = { ...DEFAULT_CONFIG, ...JSON.parse(configData) };
    } catch (error) {
      // Using default desktop icons configuration
      this.saveConfig();
    }
  }

  /**
   * Save configuration to disk
   */
  private saveConfig(): void {
    try {
      const configDir = this.configPath.substring(
        0,
        this.configPath.lastIndexOf("/"),
      );
      execAsync(["mkdir", "-p", configDir]).catch(() => {});
      writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      // Silently ignore save configuration errors
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): DesktopIconConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<DesktopIconConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.notifyChange();
  }

  /**
   * Get all available applications
   */
  getAllApps(): AstalApps.Application[] {
    return this.apps.list || [];
  }

  /**
   * Get favorite applications
   */
  getFavoriteApps(): AstalApps.Application[] {
    const allApps = this.getAllApps();
    return this.config.favoriteApps
      .map((appId) =>
        allApps.find(
          (app) =>
            app.entry === appId ||
            app.name?.toLowerCase() === appId.toLowerCase() ||
            app.executable === appId,
        ),
      )
      .filter((app) => app !== undefined) as AstalApps.Application[];
  }

  /**
   * Get visible desktop applications (excluding hidden ones)
   */
  getDesktopApps(): AstalApps.Application[] {
    const allApps = this.getAllApps();
    const favoriteApps = this.getFavoriteApps();

    // Filter out hidden apps and system apps
    const visibleApps = allApps.filter((app) => {
      if (!app.name || this.config.hiddenApps.includes(app.entry || app.name)) {
        return false;
      }

      // Skip terminal-only apps by checking categories
      if (app.categories?.includes("TerminalEmulator")) {
        return false;
      }

      return true;
    });

    // Sort: favorites first, then alphabetical
    const favorites = visibleApps.filter((app) =>
      this.config.favoriteApps.includes(app.entry || app.name || ""),
    );

    const others = visibleApps
      .filter(
        (app) =>
          !this.config.favoriteApps.includes(app.entry || app.name || ""),
      )
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return [...favorites, ...others];
  }

  /**
   * Add app to favorites
   */
  addToFavorites(appId: string): void {
    if (!this.config.favoriteApps.includes(appId)) {
      this.config.favoriteApps.push(appId);
      this.saveConfig();
      this.notifyChange();
    }
  }

  /**
   * Remove app from favorites
   */
  removeFromFavorites(appId: string): void {
    const index = this.config.favoriteApps.indexOf(appId);
    if (index > -1) {
      this.config.favoriteApps.splice(index, 1);
      this.saveConfig();
      this.notifyChange();
    }
  }

  /**
   * Hide app from desktop
   */
  hideApp(appId: string): void {
    if (!this.config.hiddenApps.includes(appId)) {
      this.config.hiddenApps.push(appId);
      this.saveConfig();
      this.notifyChange();
    }
  }

  /**
   * Unhide app on desktop
   */
  unhideApp(appId: string): void {
    const index = this.config.hiddenApps.indexOf(appId);
    if (index > -1) {
      this.config.hiddenApps.splice(index, 1);
      this.saveConfig();
      this.notifyChange();
    }
  }

  /**
   * Apply theme preset
   */
  applyTheme(themeName: string): void {
    const theme = PREDEFINED_THEMES.find((t) => t.name === themeName);
    if (theme) {
      this.updateConfig({
        iconSize: theme.iconSize,
        iconSpacing: theme.spacing,
        showLabels: theme.showLabels,
      });
    }
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): DesktopIconTheme[] {
    return [...PREDEFINED_THEMES];
  }

  /**
   * Reset configuration to defaults
   */
  resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
    this.notifyChange();
  }

  /**
   * Export configuration
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration
   */
  importConfig(configJson: string): boolean {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...DEFAULT_CONFIG, ...importedConfig };
      this.saveConfig();
      this.notifyChange();
      return true;
    } catch (error) {
      // Silently ignore import configuration errors
      return false;
    }
  }

  /**
   * Search applications
   */
  searchApps(query: string): AstalApps.Application[] {
    const allApps = this.getAllApps();
    const lowerQuery = query.toLowerCase();

    return allApps.filter((app) => {
      return (
        app.name?.toLowerCase().includes(lowerQuery) ||
        app.description?.toLowerCase().includes(lowerQuery) ||
        app.executable?.toLowerCase().includes(lowerQuery) ||
        app.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery),
        )
      );
    });
  }

  /**
   * Get app categories
   */
  getAppsByCategory(): Record<string, AstalApps.Application[]> {
    const allApps = this.getDesktopApps();
    const categories: Record<string, AstalApps.Application[]> = {};

    allApps.forEach((app) => {
      const category = this.getAppCategory(app);
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(app);
    });

    return categories;
  }

  /**
   * Get app category
   */
  private getAppCategory(app: AstalApps.Application): string {
    const categories = app.categories || [];

    // Priority mapping for common categories
    const categoryMap: Record<string, string> = {
      Audio: "Multimedia",
      Video: "Multimedia",
      AudioVideo: "Multimedia",
      Graphics: "Multimedia",
      Photography: "Multimedia",
      Game: "Games",
      Development: "Programming",
      IDE: "Programming",
      TextEditor: "Programming",
      Office: "Office",
      WordProcessor: "Office",
      Spreadsheet: "Office",
      Presentation: "Office",
      Network: "Internet",
      WebBrowser: "Internet",
      Email: "Internet",
      InstantMessaging: "Internet",
      FileManager: "System",
      TerminalEmulator: "System",
      System: "System",
      Settings: "System",
      Utility: "Utilities",
      Accessories: "Utilities",
    };

    for (const category of categories) {
      if (categoryMap[category]) {
        return categoryMap[category];
      }
    }

    return "Other";
  }

  /**
   * Register change callback
   */
  onChange(callback: () => void): void {
    this.changeCallbacks.push(callback);
  }

  /**
   * Unregister change callback
   */
  offChange(callback: () => void): void {
    const index = this.changeCallbacks.indexOf(callback);
    if (index > -1) {
      this.changeCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of changes
   */
  private notifyChange(): void {
    this.changeCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        // Silently ignore change callback errors
      }
    });
  }

  /**
   * Launch application with error handling
   */
  async launchApp(app: AstalApps.Application): Promise<boolean> {
    try {
      app.launch();
      return true;
    } catch (error) {
      // Silently ignore launch errors

      // Try alternative launch methods
      if (app.executable) {
        try {
          await execAsync([app.executable]);
          return true;
        } catch (execError) {
          // Silently ignore executable launch errors
        }
      }

      return false;
    }
  }

  /**
   * Ensure icon size maintains square aspect ratio
   */
  normalizeIconSize(size: number): number {
    // Ensure size is within reasonable bounds and is even for better rendering
    const clampedSize = Math.max(16, Math.min(128, size));
    return clampedSize % 2 === 0 ? clampedSize : clampedSize + 1;
  }

  /**
   * Update icon size with square ratio enforcement
   */
  setSquareIconSize(size: number): void {
    const normalizedSize = this.normalizeIconSize(size);
    this.updateConfig({
      iconSize: normalizedSize,
      iconSpacing: Math.max(8, normalizedSize * 0.5), // Proportional spacing
    });
  }

  /**
   * Get optimal grid columns based on icon size
   */
  getOptimalGridColumns(containerWidth: number = 1920): number {
    const config = this.getConfig();
    const iconTotalWidth = config.iconSize + config.iconSpacing + 32; // Include padding
    const maxColumns = Math.floor(containerWidth / iconTotalWidth);
    return Math.max(1, Math.min(config.gridColumns, maxColumns));
  }

  /**
   * Apply square-optimized theme
   */
  applySquareTheme(size: "small" | "medium" | "large" | "extra-large"): void {
    const sizeMap = {
      small: 32,
      medium: 48,
      large: 64,
      "extra-large": 80,
    };

    const iconSize = sizeMap[size];
    this.updateConfig({
      iconSize: iconSize,
      iconSpacing: iconSize * 0.5,
      gridColumns: this.getOptimalGridColumns(),
      showLabels: size !== "small", // Hide labels for small squares
    });
  }

  /**
   * Get custom position for an app
   */
  getAppPosition(appId: string): { x: number; y: number } | null {
    return this.config.customPositions[appId] || null;
  }

  /**
   * Set custom position for an app
   */
  setAppPosition(appId: string, x: number, y: number): void {
    this.config.customPositions[appId] = { x, y };
    this.saveConfig();
    this.notifyChange();
  }

  /**
   * Remove custom position for an app (use auto-arrange)
   */
  removeAppPosition(appId: string): void {
    delete this.config.customPositions[appId];
    this.saveConfig();
    this.notifyChange();
  }

  /**
   * Clear all custom positions
   */
  clearAllPositions(): void {
    this.config.customPositions = {};
    this.saveConfig();
    this.notifyChange();
  }

  /**
   * Get grid position from pixel coordinates
   */
  pixelToGridPosition(x: number, y: number): { x: number; y: number } {
    const gridSize = 80; // Square icon size
    const gridX = Math.round(x / gridSize);
    const gridY = Math.round(y / gridSize);
    return { x: gridX, y: gridY };
  }

  /**
   * Get pixel coordinates from grid position
   */
  gridToPixelPosition(gridX: number, gridY: number): { x: number; y: number } {
    const gridSize = 80; // Square icon size
    return { x: gridX * gridSize, y: gridY * gridSize };
  }

  /**
   * Check if a grid position is occupied
   */
  isPositionOccupied(
    gridX: number,
    gridY: number,
    excludeAppId?: string,
  ): boolean {
    return Object.entries(this.config.customPositions).some(([appId, pos]) => {
      if (excludeAppId && appId === excludeAppId) return false;
      return pos.x === gridX && pos.y === gridY;
    });
  }

  /**
   * Find nearest available grid position
   */
  findNearestAvailablePosition(
    targetX: number,
    targetY: number,
    excludeAppId?: string,
  ): { x: number; y: number } {
    const maxDistance = 10;

    for (let distance = 0; distance <= maxDistance; distance++) {
      // Check positions in a spiral pattern around the target
      for (let dx = -distance; dx <= distance; dx++) {
        for (let dy = -distance; dy <= distance; dy++) {
          if (Math.abs(dx) === distance || Math.abs(dy) === distance) {
            const x = Math.max(0, targetX + dx);
            const y = Math.max(0, targetY + dy);

            if (!this.isPositionOccupied(x, y, excludeAppId)) {
              return { x, y };
            }
          }
        }
      }
    }

    // Fallback: return original position
    return { x: targetX, y: targetY };
  }

  /**
   * Get desktop icon statistics
   */
  getStats(): {
    totalApps: number;
    visibleApps: number;
    favoriteApps: number;
    hiddenApps: number;
    categories: Record<string, number>;
  } {
    const allApps = this.getAllApps();
    const visibleApps = this.getDesktopApps();
    const categories = this.getAppsByCategory();

    const categoryStats: Record<string, number> = {};
    Object.keys(categories).forEach((category) => {
      categoryStats[category] = categories[category].length;
    });

    return {
      totalApps: allApps.length,
      visibleApps: visibleApps.length,
      favoriteApps: this.config.favoriteApps.length,
      hiddenApps: this.config.hiddenApps.length,
      categories: categoryStats,
    };
  }
}

// Export singleton instance
export const desktopIconsManager = new DesktopIconsManager();

// Make it available globally for CLI access
(globalThis as any).DesktopIconsManager = desktopIconsManager;
