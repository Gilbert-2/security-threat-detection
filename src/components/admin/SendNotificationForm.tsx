import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Users, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";
import { userService } from "@/services/userService";

interface SendNotificationFormProps {
  onSuccess?: () => void;
}

export const SendNotificationForm = ({ onSuccess }: SendNotificationFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [type, setType] = useState("system");
  const [sendMode, setSendMode] = useState<"single" | "bulk">("bulk");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getUsers();
        setUsers(users);
        if (users.length === 0) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view the users list.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const handleSendNotification = async () => {
    if (!title || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const notificationData = {
      title,
      description,
      type,
      details
    };

    try {
      setIsLoading(true);

      if (sendMode === "single") {
        if (!selectedUser) {
          toast({
            title: "Missing user",
            description: "Please select a user to send the notification to",
            variant: "destructive"
          });
          return;
        }

        await notificationService.sendNotificationToUser(selectedUser, notificationData);
        toast({
          title: "Success",
          description: "Notification sent successfully to the selected user"
        });
      } else {
        // Send to all users
        await notificationService.sendBulkNotifications(selectedUserIds.length ? selectedUserIds : users.map(u => u.id), notificationData);
        toast({
          title: "Success",
          description: `Notification sent to ${selectedUserIds.length ? selectedUserIds.length : "all"} users`
        });
      }

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setDetails("");
      setType("system");
      setSelectedUser("");
      setSelectedUserIds([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
        <CardDescription>
          Send a notification to one or multiple users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Only administrators can send notifications to users.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Button
                  variant={sendMode === "bulk" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSendMode("bulk")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Multiple Users
                </Button>
                <Button
                  variant={sendMode === "single" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSendMode("single")}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Single User
                </Button>
              </div>
            </div>

            {sendMode === "single" ? (
              <div className="space-y-1">
                <label className="text-sm font-medium">Select User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingUsers ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-medium">Select Users (leave empty for all)</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedUserIds.length ? `${selectedUserIds.length} users selected` : "All users"} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        This feature will be implemented in a future update
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setSelectedUserIds([])}
                      >
                        Select All Users
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">Notification Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Title*</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description*</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the notification"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Details (Optional)</label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Additional details or information"
                rows={4}
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSendNotification}
          disabled={isLoading || users.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
