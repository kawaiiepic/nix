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
      (client && (
        <box
          visible={focused.as(Boolean)}
          cssClasses={["client-title", "surface1"]}
          spacing={6}
          tooltipText={bind(client, "title")}
        >
          <image
            cssName="client-icon"
            iconName={bind(client, "class").as((clientClass) => {
              switch (clientClass) {
                case "dev.zed.Zed":
                  clientClass = "Zed";
              }

              const class_query = apps.exact_query(clientClass);

              if (clientClass.includes("steam_app_")) {
                return clientClass.replace("app_", "icon_");
              }
              
              print("Client: " + clientClass + " | " + class_query[0].iconName);

              return class_query[0].iconName;
            })}
          />

          <label
            label={bind(client, "title").as((title) => {
              return title.length <= 20 ? title : title.substring(0, 20) + "…";
            })}
          />
        </box>
      )) || <box></box>,
  );
};
