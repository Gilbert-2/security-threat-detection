
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService, UserActivity } from "@/services/userService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get current user
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchUserActivities();
  }, []);

  const fetchUserActivities = async () => {
    try {
      setIsLoading(true);
      let activities: UserActivity[];
      
      if (currentUser?.id) {
        // Get activities for the current user
        activities = await userService.getUserSpecificActivity(currentUser.id);
      } else {
        // Fallback to getting generic activities if no user ID
        activities = await userService.getUserActivities(20);
      }
      
      setUserActivities(activities);
    } catch (error) {
      console.error("Failed to fetch user activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activity history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueActions = ["all", ...new Set(userActivities.map(item => item.action))];

  const filteredData = userActivities.filter(item => {
    const matchesSearch = 
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.details || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || item.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Activity History</h2>
            <p className="text-muted-foreground">
              {currentUser 
                ? `Activity log for ${currentUser.firstName} ${currentUser.lastName}`
                : "All system activities and events"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Log</CardTitle>
            <CardDescription>Track system and user activities</CardDescription>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action === "all" ? "All Actions" : action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Action</TableHead>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                    {!currentUser && <TableHead>User</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={currentUser ? 3 : 4} className="h-24 text-center">
                        Loading activity history...
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const formattedTime = formatTimestamp(item.timestamp);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.action}</TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formattedTime.date}</span>
                              <Clock className="h-3.5 w-3.5 ml-2" />
                              <span>{formattedTime.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.details || "-"}</TableCell>
                          {!currentUser && <TableCell>{item.user}</TableCell>}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={currentUser ? 3 : 4} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
