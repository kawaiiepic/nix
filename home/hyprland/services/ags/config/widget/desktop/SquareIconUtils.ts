import { desktopIconsManager } from "./DesktopIconsManager";

export interface SquareIconSize {
  name: string;
  iconSize: number;
  spacing: number;
  gridColumns: number;
  showLabels: boolean;
  description: string;
}

export const SQUARE_ICON_PRESETS: SquareIconSize[] = [
  {
    name: "Tiny Squares",
    iconSize: 24,
    spacing: 12,
    gridColumns: 16,
    showLabels: false,
    description: "Ultra compact grid with tiny square icons",
  },
  {
    name: "Small Squares",
    iconSize: 32,
    spacing: 16,
    gridColumns: 12,
    showLabels: false,
    description: "Compact square icons without labels",
  },
  {
    name: "Medium Squares",
    iconSize: 48,
    spacing: 24,
    gridColumns: 8,
    showLabels: true,
    description: "Standard square icons with labels (default)",
  },
  {
    name: "Large Squares",
    iconSize: 64,
    spacing: 32,
    gridColumns: 6,
    showLabels: true,
    description: "Large square icons with full labels",
  },
  {
    name: "Extra Large Squares",
    iconSize: 80,
    spacing: 40,
    gridColumns: 4,
    showLabels: true,
    description: "Extra large square icons for accessibility",
  },
  {
    name: "Huge Squares",
    iconSize: 96,
    spacing: 48,
    gridColumns: 3,
    showLabels: true,
    description: "Huge square icons for maximum visibility",
  },
];

export class SquareIconUtils {
  /**
   * Apply a square icon preset
   */
  static applySquarePreset(presetName: string): boolean {
    const preset = SQUARE_ICON_PRESETS.find((p) => p.name === presetName);
    if (!preset) {
      // Square preset not found
      return false;
    }

    desktopIconsManager.updateConfig({
      iconSize: preset.iconSize,
      iconSpacing: preset.spacing,
      gridColumns: preset.gridColumns,
      showLabels: preset.showLabels,
    });

    return true;
  }

  /**
   * Create custom square size configuration
   */
  static createCustomSquareSize(
    size: number,
    options?: {
      showLabels?: boolean;
      gridColumns?: number;
      spacingRatio?: number;
    },
  ): void {
    const normalizedSize = this.normalizeSquareSize(size);
    const spacing = Math.round(normalizedSize * (options?.spacingRatio || 0.5));
    const columns =
      options?.gridColumns || this.calculateOptimalColumns(normalizedSize);

    desktopIconsManager.updateConfig({
      iconSize: normalizedSize,
      iconSpacing: spacing,
      gridColumns: columns,
      showLabels: options?.showLabels ?? true,
    });
  }

  /**
   * Ensure size is optimized for square rendering
   */
  static normalizeSquareSize(size: number): number {
    // Clamp to reasonable bounds
    const clampedSize = Math.max(16, Math.min(128, size));

    // Round to even number for crisp rendering
    return clampedSize % 2 === 0 ? clampedSize : clampedSize + 1;
  }

  /**
   * Calculate optimal columns based on icon size
   */
  static calculateOptimalColumns(
    iconSize: number,
    screenWidth: number = 1920,
  ): number {
    const totalIconWidth = iconSize + iconSize * 0.5 + 64; // Icon + spacing + padding
    const maxColumns = Math.floor(screenWidth / totalIconWidth);

    // Provide sensible defaults based on icon size
    if (iconSize <= 32) return Math.min(maxColumns, 16);
    if (iconSize <= 48) return Math.min(maxColumns, 8);
    if (iconSize <= 64) return Math.min(maxColumns, 6);
    return Math.min(maxColumns, 4);
  }

  /**
   * Get current square icon configuration
   */
  static getCurrentSquareConfig(): {
    preset: string | null;
    isSquare: boolean;
    aspectRatio: number;
    config: any;
  } {
    const config = desktopIconsManager.getConfig();

    // Check if current config matches any preset
    const matchingPreset = SQUARE_ICON_PRESETS.find(
      (preset) =>
        preset.iconSize === config.iconSize &&
        preset.spacing === config.iconSpacing &&
        preset.gridColumns === config.gridColumns &&
        preset.showLabels === config.showLabels,
    );

    return {
      preset: matchingPreset?.name || null,
      isSquare: true, // All our icons are now square
      aspectRatio: 1.0,
      config: config,
    };
  }

  /**
   * Quick size adjustments
   */
  static adjustSquareSize(direction: "increase" | "decrease"): void {
    const currentConfig = desktopIconsManager.getConfig();
    const currentSize = currentConfig.iconSize;

    const sizeSteps = [16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128];
    const currentIndex = sizeSteps.findIndex((size) => size >= currentSize);

    let newSize: number;
    if (direction === "increase") {
      newSize =
        currentIndex < sizeSteps.length - 1
          ? sizeSteps[currentIndex + 1]
          : currentSize;
    } else {
      newSize = currentIndex > 0 ? sizeSteps[currentIndex - 1] : currentSize;
    }

    if (newSize !== currentSize) {
      this.createCustomSquareSize(newSize, {
        showLabels: currentConfig.showLabels,
        gridColumns: this.calculateOptimalColumns(newSize),
      });
    }
  }

  /**
   * Toggle labels while maintaining square layout
   */
  static toggleSquareLabels(): void {
    const currentConfig = desktopIconsManager.getConfig();
    desktopIconsManager.updateConfig({
      showLabels: !currentConfig.showLabels,
    });
  }

  /**
   * Auto-fit squares to screen resolution
   */
  static autoFitSquaresToScreen(
    screenWidth: number = 1920,
    targetColumns?: number,
  ): void {
    const columns = targetColumns || 8;
    const availableWidth = screenWidth - 80; // Account for margins
    const maxIconWidth = Math.floor(availableWidth / columns) - 64; // Space for spacing and padding

    // Find largest suitable icon size
    const optimalSize = Math.min(maxIconWidth, 96); // Cap at 96px for usability
    const normalizedSize = this.normalizeSquareSize(optimalSize);

    this.createCustomSquareSize(normalizedSize, {
      gridColumns: columns,
      showLabels: normalizedSize >= 32,
    });
  }

  /**
   * Get available square presets
   */
  static getSquarePresets(): SquareIconSize[] {
    return [...SQUARE_ICON_PRESETS];
  }

  /**
   * Reset to default square configuration
   */
  static resetToDefaultSquares(): void {
    this.applySquarePreset("Medium Squares");
  }

  /**
   * Generate CSS for CSS Grid square rendering
   */
  static generateSquareCSS(iconSize: number): string {
    const buttonWidth = 80;
    const buttonHeight = 96;

    return `
      .desktop-grid {
        --grid-columns: 8 !important;
        --icon-width: ${buttonWidth}px !important;
        --icon-height: ${buttonHeight}px !important;
        --grid-gap: 16px !important;
        display: grid !important;
        grid-template-columns: repeat(var(--grid-columns), var(--icon-width)) !important;
        grid-auto-rows: var(--icon-height) !important;
        gap: var(--grid-gap) !important;
        justify-content: start !important;
        align-content: start !important;
        grid-auto-flow: row !important;
      }

      .desktop-icon-button {
        width: var(--icon-width) !important;
        height: var(--icon-height) !important;
        min-width: var(--icon-width) !important;
        min-height: var(--icon-height) !important;
        max-width: var(--icon-width) !important;
        max-height: var(--icon-height) !important;
        aspect-ratio: 0.833 !important;
        display: flex !important;
        align-items: flex-start !important;
        justify-content: center !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        border: 1px dotted transparent !important;
        border-radius: 2px !important;
        position: relative !important;
        outline: none !important;
        transition: all 200ms ease !important;
        margin: 0 !important;
        padding: 4px !important;
      }

      .desktop-icon-button:hover {
        background: rgba(173, 216, 230, 0.3) !important;
        border-color: rgba(173, 216, 230, 0.8) !important;
        border-style: solid !important;
      }

      .desktop-icon-button:active {
        background: rgba(173, 216, 230, 0.5) !important;
        border-color: rgba(173, 216, 230, 1) !important;
      }

      .desktop-icon-button:focus,
      .desktop-icon-button.focused {
        border: 1px dotted rgba(0, 0, 0, 0.8) !important;
        outline: none !important;
      }

      .desktop-icon-button.selected {
        background: rgba(0, 120, 215, 0.3) !important;
        border: 1px solid rgba(0, 120, 215, 0.8) !important;
      }

      .desktop-icon-button.launching {
        background: rgba(255, 255, 255, 0.2) !important;
        animation: none !important;
      }

      .desktop-icon-image {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        max-width: 32px !important;
        max-height: 32px !important;
        flex-shrink: 0 !important;
        object-fit: contain !important;
        border: none !important;
        border-radius: 0px !important;
        box-sizing: border-box !important;
        margin-bottom: 4px !important;
        filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3)) !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        image-rendering: auto !important;
        transition: none !important;
      }

      .desktop-icon-label {
        width: 72px !important;
        max-width: 72px !important;
        text-align: center !important;
        word-wrap: break-word !important;
        line-height: 1.2 !important;
        font-size: 11px !important;
        font-family: "Segoe UI", -apple-system, system-ui, sans-serif !important;
        font-weight: 400 !important;
        color: white !important;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8) !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 3 !important;
        -webkit-box-orient: vertical !important;
        padding: 2px !important;
        background: transparent !important;
        border-radius: 2px !important;
        margin-top: 2px !important;
        hyphens: auto !important;
      }

      .desktop-icon-button:hover .desktop-icon-label {
        background: rgba(173, 216, 230, 0.8) !important;
        color: black !important;
        text-shadow: none !important;
      }

      .desktop-icon-button.selected .desktop-icon-label {
        background: rgba(0, 120, 215, 0.8) !important;
        color: white !important;
        text-shadow: none !important;
      }
    `;
  }

  /**
   * Apply theme-aware square borders
   */
  static generateThemedSquareCSS(
    iconSize: number,
    isDarkMode: boolean = true,
  ): string {
    const buttonSize = iconSize + 32;
    const baseCSS = this.generateSquareCSS(iconSize);

    const themeOverrides = isDarkMode
      ? `
      .desktop-icon-button::before {
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      .desktop-icon-button:hover {
        border-color: rgba(255, 255, 255, 0.25) !important;
      }

      .desktop-icon-button:hover::before {
        border-color: rgba(255, 255, 255, 0.35) !important;
      }

      .desktop-icon-image {
        border-color: rgba(255, 255, 255, 0.06) !important;
      }
    `
      : `
      .desktop-icon-button::before {
        border-color: rgba(0, 0, 0, 0.15) !important;
      }

      .desktop-icon-button:hover {
        border-color: rgba(0, 0, 0, 0.3) !important;
      }

      .desktop-icon-button:hover::before {
        border-color: rgba(0, 0, 0, 0.4) !important;
      }

      .desktop-icon-image {
        border-color: rgba(0, 0, 0, 0.1) !important;
      }
    `;

    return baseCSS + themeOverrides;
  }

  /**
   * Debug square icon layout
   */
  static debugSquareLayout(): void {
    const config = desktopIconsManager.getConfig();
    const current = this.getCurrentSquareConfig();

    // Debug info available but not logged
  }
}

// Export convenience functions
export const applySquarePreset = SquareIconUtils.applySquarePreset;
export const createCustomSquareSize = SquareIconUtils.createCustomSquareSize;
export const adjustSquareSize = SquareIconUtils.adjustSquareSize;
export const toggleSquareLabels = SquareIconUtils.toggleSquareLabels;
export const autoFitSquaresToScreen = SquareIconUtils.autoFitSquaresToScreen;
export const resetToDefaultSquares = SquareIconUtils.resetToDefaultSquares;

// Make available globally for CLI access
(globalThis as any).SquareIconUtils = SquareIconUtils;
