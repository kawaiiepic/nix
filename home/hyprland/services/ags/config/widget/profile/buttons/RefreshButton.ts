import { Widget } from "astal/gtk3";

export default () =>
  new Widget.Button({
    className: "profile-small-button circular",
    tooltip_text: "Refresh",
    child: new Widget.Label({
      className: "profile-small-button-icon",
      label: "",
    }),
  });