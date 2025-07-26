# Desktop Icon Drag & Drop Features

## Overview
This document describes the Windows-like drag and drop functionality added to the Desktop.tsx component, allowing users to manually position desktop icons by dragging them around the desktop grid.

## Features

### 🔄 Icon Dragging
- **Windows-like Experience**: Drag desktop icons to reposition them, similar to Windows desktop behavior
- **Visual Feedback**: Icons show dragging state with scaling, rotation, and shadow effects
- **Grid Snapping**: Icons automatically snap to the nearest available grid position
- **Collision Detection**: Prevents icons from overlapping by finding the nearest available position

### 🎯 Visual Indicators
- **Drag Mode Indicator**: Shows "🔄 Icon Dragging Enabled" notification when drag mode is active
- **Grid Position Hints**: Displays grid position guides during drag operations
- **Drag Hover Effects**: Grid shows visual feedback with dashed borders and diagonal stripes
- **Icon States**: Clear visual distinction between normal, dragging, and drop target states

### ⚙️ Configuration Options
- **Toggle Drag Mode**: Enable/disable icon dragging via right-click context menu
- **Auto-Arrange**: When enabled, icons use automatic grid layout
- **Custom Positions**: When disabled, allows manual icon positioning
- **Reset Positions**: Clear all custom positions and return to auto-arrange mode

## Usage

### Enabling Drag Mode
1. Right-click on empty desktop space
2. Select "Enable Icon Dragging" from the context menu
3. Icons will now show drag cursors and can be moved by dragging

### Dragging Icons
1. Ensure drag mode is enabled (see above)
2. Click and drag any desktop icon
3. Icon will show visual feedback (scaling, rotation, shadow)
4. Release to drop icon at the nearest available grid position
5. Position is automatically saved and persists across sessions

### Disabling Drag Mode
1. Right-click on empty desktop space
2. Select "Disable Icon Dragging" from the context menu
3. Icons return to auto-arrange mode

### Resetting Icon Positions
1. Right-click on empty desktop space
2. Select "Reset Icon Positions" from the context menu
3. All custom positions are cleared and auto-arrange is re-enabled

## Technical Implementation

### Drag Detection
- Uses `Gtk.GestureDrag` for reliable drag detection
- Configurable drag threshold (8px) to distinguish between clicks and drags
- Prevents accidental launches during drag operations

### Position Management
- Grid-based positioning system (80x80px squares)
- Pixel-to-grid and grid-to-pixel coordinate conversion
- Collision detection with spiral search for nearest available position
- Persistent storage in desktop configuration file

### Visual Effects
- CSS transforms for drag feedback (scale, rotate, shadow)
- Grid overlay during drag operations
- Smooth transitions and animations
- Theme-aware styling with proper contrast

### Data Persistence
- Custom positions stored in `~/.config/ags-settings/desktop-icons.json`
- Automatic saving when icons are moved
- Preserved across application restarts

## CSS Classes

### Grid States
- `.drag-mode-enabled`: Applied when drag mode is active
- `.drag-hover`: Applied during drag operations
- `.show-grid-positions`: Shows grid position indicators

### Icon States
- `.dragging`: Applied to icon being dragged
- `.drop-target`: Applied to potential drop targets
- `.launching`: Applied during app launch

## Configuration

### DesktopIconConfig Interface
```typescript
interface DesktopIconConfig {
  // ... other properties
  customPositions: Record<string, { x: number; y: number }>;
  autoArrange: boolean;
}
```

### New Manager Methods
- `getAppPosition(appId: string)`: Get custom position for an app
- `setAppPosition(appId: string, x: number, y: number)`: Set custom position
- `removeAppPosition(appId: string)`: Remove custom position
- `clearAllPositions()`: Clear all custom positions
- `pixelToGridPosition(x, y)`: Convert pixel coordinates to grid position
- `gridToPixelPosition(gridX, gridY)`: Convert grid position to pixels
- `isPositionOccupied(gridX, gridY, excludeAppId?)`: Check if position is occupied
- `findNearestAvailablePosition(targetX, targetY, excludeAppId?)`: Find nearest free position

## Keyboard Accessibility
- Icons remain keyboard navigable when drag mode is enabled
- Focus states are preserved during drag operations
- Tab order is maintained in grid layout

## Performance Considerations
- Drag operations use efficient gesture detection
- Position calculations are optimized with grid-based system
- Visual effects use CSS transforms for hardware acceleration
- Configuration changes are debounced to prevent excessive disk writes

## Browser Compatibility
- Built using GTK4 APIs for native desktop performance
- Hardware-accelerated CSS animations
- Efficient event handling with minimal DOM updates

## Troubleshooting

### Icons Not Dragging
1. Ensure drag mode is enabled via context menu
2. Check that `autoArrange` is set to `false` in configuration
3. Verify sufficient drag threshold is met (8px minimum)

### Icons Overlapping
- The collision detection system should prevent this automatically
- If it occurs, use "Reset Icon Positions" to clear corrupted data

### Visual Glitches
- Ensure theme is properly loaded
- Check CSS class application in browser dev tools
- Verify grid dimensions match CSS variables

## Future Enhancements
- Multi-select dragging (drag multiple icons at once)
- Selection rectangle for bulk operations
- Drag and drop between desktop and launcher
- Custom grid sizes and snap-to-grid options
- Icon grouping and folder creation