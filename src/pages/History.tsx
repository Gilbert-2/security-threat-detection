
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock history data
const historyData = [
  {
    id: "act-001",
    action: "System Started",
    user: "System",
    timestamp: "2025-05-12 08:00:15",
    details: "Security system initialized successfully"
  },
  {
    id: "act-002",
    action: "User Login",
    user: "Sarah Anderson",
    timestamp: "2025-05-12 08:32:41",
    details: "Administrator login from IP 192.168.1.42"
  },
  {
    id: "act-003",
    action: "Camera Settings Updated",
    user: "Sarah Anderson",
    timestamp: "2025-05-12 09:15:22",
    details: "Changed recording quality from HD to 4K for Main Entrance"
  },
  {
    id: "act-004",
    action: "Alert Acknowledged",
    user: "John Matthews",
    timestamp: "2025-05-12 10:22:05",
    details: "Alert ID-4872 for unauthorized access was acknowledged"
  },
  {
    id: "act-005",
    action: "Access Granted",
    user: "Emily Chen",
    timestamp: "2025-05-12 11:45:33",
    details: "Access granted to Secure Area B with valid credentials"
  },
  {
    id: "act-006",
    action: "System Report Generated",
    user: "Sarah Anderson",
    timestamp: "2025-05-12 13:12:55",
    details: "Monthly security audit report generated and saved"
  },
  {
    id: "act-007",
    action: "Camera Maintenance",
    user: "Technical Support",
    timestamp: "2025-05-12 14:30:00",
    details: "Scheduled maintenance performed on parking garage cameras"
  },
  {
    id: "act-008",
    action: "User Password Changed",
    user: "Mark Johnson",
    timestamp: "2025-05-12 15:18:42",
    details: "User changed account password successfully"
  },
  {
    id: "act-009",
    action: "Alert Triggered",
    user: "System",
    timestamp: "2025-05-12 16:05:11",
    details: "Motion detected in restricted area after hours"
  },
  {
    id: "act-010",
    action: "System Backup",
    user: "System",
    timestamp: "2025-05-12 23:00:00",
    details: "Automatic daily system backup completed successfully"
  }
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const uniqueActions = ["all", ...new Set(historyData.map(item => item.action))];
  const uniqueUsers = ["all", ...new Set(historyData.map(item => item.user))];

  const filteredData = historyData.filter(item => {
    const matchesSearch = item.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === "all" || item.action === actionFilter;
    const matchesUser = userFilter === "all" || item.user === userFilter;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">System History</h2>
            <p className="text-muted-foreground">Recent activities and system events</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Log</CardTitle>
            <CardDescription>Track all system and user activities</CardDescription>
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
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>
                      {user === "all" ? "All Users" : user}
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
                    <TableHead>User</TableHead>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.action}</TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.timestamp.split(' ')[0]}</span>
                            <Clock className="h-3.5 w-3.5 ml-2" />
                            <span>{item.timestamp.split(' ')[1]}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.details}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
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
