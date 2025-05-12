
import { useState } from "react";
import { Shield, Video, Bell, Settings, User, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={cn(
        "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo and toggle */}
        <div>
          <div className="flex items-center p-4 border-b border-slate-800">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg bg-security-blue/20 text-security-blue",
              collapsed && "mx-auto"
            )}>
              <Shield className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold bg-gradient-to-r from-security-blue to-accent bg-clip-text text-transparent truncate">Security Panel</h1>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-2 space-y-2">
            <SidebarItem icon={Home} to="/" label="Dashboard" collapsed={collapsed} />
            <SidebarItem icon={Video} to="/video-feed" label="Live Video Feed" collapsed={collapsed} />
            <SidebarItem icon={Bell} to="/notifications" label="Notifications" collapsed={collapsed} />
          </nav>
        </div>

        {/* Bottom items */}
        <div className="p-2 border-t border-slate-800">
          <SidebarItem icon={Settings} to="/settings" label="Settings" collapsed={collapsed} />
          <SidebarItem icon={User} to="/profile" label="Profile" collapsed={collapsed} />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4 justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, collapsed }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1",
          collapsed ? "justify-center px-2" : "px-3"
        )}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span className="ml-3">{label}</span>}
      </Button>
    </Link>
  );
};
