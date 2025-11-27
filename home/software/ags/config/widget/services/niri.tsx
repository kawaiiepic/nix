import { createState } from "ags";
import { execAsync, subprocess } from "ags/process";

export type Workspace = {
  id: number;
  name: string;
  is_focused: boolean;
  output?: string;
  active_window_id?: number;
};

export type Window = {
  id: number;
  title: string;
  app_id: string;
  pid: number;
  workspace_id: number;
  is_focused: boolean;
  is_floating: boolean;
  is_urgent: boolean;
  layout: {
    pos_in_scrolling_layout: [number, number];
    tile_size: [number, number];
    window_size: [number, number];
    tile_pos_in_workspace_view: [number, number] | null;
    window_offset_in_tile: [number, number];
  };
};

export const [workspaces, setWorkspaces] = createState<Workspace[]>([]);
export const [windows, setWindows] = createState<Window[]>([]);

function initWorkspaces() {
  execAsync(["niri", "msg", "--json", "workspaces"])
    .then((out) => {
      const wsList: Workspace[] = JSON.parse(out.trim());

      setWorkspaces(wsList);
    })
    .catch((error) => {
      console.error("Error fetching workspaces:", error);
    });
}

function initWindows() {
  execAsync(["niri", "msg", "--json", "windows"])
    .then((out) => {
      const wsList: Window[] = JSON.parse(out.trim());

      setWindows(wsList);
    })
    .catch((error) => {
      console.error("Error fetching window focus:", error);
    });
}

export function workspaceName(workspaceId: number): string | null {
  const workspace = workspaces.get().find(ws => ws.id === workspaceId);
  return workspace ? workspace.name : null;
}

export function focusedWindow(): Window | null {
    return windows.get().find(w => w.is_focused) ?? null;
  }

export function Niri() {
  console.log("Starting Niri service");

  initWorkspaces();
  initWindows();

  subprocess(["bash", "-c", "niri msg --json event-stream"], (line) => {
    // console.log(line);
    const ev = JSON.parse(line);

    if (ev.WorkspaceActivated) {
      initWorkspaces();
    }

    else if(ev.WindowFocusChanged || ev.WindowLayoutsChanged){
      initWindows();
    }
  });
}
