const systemtray = await Service.import('systemtray')

/** @param {import('types/service/systemtray').TrayItem} item */
const SysTrayItem = item => Widget.Button({
  class_name: "systray",
  child: Widget.Icon().bind('icon', item, 'icon'),
  tooltipMarkup: item.bind('tooltip_markup'),
  onPrimaryClick: (_, event) => item.activate(event),
  onSecondaryClick: (_, event) => item.openMenu(event),
});

export default () => Widget.Box({
  class_name: "systray",
  spacing: 6,
  children: systemtray.bind('items').as(i => i.map(SysTrayItem))
})