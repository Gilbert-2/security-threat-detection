import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService, UserActivity } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/landing');
      return;
    }
    fetchUserActivities();
  }, [isAuthenticated, navigate]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const activitiesData = await userService.getUserSpecificActivity(user.id);
      setActivities(activitiesData);

      if (activitiesData.length === 0) {
        toast({
          title: "No Activities",
          description: "No activity history found for this user.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch user activities:', err);
      setError(err.message || 'Failed to fetch activities');
      toast({
        title: "Error",
        description: err.message || "Failed to fetch activities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities?.filter(activity => {
    try {
      if (!activity) return false;
      if (activeTab === "all") return true;
      return activity.type?.toLowerCase() === activeTab.toLowerCase();
    } catch (err) {
      console.error('Error filtering activity:', err);
      return false;
    }
  }) || [];

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    } catch (err) {
      console.error('Error formatting timestamp:', err);
      return {
        date: "Invalid Date",
        time: "Invalid Time"
      };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>Loading activity history...</p>
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
            <h2 className="text-2xl font-bold">Activity History</h2>
            <p className="text-muted-foreground">
              {user?.role === 'admin' ? 'All User Activities' : 'Your Activity History'} • {activities.length} total activities
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Activity Feed</CardTitle>
                <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">
                      All <Badge className="ml-1">{activities?.length || 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0 max-h-[600px] overflow-auto">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map(activity => {
                    const { date, time } = formatTimestamp(activity.timestamp);
                    return (
                      <div 
                        key={activity.id}
                        className="p-3 border-b last:border-0 hover:bg-slate-800/50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{activity.type}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div>{date}</div>
                            <div>{time}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No activities found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
