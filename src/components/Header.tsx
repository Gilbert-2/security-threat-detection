
import { Bell, Shield } from "lucide-react";
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
    <header className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-security-blue" />
        <h1 className="text-xl font-bold">Security Threat Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-2">
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
        <span className="text-sm text-muted-foreground">System Status: Active</span>
      </div>
    </header>
  );
};
