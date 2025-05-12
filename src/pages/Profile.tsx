
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, History, Key, LogOut, Save, ShieldAlert, User } from "lucide-react";

const activityLog = [
  { action: "Logged in", timestamp: "Today, 08:32 AM", ip: "192.168.1.42" },
  { action: "Updated camera settings", timestamp: "Yesterday, 4:17 PM", ip: "192.168.1.42" },
  { action: "Generated security report", timestamp: "Yesterday, 2:03 PM", ip: "192.168.1.42" },
  { action: "Acknowledged alert ID-4872", timestamp: "May 10, 2025, 11:30 AM", ip: "192.168.1.40" },
  { action: "Password changed", timestamp: "May 8, 2025, 09:15 AM", ip: "192.168.1.42" }
];

const Profile = () => {
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
              <CardTitle className="text-lg">Admin Profile</CardTitle>
              <CardDescription>Primary Administrator</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=SA" alt="Profile image" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">Sarah Anderson</h3>
              <p className="text-muted-foreground text-sm">Lead Security Administrator</p>
              <Badge variant="outline" className="mt-2 mb-4">System Administrator</Badge>
              
              <div className="w-full space-y-2 mt-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">User ID</span>
                  <span>SA-7842</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Email</span>
                  <span>s.anderson@securityco.com</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Access Level</span>
                  <span className="text-security-blue">Level 5 (Full)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md bg-slate-800/50">
                  <span className="text-muted-foreground">Last Login</span>
                  <span>Today, 08:32 AM</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6 gap-2">
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="First Name" defaultValue="Sarah" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Last Name" defaultValue="Anderson" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Email" defaultValue="s.anderson@securityco.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" placeholder="Department" defaultValue="Security Operations" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" placeholder="Role" defaultValue="Lead Security Administrator" />
                      </div>
                    </div>
                    
                    <Button className="mt-6 gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
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
                      {activityLog.map((log, index) => (
                        <div 
                          key={index} 
                          className="flex items-start justify-between p-3 rounded-md bg-slate-800/50"
                        >
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">IP: {log.ip}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      View Full Activity History
                    </Button>
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
