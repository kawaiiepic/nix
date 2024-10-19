var visible = false;

export default () => Widget.EventBox({
  class_name: "profile-pic",
  hexpand: false,
  hpack: "center",
  vexpand: false,
  vpack: "center",
  "on-primary-click": () => {
    if (visible) {
      visible = false;
      App.closeWindow("profile");
    }
    else {
      visible = true;
      App.openWindow("profile")
    }
  },
  tooltip_text: "Profile",
  setup: (self) => {
    self.child = Widget.Box({
      class_name: "profile-pic",
      css: `background-image: url("/home/mia/.face");`
        + "background-size: cover;"
        + "background-repeat: no-repeat;"
        + "background-position: center;",
    })
  }
})