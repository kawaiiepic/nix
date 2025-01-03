import { Widget } from "astal/gtk3";
import { ToggleButton } from "../../customWidget/ToggleButton";

export default () => new ToggleButton({
  className: "profile-normal-button circular",
     tooltip_text: "Toggle Do Not Disturb",
     active: true,
     child: new Widget.Label({
       className: "profile-normal-button-label",
       label: "󰂚"
     })
     
})