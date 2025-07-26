# Desktop Settings Migration Guide

## Configuration Location Change

The desktop icons configuration has been moved from:
- **Old location**: `~/.config/ags/desktop-icons.json`
- **New location**: `~/.config/ags-settings/desktop-icons.json`

## Migration Steps

### Automatic Migration
The system will automatically create the new configuration file with default settings. Your existing settings will not be automatically migrated.

### Manual Migration (Recommended)
If you have customized settings in the old location, follow these steps:

1. **Check if old config exists**:
   ```bash
   ls -la ~/.config/ags/desktop-icons.json
   ```

2. **Create new directory**:
   ```bash
   mkdir -p ~/.config/ags-settings
   ```

3. **Copy existing config**:
   ```bash
   cp ~/.config/ags/desktop-icons.json ~/.config/ags-settings/desktop-icons.json
   ```

4. **Verify migration**:
   ```bash
   cat ~/.config/ags-settings/desktop-icons.json
   ```

5. **Remove old config** (optional):
   ```bash
   rm ~/.config/ags/desktop-icons.json
   ```

## What Gets Migrated

The following settings will be preserved:
- ✅ **Icon size and spacing**
- ✅ **Favorite applications list**
- ✅ **Hidden applications list**
- ✅ **Custom icon positions** (if drag mode was used)
- ✅ **Theme preferences**
- ✅ **Grid layout settings**

## New Features After Migration

After migration, you'll have access to:
- 🔄 **Enhanced drag and drop** - Windows-like icon dragging
- 🎯 **Improved visual feedback** - Better hover and drag states
- ⚙️ **More configuration options** - Extended customization
- 🎨 **Better theme integration** - Improved color handling

## Troubleshooting

### Config Not Found
If you get "config not found" errors:
1. Ensure the directory exists: `mkdir -p ~/.config/ags-settings`
2. Restart AGS: `ags -q && ags`

### Settings Reset
If your settings appear reset after upgrade:
1. Check old location: `~/.config/ags/desktop-icons.json`
2. Follow manual migration steps above
3. Restart AGS after copying

### Permission Issues
If you can't create the new directory:
```bash
sudo mkdir -p ~/.config/ags-settings
sudo chown $USER:$USER ~/.config/ags-settings
```

## Verification

After migration, verify everything works:

1. **Open desktop**: Icons should appear as before
2. **Right-click empty space**: Context menu should work
3. **Check drag mode**: Try enabling icon dragging
4. **Test favorites**: Your favorite apps should be preserved

## Rollback (If Needed)

To rollback to the old location:
1. Copy config back: `cp ~/.config/ags-settings/desktop-icons.json ~/.config/ags/desktop-icons.json`
2. Edit `DesktopIconsManager.ts` to use old path
3. Restart AGS

## Benefits of New Location

- **Better organization**: Separates AGS settings from main config
- **Cleaner structure**: Dedicated settings directory
- **Future-proof**: Room for additional setting files
- **Consistent naming**: Matches other AGS components

## Need Help?

If you encounter issues during migration:
1. Check AGS logs for error messages
2. Verify file permissions on both directories
3. Ensure JSON syntax is valid in migrated config
4. Try starting with default config first, then migrate