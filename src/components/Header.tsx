
import { Bell, Shield, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { toast } = useToast();
  
  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread alerts that require attention",
    });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-security-blue/20 text-security-blue">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-security-blue to-accent bg-clip-text text-transparent">Security Threat Dashboard</h1>
          <p className="text-xs text-muted-foreground">Real-time threat monitoring & response</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden md:flex items-center gap-1.5">
          <span className="h-2 w-2 bg-green-500 rounded-full"></span>
          System Status: Active
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative"
          onClick={handleNotification}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 bg-security-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden md:inline">Settings</span>
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">Admin</span>
        </Button>
      </div>
    </header>
  );
};
