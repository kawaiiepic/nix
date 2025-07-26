# Desktop Icon Layout and Drag Fixes

## Issues Fixed

### 🔧 Layout Problem: Icons on Single Line
**Problem**: All desktop icons were appearing in a single horizontal line instead of a proper grid layout.

**Root Cause**: Used `Gtk.Box` with `Gtk.Orientation.HORIZONTAL` which creates a horizontal row of items.

**Solution**: Replaced with `Gtk.FlowBox` which automatically wraps items into rows and columns.

```typescript
// OLD (broken):
const gridBox = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,  // This causes single line!
});

// NEW (fixed):
const gridBox = new Gtk.FlowBox({
    maxChildrenPerLine: config.gridColumns || 8,
    columnSpacing: config.iconSpacing || 16,
    rowSpacing: config.iconSpacing || 16,
});
```

### 🖱️ Drag Functionality Not Working
**Problem**: Icon dragging was not functioning due to several API and implementation issues.

**Root Causes**:
1. Incorrect GTK4 drag API usage
2. Missing imports (`GLib`, `GObject`)
3. Wrong coordinate translation approach
4. Improper drag icon creation

**Solutions Applied**:

#### 1. Fixed GTK4 Drag Source Implementation
```typescript
// Proper drag source setup
const dragSource = new Gtk.DragSource();
dragSource.set_actions(Gdk.DragAction.MOVE);
const contentProvider = Gdk.ContentProvider.new_for_value(appId);
dragSource.set_content(contentProvider);
```

#### 2. Fixed Drag Icon Creation
```typescript
// OLD (broken API):
const paintable = new Gtk.IconPaintable({
    iconName: app.iconName,
    iconSize: 32,  // This property doesn't exist
});

// NEW (proper API):
const iconTheme = Gtk.IconTheme.get_for_display(button.get_display()!);
const paintable = iconTheme.lookup_icon(
    app.iconName || "application-x-executable",
    null, 32, 1, Gtk.TextDirection.NONE, 0
);
```

#### 3. Added Missing Imports
```typescript
import GLib from "gi://GLib";
import GObject from "gi://GObject";
```

#### 4. Fixed Drop Target Setup
```typescript
const dropTarget = new Gtk.DropTarget({
    actions: Gdk.DragAction.MOVE,
});
dropTarget.set_gtypes([GObject.TYPE_STRING]); // Fixed from GLib.TYPE_STRING
```

## How to Test the Fixes

### Testing Grid Layout
1. Open desktop - icons should appear in rows/columns, not a single line
2. Add/remove favorite apps - layout should wrap properly
3. Change grid columns in context menu - should respect column limits

### Testing Drag Functionality
1. Right-click empty desktop space
2. Select "🔄 Enable Icon Dragging" (should show checkmark when enabled)
3. Try dragging any icon - should see visual feedback:
   - Icon scales and rotates while dragging
   - Other icons become semi-transparent
   - Grid shows drag hover effect
4. Drop icon - should trigger console messages and grid refresh

## Debugging

### Console Messages to Look For
- `"Drag mode ENABLED"` - when enabling drag mode
- `"Starting drag for [AppName]"` - when drag begins
- `"Drag icon set successfully"` - when drag visual is created
- `"Drop event: draggedAppId=..."` - when drop occurs
- `"Successfully dropped..."` - on successful drop

### Common Issues and Solutions

#### "Drag disabled - enable via context menu"
**Problem**: Auto-arrange is still enabled
**Solution**: Right-click desktop → Enable Icon Dragging

#### Icons still in single line
**Problem**: FlowBox not properly configured
**Solution**: Check `maxChildrenPerLine` and spacing properties

#### Drag starts but no visual feedback
**Problem**: CSS classes not applied or theme issues
**Solution**: Check browser dev tools for CSS class application

#### Drop doesn't work
**Problem**: Drop target not receiving events
**Solution**: Verify `GObject.TYPE_STRING` import and drop target setup

## Visual Feedback Features

### Drag Mode Enabled
- Notification appears: "🔄 Icon Dragging Enabled" (top-right)
- Icons show grab cursor on hover
- Grid has special styling

### During Drag
- Dragged icon: scales up, rotates slightly, gets shadow
- Other icons: become semi-transparent (60% opacity)
- Grid: shows drag hover effect with dashed border

### Drop States
- Drop zones: highlighted with theme colors
- Success: console message and grid refresh
- Failure: error logged to console

## Configuration Options

### Grid Layout Settings
```typescript
{
    gridColumns: 8,        // Icons per row (FlowBox maxChildrenPerLine)
    iconSpacing: 16,       // Space between icons (columnSpacing/rowSpacing)
    autoArrange: true,     // When false, enables drag mode
}
```

### Context Menu Options
- "🔄 Enable Icon Dragging" - Toggle drag mode
- "Reset Icon Positions" - Clear custom positions and disable drag mode
- Various icon size presets - Update grid layout

## Future Improvements

1. **Position Persistence**: Currently drops just refresh grid, could store actual positions
2. **Multi-select**: Support dragging multiple icons at once
3. **Folders**: Create folders by dropping icons on each other
4. **Snap to Grid**: More precise grid positioning
5. **Animation**: Smooth transitions when rearranging

## Files Modified

- `Desktop.tsx`: Main implementation fixes
- `desktop.scss`: Updated CSS for FlowBox and drag states
- `DesktopIconsManager.ts`: Updated config save path to `ags-settings/`

All changes maintain backward compatibility and proper theme integration.