
import { AlertItemProps } from "@/components/AlertItem";

export const recentAlerts: AlertItemProps[] = [
  {
    id: "alert-001",
    title: "Unauthorized Access Detected",
    description: "Individual entered restricted area without proper authorization",
    camera: "Main Entrance Camera",
    timestamp: "May 11, 2025 14:32:18",
    severity: "critical",
    isAcknowledged: false,
    responseActions: ["Alarm Triggered", "Security Team Notified", "Recording Initiated"],
    confidence: 89,
    imageUrl: "/security-alert-1.jpg",
  },
  {
    id: "alert-002",
    title: "Suspicious Package",
    description: "Unattended package detected in lobby area for over 10 minutes",
    camera: "Lobby Camera 2",
    timestamp: "May 11, 2025 14:20:45",
    severity: "high",
    isAcknowledged: false,
    responseActions: ["Recording Tagged", "Supervisor Notified"],
    confidence: 76,
    imageUrl: "/security-alert-2.jpg",
  },
  {
    id: "alert-003",
    title: "Intrusion Attempt",
    description: "Multiple failed entry attempts detected at emergency exit",
    camera: "Emergency Exit B",
    timestamp: "May 11, 2025 14:15:10",
    severity: "high",
    isAcknowledged: true,
    responseActions: ["Alarm Triggered", "Access Control System Locked"],
    confidence: 92,
    imageUrl: "/security-alert-3.jpg",
  },
  {
    id: "alert-004",
    title: "Abnormal Movement Pattern",
    description: "Loitering detected in secure area for extended period",
    camera: "Hallway Camera 4",
    timestamp: "May 11, 2025 13:53:22",
    severity: "medium",
    isAcknowledged: false,
    responseActions: ["Security Personnel Alerted"],
    confidence: 68,
    imageUrl: "/security-alert-4.jpg",
  },
  {
    id: "alert-005",
    title: "Camera Connection Issue",
    description: "Lost connection to parking garage camera",
    camera: "Parking Level 2 Camera",
    timestamp: "May 11, 2025 13:42:09",
    severity: "medium",
    isAcknowledged: true,
    responseActions: ["IT Team Notified", "System Diagnostic Initiated"],
    confidence: 100,
    imageUrl: null,
  },
  {
    id: "alert-006",
    title: "Motion After Hours",
    description: "Movement detected in office area after business hours",
    camera: "Office Area Camera 3",
    timestamp: "May 11, 2025 13:30:57",
    severity: "low",
    isAcknowledged: false,
    responseActions: ["Event Recorded", "Added to Morning Report"],
    confidence: 71,
    imageUrl: "/security-alert-6.jpg",
  },
];

export const responseRules = [
  {
    id: "rule-001",
    name: "Unauthorized Access Response",
    description: "Triggers alarm and notifies security team when unauthorized access is detected",
    status: "active",
    triggerCount: 12,
  },
  {
    id: "rule-002",
    name: "Suspicious Object Detection",
    description: "Tags recording and notifies supervisor when unattended objects are detected",
    status: "active",
    triggerCount: 5,
  },
  {
    id: "rule-003",
    name: "After-Hours Movement",
    description: "Records events and adds to morning report when movement is detected after business hours",
    status: "active",
    triggerCount: 8,
  },
];

export const userActivities = [
  {
    id: "activity-001",
    user: "Security Admin",
    action: "Acknowledged Alert",
    alertId: "alert-003",
    timestamp: "May 11, 2025 14:18:45",
  },
  {
    id: "activity-002",
    user: "System",
    action: "Escalated Alert",
    alertId: "alert-001",
    timestamp: "May 11, 2025 14:35:12",
  },
  {
    id: "activity-003",
    user: "Security Operator",
    action: "Marked as False Alarm",
    alertId: "alert-005",
    timestamp: "May 11, 2025 13:46:30",
  },
  {
    id: "activity-004",
    user: "Security Admin",
    action: "Added Response Rule",
    alertId: null,
    timestamp: "May 11, 2025 12:15:22",
  },
];

export const alertSummary = {
  total: 27,
  critical: 1,
  high: 2,
  medium: 2,
  low: 1,
  byType: {
    "Unauthorized Access": 8,
    "Suspicious Object": 5,
    "Intrusion Attempt": 6,
    "Abnormal Movement": 4,
    "System Issue": 2,
    "After-Hours Activity": 2,
  },
};

export const responseStats = {
  totalTriggered: 42,
  byType: {
    "Alarm Triggered": 15,
    "Security Team Notified": 18,
    "Recording Tagged": 22,
    "Access Control Action": 7,
    "IT Team Notified": 2,
    "Added to Report": 8,
  },
};
