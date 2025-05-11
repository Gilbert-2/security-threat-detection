
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertItemProps } from "./AlertItem";
import { AlertCircle, Camera, Clock, ShieldAlert } from "lucide-react";
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

  if (!selectedAlert) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Alert Details</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-60px)] items-center justify-center">
          <p className="text-muted-foreground text-center">
            Select an alert from the event feed to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className={cn("h-5 w-5", severityColors[selectedAlert.severity])} />
            Alert Details
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "uppercase font-bold", 
              severityColors[selectedAlert.severity]
            )}
          >
            {selectedAlert.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto h-[calc(100%-60px)]">
        <div>
          <h3 className="text-lg font-medium">{selectedAlert.title}</h3>
          <p className="text-muted-foreground">{selectedAlert.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-security-blue" />
            <span className="text-muted-foreground">Camera:</span>
            <span>{selectedAlert.camera}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-security-blue" />
            <span className="text-muted-foreground">Time:</span>
            <span>{selectedAlert.timestamp}</span>
          </div>
        </div>

        {selectedAlert.imageUrl ? (
          <div>
            <h4 className="text-sm font-medium mb-2">Visual Evidence</h4>
            <div className="bg-black/40 rounded-md h-36 flex items-center justify-center">
              <span className="text-muted-foreground text-xs">
                [Image snapshot would appear here]
              </span>
            </div>
          </div>
        ) : null}

        <div>
          <h4 className="text-sm font-medium mb-2">Detection Confidence</h4>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full", 
                selectedAlert.confidence && selectedAlert.confidence > 80 ? "bg-security-blue" :
                selectedAlert.confidence && selectedAlert.confidence > 60 ? "bg-alert-medium" : "bg-alert-high"
              )}
              style={{ width: `${selectedAlert.confidence}%` }}
            />
          </div>
          <div className="text-right text-xs mt-1">
            {selectedAlert.confidence}%
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
                  className="text-sm bg-security-blue/10 text-security-blue px-3 py-2 rounded-md"
                >
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button className="w-full">Acknowledge</Button>
          <Button className="w-full" variant="outline">False Alarm</Button>
        </div>
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary">View Live Feed</Button>
          <Button className="w-full" variant="destructive">Escalate</Button>
        </div>
      </CardContent>
    </Card>
  );
};
