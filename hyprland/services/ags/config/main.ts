import "style/style"

import Bar from "widget/bar/Bar"
import Clock from "widget/clock/Clock";
import Profile from "widget/profile/Profile";
import { NotificationPopups, breadcrumb } from "./widget/notification/Notification"

App.config({
  closeWindowDelay: {

  },
  windows: () => [
    Bar(),
    Clock(),
    Profile(),
    NotificationPopups(),
    breadcrumb(),
  ],

  iconTheme: "Flat-Remix-Green-Dark",
});

