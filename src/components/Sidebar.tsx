import { Outlet } from "react-router-dom";
import { Sidebar as ResponsiveSidebar, SidebarProvider } from "./ui/sidebar";

export function Sidebar() {
  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <SidebarProvider>
        <ResponsiveSidebar />
      </SidebarProvider>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
