import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, User, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { userService, UserActivity } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const UserActivityLog = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState<any>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchUserActivities();
  }, [currentPage, pageSize]);

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        setActivities([]);
        return;
      }

      const response = await userService.getUserSpecificActivity(user.id, currentPage, pageSize);
      setActivities(response.activities);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch user activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    } catch (err) {
      return {
        date: "Invalid Date",
        time: "Invalid Time"
      };
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b flex-row flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-security-blue" />
          User Activity
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Show:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2 overflow-y-auto max-h-[calc(100%-120px)] pr-1">
          {loading ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              Loading activities...
            </div>
          ) : activities.length > 0 ? (
            activities.map((activity) => {
              const { time } = formatTimestamp(activity.timestamp);
              return (
                <div 
                  key={activity.id}
                  className="bg-slate-800/50 border border-border/50 p-2 rounded-md hover:bg-slate-800/80 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-security-blue/20 flex items-center justify-center text-security-blue text-xs">
                        {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <span className="font-medium text-xs">{activity.type}</span>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{time}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground text-sm py-4">
              No activities found
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              {pagination.total || 0} total
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Badge variant="outline" className="text-xs">
                {pagination.page} / {pagination.totalPages}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
