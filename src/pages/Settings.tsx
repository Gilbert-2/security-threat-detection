import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Bell, Camera, Lock, Monitor, Save, Shield } from "lucide-react";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    securityAlerts: true,
    systemUpdates: true,
    userActivities: false,
    hardwareStatus: true,
    emailNotifications: false
  });
  
  const [cameraSettings, setCameraSettings] = useState({
    motionDetection: true,
    recordingQuality: "hd",
    retentionPeriod: "30",
    facialRecognition: true,
    nightMode: "auto"
  });

  const handleNotificationChange = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };
  
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">Configure your security system preferences</p>
        </div>
        
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="notifications" className="flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="cameras" className="flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
              <Camera className="h-4 w-4" /> Cameras
            </TabsTrigger>
            <TabsTrigger value="access" className="flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
              <Lock className="h-4 w-4" /> Access Control
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
              <Monitor className="h-4 w-4" /> System
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                  <CardDescription>Configure which notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts for critical security events
                      </p>
                    </div>
                    <Switch 
                      id="security-alerts" 
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={() => handleNotificationChange('securityAlerts')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Updates about system maintenance and patches
                      </p>
                    </div>
                    <Switch 
                      id="system-updates" 
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={() => handleNotificationChange('systemUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="user-activities">User Activities</Label>
                      <p className="text-xs text-muted-foreground">
                        Notifications about user logins and actions
                      </p>
                    </div>
                    <Switch 
                      id="user-activities" 
                      checked={notificationSettings.userActivities}
                      onCheckedChange={() => handleNotificationChange('userActivities')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="hardware-status">Hardware Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Alerts about camera status and hardware issues
                      </p>
                    </div>
                    <Switch 
                      id="hardware-status" 
                      checked={notificationSettings.hardwareStatus}
                      onCheckedChange={() => handleNotificationChange('hardwareStatus')}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Methods</CardTitle>
                  <CardDescription>How and where you'll receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Send critical alerts to your email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationChange('emailNotifications')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input id="email-address" placeholder="admin@security.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alert-priority">Alert Priority Threshold</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority Only</SelectItem>
                        <SelectItem value="medium">Medium and Higher</SelectItem>
                        <SelectItem value="all">All Alerts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full mt-6">
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="cameras">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Camera Configuration</CardTitle>
                  <CardDescription>Adjust settings for all cameras</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="motion-detection">Motion Detection</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable automatic motion detection
                      </p>
                    </div>
                    <Switch 
                      id="motion-detection" 
                      checked={cameraSettings.motionDetection}
                      onCheckedChange={() => setCameraSettings(prev => ({...prev, motionDetection: !prev.motionDetection}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recording-quality">Recording Quality</Label>
                    <Select 
                      defaultValue={cameraSettings.recordingQuality}
                      onValueChange={(value) => setCameraSettings(prev => ({...prev, recordingQuality: value}))}
                    >
                      <SelectTrigger id="recording-quality">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sd">Standard Definition</SelectItem>
                        <SelectItem value="hd">High Definition</SelectItem>
                        <SelectItem value="4k">4K Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retention">Footage Retention Period (Days)</Label>
                    <Input 
                      id="retention" 
                      type="number" 
                      value={cameraSettings.retentionPeriod}
                      onChange={(e) => setCameraSettings(prev => ({...prev, retentionPeriod: e.target.value}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="facial-recognition">Facial Recognition</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable AI-based facial recognition
                      </p>
                    </div>
                    <Switch 
                      id="facial-recognition" 
                      checked={cameraSettings.facialRecognition}
                      onCheckedChange={() => setCameraSettings(prev => ({...prev, facialRecognition: !prev.facialRecognition}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="night-mode">Night Vision Mode</Label>
                    <Select 
                      defaultValue={cameraSettings.nightMode}
                      onValueChange={(value) => setCameraSettings(prev => ({...prev, nightMode: value}))}
                    >
                      <SelectTrigger id="night-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Light Sensitive)</SelectItem>
                        <SelectItem value="always">Always On</SelectItem>
                        <SelectItem value="scheduled">Scheduled (10pm-6am)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Motion Detection Zones</CardTitle>
                  <CardDescription>Configure sensitive areas for motion detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 h-[300px] rounded-lg border border-slate-700 flex items-center justify-center mb-4">
                    <p className="text-muted-foreground text-sm">Camera view configuration panel</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sensitivity">Detection Sensitivity</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="sensitivity">
                        <SelectValue placeholder="Select sensitivity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Fewer Alerts)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (More Alerts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full mt-6">
                    <Save className="mr-2 h-4 w-4" />
                    Save Camera Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-security-blue" />
                  Access Control Settings
                </CardTitle>
                <CardDescription>Manage authentication and access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <Shield className="h-16 w-16 mx-auto text-security-blue opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Access Control Module</h3>
                  <p className="text-muted-foreground mb-4">
                    This section requires administrator privileges.
                    Please authenticate to access these settings.
                  </p>
                  <Button>Authenticate to Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-security-blue" />
                  System Configuration
                </CardTitle>
                <CardDescription>Manage system-wide settings and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <Shield className="h-16 w-16 mx-auto text-security-blue opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">System Settings</h3>
                  <p className="text-muted-foreground mb-4">
                    This section requires administrator privileges.
                    Please authenticate to access these settings.
                  </p>
                  <Button>Authenticate to Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
