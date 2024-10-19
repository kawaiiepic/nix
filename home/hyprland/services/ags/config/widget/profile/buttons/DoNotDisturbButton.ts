import {
  notifications_count,
  doNotDisturb,
} from "../../notification/Notification";

function update_label(count: number, dnd: boolean): string {
  const icons = ["󰂚", "󱅫", "󰂛"];

  if (dnd) {
    return icons[2];
  } else if (count == 0) {
    return icons[0];
  } else {
    return icons[1];
  }
}

const label = Widget.Label({
  class_name: "profile-normal-button-label",
  label: update_label(0, false),

  setup(self) {
    notifications_count.connect("changed", ({ value }) => {
      self.label = update_label(value, doNotDisturb.value);
    });

    doNotDisturb.connect("changed", ({ value }) => {
      self.label = update_label(notifications_count.value, value);
    });
  },
});

export default () =>
  Widget.ToggleButton({
    class_name: "profile-normal-button circular",
    tooltip_text: "Toggle Do Not Disturb",
    on_toggled(self) {
      doNotDisturb.setValue(!self.active);
    },
    active: true,
    child: label,
  });
