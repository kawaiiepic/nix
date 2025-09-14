import { execAsync } from "ags/process";


export function send_notification(title: string, message: string) {
  execAsync(["notify-send", "-i", "dialog-information-symbolic", title, message]);
}
