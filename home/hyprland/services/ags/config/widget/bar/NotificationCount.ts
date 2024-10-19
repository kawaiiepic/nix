import { notifications_count, doNotDisturb } from "../notification/Notification"

function update_label(count: number, dnd: boolean): string {
  const icons = ["󰂚", "󱅫", "󰂛"];

  if (dnd) {
    return icons[2] + ` (${count})`;
  }
  else if (count == 0) {
    return icons[0] + ` (${count})`;
  }
  else {
    return icons[1] + ` (${count})`;
  }
}

export default () => Widget.Label({
  label: update_label(0, false),

  setup(self) {
    notifications_count.connect('changed', ({ value }) => {
      self.label = update_label(value, doNotDisturb.value)
    })

    doNotDisturb.connect('changed', ({ value }) => {
      self.label = update_label(notifications_count.value, value)
    })
  }
})