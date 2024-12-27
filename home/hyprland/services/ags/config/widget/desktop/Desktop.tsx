import GObject from "gi://GObject";
import { App, Astal, Gtk, Gdk, Widget, astalify, type ConstructProps } from "astal/gtk3";
import { Variable } from "astal";

const time = Variable("").poll(1000, "date");

function setup(menu: Menu) {
  menu.popup_at_pointer(null);
}

function Background() {
  return (
    <box css="background-image: url('/home/mia/Nextcloud/Photos/Wallpapers/__belfast_azur_lane_drawn_by_xiehou_nangong__4a15db77e5efec118e396b634afe9fe2.jpg');">
      <label yalign="0.9" valign="END" halign="CENTER" hexpand="true" vexpand="true" label="Splash message"></label>
    </box>
  );

  // return "background-image: url('/home/mia/Nextcloud/Photos/Wallpapers/__belfast_azur_lane_drawn_by_xiehou_nangong__4a15db77e5efec118e396b634afe9fe2.jpg');";
}

function yes(_, event) {
  if (event.button == 3) {
    return (
      <Menu setup={setup}>
        <MenuItem label="Web Browser"></MenuItem>
        <MenuItem label="File Manager"></MenuItem>
        <SeparatorMenuItem></SeparatorMenuItem>
        <MenuItem label="Wallpaper"></MenuItem>
        <MenuItem label="Colour Picker"></MenuItem>
        <MenuItem
          label="Screenshot"
          submenu={
            <Menu>
              <MenuItem label="Screenshot"></MenuItem>
            </Menu>
          }
        ></MenuItem>
        <MenuItem label="Edit NixOS"></MenuItem>
        <SeparatorMenuItem></SeparatorMenuItem>
        <MenuItem
          label="Exit"
          submenu={
            <Menu>
              <MenuItem label="Reboot"></MenuItem>
              <MenuItem label="Suspend"></MenuItem>
              <MenuItem label="Hibernate"></MenuItem>
              <MenuItem label="Shutdown"></MenuItem>
            </Menu>
          }
        ></MenuItem>
      </Menu>
    );
  }
}

export default function Desktop(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      className="desktop"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM}
      layer="BACKGROUND"
    >
      <eventbox onClick={yes}>
        <Background />
      </eventbox>
    </window>
  );
}

class Menu extends astalify(Gtk.Menu) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<
      Menu,
      Gtk.Menu.ConstructorProps,
      { onColorSet: [] } // signals of Gtk.ColorButton have to be manually typed
    >,
  ) {
    super(props as any);
  }
}

class MenuItem extends astalify(Gtk.MenuItem) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<
      MenuItem,
      Gtk.MenuItem.ConstructorProps,
      { onColorSet: [] } // signals of Gtk.ColorButton have to be manually typed
    >,
  ) {
    super(props as any);
  }
}

class SeparatorMenuItem extends astalify(Gtk.SeparatorMenuItem) {
  static {
    GObject.registerClass(this);
  }

  constructor(
    props: ConstructProps<
      MenuItem,
      Gtk.SeparatorMenuItem.ConstructorProps,
      { onColorSet: [] } // signals of Gtk.ColorButton have to be manually typed
    >,
  ) {
    super(props as any);
  }
}
