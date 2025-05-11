
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertItemProps } from "./AlertItem";
import { AlertCircle, Camera, Clock, ShieldAlert, Eye, CheckCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface AlertDetailsProps {
  selectedAlert: AlertItemProps | null;
}

export const AlertDetails = ({ selectedAlert }: AlertDetailsProps) => {
  const severityColors: Record<string, string> = {
    low: "text-alert-low",
    medium: "text-alert-medium",
    high: "text-alert-high",
    critical: "text-alert-critical",
  };

  const severityBg: Record<string, string> = {
    low: "bg-alert-low/10",
    medium: "bg-alert-medium/10",
    high: "bg-alert-high/10",
    critical: "bg-alert-critical/10",
  };

  if (!selectedAlert) {
    return (
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Alert Details</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-60px)] items-center justify-center flex-col">
          <div className="p-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">
              Select an alert from the event feed to view details
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              All alert information and actions will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className={cn("h-5 w-5", severityColors[selectedAlert.severity])} />
            Alert Details
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "uppercase font-bold", 
              severityColors[selectedAlert.severity],
              severityBg[selectedAlert.severity]
            )}
          >
            {selectedAlert.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto h-[calc(100%-60px)] p-4">
        <div>
          <h3 className="text-lg font-medium">{selectedAlert.title}</h3>
          <p className="text-muted-foreground">{selectedAlert.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
            <Camera className="h-4 w-4 text-security-blue" />
            <span className="text-muted-foreground">Camera:</span>
            <span className="font-medium">{selectedAlert.camera}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
            <Clock className="h-4 w-4 text-security-blue" />
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">{selectedAlert.timestamp}</span>
          </div>
        </div>

        {selectedAlert.imageUrl ? (
          <div className="bg-slate-900 rounded-md h-36 flex items-center justify-center border border-slate-800">
            <span className="text-muted-foreground text-xs">
              [Image snapshot would appear here]
            </span>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-md h-36 flex items-center justify-center border border-slate-800">
            <div className="text-center">
              <Eye className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <span className="text-muted-foreground text-xs">
                No image available
              </span>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span>Detection Confidence</span>
            <span className="text-xs text-muted-foreground font-normal">{selectedAlert.confidence || 85}%</span>
          </h4>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full", 
                selectedAlert.confidence && selectedAlert.confidence > 80 ? "bg-security-blue" :
                selectedAlert.confidence && selectedAlert.confidence > 60 ? "bg-alert-medium" : "bg-alert-high"
              )}
              style={{ width: `${selectedAlert.confidence || 85}%` }}
            />
          </div>
        </div>

        {selectedAlert.responseActions && selectedAlert.responseActions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <ShieldAlert className="h-4 w-4 text-security-blue" />
              System Response
            </h4>
            <ul className="space-y-2">
              {selectedAlert.responseActions.map((action, index) => (
                <li 
                  key={index} 
                  className="text-sm bg-security-blue/10 text-security-blue px-3 py-2 rounded-md flex items-center gap-2"
                >
                  <CheckCircle className="h-3 w-3" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button className="w-full">Acknowledge</Button>
          <Button className="w-full" variant="outline">False Alarm</Button>
          <Button className="w-full" variant="secondary">View Live Feed</Button>
          <Button className="w-full" variant="destructive">Escalate</Button>
        </div>
      </CardContent>
    </Card>
  );
};
