import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState<any>({});
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/landing');
      return;
    }
    fetchUserActivities();
  }, [isAuthenticated, navigate, currentPage, pageSize]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const response = await userService.getUserSpecificActivity(user.id, currentPage, pageSize);
      setActivities(response.activities);
      setPagination(response.pagination);

      if (response.activities.length === 0) {
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
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
              {user?.role === 'admin' ? 'All User Activities' : 'Your Activity History'} • {pagination.total || 0} total activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Activity Feed</CardTitle>
                <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">
                      All <Badge className="ml-1">{activities?.length || 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="login" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">Login</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">Security</TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-security-blue data-[state=active]:text-security-blue">System</TabsTrigger>
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
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
