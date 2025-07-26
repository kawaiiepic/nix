# Drag Testing Guide

## Quick Test Steps

1. **Enable Drag Mode**
   - Right-click on empty desktop space
   - Click "🔄 Enable Icon Dragging (TEST)"
   - You should see notification appear: "🔄 Icon Dragging Enabled"

2. **Test Dragging**
   - Click and hold any desktop icon
   - Drag it around (move at least 8 pixels)
   - You should see:
     - Icon scales up (110%) and rotates (2 degrees)
     - Icon gets a blue border and shadow
     - Other icons become semi-transparent (60% opacity)
   - Release the icon

3. **Verify Result**
   - Check console for messages:
     - `"Drag begin for [AppName] at x, y"`
     - `"Started dragging [AppName] - moved Xpx"`
     - `"✅ Successfully dragged [AppName]! Drag is working."`
     - `"Adding/Removing [AppName] from favorites"`
   - Icon should toggle its favorite status (favorites appear first in grid)

## Visual Indicators

### Drag Mode Enabled
- Blue notification box appears (top-right): "🔄 Icon Dragging Enabled"
- Icon tooltips show: "🔄 Drag me to test dragging!"
- Context menu shows: "❌ Disable Icon Dragging"

### During Drag
- **Dragged Icon**: Larger, rotated, blue border, shadow
- **Other Icons**: Semi-transparent
- **Grid**: May show drag hover effects

### After Drop
- **Console Success**: "✅ Successfully dragged [AppName]! Drag is working."
- **Icon Reorder**: Favorites move to front, others to back
- **Visual Reset**: All effects return to normal

## Troubleshooting

### No Visual Feedback During Drag
- Check console for "Drag disabled - enable via context menu"
- Verify drag mode is enabled (see notification)
- Try dragging further (needs 8+ pixel movement)

### No Console Messages
- Open browser dev tools (F12) → Console tab
- Try disabling and re-enabling drag mode
- Restart AGS if needed

### Icons Don't Move
- This is expected! Current implementation only:
  - Provides visual feedback
  - Toggles favorite status
  - Logs success messages
- Actual repositioning requires more complex implementation

## Expected Behavior

✅ **What Should Work:**
- Visual drag feedback (scaling, rotation, transparency)
- Console debug messages
- Favorite status toggling
- Smooth drag gestures

❌ **What Doesn't Work Yet:**
- Actual icon repositioning
- Persistent custom positions
- Multi-icon selection
- Folder creation

## Success Criteria

The drag system is working if you see:

1. **Visual Changes**: Icon scales/rotates during drag
2. **Console Output**: Success messages in browser console  
3. **State Changes**: Icon favorite status toggles
4. **Smooth Interaction**: No lag or glitches during drag

If you see all of these, the basic drag system is functional and ready for enhanced features like positional persistence.

## Next Steps

Once basic dragging works, we can add:
- Actual position saving
- Grid-based snapping
- Multi-select dragging
- Undo/redo functionality