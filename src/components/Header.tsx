
import { Bell, Shield, User, Settings, Search, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

// Mock notifications
const notifications = [
  {
    id: 1,
    title: "Unauthorized Access Attempt",
    message: "Someone attempted to access restricted area A-7",
    time: "10 mins ago",
    read: false
  },
  {
    id: 2,
    title: "System Update Available",
    message: "A new security patch is available for installation",
    time: "2 hours ago",
    read: false
  },
  {
    id: 3,
    title: "Camera 4 Offline",
    message: "The camera in the east corridor is currently offline",
    time: "Yesterday",
    read: true
  }
];

export const Header = () => {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(2);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread alerts that require attention",
    });
  };

  const markAsRead = () => {
    setUnreadCount(0);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      toast({
        title: "Searching",
        description: `Searching for "${searchValue}"`,
      });
      // In a real app, you would redirect to search results or filter current view
    }
  };

  const handleNotificationClick = (notificationId: number) => {
    navigate(`/notifications`);
    // In a real app, you would also select the specific notification
  };

  return (
    <header className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3 md:hidden">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-security-blue/20 text-security-blue">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-security-blue to-accent bg-clip-text text-transparent">Security Threat Dashboard</h1>
          <p className="text-xs text-muted-foreground">Real-time threat monitoring & response</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center max-w-sm">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-slate-950/50 border-slate-800 w-[200px] h-9"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
        
        <span className="text-sm text-muted-foreground hidden md:flex items-center gap-1.5 mr-2">
          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
          System Status: Active
        </span>
        
        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-security-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAsRead} className="h-8 text-xs">
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="p-0">
                  <div 
                    onClick={() => handleNotificationClick(notification.id)} 
                    className="flex flex-col w-full px-2 py-2 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm flex items-center gap-1.5">
                        {notification.title}
                        {!notification.read && (
                          <Badge variant="default" className="h-1.5 w-1.5 p-0 rounded-full bg-security-blue" />
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{notification.message}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/notifications" className="justify-center font-medium cursor-pointer">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Settings Button */}
        <Button variant="outline" size="sm" className="gap-2 hidden sm:flex" asChild>
          <Link to="/settings">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Settings</span>
          </Link>
        </Button>
        
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=SA" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-security-red cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
