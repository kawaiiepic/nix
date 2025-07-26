import { Astal, Gdk, Gtk } from "ags/gtk4";
import { setup_theme } from "../theme";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import { readFile, writeFile } from "ags/file";

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
    valign: Gtk.Align.CENTER,
    marginTop: 0,
    marginBottom: 0,
    marginStart: 0,
    marginEnd: 0,
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
    cssClasses: ["desktop-icon-label"],
    justify: Gtk.Justification.CENTER,
    wrap: false,
    maxWidthChars: 8,
    widthRequest: 60,
    ellipsize: 3,
  });

  const button = new Gtk.Button({
    cssClasses: ["desktop-icon-button", "windows-icon"],
    child: iconBox,
    tooltipText: file.name === "trash" ? "Open Trash" : file.path,
    widthRequest: 64,
    heightRequest: 64,
    focusOnClick: true,
    marginTop: 0,
    marginBottom: 0,
    marginStart: 0,
    marginEnd: 0,
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
          execAsync(["wl-copy"], output).catch((error) => {
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
    // Show grid overlay immediately
    const overlay = (globalThis as any).desktopGridOverlay;
    if (overlay) {
      overlay.set_visible(true);
    }
    return Gdk.ContentProvider.new_for_value(file.path);
  });

  dragSource.connect("drag-end", () => {
    isDragging = false;
    button.remove_css_class("dragging");
    // Hide grid overlay
    const overlay = (globalThis as any).desktopGridOverlay;
    if (overlay) {
      overlay.set_visible(false);
      // Reset all cell highlights and hide all cells
      let child = overlay.get_first_child();
      while (child) {
        child.remove_css_class("grid-cell-hover");
        child.set_visible(false);
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
    const draggedPath = value;
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

async function createDesktopGrid(gdkmonitor: Gdk.Monitor): Promise<Gtk.Widget> {
  // Calculate grid dimensions first for consistent use throughout
  const geometry = gdkmonitor.get_geometry();
  const desktopWidth = geometry.width;
  const desktopHeight = geometry.height;
  const cellSize = 64;
  const maxColumns = Math.ceil(desktopWidth / cellSize);
  const maxRows = Math.ceil(desktopHeight / cellSize);

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
    visible: false,
  });

  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxColumns; col++) {
      const gridCell = new Gtk.Box({
        cssClasses: ["grid-cell", "debug-grid-cell"],
        widthRequest: 64,
        heightRequest: 64,
        visible: false,
      });
      gridOverlay.put(gridCell, col * 64 + 20, row * 64 + 20);
    }
  }

  // Store reference globally for access during drag
  (globalThis as any).desktopGridOverlay = gridOverlay;

  // Function to populate the grid with files
  const populateGrid = async () => {
    // Clear existing children
    let child = gridBox.get_first_child();
    while (child) {
      const next = child.get_next_sibling();
      gridBox.remove(child);
      child = next;
    }

    // Get files from Desktop directory
    const files = getDesktopFiles();

    // Check if trash is empty or full for dynamic icon
    let trashIcon = "user-trash";
    try {
      const trashList = await execAsync(["gio", "trash", "--list"]);
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

    // Use the same maxColumns as calculated in grid creation scope

    // Add file icons to grid (excluding trash)
    files.forEach((file, index) => {
      // Skip trash icon as it has fixed position
      if (file.name === "trash") return;

      // Store grid position for new files
      if (!(file.name in desktopPositions)) {
        desktopPositions[file.name] = index;
        saveDesktopPositions();
      }

      const position = desktopPositions[file.name] ?? index;
      const gridX = position % maxColumns;
      const gridY = Math.floor(position / maxColumns);

      const iconWidget = DesktopIcon({
        file,
        onLaunch: () => {
          populateGrid(); // Refresh grid after changes
        },
      });

      // Position widget at specific coordinates
      gridBox.put(iconWidget, gridX * 64, gridY * 64);
    });

    // Add trash icon to bottom right corner
    const trashIconWidget = DesktopIcon({
      file: trashFile,
      onLaunch: () => {
        populateGrid(); // Refresh grid after changes
      },
    });

    // Add special CSS class for bottom-right trash icon
    trashIconWidget.add_css_class("trash-bottom-right");

    // Position trash in bottom right (accounting for grid padding and icon size)
    // gridBox has 20px padding, so content area is (desktopWidth - 40) x (desktopHeight - 40)
    const gridContentWidth = desktopWidth - 40; // Account for 20px padding on both sides
    const gridContentHeight = desktopHeight - 40; // Account for 20px padding on both sides
    const bottomMargin = 20; // Extra margin from bottom edge
    const rightMargin = 20; // Extra margin from right edge
    const trashX = Math.max(0, gridContentWidth - 64 - rightMargin); // Position within grid content area
    const trashY = Math.max(0, gridContentHeight - 64 - bottomMargin); // Position within grid content area

    gridBox.put(trashIconWidget, trashX, trashY);

    // Ensure trash icon is visible and on top
    trashIconWidget.set_visible(true);
    trashIconWidget.set_can_focus(true);
  };

  // Add drop target to the overlay container for better coverage
  const overlayDropTarget = new Gtk.DropTarget();
  overlayDropTarget.set_gtypes([GObject.TYPE_STRING]);
  overlayDropTarget.set_actions(Gdk.DragAction.MOVE | Gdk.DragAction.COPY);
  overlayDropTarget.set_preload(true);

  // Also try adding to viewport for better coverage
  const viewportDropTarget = new Gtk.DropTarget();
  viewportDropTarget.set_gtypes([GObject.TYPE_STRING]);
  viewportDropTarget.set_actions(Gdk.DragAction.MOVE | Gdk.DragAction.COPY);
  viewportDropTarget.set_preload(true);

  overlayDropTarget.connect("leave", () => {
    gridBox.remove_css_class("grid-drop-target");

    gridOverlay.set_visible(false);
    // Hide all grid cells
    let child = gridOverlay.get_first_child();
    while (child) {
      child.remove_css_class("grid-cell-hover");
      child.set_visible(false);
      child = child.get_next_sibling();
    }
  });

  overlayDropTarget.connect("enter", (target, x, y) => {
    gridBox.add_css_class("grid-drop-target");

    gridOverlay.set_visible(true);
    return Gdk.DragAction.MOVE;
  });

  overlayDropTarget.connect("motion", (target, x, y) => {
    const gridX = Math.floor((x - 20) / 64);
    const gridY = Math.floor((y - 20) / 64);

    // Hide all grid cells and remove hover class
    let child = gridOverlay.get_first_child();
    while (child) {
      child.remove_css_class("grid-cell-hover");
      child.set_visible(false);
      child = child.get_next_sibling();
    }

    // Validate grid bounds before highlighting
    if (gridX < 0 || gridY < 0 || gridX >= maxColumns || gridY >= maxRows) {
      return Gdk.DragAction.MOVE;
    }

    // Calculate which cell to show and highlight
    const targetIndex = gridY * maxColumns + gridX;
    if (targetIndex >= 0 && targetIndex < maxRows * maxColumns) {
      // Find the specific cell by walking through children
      let currentChild = gridOverlay.get_first_child();
      let currentIndex = 0;
      while (currentChild && currentIndex < targetIndex) {
        currentChild = currentChild.get_next_sibling();
        currentIndex++;
      }

      if (currentChild) {
        currentChild.set_visible(true);
        currentChild.add_css_class("grid-cell-hover");
      }
    } else {
    }

    return Gdk.DragAction.MOVE;
  });

  overlayDropTarget.connect("drop", (target, value, x, y) => {
    // Calculate grid position from drop coordinates (accounting for 20px padding)
    const rawGridX = Math.floor((x - 20) / 64);
    const rawGridY = Math.floor((y - 20) / 64);

    // Clamp grid position to valid bounds and find nearest valid position
    const gridX = Math.max(0, Math.min(rawGridX, maxColumns - 1));
    const gridY = Math.max(0, Math.min(rawGridY, maxRows - 1));

    if (rawGridX !== gridX || rawGridY !== gridY) {
    }

    const targetPosition = gridY * maxColumns + gridX;

    // Get the filename from the path
    const fileName = GLib.path_get_basename(value);

    // Don't allow dropping onto trash icon's fixed position
    if (fileName === "trash") {
      gridBox.remove_css_class("grid-drop-target");
      gridOverlay.set_visible(false);
      return false;
    }

    // Comprehensive coordinate debugging

    // Get actual widget allocations for debugging
    const gridBoxAlloc = gridBox.get_allocation();
    const overlayAlloc = gridOverlay.get_allocation();

    // Create visual grid cell highlighter to show exact drop target
    const gridCellX = gridX * 64 + 20; // Account for grid padding (20px)
    const gridCellY = gridY * 64 + 20; // Account for grid padding (20px)

    // Create a cell highlight overlay to show the exact drop zone
    const cellHighlight = new Gtk.Box({
      cssClasses: ["drop-target-highlight"],
      widthRequest: 64,
      heightRequest: 64,
    });
    gridOverlay.put(cellHighlight, gridCellX, gridCellY);

    // Create crosshair markers to show exact center
    const cellSize = 64; // Grid cell is 64px x 64px
    const cellCenterX = gridCellX + cellSize / 2; // Exact center of cell
    const cellCenterY = gridCellY + cellSize / 2; // Exact center of cell

    // Horizontal crosshair line
    const hLine = new Gtk.Box({
      cssClasses: ["debug-crosshair-h"],
      widthRequest: 32,
      heightRequest: 2,
    });
    gridOverlay.put(hLine, cellCenterX - 16, cellCenterY - 1);

    // Vertical crosshair line
    const vLine = new Gtk.Box({
      cssClasses: ["debug-crosshair-v"],
      widthRequest: 2,
      heightRequest: 32,
    });
    gridOverlay.put(vLine, cellCenterX - 1, cellCenterY - 16);

    // Create debug marker at exact center
    const markerSize = 12; // Marker is 12px x 12px
    const markerCenterX = cellCenterX - markerSize / 2; // Center the marker on the crosshair
    const markerCenterY = cellCenterY - markerSize / 2; // Center the marker on the crosshair

    const debugMarker = new Gtk.Box({
      cssClasses: ["debug-drop-marker"],
      widthRequest: 12,
      heightRequest: 12,
    });
    gridOverlay.put(debugMarker, markerCenterX, markerCenterY);

    // Remove all markers after 3 seconds for better visibility
    setTimeout(() => {
      gridOverlay.remove(cellHighlight);
      gridOverlay.remove(hLine);
      gridOverlay.remove(vLine);
      gridOverlay.remove(debugMarker);
      // Hide all grid cells after drop
      let child = gridOverlay.get_first_child();
      while (child) {
        child.remove_css_class("grid-cell-hover");
        child.set_visible(false);
        child = child.get_next_sibling();
      }
    }, 3000);

    // Move the file to the target position

    moveFileToPosition(fileName, targetPosition, maxColumns);

    populateGrid().then(() => {
      gridBox.remove_css_class("grid-drop-target");
      gridOverlay.set_visible(false);
    });
    return true;
  });

  // Don't add controller to gridBox anymore

  // Add drop target to viewport as well for better coverage
  viewportDropTarget.connect("drop", (target, value, x, y) => {
    // Get viewport allocation for coordinate translation
    const viewportAllocation = viewport.get_allocation();

    // Calculate grid position from drop coordinates
    const gridX = Math.floor(x / 64);
    const gridY = Math.floor(y / 64);
    const targetPosition = gridY * maxColumns + gridX;

    const fileName = GLib.path_get_basename(value);

    moveFileToPosition(fileName, targetPosition);
    populateGrid();
    return true;
  });

  viewport.add_controller(viewportDropTarget);

  // Load positions and initial population
  loadDesktopPositions();
  populateGrid();

  // Refresh every 5 seconds to pick up new files
  const refreshInterval = setInterval(() => {
    populateGrid();
  }, 5000);

  // Clean up interval when widget is destroyed
  gridBox.connect("destroy", () => {
    clearInterval(refreshInterval);
  });

  // Create overlay container and ensure grid overlay is added
  const overlay = new Gtk.Overlay();
  overlay.set_child(gridBox);
  overlay.add_overlay(gridOverlay);

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
      // Handle repositioning if requested
      let gridPosition: { x: number; y: number } | undefined;
      if ((globalThis as any).repositionDesktopIcon) {
        const reposition = (globalThis as any).repositionDesktopIcon;
        if (reposition.path === path) {
          gridPosition = reposition.position;
          (globalThis as any).repositionDesktopIcon = null;
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
        gridPosition,
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
    execAsync([
      "gnome-terminal",
      "--working-directory",
      desktopPath || "~",
    ]).catch(() => {
      execAsync(["kitty", "--directory", desktopPath || "~"]).catch(() => {
        execAsync([
          "alacritty",
          "--working-directory",
          desktopPath || "~",
        ]).catch(() => {
          // Silently ignore terminal not found errors
        });
      });
    });
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

  menuBox.append(refreshBtn);
  menuBox.append(new Gtk.Separator());
  menuBox.append(terminalBtn);
  menuBox.append(fileManagerBtn);
  menuBox.append(new Gtk.Separator());
  menuBox.append(newFolderBtn);

  popover.set_child(menuBox);
  return popover;
}

// Function to create AstalCava audio visualizer widget
function createCavaWidget(
  desktopWidth: number,
  desktopHeight: number,
): Gtk.Widget {
  // Create minimalist bars container - no background or borders
  const barsContainer = new Gtk.Box({
    cssClasses: ["cava-minimal"],
    orientation: Gtk.Orientation.HORIZONTAL,
    spacing: 1,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.END,
  });

  // Create visual bars
  const bars: Gtk.Box[] = [];
  for (let i = 0; i < 24; i++) {
    const bar = new Gtk.Box({
      cssClasses: ["cava-bar-minimal"],
      widthRequest: 3,
      heightRequest: 1,
      valign: Gtk.Align.END,
    });
    bars.push(bar);
    barsContainer.append(bar);
  }

  // Simple audio visualization using cava command
  let updateInterval: number | null = null;

  let isVisible = false;
  let consecutiveFailures = 0;
  const maxFailures = 10; // Stop trying after 10 consecutive failures

  const updateBars = async () => {
    // Skip updates if we've had too many consecutive failures
    if (consecutiveFailures >= maxFailures) {
      if (isVisible) {
        barsContainer.set_visible(false);
        isVisible = false;
      }
      return;
    }

    try {
      // Create a temporary config file for cava
      const tmpConfigPath = `/tmp/cava-config-${Math.random().toString(36).substr(2, 9)}`;
      const cavaConfig = `[general]
bars = 24
framerate = 60
autosens = 1
sensitivity = 100

[input]
method = pulse

[output]
method = raw
raw_target = /dev/stdout
data_format = ascii
channels = mono
`;

      // Write config to temp file
      GLib.file_set_contents(tmpConfigPath, cavaConfig);

      // Run cava with timeout to get one frame of data
      const result = await execAsync([
        "timeout",
        "0.2s",
        "cava",
        "-p",
        tmpConfigPath,
      ]);

      // Clean up temp file
      execAsync(["rm", "-f", tmpConfigPath]).catch(() => {});

      if (result.trim()) {
        const lines = result.trim().split("\n");
        const lastLine = lines[lines.length - 1];

        if (lastLine && lastLine.includes(" ")) {
          const values = lastLine
            .split(/\s+/)
            .map((val) => {
              const num = parseInt(val) || 0;
              return Math.max(0, Math.min(1, num / 255)); // cava outputs 0-255
            })
            .slice(0, 24);

          if (values.length >= 12) {
            // Ensure we have reasonable data
            values.forEach((value, index) => {
              if (index < bars.length) {
                const height = Math.max(2, Math.min(40, value * 35 + 2));
                bars[index].set_size_request(3, height);
              }
            });

            if (!isVisible) {
              barsContainer.set_visible(true);
              isVisible = true;
            }
            consecutiveFailures = 0; // Reset failure counter on success
            return; // Successfully updated, exit function
          }
        }
      }
    } catch {
      consecutiveFailures++;
    }

    // Hide widget when no valid cava data is available
    consecutiveFailures++;
    if (isVisible) {
      barsContainer.set_visible(false);
      isVisible = false;
    }
  };

  // Start periodic updates at 20fps for smoother animation
  updateInterval = setInterval(updateBars, 50);
  barsContainer.set_visible(false); // Initially hidden until cava data is available

  // Cleanup on widget destroy
  barsContainer.connect("destroy", () => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  });

  // Position in bottom center
  const fixed = new Gtk.Fixed();
  const x = (desktopWidth - 80) / 2; // Small width for minimal bars
  const y = desktopHeight - 80; // Close to bottom
  fixed.put(barsContainer, x, y);

  return fixed;
}

export default async function Desktop(gdkmonitor: Gdk.Monitor) {
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

  // Desktop icons grid - only on primary monitor
  if (isPrimaryMonitor) {
    const iconsGrid = await createDesktopGrid(gdkmonitor);
    overlay.add_overlay(iconsGrid);

    // Add Cava audio visualizer widget
    const cavaWidget = createCavaWidget(geometry.width, geometry.height);
    overlay.add_overlay(cavaWidget);

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
