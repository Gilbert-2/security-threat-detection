
import { ScrollArea } from "./ui/scroll-area";
import { AlertItem, AlertItemProps } from "./AlertItem";
import { recentAlerts } from "@/data/mockData";
import { useState } from "react";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";

interface EventFeedProps {
  onAlertSelect: (alert: AlertItemProps) => void;
  selectedAlertId?: string;
}

export const EventFeed = ({ onAlertSelect, selectedAlertId }: EventFeedProps) => {
  const [filter, setFilter] = useState<"all" | AlertItemProps["severity"]>("all");
  
  const filteredAlerts = filter === "all" 
    ? recentAlerts
    : recentAlerts.filter(alert => alert.severity === filter);

  return (
    <div className="h-full security-glass rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Real-time Event Feed</h2>
        <div className="flex gap-2 items-center">
          <div className="flex text-xs">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              size="sm" 
              onClick={() => setFilter("all")}
              className="h-7 rounded-r-none"
            >
              All
            </Button>
            <Button 
              variant={filter === "critical" ? "default" : "outline"}
              size="sm" 
              onClick={() => setFilter("critical")}
              className="h-7 rounded-none border-l-0 bg-alert-critical/10 text-alert-critical hover:text-alert-critical"
            >
              Critical
            </Button>
            <Button 
              variant={filter === "high" ? "default" : "outline"}
              size="sm" 
              onClick={() => setFilter("high")}
              className="h-7 rounded-none border-l-0 bg-alert-high/10 text-alert-high hover:text-alert-high"
            >
              High
            </Button>
            <Button 
              variant={filter === "medium" ? "default" : "outline"}
              size="sm" 
              onClick={() => setFilter("medium")}
              className="h-7 rounded-none border-l-0 bg-alert-medium/10 text-alert-medium hover:text-alert-medium"
            >
              Medium
            </Button>
            <Button 
              variant={filter === "low" ? "default" : "outline"}
              size="sm" 
              onClick={() => setFilter("low")}
              className="h-7 rounded-l-none border-l-0 bg-alert-low/10 text-alert-low hover:text-alert-low"
            >
              Low
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-2.5rem)] pr-4">
        {filteredAlerts.map((alert) => (
          <AlertItem 
            key={alert.id} 
            {...alert} 
            onClick={() => onAlertSelect(alert)}
            isSelected={alert.id === selectedAlertId}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
