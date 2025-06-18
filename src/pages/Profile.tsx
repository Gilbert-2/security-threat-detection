import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, History, Key, LogOut, Save, ShieldAlert, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { userService, UserActivity } from "@/services/userService";

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // If we don't have user data, try to fetch it
        if (!user) {
          const token = localStorage.getItem('authToken');
          if (token) {
            const userData = await userService.getCurrentUser();
            if (userData) {
              localStorage.setItem("user", JSON.stringify(userData));
            }
          } else {
            setError('Authentication token not found');
            navigate('/landing');
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user, navigate]);

  // Fetch user activity when the component mounts
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (user?.id) {
        try {
          setActivityLoading(true);
          const result = await userService.getUserSpecificActivity(user.id);
          setUserActivities(result.activities);
        } catch (err) {
          console.error("Failed to fetch user activities:", err);
        } finally {
          setActivityLoading(false);
        }
      }
    };

    fetchUserActivity();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">User Profile</CardTitle>
              <CardDescription>{user.role}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.picture ? `http://localhost:7070/uploads/${user.picture}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}${user.lastName}`} alt="Profile image" />
                <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
              <p className="text-muted-foreground text-sm">{user.department || 'No department'}</p>
              <Badge variant="outline" className="mt-2 mb-4">{user.role}</Badge>
              
              <div className="w-full space-y-2 mt-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">User ID</span>
                  <span>{user.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{user.phoneNumber || 'N/A'}</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6 gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="account" className="flex gap-2">
                  <UserIcon className="h-4 w-4" /> Account
                </TabsTrigger>
                <TabsTrigger value="security" className="flex gap-2">
                  <ShieldAlert className="h-4 w-4" /> Security
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex gap-2">
                  <History className="h-4 w-4" /> Activity
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                    <CardDescription>View your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input 
                            id="first-name" 
                            placeholder="First Name" 
                            value={user.firstName}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input 
                            id="last-name" 
                            placeholder="Last Name" 
                            value={user.lastName}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            placeholder="Email" 
                            value={user.email}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            placeholder="Phone" 
                            value={user.phoneNumber || 'N/A'}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input 
                            id="department" 
                            placeholder="Department" 
                            value={user.department || 'N/A'}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input 
                            id="role" 
                            placeholder="Role" 
                            value={user.role}
                            disabled
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
                          <Key className="h-4 w-4" /> Password Management
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" placeholder="••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" placeholder="••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" placeholder="••••••••" />
                          </div>
                        </div>
                        <Button className="mt-4">Change Password</Button>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-800">
                        <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
                          <Fingerprint className="h-4 w-4" /> Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Two-factor authentication adds an extra layer of security to your account
                        </p>
                        <Button variant="outline">Enable Two-Factor Authentication</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity Log</CardTitle>
                    <CardDescription>Recent activity on your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="text-center py-4">Loading activity data...</div>
                    ) : userActivities.length > 0 ? (
                      <div className="space-y-4">
                        {userActivities.map((activity) => (
                          <div 
                            key={activity.id} 
                            className="flex items-start border-b border-slate-800 pb-3 last:border-0"
                          >
                            <div className="p-2 rounded-full bg-slate-800 mr-3">
                              <History className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium text-sm">{activity.type}</p>
                                <span className="text-xs text-muted-foreground">
                                  {formatActivityDate(activity.timestamp.toString())}
                                </span>
                              </div>
                              {activity.description && (
                                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                              )}
                              {activity.ipAddress && (
                                <p className="text-xs mt-1">IP: {activity.ipAddress}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No activity records found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
