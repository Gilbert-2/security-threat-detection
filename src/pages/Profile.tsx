import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, History, Key, LogOut, Save, ShieldAlert, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  lastLoggedIn: string;
}

interface ActivityLog {
  action: string;
  timestamp: string;
  ip: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:7070/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('profile');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:7070/users/${user.id}`, {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        department: user.department
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Show success message or update UI
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
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
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}${user.lastName}`} alt="Profile image" />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
              <p className="text-muted-foreground text-sm">{user.department}</p>
              <Badge variant="outline" className="mt-2 mb-4">{user.role}</Badge>
              
              <div className="w-full space-y-2 mt-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">User ID</span>
                  <span>{user.id}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Last Login</span>
                  <span>{new Date(user.lastLoggedIn).toLocaleString()}</span>
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
                  <User className="h-4 w-4" /> Account
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
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <form onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input 
                            id="first-name" 
                            placeholder="First Name" 
                            value={user.firstName}
                            onChange={(e) => setUser({...user, firstName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input 
                            id="last-name" 
                            placeholder="Last Name" 
                            value={user.lastName}
                            onChange={(e) => setUser({...user, lastName: e.target.value})}
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
                            value={user.phoneNumber}
                            onChange={(e) => setUser({...user, phoneNumber: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input 
                            id="department" 
                            placeholder="Department" 
                            value={user.department}
                            onChange={(e) => setUser({...user, department: e.target.value})}
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
                      
                      <Button type="submit" className="mt-6 gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </form> */}
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
                    <div className="space-y-4">
                      {/* Activity log will be implemented when backend provides this data */}
                      <p className="text-muted-foreground">Activity log will be available soon.</p>
                    </div>
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