import { Variable, GLib, bind, Process } from "astal";
import Hyprland from "gi://AstalHyprland";
import Apps from "gi://AstalApps";

export default () => {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  const apps = new Apps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
  });

  return (
    <box tooltipText={focused.as((client) => client.title)} spacing={6} className="client-title" visible={focused.as(Boolean)}>
      {focused.as(
        (client) =>
          client && (
            <icon
              className="client-icon"
              icon={bind(client, "class").as((title) => {
                switch (title) {
                  case "dev.zed.Zed":
                    title = "Zed";
                }
                const title_query = apps.fuzzy_query(client.initial_title);
                const class_query = apps.fuzzy_query(title);

                if (class_query.length > 0) {
                  return class_query[0].iconName;
                } else if (title_query.length > 0) {
                  return title_query[0].iconName;
                } else {
                  return client.class;
                }
              })}
            />
          ),
      )}
      {focused.as(
        (client) =>
          client && (
            <label
              label={bind(client, "title").as((title) => {
                return title.length <= 40
                  ? title
                  : title.substring(0, 40) + "…";
              })}
            />
          ),
      )}
    </box>
  );
}