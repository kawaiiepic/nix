const hyprland = await Service.import("hyprland")

export default () => Widget.Label({
  class_name: "client-title",
  tooltip_text: hyprland.active.client.bind("title"),
  label: hyprland.active.client.bind("title").as((title: string) => {
    return title.length <= 40 ? title : title.substring(0, 40) + "…"
  })
})