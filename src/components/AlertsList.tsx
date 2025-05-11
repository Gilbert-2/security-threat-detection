
import { AlertItem, AlertItemProps } from "./AlertItem";
import { ScrollArea } from "./ui/scroll-area";

const recentAlerts: AlertItemProps[] = [
  {
    id: "alert-001",
    title: "Unauthorized Access Detected",
    description: "Individual entered restricted area without proper authorization",
    camera: "Main Entrance Camera",
    timestamp: "May 11, 2025 14:32:18",
    severity: "critical",
    isAcknowledged: false,
  },
  {
    id: "alert-002",
    title: "Suspicious Package",
    description: "Unattended package detected in lobby area for over 10 minutes",
    camera: "Lobby Camera 2",
    timestamp: "May 11, 2025 14:20:45",
    severity: "high",
    isAcknowledged: false,
  },
  {
    id: "alert-003",
    title: "Intrusion Attempt",
    description: "Multiple failed entry attempts detected at emergency exit",
    camera: "Emergency Exit B",
    timestamp: "May 11, 2025 14:15:10",
    severity: "high",
    isAcknowledged: true,
  },
  {
    id: "alert-004",
    title: "Abnormal Movement Pattern",
    description: "Loitering detected in secure area for extended period",
    camera: "Hallway Camera 4",
    timestamp: "May 11, 2025 13:53:22",
    severity: "medium",
    isAcknowledged: false,
  },
  {
    id: "alert-005",
    title: "Camera Connection Issue",
    description: "Lost connection to parking garage camera",
    camera: "Parking Level 2 Camera",
    timestamp: "May 11, 2025 13:42:09",
    severity: "medium",
    isAcknowledged: true,
  },
  {
    id: "alert-006",
    title: "Motion After Hours",
    description: "Movement detected in office area after business hours",
    camera: "Office Area Camera 3",
    timestamp: "May 11, 2025 13:30:57",
    severity: "low",
    isAcknowledged: false,
  },
];

export const AlertsList = () => {
  return (
    <div className="h-full security-glass rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Alerts</h2>
        <span className="text-xs text-muted-foreground">
          {recentAlerts.filter(alert => !alert.isAcknowledged).length} active alerts
        </span>
      </div>
      <ScrollArea className="h-[calc(100%-2rem)] pr-4">
        {recentAlerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))}
      </ScrollArea>
    </div>
  );
};
