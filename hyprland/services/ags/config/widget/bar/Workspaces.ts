const hyprland = await Service.import("hyprland")

export default () => Widget.Box({
  class_name: "workspaces",
  children: Array.from({ length: 5 }, (_, i) => i + 1).map(i => Widget.EventBox({
    "on-primary-click": (event) => {
      hyprland.messageAsync(`dispatch workspace ${i}`)
    },
    child: Widget.Label({
      attribute: i,
      class_name: "workspace",
      vpack: "center",
      hpack: "center",
      tooltip_text: `Workspace: ${i}`,
      label: `${i}`,
      setup: self => self.hook(hyprland, () => {
        self.toggleClassName("active", hyprland.active.workspace.id === i)
        self.toggleClassName("occupied", (hyprland.getWorkspace(i)?.windows || 0) > 0)
      })
    })
  })),
});