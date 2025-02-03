import { Process } from "astal";
import { App, Gtk } from "astal/gtk3";

export default ({ hostname="mia" }) => {
  function css (): string {
    if(hostname == "wyntor"){
      return "background-image: url('/home/wyntor/.face');"
    }
    else {
       return "background-image: url('/home/mia/.face');"
    }
  }
  
  return (
    <eventbox
      onClick={() => {
        App.toggle_window("launcher");
      }}
    >
      <box
        halign={Gtk.Align.CENTER}
        hexpand={false}
        vexpand={false}
        valign={Gtk.Align.CENTER}
        className="launcher"
        tooltip_text={"NixOS " + Process.exec("uname -r")}
        css={css()}
      />
    </eventbox>
  );
};
