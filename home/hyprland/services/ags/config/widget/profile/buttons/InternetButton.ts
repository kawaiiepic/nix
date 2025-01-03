import { bind } from "astal";
import { Widget } from "astal/gtk3";
import Network from "gi://AstalNetwork";
import { ToggleButton } from "../../customWidget/ToggleButton";

const { wifi } = Network.get_default();
export default () =>
  new ToggleButton({
    className: "profile-normal-button circular",
    active: true,
    child: new Widget.Icon({ icon: bind(wifi, "iconName") }),
  });
