# Theme Color Reference for Desktop Widget

This document lists the available theme colors that can be used with `theme-get()` in the desktop SCSS files.

## Available Theme Colors

Based on the `_theme.scss` file, the following colors are available:

### Text Colors
- `text` - Main text color
- `subtext1` - Secondary text color
- `subtext0` - Tertiary text color

### Overlay Colors
- `overlay2` - Highest overlay opacity
- `overlay1` - Medium overlay opacity  
- `overlay0` - Lowest overlay opacity

### Surface Colors
- `surface2` - Darkest surface
- `surface1` - Medium surface
- `surface0` - Lightest surface

### Base Colors
- `base` - Main background color
- `mantle` - Secondary background
- `crust` - Darkest background

### Accent Colors (Macchiato Theme)
- `color0` - #f4dbd6 (Rosewater)
- `color1` - #f0c6c6 (Flamingo)
- `color2` - #f5bde6 (Pink)
- `color3` - #c6a0f6 (Mauve)
- `color4` - #ed8796 (Red)
- `color5` - #ee99a0 (Maroon)
- `color6` - #f5a97f (Peach)
- `color7` - #eed49f (Yellow)
- `color8` - #a6da95 (Green)
- `color9` - #8bd5ca (Teal)
- `color10` - #91d7e3 (Sky)
- `color11` - #7dc4e4 (Sapphire)
- `color12` - #8aadf4 (Blue) - Used for drag effects
- `color13` - #b7bdf8 (Lavender)

## Usage in Desktop Drag Effects

### Primary Drag Color
- **Main drag accent**: `color12` (#8aadf4 - Blue)
- **Background contrast**: `crust` for text on colored backgrounds

### Example Usage
```scss
@include theme() {
    .desktop-icon-button.dragging {
        border-color: theme-get("color12");
        background: color-mix(in srgb, theme-get("color12"), transparent 70%);
        
        .desktop-icon-label {
            background: theme-get("color12");
            color: theme-get("crust");
        }
    }
}
```

## Best Practices

1. **Clean separation of concerns** - Keep structural/layout styles in base sections, all colors in theme blocks
2. **Always use `theme-get()` inside `@include theme()`** - theme-get() can only be used within theme blocks
3. **No colors in base styles** - Base styles should only contain layout, sizing, transitions, and structural properties
4. **For semi-transparent colors** - Use `color-mix(in srgb, theme-get("color"), transparent X%)` inside theme blocks
5. **Text contrast** - Use `crust` for text on light colored backgrounds, `text` for dark backgrounds
6. **Surface hierarchy** - Use `surface0` → `surface1` → `surface2` for layered elements
7. **Opacity control** - Use color-mix with transparency percentages (e.g., `transparent 30%` = 30% transparent)

## Drag Effect Color Choices

Inside `@include theme()` blocks:
- **Primary drag indicator**: `theme-get("color12")` (Blue) - Good visibility and Windows-like
- **Hover states**: `color-mix(in srgb, theme-get("color12"), transparent 80-90%)`
- **Active drag**: `color-mix(in srgb, theme-get("color12"), transparent 50-70%)`
- **Text on drag elements**: `theme-get("crust")` (provides good contrast)
- **Drop zones**: `theme-get("color12")` with dashed borders
- **Shadows**: `color-mix(in srgb, theme-get("crust"), transparent 70-90%)`

Outside theme blocks (base styles):
- No colors at all - only structural properties like sizing, positioning, transitions

## Invalid Color References

❌ **Do NOT use these** (they don't exist in the theme):
- `blue` 
- `shadow`
- `primary`
- `secondary`
- `accent`
- `theme-get()` outside of `@include theme()` blocks
- Any color properties in base styles (background, color, border-color, etc.)

✅ **Use these instead**:
- `theme-get("color12")` for blue tones (inside theme blocks)
- `color-mix(in srgb, theme-get("crust"), transparent X%)` for shadows (inside theme blocks)
- `theme-get("color3")` or `theme-get("color12")` for primary accents (inside theme blocks)
- `theme-get("surface1")` or `theme-get("surface2")` for secondary elements (inside theme blocks)
- Clean base styles with no color properties
- `color-mix()` function for all transparency effects

## Structure Example
```scss
// Base styles (structural only - no colors!)
.desktop-icon-button {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    transition: all 200ms ease;
    cursor: pointer;
    // NO color properties here!
}

.desktop-icon-button.dragging {
    opacity: 0.8;
    transform: scale(1.1) rotate(2deg);
    z-index: 1000;
    // NO color properties here!
}

// Theme-aware styles (all colors here)
@include theme() {
    .desktop-icon-button {
        background: color-mix(in srgb, theme-get("color12"), transparent 70%);
        border: 1px solid theme-get("color12");
        color: theme-get("text");
        
        &.dragging {
            background: color-mix(in srgb, theme-get("color12"), transparent 50%);
            border: 2px solid theme-get("color12");
            box-shadow: 0 6px 12px color-mix(in srgb, theme-get("crust"), transparent 60%);
        }
    }
}
```