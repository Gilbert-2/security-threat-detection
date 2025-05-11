
import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface AlertItemProps {
  id: string;
  title: string;
  description: string;
  camera: string;
  timestamp: string;
  severity: AlertSeverity;
  isAcknowledged?: boolean;
}

export const AlertItem = ({
  id,
  title,
  description,
  camera,
  timestamp,
  severity,
  isAcknowledged = false,
}: AlertItemProps) => {
  const [acknowledged, setAcknowledged] = useState(isAcknowledged);

  const handleAcknowledge = (e: React.MouseEvent) => {
    e.preventDefault();
    setAcknowledged(true);
  };

  const severityColors: Record<AlertSeverity, string> = {
    low: "text-alert-low bg-alert-low/10",
    medium: "text-alert-medium bg-alert-medium/10",
    high: "text-alert-high bg-alert-high/10",
    critical: "text-alert-critical bg-alert-critical/10",
  };

  const severityBorder: Record<AlertSeverity, string> = {
    low: "border-l-alert-low",
    medium: "border-l-alert-medium",
    high: "border-l-alert-high",
    critical: "border-l-alert-critical",
  };

  return (
    <div 
      className={cn(
        "p-4 mb-3 security-glass rounded-md border-l-4 transition-all hover:bg-slate-800/50",
        severityBorder[severity],
        !acknowledged && severity === "critical" && "animate-alert-blink",
      )}
    >
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <AlertCircle className={cn("h-4 w-4", severityColors[severity])} />
            <h3 className="font-medium">{title}</h3>
            <span className={cn("px-2 py-0.5 text-xs rounded-full", severityColors[severity])}>
              {severity.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{camera}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {!acknowledged ? (
            <Button size="sm" variant="outline" onClick={handleAcknowledge}>
              Acknowledge
            </Button>
          ) : (
            <div className="flex items-center text-green-500 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Acknowledged
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="default">View Video</Button>
            <Button size="sm" variant="secondary">Escalate</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
