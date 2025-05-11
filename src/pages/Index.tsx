
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { recentAlerts } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Filter button component for consistent styling
const FilterButton = ({ label, children }: { label: string, children?: React.ReactNode }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-transparent border-slate-700 hover:bg-slate-800 text-sm flex items-center gap-2"
      >
        {label} <ChevronDown className="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="bg-slate-900 border-slate-700 text-foreground">
      <div className="flex flex-col gap-2 p-1">
        {children || (
          <>
            <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md cursor-pointer">All</div>
            <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md cursor-pointer">Option 1</div>
            <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md cursor-pointer">Option 2</div>
            <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md cursor-pointer">Option 3</div>
          </>
        )}
      </div>
    </PopoverContent>
  </Popover>
);

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  
  // Convert alerts data to match the table structure
  const incidents = recentAlerts.map(alert => ({
    id: alert.id,
    type: alert.title,
    severity: alert.severity,
    date: alert.timestamp.split(' ')[0],
    time: alert.timestamp.split(' ')[1],
    status: Math.random() > 0.5 ? "Open" : "Resolved"
  }));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <SidebarInset className="p-0">
          <div className="flex flex-col h-full">
            <Header />
            <main className="flex-grow p-4">
              {/* Filters Row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <FilterButton label="Severity" />
                <FilterButton label="Date" />
                <FilterButton label="Response Status" />
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by</span>
                  <FilterButton label="Date" />
                </div>
              </div>
              
              {/* Incidents Table */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-800">
                    <TableRow className="hover:bg-slate-700 border-slate-700">
                      <TableHead className="text-white flex items-center gap-1">Incident ID <ChevronDown className="h-3 w-3" /></TableHead>
                      <TableHead className="text-white">Incident Type</TableHead>
                      <TableHead className="text-white flex items-center gap-1">Severity <ChevronDown className="h-3 w-3" /></TableHead>
                      <TableHead className="text-white flex items-center gap-1">Date <ChevronDown className="h-3 w-3" /></TableHead>
                      <TableHead className="text-white">Time</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id} className="hover:bg-slate-700/50 border-slate-700">
                        <TableCell className="font-medium"># {incident.id}</TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              incident.severity === 'critical' ? 'bg-security-red' :
                              incident.severity === 'high' ? 'bg-security-red' :
                              incident.severity === 'medium' ? 'bg-orange-400' :
                              'bg-yellow-300'
                            }`}></div>
                            <span className={
                              incident.severity === 'critical' ? 'text-security-red' :
                              incident.severity === 'high' ? 'text-security-red' :
                              incident.severity === 'medium' ? 'text-orange-400' :
                              'text-yellow-300'
                            }>
                              {incident.severity === 'critical' ? 'Urgent' : 
                               incident.severity === 'high' ? 'Urgent' : 
                               incident.severity === 'medium' ? 'Warning' : 'Caution'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>2024-10-0{Math.floor(Math.random() * 5) + 1}</TableCell>
                        <TableCell>{incident.time}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            incident.status === 'Open' 
                              ? 'bg-slate-700/50 text-white' 
                              : 'bg-green-900/30 text-green-300'
                          }`}>
                            {incident.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {incidents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                          No incidents to display at the moment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-slate-700 hover:bg-slate-800 flex items-center gap-2" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-slate-700 hover:bg-slate-800 flex items-center gap-2" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
