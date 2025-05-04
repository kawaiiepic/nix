import { bind, Variable } from "astal";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import AstalApps from "gi://AstalApps";

import { setup_theme } from "../theme";

const MAX_ITEMS = 8;

function hide() {
  App.get_window("launcher")!.hide();
}

function AppButton({ app }: { app: AstalApps.Application }) {
  return (
    <button
      cssClasses={["AppButton"]}
      onClicked={() => {
        hide();
        app.launch();
      }}
    >
      <box>
        <image pixelSize={28} iconName={app.iconName} />
        <box valign={Gtk.Align.CENTER} vertical>
          <label cssClasses={["name"]} xalign={0} label={app.name} />
          {app.description && (
            <label
              cssClasses={["description"]}
              wrap
              xalign={0}
              label={app.description}
            />
          )}
        </box>
      </box>
    </button>
  );
}

function onHover(self: Astal.Box) {
  self.add_css_class("hover");
}

function onHoverLost(self: Astal.Box) {
  self.remove_css_class("hover");
}

function AppIcon({ app }: { app: AstalApps.Application }) {
  return (
    <box
      vexpand={false}
      hexpand={false}
      cssClasses={["AppIcon"]}
      halign={Gtk.Align.CENTER}
      onHoverEnter={onHover}
      onHoverLeave={onHoverLost}
      onButtonPressed={() => {
        hide();
        app.launch();
      }}
    >
      <image
        pixelSize={36}
        tooltipText={app.name}
        halign={Gtk.Align.CENTER}
        cssClasses={["icon"]}
        onHoverEnter={(self) => {self.pixelSize = 40}}
        onHoverLeave={(self) => {self.pixelSize = 36}}
        iconName={app.iconName}
      />
    </box>
  );
}

export default (gdkmonitor: Gdk.Monitor) => {
  const apps = new AstalApps.Apps({minScore: 20});

  const { CENTER } = Gtk.Align;

  const text = Variable("");
  const default_apps = [
    apps.fuzzy_query("zen")[0],
    // apps.fuzzy_query("spotify")[0],
    apps.fuzzy_query("files")[0],
    apps.fuzzy_query("kitty")[0],
    apps.fuzzy_query("zed")[0],
    apps.fuzzy_query("steam")[0],
  ];
  const list = text((text) =>
    apps
      .fuzzy_query(text)
      .slice(0, MAX_ITEMS)
      .filter((app) => {
        if (app.executable.includes("steam://rungameid")) {
          return true;
        }
        return true;
      }),
  );

  const onEnter = () => {
    list.get()[0].launch();
    text.set("");
    entry.text = "";
    hide();
  };
  
  const entry: Gtk.Entry = (<entry
    placeholderText="Search"
    onChanged={(self) => text.set(self.text)}
    onActivate={onEnter}
  />);

  return (
    <window
      name={"launcher"}
      cssClasses={["launcher"]}
      gdkmonitor={gdkmonitor}
      application={App}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM
      }
      onButtonPressed={() => hide()}
      onKeyPressed={(self, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          App.toggle_window("launcher");
          text.set("");
          entry.text = ("");
        }
      }}
    >
      <box vertical spacing={12} setup={setup_theme}>
        <box
          cssClasses={["default-apps"]}
          halign={Gtk.Align.CENTER}
          spacing={6}
        >
          {default_apps.map((app) => (
            <AppIcon app={app} />
          ))}
        </box>
        <box heightRequest={100} />
        <box halign={Gtk.Align.CENTER} cssClasses={["Applauncher"]} vertical>
          {entry}
          <box spacing={6} vertical>
            {list.as((list) => list.map((app) => <AppButton app={app} />))}
          </box>
          <box
            halign={CENTER}
            cssClasses={["not-found"]}
            vertical
            visible={list.as((l) => l.length === 0)}
          >
            <image iconName="system-search-symbolic" />
            <label label="No match found" />
          </box>
        </box>
      </box>
    </window>
  );
};
