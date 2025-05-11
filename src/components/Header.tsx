
import { Bell, ChevronDown, Filter, Search, Settings, Shield, User } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";

export const Header = () => {
  const { toast } = useToast();
  
  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread alerts that require attention",
    });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-security-blue/20 text-security-blue">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Incident Response</h1>
          <p className="text-xs text-muted-foreground">Efficiently monitor, investigate, and resolve security incidents to ensure system integrity and quick recovery.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search incidents, threats, or alerts..." 
            className="pl-9 bg-slate-800 border-slate-700 w-72"
          />
        </div>
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="relative bg-transparent border-slate-700 hover:bg-slate-800"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-security-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <div className="max-h-80 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="py-3 px-4 flex flex-col items-start gap-1 hover:bg-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-2 w-2 rounded-full bg-security-red"></div>
                    <span className="font-medium text-sm">Critical Alert Detected</span>
                    <span className="ml-auto text-xs text-muted-foreground">Just now</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Unauthorized access attempt detected from IP 192.168.1.{i}</p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="justify-center text-security-blue text-sm hover:bg-slate-800 cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent border-slate-700 hover:bg-slate-800">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
            <DropdownMenuLabel>System Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">Alert Configuration</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">Response Rules</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">Camera Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">User Management</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">System Logs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-slate-800">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-security-blue/20 text-security-blue">MP</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="hidden md:inline mr-1">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
            <DropdownMenuLabel>Mario Prokoski</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">Preferences</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">Activity Log</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer text-security-red">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
