import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userService, UserActivity, ActivityType } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, Clock, User, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const UserActivityPage = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityTypes, setActivityTypes] = useState<Record<ActivityType, number>>({} as Record<ActivityType, number>);
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [date, setDate] = useState<DateRange | undefined>();
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [userFilter, setUserFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState<any>({});
  
  const { toast } = useToast();

  // Fetch activities when component mounts or pagination changes
  useEffect(() => {
    fetchActivities();
    fetchUsers();
    fetchActivityTypes();
  }, [currentPage, pageSize]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserActivities(pageSize, currentPage);
      setActivities(response.activities);
      setError(null);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch user activities');
      console.error('Error fetching user activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getAllUsers();
      setUsers(
        usersData.map(user => ({
          id: user.id!,
          name: `${user.firstName} ${user.lastName}`
        }))
      );
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const typesData = await userService.getActivityTypeStats();
      setActivityTypes(typesData);
    } catch (err) {
      console.error('Error fetching activity types:', err);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Filter activities based on search query, type, date range and user
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.metadata && JSON.stringify(activity.metadata).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    
    const matchesUser = userFilter === "all" || activity.userId === userFilter;
    
    let matchesDate = true;
    if (date?.from && date?.to) {
      const activityDate = new Date(activity.timestamp);
      matchesDate = isWithinInterval(activityDate, {
        start: startOfDay(date.from),
        end: endOfDay(date.to)
      });
    }
    
    return matchesSearch && matchesType && matchesUser && matchesDate;
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const downloadCSV = () => {
    const headers = ["User", "Type", "Description", "Timestamp", "IP Address", "User Agent"];
    
    const csvContent = [
      headers.join(","),
      ...filteredActivities.map(activity => {
        const userName = users.find(u => u.id === activity.userId)?.name || activity.userId;
        return [
          userName,
          activity.type,
          `"${activity.description}"`,
          formatDate(activity.timestamp),
          activity.ipAddress || '',
          `"${activity.userAgent || ''}"`
        ].join(",");
      })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `user_activity_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Success", description: "Activity log exported to CSV" });
  };

  // Get activity type badge color
  const getTypeColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.LOGIN:
        return "bg-green-500/10 text-green-500";
      case ActivityType.LOGOUT:
        return "bg-blue-500/10 text-blue-500";
      case ActivityType.PROFILE_UPDATE:
        return "bg-purple-500/10 text-purple-500";
      case ActivityType.ALERT_ACKNOWLEDGE:
        return "bg-amber-500/10 text-amber-500";
      case ActivityType.ALERT_RESOLVE:
        return "bg-cyan-500/10 text-cyan-500";
      case ActivityType.SYSTEM_ACCESS:
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>Loading user activities...</p>
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
            <h2 className="text-2xl font-bold">User Activity</h2>
            <p className="text-muted-foreground">Track and monitor user actions within the system</p>
          </div>
          <Button onClick={downloadCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Filter by Date</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Filter by Type</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ActivityType | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(activityTypes).map(([type, count]) => (
                    <SelectItem key={type} value={type}>
                      {type} ({count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Filter by User</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Search Activities</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Log</CardTitle>
            <CardDescription>
              Showing {filteredActivities.length} of {pagination.total || 0} activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => {
                      const userName = users.find(u => u.id === activity.userId)?.name || activity.userId;
                      
                      return (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {userName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(activity.type)}>
                              {activity.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              {formatDate(activity.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell>{activity.ipAddress || "N/A"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {activity.metadata ? (
                              <div className="text-xs">
                                {activity.metadata.userAgent && (
                                  <div className="truncate" title={activity.metadata.userAgent}>
                                    Browser: {activity.metadata.userAgent.split(' ')[0]}
                                  </div>
                                )}
                                {activity.metadata.department && (
                                  <div>Dept: {activity.metadata.department}</div>
                                )}
                                {activity.metadata.alertId && (
                                  <div>Alert: {activity.metadata.alertId}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No details</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No activities found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserActivityPage;