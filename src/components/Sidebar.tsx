import { Outlet } from "react-router-dom";
import { Sidebar as ResponsiveSidebar } from "./ui/sidebar";

export function Sidebar() {
  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <ResponsiveSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
