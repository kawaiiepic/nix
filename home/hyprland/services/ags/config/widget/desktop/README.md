# Desktop Icons Documentation

This directory contains the desktop icons implementation for the AGS configuration, providing a modern desktop experience with application icons, context menus, and customization options.

## Components

### `Desktop.tsx`
The main desktop widget that displays application icons in a grid layout.

**Features:**
- Grid-based icon layout with configurable columns and spacing
- Icon hover effects and visual feedback
- Single-click to launch applications
- Right-click context menus for app management
- Desktop background integration
- Overlay system for wallpaper + icons

### `DesktopIconsManager.ts`
Comprehensive management system for desktop icons configuration and behavior.

**Key Features:**
- Persistent configuration storage
- Favorite apps management
- Hidden apps filtering
- Theme presets
- App categorization
- Search functionality
- Statistics and analytics

## Configuration

### Default Settings
```typescript
{
  iconSize: 48,           // Icon size in pixels
  iconSpacing: 20,        // Space between icons
  gridColumns: 8,         // Max icons per row
  showLabels: true,       // Show app names below icons
  labelMaxChars: 12,      // Max characters in labels
  favoriteApps: [...],    // Pinned favorite applications
  hiddenApps: [...],      // Apps hidden from desktop
  autoArrange: true       // Auto-arrange icons
}
```

### Customization Options

**Icon Themes:**
- **Classic**: 48px icons with labels below
- **Minimal**: 32px icons without labels
- **Large**: 64px icons with enhanced spacing
- **Compact**: 40px icons with overlay labels

**Visual Effects:**
- Scale animation on hover
- Lift effect (translateY)
- Glow effects
- Smooth transitions

## Usage

### Basic Operations

**Launch Application:**
- Single left-click on any desktop icon

**Context Menu:**
- Right-click on any icon for options:
  - Launch application
  - Add/remove from favorites
  - Hide from desktop
  - View properties
  - Open file location

**Desktop Menu:**
- Right-click on empty desktop space:
  - Refresh desktop
  - Open terminal
  - Open file manager
  - Desktop settings

### Programmatic Control

```typescript
import { desktopIconsManager } from './DesktopIconsManager';

// Add to favorites
desktopIconsManager.addToFavorites('firefox');

// Apply theme
desktopIconsManager.applyTheme('Minimal');

// Update configuration
desktopIconsManager.updateConfig({
  iconSize: 64,
  gridColumns: 6
});

// Get statistics
const stats = desktopIconsManager.getStats();
console.log(`Total apps: ${stats.totalApps}`);
```

### CLI Access

The desktop manager is available globally for CLI control:

```bash
# Add app to favorites
ags -r 'DesktopIconsManager.addToFavorites("code")'

# Apply theme
ags -r 'DesktopIconsManager.applyTheme("Large")'

# Get stats
ags -r 'console.log(DesktopIconsManager.getStats())'
```

## Features

### Application Management
- **Favorites System**: Pin frequently used apps to top of grid
- **Hide Apps**: Remove unwanted apps from desktop view
- **Auto-filtering**: Automatically hides system/terminal apps
- **Smart Sorting**: Favorites first, then alphabetical

### Visual Customization
- **Configurable Grid**: Adjust columns, spacing, and icon size
- **Theme Presets**: Quick apply common layout styles
- **Label Control**: Toggle app name visibility and length
- **Hover Effects**: Multiple animation options

### Context Integration
- **App Properties**: Detailed information dialogs
- **File Manager**: Direct access to application directories
- **Launch Handling**: Robust error handling and fallbacks
- **Desktop Actions**: Quick access to common desktop tasks

## Configuration File

Settings are automatically saved to:
```
~/.config/ags-settings/desktop-icons.json
```

**Sample Configuration:**
```json
{
  "iconSize": 48,
  "iconSpacing": 20,
  "gridColumns": 8,
  "showLabels": true,
  "labelMaxChars": 12,
  "favoriteApps": [
    "firefox",
    "org.gnome.Nautilus",
    "code"
  ],
  "hiddenApps": [
    "htop",
    "vim"
  ],
  "autoArrange": true
}
```

## CSS Classes

### Desktop Icons
- `.desktop-icon-button` - Main icon button container
- `.desktop-icon` - Icon content wrapper
- `.desktop-icon-image` - Application icon image
- `.desktop-icon-label` - Application name label

### Layout
- `.desktop-grid` - Main grid container
- `.desktop-scrolled` - Scrollable viewport
- `.desktop-separator` - Visual separator between sections

### Context Menus
- `.context-menu-item` - Menu item buttons
- `.app-properties` - Properties dialog window
- `.property-label` - Property field labels
- `.property-value` - Property field values

## Keyboard Support

While primarily mouse-driven, the desktop icons support:
- **Tab Navigation**: Navigate between icons
- **Enter/Space**: Launch selected application
- **Context Menu Key**: Open context menu
- **Arrow Keys**: Grid navigation

## Performance

### Optimization Features
- **Lazy Loading**: Icons created on-demand
- **Efficient Updates**: Only refresh when needed
- **Memory Management**: Proper widget cleanup
- **Caching**: App information cached for performance

### Scalability
- **App Limiting**: Reasonable limits on displayed apps
- **Async Operations**: Non-blocking app launches
- **Error Handling**: Graceful handling of missing apps/icons

## Troubleshooting

### Icons not showing
1. Check if applications are hidden: `DesktopIconsManager.getConfig().hiddenApps`
2. Verify AstalApps service is running
3. Check app filtering criteria

### Performance issues
1. Reduce `gridColumns` for fewer icons per row
2. Disable `showLabels` for minimal resource usage
3. Clear hidden apps list periodically

### Context menu not working
1. Ensure proper Gtk event handling
2. Check popover positioning
3. Verify parent-child relationships

### Theme not applying
1. Check theme name spelling
2. Verify configuration save/load
3. Manually refresh desktop

## Integration

The desktop icons system integrates with:
- **Wallpaper Manager**: Seamless background integration
- **Theme System**: Automatic color scheme adaptation  
- **Application Launcher**: Shared app database
- **System Tray**: Consistent styling and behavior

## Future Enhancements

Planned features:
- Drag-and-drop icon positioning
- Custom icon support
- Icon grouping/folders
- Multi-monitor icon distribution
- Desktop widgets integration