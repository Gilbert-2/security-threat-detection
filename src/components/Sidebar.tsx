
import { useLocation, NavLink, Outlet } from "react-router-dom";
import { 
  Bell, 
  History as HistoryIcon, 
  Home,
  LogOut,
  Menu, 
  Settings, 
  Shield,
  ShieldAlert,
  UserCircle,
  Video
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Navigation items for the sidebar
const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home
  },
  {
    name: "Video Feed",
    path: "/video-feed",
    icon: Video
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: ShieldAlert
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell
  },
  {
    name: "History",
    path: "/history",
    icon: HistoryIcon
  },
];

// User-related navigation items
const userNavigationItems = [
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings
  },
];

// The shared sidebar content component used by both desktop and mobile views
const SidebarContent = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Function to generate initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get initials for avatar
  const userInitials = user ? getInitials(`${user.firstName} ${user.lastName}`) : "U";

  // User display name
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-center border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-security-blue/20 text-security-blue">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-security-blue to-accent bg-clip-text text-transparent">
            Security Monitor
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          <div className="py-2">
            {navigationItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 ${
                        isActive ? "bg-accent text-accent-foreground" : "transparent"
                      }`
                    }
                    end={item.path === "/"}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <Separator className="my-2 bg-slate-700/50" />
          <div className="py-2">
            <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">User</p>
            {userNavigationItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/50 ${
                        isActive ? "bg-accent text-accent-foreground" : "transparent"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </nav>
      </ScrollArea>
      <div className="p-2">
        <div className="flex items-center justify-between rounded-md p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.picture} alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.role || 'User'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// The main Sidebar component that conditionally renders based on viewport size
export const Sidebar = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-700/50 bg-slate-900/80 px-4 backdrop-blur-lg">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[270px] border-slate-700/50 bg-background p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-security-blue" />
            <span className="text-lg font-semibold">Security Monitor</span>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-700/50 bg-background sm:flex sm:flex-col">
        <SidebarContent />
      </aside>
      <main className="flex-1 sm:ml-64">
        <Outlet />
      </main>
    </div>
  );
};
