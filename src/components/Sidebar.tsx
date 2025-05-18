
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  BarChart3, Camera, Clock, Home, 
  LogOut, Menu, Settings, ShieldAlert, User, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Video Feed', icon: Camera, path: '/video-feed' },
  { name: 'Incidents', icon: ShieldAlert, path: '/incidents' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'History', icon: Clock, path: '/history' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
];

export const Sidebar = () => {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/landing');
  };

  // Create a utility component for consistent nav items
  const NavItem = ({ 
    icon: Icon, 
    name, 
    path 
  }: { 
    icon: React.ComponentType<any>; 
    name: string; 
    path: string; 
  }) => (
    <NavLink
      to={path}
      onClick={() => isMobile && setOpen(false)}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
        ${isActive 
          ? 'bg-slate-800/80 text-white' 
          : 'text-muted-foreground hover:text-white hover:bg-slate-800/50'
        }
      `}
    >
      <Icon className="h-5 w-5" />
      <span>{name}</span>
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 bg-sidebar-background text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 mb-8">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-security-blue/20 text-security-blue">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold text-lg leading-none tracking-tight">SecurityMonitor</h2>
          <p className="text-xs text-muted-foreground">Threat detection dashboard</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(item => (
          <NavItem key={item.path} icon={item.icon} name={item.name} path={item.path} />
        ))}
      </div>

      <Separator className="my-4 bg-slate-700/50" />
      
      <div className="px-3 py-2 space-y-1">
        <NavItem icon={User} name="Profile" path="/profile" />
        <NavItem icon={Settings} name="Settings" path="/settings" />
        <button 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full text-left text-muted-foreground hover:text-white hover:bg-slate-800/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {user && (
        <div className="px-3 mt-6 mb-2">
          <div className="flex items-center gap-3 p-3 rounded-md bg-slate-800/50">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white">
              {user.firstName?.[0]}{user.lastName?.[0] || ''}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div>
        <div className="sticky top-0 z-30 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-3 border-b">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-security-blue/20 text-security-blue">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h2 className="font-semibold tracking-tight">SecurityMonitor</h2>
          </div>
        </div>
        <div className="p-0">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-700/50">
        {sidebarContent}
      </aside>
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};
