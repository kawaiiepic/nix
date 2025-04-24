import { bind } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export default () => {
  const hypr = AstalHyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  const apps = new AstalApps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
  });

  return focused.as(
    (client) =>
      client && (
        <box
          visible={focused.as(Boolean)}
          cssClasses={["client-title", "surface1"]}
          spacing={6}
          tooltipText={bind(client, "title")}
        >
          <image
            cssName="client-icon"
            iconName={bind(client, "class").as((title) => {
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

          <label
            label={bind(client, "title").as((title) => {
              return title.length <= 20 ? title : title.substring(0, 20) + "…";
            })}
          />
        </box>
      ) || (<box></box>),
  );
};
