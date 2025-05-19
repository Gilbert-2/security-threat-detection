
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  Camera,
  Bell,
  Settings,
  List,
  Shrink,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  History,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const ResizableSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  const minWidth = 80;
  const maxWidth = 300;

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    if (width <= minWidth + 50) {
      setCollapsed(true);
      setWidth(minWidth);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResize = (e: MouseEvent) => {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
        if (newWidth <= minWidth + 50) {
          setCollapsed(true);
        } else {
          setCollapsed(false);
        }
      }
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeEnd);

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing]);

  const toggleSidebar = () => {
    if (collapsed) {
      setCollapsed(false);
      setWidth(256);
    } else {
      setCollapsed(true);
      setWidth(minWidth);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { title: "Dashboard", icon: BarChart3, path: "/", roles: ["user", "admin", "manager", "supervisor"] },
    { title: "Video Feed", icon: Camera, path: "/video-feed", roles: ["user", "admin", "manager", "supervisor"] },
    { title: "Notifications", icon: Bell, path: "/notifications", roles: ["user", "admin", "manager", "supervisor"] },
    { title: "Incidents", icon: AlertCircle, path: "/incidents", roles: ["user", "admin", "manager", "supervisor"] },
    { title: "History", icon: History, path: "/history", roles: ["user", "admin", "manager", "supervisor"] },
    { title: "Response Rules", icon: Shield, path: "/response-rules", roles: ["admin", "supervisor"] },
    { title: "User Activity", icon: User, path: "/user-activity", roles: ["admin", "supervisor"] },
    { title: "Settings", icon: Settings, path: "/settings", roles: ["user", "admin", "manager", "supervisor"] },
  ];

  const filteredNavItems = navItems.filter(item => {
    return hasRole(item.roles);
  });

  return (
    <div className="relative h-full flex flex-col" style={{ width: `${width}px`, minWidth: `${width}px` }}>
      <div className={cn(
        "h-full bg-slate-900 border-r border-slate-800 flex flex-col",
        isResizing && "select-none"
      )}>
        <div className="p-2 flex items-center justify-between">
          {!collapsed && <div className="text-lg font-bold text-security-blue px-2">SecuritySystem</div>}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <nav className="mt-4 flex-1">
          <ul className="space-y-1 p-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive(item.path) && "bg-slate-800",
                        collapsed ? "px-2" : "px-4"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-security-blue/50 transition-colors",
          isResizing && "bg-security-blue"
        )}
        onMouseDown={handleResizeStart}
      >
        <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2">
          <Shrink className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
};
