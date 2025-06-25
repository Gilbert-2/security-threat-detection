import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, Check, Clock, Fingerprint, Shield, UserX, Trash2, CheckCheck, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { notificationService, Notification } from "@/services/notificationService";
import { cn } from "@/lib/utils";

const API_URL = "https://security-threat-backend.onrender.com";

const NotificationItem = ({ 
  notification, 
  isSelected, 
  onClick,
  onDelete,
  isAdmin = false,
  currentUserId = ''
}: { 
  notification: Notification, 
  isSelected: boolean, 
  onClick: () => void,
  onDelete: () => void,
  isAdmin?: boolean,
  currentUserId?: string
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

  const isOwnNotification = currentUserId === notification.userId;

  return (
    <div
      className={
        `relative p-4 mb-2 rounded-lg border transition-all cursor-pointer flex items-start gap-3
        ${isSelected ? 'bg-slate-800/60 border-security-blue' : 'bg-slate-900/60 border-slate-800'}
        ${!notification.read ? 'border-l-4 border-l-security-blue' : 'border-l-4 border-l-transparent'}
        hover:bg-slate-800/80`
      }
      onClick={onClick}
    >
      <div className="flex-shrink-0 mt-1">{iconMap[notification.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-foreground truncate max-w-[200px]">{notification.title}</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${notification.type === 'security' ? 'bg-security-blue/10 text-security-blue' : notification.type === 'system' ? 'bg-amber-500/10 text-amber-500' : notification.type === 'hardware' ? 'bg-security-red/10 text-security-red' : 'bg-purple-500/10 text-purple-500'}`}>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</span>
            {!notification.read && <span className="ml-2 text-xs text-security-blue font-bold">New</span>}
            {isAdmin && !isOwnNotification && (
              <span className="ml-2 text-xs text-amber-500 bg-amber-500/10 px-1 rounded">Other User</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="inline h-3 w-3 mr-1" />
              {formatTime(notification.createdAt)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-red-500/10 hover:text-red-500"
              onClick={e => { e.stopPropagation(); onDelete(); }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="mt-1 text-sm text-foreground leading-snug">
          {notification.message
            ? notification.message.split(' ').length > 10
              ? notification.message.split(' ').slice(0, 10).join(' ') + '...'
              : notification.message
            : ''}
        </div>
        {isAdmin && !isOwnNotification && (
          <div className="text-xs text-amber-500 mt-1">User ID: {notification.userId}</div>
        )}
      </div>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/landing');
      return;
    }
    
    // Check if user is admin
    setIsAdmin(notificationService.isCurrentUserAdmin());
    fetchNotifications();
  }, [isAuthenticated, navigate, user]);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData);
      if (notificationsData.length > 0) {
        setSelectedNotification(notificationsData[0]);
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
      const response = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (err: any) {
      // If notification not found (404), mark it as read locally anyway
      if (err.response?.status === 404) {
        setNotifications(prev => prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        ));
        return;
      }
      
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
      const response = await axios.patch(`${API_URL}/notifications/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    } catch (err: any) {
      // If endpoint not found, mark all as read locally
      if (err.response?.status === 404) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast({
          title: "Success",
          description: "All notifications marked as read.",
        });
        return;
      }
      
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
    setDetailsOpen(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedNotification(null);
  };

  const deleteNotification = async (id: string, userId?: string) => {
    try {
      await notificationService.deleteNotification(id, userId);
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      toast({
        title: "Success",
        description: "Notification deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification.",
        variant: "destructive",
      });
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (!notification) return false;
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  }) || [];

  const unreadCount = notifications?.filter(n => n && !n.read).length || 0;

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
              {isAdmin ? 'All System Notifications' : 'Your Notifications'} • {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notification Feed</CardTitle>
              <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
                    All
                    <Badge
                      className="ml-1 h-4 min-w-[1rem] px-1.5 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center pointer-events-none select-none hover:bg-muted hover:text-foreground"
                      style={{ verticalAlign: 'middle', lineHeight: '1rem' }}
                    >
                      {notifications?.length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
                    Unread
                    <Badge
                      className="ml-1 h-4 min-w-[1rem] px-1.5 rounded-full bg-security-blue text-white text-xs font-bold flex items-center justify-center pointer-events-none select-none hover:bg-security-blue hover:text-white"
                      style={{ verticalAlign: 'middle', lineHeight: '1rem' }}
                    >
                      {unreadCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">Security</TabsTrigger>
                  <TabsTrigger value="system" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">System</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    isSelected={selectedNotification?.id === notification.id && detailsOpen}
                    onClick={() => handleSelect(notification)}
                    onDelete={() => deleteNotification(notification.id, notification.userId)}
                    isAdmin={isAdmin}
                    currentUserId={user.id}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No notifications found
                </div>
              )}
            </CardContent>
          </Card>

          {/* Floating Details Panel */}
          {detailsOpen && selectedNotification && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 animate-fade-in">
                <button
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                  onClick={handleCloseDetails}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  {/* Icon */}
                  {(() => {
                    switch (selectedNotification.type) {
                      case 'security': return <Shield className="text-security-blue h-7 w-7" />;
                      case 'system': return <Bell className="text-amber-500 h-7 w-7" />;
                      case 'hardware': return <AlertCircle className="text-security-red h-7 w-7" />;
                      case 'user': return <UserX className="text-purple-500 h-7 w-7" />;
                      default: return <Bell className="h-7 w-7" />;
                    }
                  })()}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-foreground truncate">{selectedNotification.title}</span>
                      <Badge variant={selectedNotification.read ? "outline" : "default"} className="ml-1">
                        {selectedNotification.read ? "Read" : "New"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${selectedNotification.type === 'security' ? 'bg-security-blue/10 text-security-blue' : selectedNotification.type === 'system' ? 'bg-amber-500/10 text-amber-500' : selectedNotification.type === 'hardware' ? 'bg-security-red/10 text-security-red' : 'bg-purple-500/10 text-purple-500'}`}>{selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}</span>
                      <span>• {new Date(selectedNotification.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-base text-foreground leading-snug">
                  {selectedNotification.message}
                </div>
                {isAdmin && (
                  <div className="mb-2 p-2 bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Recipient ID: {selectedNotification.userId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
