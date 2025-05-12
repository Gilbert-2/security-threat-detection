
import { Header } from "@/components/Header";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, Check, Clock, Fingerprint, Shield, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "Unauthorized Access Attempt",
    description: "Someone attempted to access restricted area A-7 without proper credentials.",
    time: "10 minutes ago",
    read: false,
    type: "security",
    details: "IP Address: 192.168.1.45\nLocation: Server Room\nAttempt Count: 3\nAction Taken: Access denied and security alert triggered. The system has logged the MAC address and device information for further investigation."
  },
  {
    id: 2,
    title: "System Update Available",
    description: "A new security patch is available for installation.",
    time: "2 hours ago",
    read: false,
    type: "system",
    details: "Update Version: 2.5.3\nPriority: High\nChanges: This update addresses critical vulnerabilities in the authentication module and improves overall system stability. It's recommended to apply this update as soon as possible to maintain security standards."
  },
  {
    id: 3,
    title: "Camera 4 Offline",
    description: "The camera in the east corridor is currently offline.",
    time: "Yesterday",
    read: true,
    type: "hardware",
    details: "Device ID: CAM-EAST-04\nLast Seen: May 11, 2025 at 15:42\nDiagnostic Info: Connection lost suddenly, power supply seems operational. The system has attempted automatic reset 3 times without success. Manual inspection required."
  },
  {
    id: 4,
    title: "Motion Detected",
    description: "Motion detected in restricted area during off-hours.",
    time: "Yesterday",
    read: true,
    type: "security",
    details: "Location: R&D Lab\nTime: May 11, 2025 at 23:17\nDuration: 4 minutes 28 seconds\nVerification: Security footage has been flagged for review. Two individuals identified, confirming against authorized personnel database. Initial facial recognition suggests maintenance staff."
  },
  {
    id: 5,
    title: "User Account Locked",
    description: "User account 'jsmith' has been locked due to multiple failed login attempts.",
    time: "2 days ago",
    read: true,
    type: "user",
    details: "User: John Smith (jsmith)\nDepartment: IT Support\nFailed Attempts: 5\nTime Period: May 10, 2025 between 08:15-08:30\nIP Addresses: Multiple locations detected, possible credential theft attempt. Security team has been notified for follow-up."
  }
];

const NotificationItem = ({ 
  notification, 
  isSelected, 
  onClick 
}: { 
  notification: typeof notifications[0], 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  const iconMap = {
    security: <Shield className="text-security-blue h-5 w-5" />,
    system: <Bell className="text-amber-500 h-5 w-5" />,
    hardware: <AlertCircle className="text-security-red h-5 w-5" />,
    user: <UserX className="text-purple-500 h-5 w-5" />
  };

  return (
    <div 
      className={`p-3 border-b last:border-0 cursor-pointer flex items-start hover:bg-slate-800/50 ${isSelected ? 'bg-slate-800/50' : ''} ${!notification.read ? 'border-l-2 border-l-security-blue' : ''}`}
      onClick={onClick}
    >
      <div className="mr-3">
        {iconMap[notification.type as keyof typeof iconMap]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">
            {notification.title}
            {!notification.read && <span className="ml-2 text-xs text-security-blue">New</span>}
          </h4>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="inline h-3 w-3 mr-1" />
            {notification.time}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(notifications[0]);
  const [notificationList, setNotificationList] = useState(notifications);
  const [activeTab, setActiveTab] = useState("all");
  
  const markAsRead = (id: number) => {
    setNotificationList(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const handleSelect = (notification: typeof notifications[0]) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  };
  
  const filteredNotifications = notificationList.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });
  
  const unreadCount = notificationList.filter(n => !n.read).length;
  
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setNotificationList(prev => 
              prev.map(n => ({ ...n, read: true }))
            )}
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notification Feed</CardTitle>
                <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">
                      All <Badge className="ml-1">{notificationList.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread">
                      Unread <Badge className="ml-1">{unreadCount}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0 max-h-[600px] overflow-auto">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <NotificationItem 
                      key={notification.id}
                      notification={notification}
                      isSelected={selectedNotification?.id === notification.id}
                      onClick={() => handleSelect(notification)}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No notifications found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedNotification?.title}
                  <Badge variant={selectedNotification?.read ? "outline" : "default"}>
                    {selectedNotification?.read ? "Read" : "New"}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex justify-between">
                  <span>Type: {selectedNotification?.type}</span>
                  <span>{selectedNotification?.time}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg mb-4">
                  <Fingerprint className="text-security-blue h-5 w-5" />
                  <span className="text-sm">{selectedNotification?.description}</span>
                </div>
                
                <h4 className="font-medium mb-2">Detailed Information</h4>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground p-3 bg-slate-900 rounded-lg">
                  {selectedNotification?.details}
                </pre>
                
                <div className="mt-6 flex gap-2">
                  <Button variant="default" size="sm">Acknowledge</Button>
                  <Button variant="outline" size="sm">Forward</Button>
                  <Button variant="secondary" size="sm">View Related</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
