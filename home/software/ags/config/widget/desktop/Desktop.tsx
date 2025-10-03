import { Astal, Gdk, Gtk } from "ags/gtk4";
import { setup_theme } from "../theme";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import { execAsync, exec } from "ags/process";
import { readFile, writeFile } from "ags/file";
import Pango from "gi://Pango?version=1.0";
import { backgroundImage } from "./WallpaperManager";

interface DesktopFile {
  name: string;
  displayName: string;
  path: string;
  isDirectory: boolean;
  iconName: string;
  isDesktopFile: boolean;
  execCommand?: string;
  gridIndex?: number;
}

interface DesktopIconProps {
  file: DesktopFile;
  onLaunch?: () => void;
}

// Position tracking system
let desktopPositions: { [fileName: string]: number } = {};
const positionsFile = `${GLib.get_home_dir()}/.desktop-positions.json`;

function loadDesktopPositions() {
  try {
    const content = readFile(positionsFile);
    desktopPositions = JSON.parse(content);
  } catch {
    desktopPositions = {};
  }
}

function saveDesktopPositions() {
  try {
    writeFile(positionsFile, JSON.stringify(desktopPositions, null, 2));
  } catch (error) {
    // Silently ignore save errors
  }
}

function DesktopIcon({ file, onLaunch }: DesktopIconProps): Gtk.Widget {
  const iconSize = 32;

  const iconBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 1,
    cssClasses: ["desktop-icon"],
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.FILL,
    hexpand: false,
    vexpand: false,
    widthRequest: 64,
    heightRequest: 64,
  });

  // File icon
  const icon = new Gtk.Image({
    pixelSize: iconSize,
    iconName: file.iconName,
    cssClasses: ["desktop-icon-image"],
    widthRequest: iconSize,
    heightRequest: iconSize,
  });

  // File label
  let displayName = file.displayName;
  if (displayName.length > 10) {
    displayName = displayName.substring(0, 7) + "...";
  }

  const label = new Gtk.Label({
    label: displayName,
    cssClasses: ["label"],
    justify: Gtk.Justification.CENTER,
    wrap: false,
    maxWidthChars: 8,
    ellipsize: Pango.EllipsizeMode.END,
  });

  const button = new Gtk.Button({
    cssClasses: ["desktop-icon-button"],
    child: iconBox,
    tooltipText: file.name === "trash" ? "Open Trash" : file.path,
    focusOnClick: true,
    hasFrame: false,
  });

  iconBox.append(icon);
  iconBox.append(label);

  // Add right-click context menu for trash
  if (file.name === "trash") {
    const rightClick = new Gtk.GestureClick();
    rightClick.set_button(3); // Right mouse button

    rightClick.connect("pressed", () => {
      const popover = new Gtk.Popover();
      const menuBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 4,
        marginTop: 8,
        marginBottom: 8,
        marginStart: 8,
        marginEnd: 8,
      });

      const openButton = new Gtk.Button({
        label: "📂 Open Trash",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      const emptyButton = new Gtk.Button({
        label: "🗑️ Empty Trash",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      openButton.connect("clicked", () => {
        popover.popdown();
        execAsync(["xdg-open", "trash:///"]).catch((error) => {
          // Silently ignore open trash errors
        });
      });

      emptyButton.connect("clicked", () => {
        popover.popdown();
        execAsync(["gio", "trash", "--empty"])
          .then(() => {
            if (onLaunch) onLaunch(); // Refresh to update icon
          })
          .catch((error) => {
            // Silently ignore empty trash errors
          });
      });

      menuBox.append(openButton);
      menuBox.append(emptyButton);
      popover.set_child(menuBox);
      popover.set_parent(button);
      popover.popup();
    });

    button.add_controller(rightClick);
  }

  // Add right-click context menu for regular desktop icons
  if (file.name !== "trash") {
    const iconRightClick = new Gtk.GestureClick();
    iconRightClick.set_button(3); // Right mouse button

    iconRightClick.connect("pressed", () => {
      const popover = new Gtk.Popover();
      popover.add_css_class("desktop-icon-menu");
      const menuBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 4,
        marginTop: 8,
        marginBottom: 8,
        marginStart: 8,
        marginEnd: 8,
      });

      const openButton = new Gtk.Button({
        label: "📂 Open",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      const copyButton = new Gtk.Button({
        label: "📋 Copy",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      const cutButton = new Gtk.Button({
        label: "✂️ Cut",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      const deleteButton = new Gtk.Button({
        label: "🗑️ Delete",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      const propertiesButton = new Gtk.Button({
        label: "🔧 Properties",
        cssClasses: ["context-menu-item"],
        hasFrame: false,
      });

      openButton.connect("clicked", () => {
        popover.popdown();
        // Trigger the same action as left-click
        button.emit("clicked");
      });

      copyButton.connect("clicked", () => {
        popover.popdown();
        execAsync(["echo", file.path]).then((output) => {
          execAsync(["wl-copy", output]).catch((error) => {
            // Silently ignore copy errors
          });
        });
      });

      cutButton.connect("clicked", () => {
        popover.popdown();
        // Store cut file path globally for paste operations
        (globalThis as any).cutFilePath = file.path;
      });

      deleteButton.connect("clicked", () => {
        popover.popdown();

        // Create confirmation dialog
        const confirmDialog = new Gtk.Popover();
        confirmDialog.add_css_class("delete-confirm");
        const confirmBox = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL,
          spacing: 8,
          marginTop: 12,
          marginBottom: 12,
          marginStart: 12,
          marginEnd: 12,
        });

        const messageLabel = new Gtk.Label({
          label: `Are you sure you want to delete "${file.displayName}"?`,
          wrap: true,
          maxWidthChars: 30,
        });

        const buttonBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 8,
          halign: Gtk.Align.END,
        });

        const cancelButton = new Gtk.Button({
          label: "Cancel",
          cssClasses: ["context-menu-item"],
          hasFrame: false,
        });

        const confirmDeleteButton = new Gtk.Button({
          label: "🗑️ Delete",
          cssClasses: ["context-menu-item"],
          hasFrame: false,
        });

        cancelButton.connect("clicked", () => {
          confirmDialog.popdown();
        });

        confirmDeleteButton.connect("clicked", () => {
          confirmDialog.popdown();
          execAsync(["gio", "trash", file.path])
            .then(() => {
              if (onLaunch) onLaunch(); // Refresh to remove from desktop
            })
            .catch((error) => {
              // Silently ignore delete errors
            });
        });

        buttonBox.append(cancelButton);
        buttonBox.append(confirmDeleteButton);
        confirmBox.append(messageLabel);
        confirmBox.append(buttonBox);
        confirmDialog.set_child(confirmBox);
        confirmDialog.set_parent(button);
        confirmDialog.popup();
      });

      propertiesButton.connect("clicked", () => {
        popover.popdown();
        execAsync(["nautilus", "--properties", file.path]).catch((error) => {
          // Silently ignore properties errors
        });
      });

      menuBox.append(openButton);
      menuBox.append(new Gtk.Separator());
      menuBox.append(copyButton);
      menuBox.append(cutButton);
      menuBox.append(new Gtk.Separator());
      menuBox.append(deleteButton);
      menuBox.append(new Gtk.Separator());
      menuBox.append(propertiesButton);
      popover.set_child(menuBox);
      popover.set_parent(button);
      popover.popup();
    });

    button.add_controller(iconRightClick);
  }

  // Drag and drop functionality
  let isDragging = false;

  // Drag source
  const dragSource = new Gtk.DragSource();
  dragSource.set_actions(Gdk.DragAction.MOVE);

  dragSource.connect("prepare", () => {
    isDragging = true;
    button.add_css_class("dragging");
    return Gdk.ContentProvider.new_for_value(file.path);
  });

  dragSource.connect("drag-begin", (source, drag) => {
    // Show grid overlay when drag begins
    const overlay = (globalThis as any).desktopGridOverlay;
    if (overlay) {
      overlay.set_visible(true);
      // Grid cells will be shown individually on hover
    }
  });

  dragSource.connect("drag-end", () => {
    isDragging = false;
    button.remove_css_class("dragging");
    // Hide grid overlay
    const overlay = (globalThis as any).desktopGridOverlay;
    if (overlay) {
      overlay.set_visible(true);
      // Reset all cell highlights and hide all cells
      let child = overlay.get_first_child();
      while (child) {
        child.remove_css_class("grid-cell-hover");
        child.set_visible(true);
        child = child.get_next_sibling();
      }
    }
  });

  button.add_controller(dragSource);

  // Drop target
  const dropTarget = new Gtk.DropTarget();
  dropTarget.set_gtypes([GObject.TYPE_STRING]);
  dropTarget.set_actions(Gdk.DragAction.MOVE);

  dropTarget.connect("enter", () => {
    if (!isDragging) {
      if (file.name === "trash") {
        button.add_css_class("trash-drop-target");
      } else {
        button.add_css_class("drop-target");
      }
    }
  });

  dropTarget.connect("leave", () => {
    button.remove_css_class("drop-target");
    button.remove_css_class("trash-drop-target");
  });

  dropTarget.connect("drop", (target, value, x, y) => {
    const draggedPath = value.toString();
    if (draggedPath !== file.path) {
      if (file.name === "trash") {
        // Handle dropping files on trash
        const draggedFileName = GLib.path_get_basename(draggedPath);
        execAsync(["gio", "trash", draggedPath])
          .then(() => {
            if (onLaunch) onLaunch(); // Trigger refresh to update trash icon
          })
          .catch((error) => {
            // Silently ignore trash errors
          });
      } else {
        // Swap positions in our tracking system
        swapDesktopPositions(draggedPath, file.path);
        if (onLaunch) onLaunch(); // Trigger refresh
      }
    }
    button.remove_css_class("drop-target");
    button.remove_css_class("trash-drop-target");
    return true;
  });

  button.add_controller(dropTarget);

  // Single click to open file or launch application
  button.connect("clicked", () => {
    if (isDragging) return; // Don't launch if we were dragging

    button.add_css_class("launching");

    let execPromise: Promise<string>;

    if (file.name === "trash") {
      // Handle trash icon click - open file manager to trash
      execPromise = execAsync(["xdg-open", "trash:///"]);
    } else if (file.isDesktopFile && file.execCommand) {
      // Launch application from .desktop file
      const command = file.execCommand.replace(/%[fFuU]/g, "").trim();
      const args = command.split(" ");
      execPromise = execAsync(args);
    } else if (file.isDirectory) {
      execPromise = execAsync(["xdg-open", file.path]);
    } else {
      execPromise = execAsync(["xdg-open", file.path]);
    }

    execPromise
      .then(() => {
        onLaunch?.();
      })
      .catch((error) => {
        // Silently ignore open errors
      })
      .finally(() => {
        setTimeout(() => {
          button.remove_css_class("launching");
        }, 300);
      });
  });

  // Handle focus states for keyboard navigation
  const focusController = new Gtk.EventControllerFocus();
  focusController.connect("enter", () => {
    button.add_css_class("focused");
  });

  focusController.connect("leave", () => {
    button.remove_css_class("focused");
  });

  button.add_controller(focusController);

  return button;
}

// Function to swap two files on the desktop using temporary file
async function swapDesktopFiles(file1Path: string, file2Path: string) {
  try {
    const tempPath = file1Path + ".temp_swap";

    // Move file1 to temp
    const result1 = GLib.spawn_sync(
      null,
      ["mv", file1Path, tempPath],
      null,
      GLib.SpawnFlags.DEFAULT,
      null,
    );
    if (result1[0] !== true) throw new Error("Failed to move file1 to temp");

    // Move file2 to file1's position
    const result2 = GLib.spawn_sync(
      null,
      ["mv", file2Path, file1Path],
      null,
      GLib.SpawnFlags.DEFAULT,
      null,
    );
    if (result2[0] !== true)
      throw new Error("Failed to move file2 to file1 position");

    // Move temp to file2's position
    const result3 = GLib.spawn_sync(
      null,
      ["mv", tempPath, file2Path],
      null,
      GLib.SpawnFlags.DEFAULT,
      null,
    );
    if (result3[0] !== true)
      throw new Error("Failed to move temp to file2 position");
  } catch (error) {
    // Silently ignore swap errors
  }
}

// Function to swap positions of two desktop files
function swapDesktopPositions(file1Path: string, file2Path: string) {
  const file1Name = GLib.path_get_basename(file1Path);
  const file2Name = GLib.path_get_basename(file2Path);

  const pos1 = desktopPositions[file1Name] ?? 0;
  const pos2 = desktopPositions[file2Name] ?? 0;

  // Swap positions
  desktopPositions[file1Name] = pos2;
  desktopPositions[file2Name] = pos1;

  saveDesktopPositions();
}

// Function to move a file to a specific position
function moveFileToPosition(
  fileName: string,
  targetPosition: number,
  maxColumns: number,
) {
  // Don't manage position for trash icon
  if (fileName === "trash") {
    return;
  }
  // Check if target position is already occupied by another file
  const occupiedBy = Object.keys(desktopPositions).find(
    (key) => key !== fileName && desktopPositions[key] === targetPosition,
  );

  if (occupiedBy) {
    // Find the nearest available position using spiral search
    const startGridX = targetPosition % maxColumns;
    const startGridY = Math.floor(targetPosition / maxColumns);

    let foundPosition = targetPosition;
    let searchRadius = 1;
    let found = false;

    while (!found && searchRadius < 50) {
      for (let dy = -searchRadius; dy <= searchRadius && !found; dy++) {
        for (let dx = -searchRadius; dx <= searchRadius && !found; dx++) {
          if (Math.abs(dx) === searchRadius || Math.abs(dy) === searchRadius) {
            const testGridX = startGridX + dx;
            const testGridY = startGridY + dy;
            const testPosition = testGridY * maxColumns + testGridX;

            if (testGridX >= 0 && testGridY >= 0 && testGridX < maxColumns) {
              const testOccupied = Object.keys(desktopPositions).find(
                (key) =>
                  key !== fileName && desktopPositions[key] === testPosition,
              );

              if (!testOccupied) {
                foundPosition = testPosition;
                found = true;
              }
            }
          }
        }
      }
      searchRadius++;
    }

    targetPosition = foundPosition;
  }

  // Set the file to the final position
  const oldPosition = desktopPositions[fileName];
  desktopPositions[fileName] = targetPosition;

  saveDesktopPositions();
}

function createDesktopGrid(gdkmonitor: Gdk.Monitor): Gtk.Widget {
  // Calculate grid dimensions first for consistent use throughout
  const geometry = gdkmonitor.get_geometry();
  const desktopWidth = geometry.width;
  const desktopHeight = geometry.height;

  // Calculate optimal grid size that divides evenly into monitor resolution
  // Start with desired size around 80px and find closest divisor
  const targetCellSize = 80;
  let bestCellSize = targetCellSize;
  let minWaste = Infinity;

  // Try cell sizes from 60 to 120 to find the best fit
  for (let testSize = 60; testSize <= 120; testSize++) {
    const cols = Math.floor(desktopWidth / testSize);
    const rows = Math.floor(desktopHeight / testSize);
    const wastedX = desktopWidth - cols * testSize;
    const wastedY = desktopHeight - rows * testSize;
    const totalWaste = wastedX + wastedY;

    if (totalWaste < minWaste) {
      minWaste = totalWaste;
      bestCellSize = testSize;
    }
  }

  const cellSize = bestCellSize;
  const maxColumns = Math.floor(desktopWidth / cellSize);
  const maxRows = Math.floor(desktopHeight / cellSize);

  const scrolled = new Gtk.ScrolledWindow({
    cssClasses: ["desktop-scrolled"],
    vexpand: true,
    hexpand: true,
    propagateNaturalHeight: false,
    propagateNaturalWidth: false,
    hscrollbarPolicy: Gtk.PolicyType.NEVER,
    vscrollbarPolicy: Gtk.PolicyType.NEVER,
  });

  const viewport = new Gtk.Viewport();
  const gridBox = new Gtk.Fixed({
    cssClasses: ["desktop-grid"],
    hexpand: true,
    vexpand: true,
    widthRequest: desktopWidth,
    heightRequest: desktopHeight,
  });

  // Create grid overlay for drag feedback
  const gridOverlay = new Gtk.Fixed({
    cssClasses: ["grid-overlay"],
    hexpand: true,
    vexpand: true,
    visible: true,
  });

  // Create visual feedback grid cells
  const gridCells: Gtk.Widget[] = [];
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxColumns; col++) {
      const gridCell = new Gtk.Box({
        cssClasses: ["grid-cell"],
        widthRequest: cellSize,
        heightRequest: cellSize,
        visible: false,
      });

      const x = col * cellSize; // Match icon positioning
      const y = row * cellSize;
      gridOverlay.put(gridCell, x, y);
      gridCells.push(gridCell);
    }
  }

  // Store reference globally for access during drag
  (globalThis as any).desktopGridOverlay = gridOverlay;

  // Track existing icons to avoid unnecessary recreation
  const existingIcons = new Map<string, Gtk.Widget>();
  let trashWidget: Gtk.Widget | null = null;

  // Function to populate the grid with files
  const populateGrid = () => {
    // Get files from Desktop directory
    const files = getDesktopFiles();

    // Check if trash is empty or full for dynamic icon
    let trashIcon = "user-trash";
    try {
      const trashList = exec(["gio", "trash", "--list"]);
      trashIcon = trashList.trim() ? "user-trash-full" : "user-trash";
    } catch (error) {
      // Silently ignore trash status check errors
    }

    // Add virtual trash icon (will be positioned separately in bottom right)
    const trashFile: DesktopFile = {
      name: "trash",
      displayName: "Trash",
      path: "trash://",
      iconName: trashIcon,
      isDesktopFile: true,
      isDirectory: false,
      execCommand: "trash-list",
    };

    // Sort files by their stored positions
    files.sort((a, b) => {
      const posA = desktopPositions[a.name] ?? 999;
      const posB = desktopPositions[b.name] ?? 999;
      return posA - posB;
    });

    // Track which files should exist
    const currentFiles = new Set(files.map((f) => f.name));

    // Remove icons for files that no longer exist
    for (const [fileName, widget] of existingIcons.entries()) {
      if (!currentFiles.has(fileName)) {
        gridBox.remove(widget);
        existingIcons.delete(fileName);
      }
    }

    // Add/update file icons to grid (excluding trash)
    let nonTrashIndex = 0;
    files.forEach((file) => {
      // Skip trash icon as it has fixed position
      if (file.name === "trash") return;

      // Store grid position for new files
      if (!(file.name in desktopPositions)) {
        desktopPositions[file.name] = nonTrashIndex;
        saveDesktopPositions();
      }

      const position = desktopPositions[file.name] ?? nonTrashIndex;
      const gridX = position % maxColumns;
      const gridY = Math.floor(position / maxColumns);

      // Position coordinates
      const iconX = gridX * cellSize;
      const iconY = gridY * cellSize;

      // Only create new icon if it doesn't exist
      if (!existingIcons.has(file.name)) {
        const iconWidget = DesktopIcon({
          file,
          onLaunch: () => {
            populateGrid(); // Refresh grid after changes
          },
        });

        existingIcons.set(file.name, iconWidget);
        gridBox.put(iconWidget, iconX, iconY);
      } else {
        // Just update position if icon already exists
        const existingWidget = existingIcons.get(file.name)!;
        gridBox.move(existingWidget, iconX, iconY);
      }
    });

    // Handle trash icon
    if (!trashWidget) {
      trashWidget = DesktopIcon({
        file: trashFile,
        onLaunch: () => {
          populateGrid(); // Refresh grid after changes
        },
      });

      // Add special CSS class for bottom-right trash icon
      trashWidget.add_css_class("trash-bottom-right");

      // Position trash in bottom right corner of grid
      const trashX = Math.max(0, desktopWidth - cellSize);
      const trashY = Math.max(0, desktopHeight - cellSize);

      gridBox.put(trashWidget, trashX, trashY);
      trashWidget.set_visible(true);
      trashWidget.set_can_focus(true);
    }
    // Note: Trash icon position doesn't change, so no need to move it
  };

  // Add drop target to the overlay container for better coverage
  const overlayDropTarget = new Gtk.DropTarget();
  overlayDropTarget.set_gtypes([GObject.TYPE_STRING]);
  overlayDropTarget.set_actions(Gdk.DragAction.MOVE | Gdk.DragAction.COPY);
  overlayDropTarget.set_preload(true);

  overlayDropTarget.connect("leave", () => {
    gridBox.remove_css_class("grid-drop-target");
    gridBox.remove_css_class("grid-drop-active");
    gridOverlay.set_visible(false);

    // Hide all grid cells
    gridCells.forEach((cell) => {
      cell.set_visible(false);
      cell.remove_css_class("grid-cell-hover");
      cell.remove_css_class("grid-cell-target");
    });
  });

  overlayDropTarget.connect("enter", (target, x, y) => {
    gridBox.add_css_class("grid-drop-target");
    gridOverlay.set_visible(true);

    // Show all grid cells with fade in effect
    gridBox.add_css_class("grid-fade-in");
    gridCells.forEach((cell, index) => {
      setTimeout(() => {
        cell.set_visible(false);
      }, index * 2); // Stagger the appearance for wave effect
    });

    return Gdk.DragAction.MOVE;
  });

  overlayDropTarget.connect("motion", (target, x, y) => {
    // Account for icon positioning offset (icons are positioned at cellX + 20, cellY + 20)
    const adjustedX = Math.max(0, x - 20);
    const adjustedY = Math.max(0, y - 20);

    const gridX = Math.floor(adjustedX / cellSize);
    const gridY = Math.floor(adjustedY / cellSize);

    // Clear all previous hover states
    gridCells.forEach((cell) => {
      cell.remove_css_class("grid-cell-hover");
      cell.remove_css_class("grid-cell-target");
    });

    // Validate grid bounds
    if (gridX < 0 || gridY < 0 || gridX >= maxColumns || gridY >= maxRows) {
      gridBox.remove_css_class("grid-drop-active");
      return Gdk.DragAction.MOVE;
    }

    // Highlight target cell
    const targetIndex = gridY * maxColumns + gridX;
    if (targetIndex < gridCells.length) {
      const targetCell = gridCells[targetIndex];
      targetCell.add_css_class("grid-cell-target");
      targetCell.visible = true;

      // Also highlight surrounding cells for better visual context
      const surroundingIndices = [
        targetIndex - maxColumns - 1,
        targetIndex - maxColumns,
        targetIndex - maxColumns + 1,
        targetIndex - 1,
        targetIndex + 1,
        targetIndex + maxColumns - 1,
        targetIndex + maxColumns,
        targetIndex + maxColumns + 1,
      ];

      surroundingIndices.forEach((index) => {
        if (index >= 0 && index < gridCells.length && index !== targetIndex) {
          const surroundingRow = Math.floor(index / maxColumns);
          const surroundingCol = index % maxColumns;
          const targetRow = Math.floor(targetIndex / maxColumns);
          const targetCol = targetIndex % maxColumns;

          // Only highlight if within one cell distance
          if (
            Math.abs(surroundingRow - targetRow) <= 1 &&
            Math.abs(surroundingCol - targetCol) <= 1
          ) {
            gridCells[index].add_css_class("grid-cell-hover");
            gridCells[index].visible = true;
          }
        }
      });
    }

    gridBox.add_css_class("grid-drop-active");
    return Gdk.DragAction.MOVE;
  });

  overlayDropTarget.connect("drop", (target, value, x, y) => {
    // Account for icon positioning offset (icons are positioned at cellX + 20, cellY + 20)
    const adjustedX = Math.max(0, x);
    const adjustedY = Math.max(0, y);

    // Calculate grid position from adjusted coordinates
    const gridX = Math.max(
      0,
      Math.min(Math.floor(adjustedX / cellSize), maxColumns - 1),
    );
    const gridY = Math.max(
      0,
      Math.min(Math.floor(adjustedY / cellSize), maxRows - 1),
    );

    const targetPosition = gridY * maxColumns + gridX;

    // Get the filename from the path
    const fileName = GLib.path_get_basename(value.toString());

    // Don't allow dropping onto trash icon's fixed position
    if (fileName === "trash") {
      gridBox.remove_css_class("grid-drop-target");
      gridOverlay.set_visible(false);
      return false;
    }

    // Show drop animation before moving
    const targetCell = gridCells[targetPosition];
    if (targetCell) {
      targetCell.add_css_class("grid-cell-drop-animation");

      // Animate the drop
      setTimeout(() => {
        targetCell.remove_css_class("grid-cell-drop-animation");

        // Move the file to the target position
        moveFileToPosition(fileName, targetPosition, maxColumns);
        populateGrid();

        // Fade out grid overlay
        gridBox.add_css_class("grid-fade-out");
        setTimeout(() => {
          gridBox.remove_css_class("grid-drop-target");
          gridBox.remove_css_class("grid-fade-out");
          gridOverlay.set_visible(false);

          // Hide all grid cells
          gridCells.forEach((cell) => {
            cell.set_visible(false);
            cell.remove_css_class("grid-cell-hover");
            cell.remove_css_class("grid-cell-target");
          });
        }, 200);
      }, 150);
    } else {
      // Fallback without animation
      moveFileToPosition(fileName, targetPosition, maxColumns);
      populateGrid();
      gridBox.remove_css_class("grid-drop-target");
      gridOverlay.set_visible(false);
    }

    return true;
  });

  // Load positions and initial population
  loadDesktopPositions();
  populateGrid();

  // Create overlay container and ensure grid overlay is added
  const overlay = new Gtk.Overlay();
  overlay.set_child(gridBox);
  overlay.add_overlay(gridOverlay);

  // Force grid overlay to be on top
  gridOverlay.set_can_focus(false);
  gridOverlay.set_can_target(false);

  // Add drop target to the overlay container
  overlay.add_controller(overlayDropTarget);

  viewport.set_child(overlay);
  scrolled.set_child(viewport);

  return scrolled;
}

// Function to get files from Desktop directory
function getDesktopFiles(): DesktopFile[] {
  const desktopPath = GLib.get_home_dir() + "/Desktop";
  if (!desktopPath) {
    // Silently ignore missing Desktop directory
    return [];
  }

  try {
    const dir = Gio.File.new_for_path(desktopPath);
    const enumerator = dir.enumerate_children(
      "standard::*",
      Gio.FileQueryInfoFlags.NONE,
      null,
    );

    const files: DesktopFile[] = [];
    let info: Gio.FileInfo | null;

    while ((info = enumerator.next_file(null)) !== null) {
      const name = info.get_name();
      let displayName = info.get_display_name();
      const isDirectory = info.get_file_type() === Gio.FileType.DIRECTORY;
      const path = `${desktopPath}/${name}`;

      // Check if it's a .desktop file
      const isDesktopFile = name.endsWith(".desktop") && !isDirectory;
      let execCommand: string | undefined;
      let iconName = "text-x-generic";

      // Parse .desktop file if applicable
      if (isDesktopFile) {
        try {
          const desktopContent = GLib.file_get_contents(path);
          if (desktopContent[0]) {
            const decoder = new TextDecoder("utf-8");
            const content = decoder.decode(desktopContent[1]);
            const lines = content.split("\n");

            for (const line of lines) {
              if (line.startsWith("Name=")) {
                displayName = line.substring(5).trim();
              } else if (line.startsWith("Exec=")) {
                execCommand = line.substring(5).trim();
              } else if (line.startsWith("Icon=")) {
                const iconValue = line.substring(5).trim();
                if (iconValue) {
                  iconName = iconValue;
                }
              }
            }
          }
        } catch (error) {
          // Silently ignore desktop file parse errors
        }
      }

      // Determine icon for non-desktop files
      if (!isDesktopFile) {
        if (isDirectory) {
          iconName = "folder";
        } else {
          const contentType = info.get_content_type();
          if (contentType) {
            const icon = Gio.content_type_get_icon(contentType);
            if (icon && icon.to_string) {
              const iconStr = icon.to_string();
              if (iconStr) {
                iconName = iconStr;
              }
            }
          }
        }
      }
      files.push({
        name,
        displayName,
        path,
        isDirectory,
        iconName,
        isDesktopFile,
        execCommand,
      });
    }

    // Sort: directories first, then files alphabetically
    files.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.displayName.localeCompare(b.displayName);
    });

    return files;
  } catch (error) {
    // Silently ignore Desktop directory read errors
    return [];
  }
}

function createDesktopContextMenu(): Gtk.Popover {
  const popover = new Gtk.Popover();
  const menuBox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 4,
    marginTop: 8,
    marginBottom: 8,
    marginStart: 8,
    marginEnd: 8,
  });

  // Refresh desktop
  const refreshBtn = new Gtk.Button({
    label: "🔄 Refresh Desktop",
    cssClasses: ["context-menu-item"],
  });
  refreshBtn.connect("clicked", () => {
    popover.popdown();
    // Refresh will happen automatically via the refresh interval
  });

  // Open terminal here
  const terminalBtn = new Gtk.Button({
    label: "🖥️ Open Terminal Here",
    cssClasses: ["context-menu-item"],
  });
  terminalBtn.connect("clicked", () => {
    popover.popdown();
    const desktopPath = GLib.get_user_special_dir(
      GLib.UserDirectory.DIRECTORY_DESKTOP,
    );
    execAsync(["kitty", "--working-directory", desktopPath || "~"]).catch(
      () => {
        execAsync(["kitty", "--directory", desktopPath || "~"]).catch(() => {
          execAsync([
            "alacritty",
            "--working-directory",
            desktopPath || "~",
          ]).catch(() => {
            // Silently ignore terminal not found errors
          });
        });
      },
    );
  });

  // Open file manager
  const fileManagerBtn = new Gtk.Button({
    label: "📁 Open Desktop Folder",
    cssClasses: ["context-menu-item"],
  });
  fileManagerBtn.connect("clicked", () => {
    const desktopPath = GLib.get_home_dir() + "/Desktop";
    execAsync(["xdg-open", desktopPath || "~"]).catch((error) => {
      // Silently ignore file manager open errors
    });
    popover.popdown();
  });

  // Create new folder
  const newFolderBtn = new Gtk.Button({
    label: "📂 New Folder",
    cssClasses: ["context-menu-item"],
  });
  newFolderBtn.connect("clicked", () => {
    const desktopPath = GLib.get_home_dir() + "/Desktop";
    if (desktopPath) {
      try {
        let folderName = "New Folder";
        let counter = 1;
        let folderPath = `${desktopPath}/${folderName}`;

        // Find unique name
        while (GLib.file_test(folderPath, GLib.FileTest.EXISTS)) {
          folderName = `New Folder ${counter}`;
          folderPath = `${desktopPath}/${folderName}`;
          counter++;
        }

        execAsync(["mkdir", folderPath]).catch((error) => {
          // Silently ignore folder creation errors
        });
      } catch (error) {
        // Silently ignore folder creation errors
      }
    }
    popover.popdown();
  });

  const wallpaperLabel = new Gtk.Label({ label: backgroundImage.get() });

  menuBox.append(wallpaperLabel);
  menuBox.append(refreshBtn);
  menuBox.append(new Gtk.Separator());
  menuBox.append(terminalBtn);
  menuBox.append(fileManagerBtn);
  menuBox.append(new Gtk.Separator());
  menuBox.append(newFolderBtn);

  backgroundImage.subscribe(() => {
    wallpaperLabel.set_label(backgroundImage.get());
  });

  popover.set_child(menuBox);
  return popover;
}

export default function Desktop(gdkmonitor: Gdk.Monitor) {
  const window = new Astal.Window({
    layer: Astal.Layer.BOTTOM,
    visible: true,
    cssClasses: ["desktop"],
    exclusivity: Astal.Exclusivity.EXCLUSIVE,
    gdkmonitor: gdkmonitor,
    anchor:
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT |
      Astal.WindowAnchor.BOTTOM,
  });

  // Check if this is the primary monitor by checking if it's at position (0,0)
  const geometry = gdkmonitor.get_geometry();
  const isPrimaryMonitor = geometry.x === 0 && geometry.y === 0;

  const overlay = new Gtk.Overlay();

  // Main wallpaper background
  const backgroundBox = new Gtk.Box({
    cssClasses: ["wallpaper"],
    hexpand: true,
    vexpand: true,
    orientation: Gtk.Orientation.VERTICAL,
  });

  overlay.set_child(backgroundBox);

  overlay.add_overlay(new Gtk.Label({ label: "Hello" }));

  // Desktop icons grid - only on primary monitor
  if (isPrimaryMonitor) {
    const iconsGrid = createDesktopGrid(gdkmonitor);
    overlay.add_overlay(iconsGrid);

    // Desktop context menu (right-click on empty space) - only on primary
    const desktopContextMenu = createDesktopContextMenu();
    desktopContextMenu.set_parent(overlay);

    const rightClick = new Gtk.GestureClick({
      button: 3, // Right mouse button
    });

    rightClick.connect("pressed", (gesture, nPress, x, y) => {
      // Only show context menu if clicking on empty space
      const target = gesture.get_widget();
      if (
        target === overlay ||
        target === backgroundBox ||
        target === iconsGrid
      ) {
        const rect = new Gdk.Rectangle({ x: x, y: y, width: 1, height: 1 });
        desktopContextMenu.set_pointing_to(rect);
        desktopContextMenu.popup();
      }
    });

    overlay.add_controller(rightClick);
    // Desktop icons and context menu added to primary monitor
  } else {
    // Secondary monitor - no desktop icons
  }

  // Add background to overlay
  overlay.set_child(backgroundBox);

  // Apply theme
  setup_theme(overlay);

  window.child = overlay;

  return window;
}
