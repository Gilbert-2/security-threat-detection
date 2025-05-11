
import { Home, Shield, AlertTriangle, Settings, User, Calendar, Clock } from "lucide-react";
import { 
  Sidebar as SidebarComponent,
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar";

export const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: Home, active: true },
    { name: "Incidents", icon: AlertTriangle, active: false },
    { name: "Response Rules", icon: Shield, active: false },
    { name: "Schedule", icon: Calendar, active: false },
    { name: "History", icon: Clock, active: false },
    { name: "Settings", icon: Settings, active: false },
    { name: "User Management", icon: User, active: false }
  ];

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-6 w-6 text-security-blue" />
          <span className="font-bold text-lg">SecureView</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    isActive={item.active}
                    tooltip={item.name}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};
