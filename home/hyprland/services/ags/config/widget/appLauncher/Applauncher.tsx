import Apps from "gi://AstalApps";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { Variable } from "astal";

const MAX_ITEMS = 8;

function hide() {
  App.get_window("launcher")!.hide();
  1;
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

export default (gdkmonitor: Gdk.Monitor) => {
  const apps = new Apps.Apps();

  const { CENTER } = Gtk.Align;

  const text = Variable("");
  const list = text((text) => apps.fuzzy_query(text).slice(0, MAX_ITEMS).filter((app) => {
    if(app.executable.includes("steam://rungameid")){
      return false;
    }
    return true;
  }));
  const onEnter = () => {
    apps.fuzzy_query(text.get())?.[0].launch();
    hide();
  };

  new Widget.Window({
    name: "launcher",
    visible: false,
    gdkmonitor: gdkmonitor,
    application: App,
    exclusivity: Astal.Exclusivity.IGNORE,
    keymode: Astal.Keymode.EXCLUSIVE,
     anchor: Astal.WindowAnchor.TOP,
    onKeyPressEvent: (self, event) => {
      if (event.get_keyval()[1] === Gdk.KEY_Escape) {
        App.toggle_window("launcher");
      }
    },

    child: new Widget.Box({
      vertical: true,
      spacing: 12,
      child: (
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
                  {list.as((list) =>
                    list.map((app) => <AppButton app={app} />),
                  )}
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
        </box>
      ),
    }),
  });
};
