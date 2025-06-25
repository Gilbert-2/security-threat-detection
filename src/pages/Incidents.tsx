import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, AlertCircle, CheckCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Alert, AlertSeverity, AlertStatus, LocationType } from "@/types/alert";
import { useToast } from "@/components/ui/use-toast";

const API_URL = "https://security-threat-backend.onrender.com";

const getSeverityColor = (severity: AlertSeverity) => {
  switch (severity) {
    case AlertSeverity.CRITICAL: return "text-alert-critical bg-alert-critical/10 border-alert-critical";
    case AlertSeverity.HIGH: return "text-alert-high bg-alert-high/10 border-alert-high";
    case AlertSeverity.MEDIUM: return "text-alert-medium bg-alert-medium/10 border-alert-medium";
    case AlertSeverity.LOW: return "text-alert-low bg-alert-low/10 border-alert-low";
    default: return "text-muted-foreground bg-muted/50";
  }
};

const getStatusColor = (status: AlertStatus) => {
  switch (status) {
    case AlertStatus.RESOLVED: return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case AlertStatus.NEW: return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    case AlertStatus.IN_PROGRESS: return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case AlertStatus.FALSE_ALARM: return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20";
    case AlertStatus.ACKNOWLEDGED: return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    default: return "bg-muted/50 text-muted-foreground";
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const Incidents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [selectedIncident, setSelectedIncident] = useState<Alert | null>(null);
  const [incidents, setIncidents] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const severities = ["all", ...Object.values(AlertSeverity)];
  const statuses = ["all", ...Object.values(AlertStatus)];

  useEffect(() => {
    fetchIncidents();
    
    // Listen for refresh events from other components
    const handleRefresh = () => {
      fetchIncidents();
    };
    
    window.addEventListener('refreshIncidents', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshIncidents', handleRefresh);
    };
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      // Get locally stored incidents
      const localIncidents = JSON.parse(localStorage.getItem('localIncidents') || '[]');
      
      // Combine backend and local incidents
      const allIncidents = [...response.data, ...localIncidents];
      setIncidents(allIncidents);
      setError(null);
    } catch (err) {
      // If backend fails, still show local incidents
      const localIncidents = JSON.parse(localStorage.getItem('localIncidents') || '[]');
      setIncidents(localIncidents);
      setError('Failed to fetch incidents from backend, showing local incidents only');
    } finally {
      setLoading(false);
    }
  };

  const updateIncidentStatus = async (id: string, status: AlertStatus) => {
    try {
      await axios.patch(`${API_URL}/alerts/${id}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      fetchIncidents();
      setSelectedIncident(null);
    } catch (err) {
      // Silent error handling for status updates
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      setDeletingId(id);
      
      // Check if it's a local incident
      const incident = incidents.find(inc => inc.id === id);
      const isLocal = incident?.isLocal;
      
      if (isLocal) {
        // Delete from localStorage
        const localIncidents = JSON.parse(localStorage.getItem('localIncidents') || '[]');
        const updatedLocalIncidents = localIncidents.filter((inc: any) => inc.id !== id);
        localStorage.setItem('localIncidents', JSON.stringify(updatedLocalIncidents));
        
        toast({
          title: "Incident Deleted",
          description: "Local incident has been removed.",
          variant: "default",
        });
      } else {
        // Delete from backend
        await axios.delete(`${API_URL}/alerts/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        toast({
          title: "Incident Deleted",
          description: "Incident has been removed from the system.",
          variant: "default",
        });
      }
      
      // Refresh the incidents list
      fetchIncidents();
      setSelectedIncident(null);
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the incident. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredData = incidents.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.locationName.toLowerCase().includes(searchQuery.toLowerCase());
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
                  <Select value={severityFilter} onValueChange={(value: AlertSeverity | "all") => setSeverityFilter(value)}>
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
                  <Select value={statusFilter} onValueChange={(value: AlertStatus | "all") => setStatusFilter(value)}>
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
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Loading incidents...
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-red-500">
                            {error}
                          </TableCell>
                        </TableRow>
                      ) : filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <TableRow 
                            key={item.id}
                            onClick={() => setSelectedIncident(item)}
                            className="cursor-pointer hover:bg-slate-800/50"
                          >
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.locationName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("capitalize", getSeverityColor(item.severity))}>
                                {item.severity.toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={cn("capitalize", getStatusColor(item.status))}>
                                {item.status.toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-nowrap">
                              <div className="flex flex-col text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(item.createdAt).split(' ')[0]}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(item.createdAt).split(' ')[1]}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={deletingId === item.id}
                                  >
                                    {deletingId === item.id ? (
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Incident</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteIncident(item.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                          {selectedIncident.severity.toLowerCase()}
                        </Badge>
                        <Badge variant="secondary" className={cn("capitalize", getStatusColor(selectedIncident.status))}>
                          {selectedIncident.status.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location Type:</span>
                        <span className="font-medium">{selectedIncident.locationType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedIncident.locationName}</span>
                      </div>
                      {selectedIncident.locationDetails && (
                        <>
                          {selectedIncident.locationDetails.building && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Building:</span>
                              <span className="font-medium">{selectedIncident.locationDetails.building}</span>
                            </div>
                          )}
                          {selectedIncident.locationDetails.floor && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Floor:</span>
                              <span className="font-medium">{selectedIncident.locationDetails.floor}</span>
                            </div>
                          )}
                          {selectedIncident.locationDetails.room && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Room:</span>
                              <span className="font-medium">{selectedIncident.locationDetails.room}</span>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">{formatDate(selectedIncident.createdAt)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{formatDate(selectedIncident.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700">
                      <div className="text-sm mb-2 text-muted-foreground">Description:</div>
                      <p className="text-sm p-3 bg-slate-800/50 rounded-md">
                        {selectedIncident.description}
                      </p>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      <Select 
                        value={selectedIncident.status} 
                        onValueChange={(value: AlertStatus) => updateIncidentStatus(selectedIncident.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AlertStatus).map(status => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedIncident.frameId && (
                        <Button size="sm" variant="outline">View Footage</Button>
                      )}
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
