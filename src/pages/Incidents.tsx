
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Calendar, Clock, AlertCircle, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock incidents data
const incidentsData = [
  {
    id: "inc-001",
    title: "Unauthorized Access",
    location: "Main Entrance",
    timestamp: "2025-05-12 02:14:37",
    severity: "critical",
    status: "resolved",
    response: "Security team dispatched, unauthorized person detained."
  },
  {
    id: "inc-002",
    title: "Suspicious Package",
    location: "Lobby",
    timestamp: "2025-05-11 15:22:05",
    severity: "high",
    status: "resolved",
    response: "Package inspected by security team, confirmed safe."
  },
  {
    id: "inc-003",
    title: "Multiple Failed Access Attempts",
    location: "Server Room",
    timestamp: "2025-05-11 10:08:44",
    severity: "high",
    status: "resolved",
    response: "System administrator notified, account temporarily locked."
  },
  {
    id: "inc-004",
    title: "Camera Malfunction",
    location: "Parking Level 2",
    timestamp: "2025-05-11 08:37:19",
    severity: "medium",
    status: "pending",
    response: "Maintenance team scheduled for repair."
  },
  {
    id: "inc-005",
    title: "Motion After Hours",
    location: "Research Lab",
    timestamp: "2025-05-10 23:44:52",
    severity: "medium",
    status: "false alarm",
    response: "Confirmed as cleaning staff with proper authorization."
  },
  {
    id: "inc-006",
    title: "Smoke Detector Activation",
    location: "Kitchen Area",
    timestamp: "2025-05-10 12:15:33",
    severity: "high",
    status: "resolved",
    response: "Minor smoke from cooking, no fire. Ventilation activated."
  },
  {
    id: "inc-007",
    title: "Power Fluctuation",
    location: "Security System",
    timestamp: "2025-05-10 09:22:47",
    severity: "low",
    status: "resolved",
    response: "Backup systems engaged, no security compromise."
  },
  {
    id: "inc-008",
    title: "Unauthorized Access Attempt",
    location: "Executive Office",
    timestamp: "2025-05-09 17:05:11",
    severity: "critical",
    status: "under investigation",
    response: "Footage under review, additional guards posted."
  },
  {
    id: "inc-009",
    title: "Window Sensor Triggered",
    location: "West Wing",
    timestamp: "2025-05-09 02:33:29",
    severity: "medium",
    status: "resolved",
    response: "False alarm due to strong winds, sensors adjusted."
  },
  {
    id: "inc-010",
    title: "Unidentified Vehicle",
    location: "Loading Dock",
    timestamp: "2025-05-08 14:17:50",
    severity: "low",
    status: "resolved",
    response: "Vehicle confirmed as new vendor delivery, added to approved list."
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "text-alert-critical bg-alert-critical/10 border-alert-critical";
    case "high": return "text-alert-high bg-alert-high/10 border-alert-high";
    case "medium": return "text-alert-medium bg-alert-medium/10 border-alert-medium";
    case "low": return "text-alert-low bg-alert-low/10 border-alert-low";
    default: return "text-muted-foreground bg-muted/50";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "pending": return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    case "under investigation": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "false alarm": return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20";
    default: return "bg-muted/50 text-muted-foreground";
  }
};

const Incidents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<typeof incidentsData[0] | null>(null);

  const severities = ["all", "critical", "high", "medium", "low"];
  const statuses = ["all", "resolved", "pending", "under investigation", "false alarm"];

  const filteredData = incidentsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Security Incidents</h2>
            <p className="text-muted-foreground">All recorded security incidents and responses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Incidents Log</CardTitle>
                <CardDescription>All security incidents in chronological order</CardDescription>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search incidents..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severities.map(severity => (
                        <SelectItem key={severity} value={severity}>
                          {severity === "all" ? "All Severities" : severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
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
                        <TableHead>Incident</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[150px]">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <TableRow 
                            key={item.id}
                            onClick={() => setSelectedIncident(item)}
                            className="cursor-pointer hover:bg-slate-800/50"
                          >
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("capitalize", getSeverityColor(item.severity))}>
                                {item.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={cn("capitalize", getStatusColor(item.status))}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-nowrap">
                              <div className="flex flex-col text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {item.timestamp.split(' ')[0]}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.timestamp.split(' ')[1]}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
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
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Incident Details
                </CardTitle>
                <CardDescription>
                  {selectedIncident ? `Incident #${selectedIncident.id}` : "Select an incident to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedIncident ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{selectedIncident.title}</h3>
                      <div className="flex items-center gap-2 mt-1 mb-4">
                        <Badge variant="outline" className={cn("capitalize", getSeverityColor(selectedIncident.severity))}>
                          {selectedIncident.severity}
                        </Badge>
                        <Badge variant="secondary" className={cn("capitalize", getStatusColor(selectedIncident.status))}>
                          {selectedIncident.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedIncident.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{selectedIncident.timestamp.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedIncident.timestamp.split(' ')[1]}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700">
                      <div className="text-sm mb-2 text-muted-foreground">Response:</div>
                      <p className="text-sm p-3 bg-slate-800/50 rounded-md">
                        {selectedIncident.response}
                      </p>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      <Button size="sm" variant="default" className="gap-2">
                        <CheckCheck className="h-4 w-4" /> Update Status
                      </Button>
                      <Button size="sm" variant="outline">View Footage</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <AlertCircle className="h-16 w-16 mb-4 opacity-20" />
                    <p>Select an incident from the list to view details</p>
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

export default Incidents;
