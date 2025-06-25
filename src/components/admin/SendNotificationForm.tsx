import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Users, User as UserIcon, Send, AlertCircle, Shield, Settings, UserCheck, Search, X, ChevronDown, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService, User } from "@/services/userService";
import { notificationService } from "@/services/notificationService";

interface CreateNotificationDto {
  title: string;
  description: string;
  type: 'security' | 'system' | 'hardware' | 'user';
  details?: string;
}

interface CreateBulkNotificationDto {
  notification: CreateNotificationDto;
  userIds?: string[];
  all?: boolean;
}

export const SendNotificationForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [notificationType, setNotificationType] = useState<'specific' | 'multiple' | 'all'>('specific');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'system',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendToAllToggle = () => {
    setSendToAll(!sendToAll);
    if (!sendToAll) {
      setSelectedUsers([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (notificationType === 'specific' && selectedUsers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one user.",
        variant: "destructive",
      });
      return;
    }
    if (notificationType === 'multiple' && selectedUsers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one user.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      let response;
      const notificationPayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
      };
      if (notificationType === 'specific' && selectedUsers.length === 1) {
        response = await notificationService.sendNotificationToUser(
          selectedUsers[0],
          notificationPayload
        );
        toast({
          title: "Success",
          description: `Notification sent to user successfully.`,
        });
      } else if (notificationType === 'multiple' || (notificationType === 'specific' && selectedUsers.length > 1)) {
        response = await notificationService.sendBulkNotifications(selectedUsers, notificationPayload);
        toast({
          title: "Success",
          description: `Notification sent to ${response.count} users successfully.`,
        });
      } else if (notificationType === 'all' || sendToAll) {
        response = await notificationService.sendBulkNotifications([], notificationPayload, true);
        toast({
          title: "Success",
          description: `Notification sent to all ${response.count} users successfully.`,
        });
      }
      setFormData({
        title: '',
        description: '',
        type: 'system',
      });
      setSelectedUsers([]);
      setSendToAll(false);
      setNotificationType('specific');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4 text-security-blue" />;
      case 'system':
        return <Settings className="h-4 w-4 text-amber-500" />;
      case 'hardware':
        return <AlertCircle className="h-4 w-4 text-security-red" />;
      case 'user':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'text-security-blue bg-security-blue/10';
      case 'system':
        return 'text-amber-500 bg-amber-500/10';
      case 'hardware':
        return 'text-security-red bg-security-red/10';
      case 'user':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-security-blue" />
            Send Notification
          </CardTitle>
          <CardDescription>
            Create and send notifications to users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Notification Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant={notificationType === 'specific' ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setNotificationType('specific')}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Specific User</span>
                  <span className="text-xs text-muted-foreground">Send to one user</span>
                </Button>
                <Button
                  type="button"
                  variant={notificationType === 'multiple' ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setNotificationType('multiple')}
                >
                  <Users className="h-5 w-5" />
                  <span>Multiple Users</span>
                  <span className="text-xs text-muted-foreground">Send to selected users</span>
                </Button>
                <Button
                  type="button"
                  variant={notificationType === 'all' ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setNotificationType('all')}
                >
                  <Bell className="h-5 w-5" />
                  <span>All Users</span>
                  <span className="text-xs text-muted-foreground">Send to everyone</span>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Notification Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter notification description"
                  rows={3}
                  required
                  className="resize-none"
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'security' | 'system' | 'hardware' | 'user') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-security-blue" />
                        Security
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-amber-500" />
                        System
                      </div>
                    </SelectItem>
                    <SelectItem value="hardware">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-security-red" />
                        Hardware
                      </div>
                    </SelectItem>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-purple-500" />
                        User
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User Selection */}
            {(notificationType === 'specific' || notificationType === 'multiple') && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Select Users</Label>
                    {loadingUsers && <span className="text-sm text-muted-foreground">Loading users...</span>}
                  </div>
                  
                  {/* User Search and Selection */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        placeholder="Search users by name, email, or department..."
                        className="pr-10"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          // Filter users based on search term
                          const filtered = users.filter(user => 
                            user.firstName?.toLowerCase().includes(searchTerm) ||
                            user.lastName?.toLowerCase().includes(searchTerm) ||
                            user.email?.toLowerCase().includes(searchTerm) ||
                            user.department?.toLowerCase().includes(searchTerm)
                          );
                          // Show filtered results in dropdown
                        }}
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    {/* Selected Users Display */}
                    {selectedUsers.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Users ({selectedUsers.length})</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map(userId => {
                            const user = users.find(u => u.id === userId);
                            if (!user) return null;
                            return (
                              <div
                                key={userId}
                                className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 text-sm"
                              >
                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <span className="font-medium">
                                  {user.firstName} {user.lastName}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-red-500/10 hover:text-red-500"
                                  onClick={() => handleUserToggle(userId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Selection Options */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Quick Selection</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const adminUsers = users.filter(u => u.role === 'admin').map(u => u.id || '');
                            setSelectedUsers(adminUsers);
                          }}
                          className="text-xs"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          All Admins
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const itUsers = users.filter(u => u.department === 'IT').map(u => u.id || '');
                            setSelectedUsers(itUsers);
                          }}
                          className="text-xs"
                        >
                          <Building className="h-3 w-3 mr-1" />
                          IT Department
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const securityUsers = users.filter(u => u.department === 'Security').map(u => u.id || '');
                            setSelectedUsers(securityUsers);
                          }}
                          className="text-xs"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Security Team
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUsers([])}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    {/* User List (Collapsible) */}
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => {
                          const userListElement = document.getElementById('user-list');
                          if (userListElement) {
                            userListElement.classList.toggle('hidden');
                          }
                        }}
                      >
                        <span>Show All Users ({users.length})</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      
                      <div id="user-list" className="hidden max-h-60 overflow-y-auto border rounded-md p-4 space-y-2">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-800/50"
                          >
                            <Checkbox
                              id={user.id}
                              checked={selectedUsers.includes(user.id || '')}
                              onCheckedChange={() => handleUserToggle(user.id || '')}
                            />
                            <Label
                              htmlFor={user.id}
                              className="flex-1 cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {user.email} • {user.department || 'No department'}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* All Users Option */}
            {notificationType === 'all' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-md bg-slate-800/20">
                    <Checkbox
                      id="sendToAll"
                      checked={sendToAll}
                      onCheckedChange={handleSendToAllToggle}
                    />
                    <Label htmlFor="sendToAll" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4 text-security-blue" />
                      Send to all {users.length} users in the system
                    </Label>
                  </div>
                </div>
              </>
            )}

            {/* Preview */}
            {(formData.title || formData.description) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-base font-medium">Preview</Label>
                  <Card className="bg-slate-800/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(formData.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{formData.title || 'Notification Title'}</h4>
                            <Badge className={getTypeColor(formData.type)}>
                              {formData.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formData.description || 'Notification description will appear here...'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            <Separator />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Notification
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
