import { Outlet } from "react-router-dom";
import { ResizableSidebar } from "./ResizableSidebar";

export function Sidebar() {
  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <ResizableSidebar />
      <main className="flex-1 overflow-auto custom-dialog-scrollbar">
        <Outlet />
      </main>
    </div>
  );
}
