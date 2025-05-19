
import { useState } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SendNotificationForm } from "@/components/admin/SendNotificationForm";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemStatus } from "@/components/SystemStatus";
import { BellRing, Users, Bell } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Manage system users, send notifications and monitor system status
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications">Send Notifications</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <SystemStatus />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" /> 
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage system users and their access levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Switch to the User Management tab to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>View all registered users</li>
                    <li>Edit user information</li>
                    <li>Manage user roles and permissions</li>
                    <li>Remove users from the system</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellRing className="h-5 w-5 mr-2" /> 
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Send important notifications to system users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Switch to the Send Notifications tab to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Send system announcements</li>
                    <li>Alert users about security issues</li>
                    <li>Target specific users or groups</li>
                    <li>Schedule automated notifications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="max-w-2xl mx-auto">
              <SendNotificationForm />
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="user-management-container">
              <UserManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
