import Apps from "gi://AstalApps";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { Variable } from "astal";

const MAX_ITEMS = 8;

function hide() {
  App.get_window("launcher")!.hide();
}

function AppButton({ app }: { app: Apps.Application }) {
  return (
    <button
      className="AppButton"
      onClicked={() => {
        hide();
        app.launch();
      }}
    >
      <box>
        <icon icon={app.iconName} />
        <box valign={Gtk.Align.CENTER} vertical>
          <label className="name" truncate xalign={0} label={app.name} />
          {app.description && (
            <label
              className="description"
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

function onHover(self: Widget.EventBox, ...args) {
  self.toggleClassName("hover", true);
}

function onHoverLost(self: Widget.EventBox, ...args) {
  self.toggleClassName("hover", false);
}

function AppIcon({ app }: { app: Apps.Application }) {
  return (
    <eventbox
      vexpand={false}
      hexpand={false}
      expand={false}
      className="AppIcon"
      halign={Gtk.Align.CENTER}
      onHover={onHover}
      onHoverLost={onHoverLost}
      onClick={() => {
        hide();
        app.launch();
      }}
    >
      <icon
        tooltipText={app.name}
        halign={Gtk.Align.CENTER}
        className="icon"
        icon={app.iconName}
      />
    </eventbox>
  );
}

export default (gdkmonitor: Gdk.Monitor) => {
  const apps = new Apps.Apps();

  const { CENTER } = Gtk.Align;

  const text = Variable("");
  const default_apps = [
    apps.fuzzy_query("zen")[0],
    apps.fuzzy_query("spotify")[0],
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
          return false;
        }
        return true;
      }),
  );

  const onEnter = () => {
    apps.fuzzy_query(text.get())?.[0].launch();
    text.set("");
    hide();
  };

  new Widget.Window({
    name: "launcher",
    className: "launcher",
    visible: false,
    gdkmonitor: gdkmonitor,
    application: App,
    exclusivity: Astal.Exclusivity.IGNORE,
    keymode: Astal.Keymode.EXCLUSIVE,
    anchor: Astal.WindowAnchor.TOP,
    onKeyPressEvent: (self, event) => {
      if (event.get_keyval()[1] === Gdk.KEY_Escape) {
        App.toggle_window("launcher");
        text.set("");
      }
    },

    child: new Widget.Box({
      className: "macchiato",
      vertical: true,
      spacing: 12,
      children: [
        <box className="default-apps" halign={Gtk.Align.CENTER} spacing={6}>
          {default_apps.map((app) => (
            <AppIcon app={app} />
          ))}
        </box>,

        <box>
          <eventbox expand onClick={hide} />
          <box hexpand={false} vertical>
            <eventbox heightRequest={100} onClick={hide} />
            <box className="Applauncher" vertical>
              <entry
                placeholderText="Search"
                text={text()}
                onChanged={(self) => text.set(self.text)}
                onActivate={onEnter}
              />
              <box spacing={6} vertical>
                {list.as((list) => list.map((app) => <AppButton app={app} />))}
              </box>
              <box
                halign={CENTER}
                className="not-found"
                vertical
                visible={list.as((l) => l.length === 0)}
              >
                <icon icon="system-search-symbolic" />
                <label label="No match found" />
              </box>
            </box>
            <eventbox expand onClick={hide} />
          </box>
          <eventbox expand onClick={hide} />
        </box>,
      ],
    }),
  });
};
