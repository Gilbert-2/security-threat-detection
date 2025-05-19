
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, Check, Clock, Fingerprint, Shield, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  type: 'security' | 'system' | 'hardware' | 'user';
  details: string;
  userId: string;
}

const NotificationItem = ({ 
  notification, 
  isSelected, 
  onClick 
}: { 
  notification: Notification, 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  const iconMap = {
    security: <Shield className="text-security-blue h-5 w-5" />,
    system: <Bell className="text-amber-500 h-5 w-5" />,
    hardware: <AlertCircle className="text-security-red h-5 w-5" />,
    user: <UserX className="text-purple-500 h-5 w-5" />
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div 
      className={`p-3 border-b last:border-0 cursor-pointer flex items-start hover:bg-slate-800/50 ${isSelected ? 'bg-slate-800/50' : ''} ${!notification.read ? 'border-l-2 border-l-security-blue' : ''}`}
      onClick={onClick}
    >
      <div className="mr-3">
        {iconMap[notification.type]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">
            {notification.title}
            {!notification.read && <span className="ml-2 text-xs text-security-blue">New</span>}
          </h4>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="inline h-3 w-3 mr-1" />
            {formatTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/landing');
        return;
      }

      const response = await axios.get('http://localhost:7070/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(response.data);
      if (response.data.length > 0) {
        setSelectedNotification(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again.",
        variant: "destructive",
      });
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:7070/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch('http://localhost:7070/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      });
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleSelect = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
            onClick={markAllAsRead}
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
                      All <Badge className="ml-1">{notifications.length}</Badge>
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
            {selectedNotification ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedNotification.title}
                    <Badge variant={selectedNotification.read ? "outline" : "default"}>
                      {selectedNotification.read ? "Read" : "New"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex justify-between">
                    <span>Type: {selectedNotification.type}</span>
                    <span>{new Date(selectedNotification.createdAt).toLocaleString()}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg mb-4">
                    <Fingerprint className="text-security-blue h-5 w-5" />
                    <span className="text-sm">{selectedNotification.description}</span>
                  </div>
                  
                  <h4 className="font-medium mb-2">Detailed Information</h4>
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground p-3 bg-slate-900 rounded-lg">
                    {selectedNotification.details}
                  </pre>
                  
                  <div className="mt-6 flex gap-2">
                    <Button variant="default" size="sm">Acknowledge</Button>
                    <Button variant="outline" size="sm">Forward</Button>
                    <Button variant="secondary" size="sm">View Related</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Select a notification to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
