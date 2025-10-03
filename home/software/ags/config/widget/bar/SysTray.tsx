import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";

export default (): Gtk.Widget => {
  const tray = AstalTray.get_default();
  const trayWidgets = new Map<string, Gtk.MenuButton>();

  const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
    btn.menuModel = item.menuModel;
    btn.insert_action_group("dbusmenu", item.actionGroup);
    item.connect("notify::action-group", () => {
      btn.insert_action_group("dbusmenu", item.actionGroup);
    });
  };

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,
    cssClasses: ["systray"],
    visible: trayWidgets.size > 0,
    spacing: 2,
    valign: Gtk.Align.CENTER,
  });

  tray.connect("item-added", (tray, itemId) => {
    const item = tray.get_item(itemId);
    const btn = new Gtk.MenuButton({ cssClasses: ["entry"] });
    init(btn, item);
    btn.child = new Gtk.Image({ gicon: item.gicon, pixelSize: 14 });
    trayWidgets.set(itemId, btn);

    if (!box.visible) {
      box.visible = true;
    }
    box.append(btn);
  });

  tray.connect("item-removed", (tray, itemId) => {
    if (trayWidgets.has(itemId)) {
      box.remove(trayWidgets.get(itemId)!);
      trayWidgets.delete(itemId);

      if (trayWidgets.size === 0) {
        box.visible = false;
      }
    }
  });

  return box;
};
