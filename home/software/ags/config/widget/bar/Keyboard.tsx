import { subprocess, exec, execAsync, createSubprocess } from "ags/process";

export default () => (
  <box onButtonPressed={() => {
   exec("pkill -RTMIN wvkbd");
  }}>
    <label label="" tooltipText="on-screen Keyboard" />
  </box>
);
