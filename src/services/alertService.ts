import api from "./api";
import { alertSummary } from "@/data/mockData";

export interface Alert {
  id: string;
  title: string;
  description: string;
  camera: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
  isAcknowledged: boolean;
}

export interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: Record<string, number>;
}

export const alertService = {
  // Get all alerts
  getAlerts: async (): Promise<Alert[]> => {
    // This will be replaced with actual API call
    // const response = await api.get<Alert[]>("/alerts");
    // return response.data;
    
    // Using mock data for now
    return Promise.resolve(
      // Mock alerts imported from another file would go here
      []
    );
  },

  // Get alert by ID
  getAlertById: async (id: string): Promise<Alert> => {
    // const response = await api.get<Alert>(`/alerts/${id}`);
    // return response.data;
    
    return Promise.resolve({
      id,
      title: "Mock Alert",
      description: "This is a mock alert",
      camera: "Main Entrance Camera",
      timestamp: new Date().toISOString(),
      severity: "medium" as const,
      isAcknowledged: false
    });
  },

  // Get alert summary statistics
  getAlertSummary: async (): Promise<AlertSummary> => {
    // const response = await api.get<AlertSummary>("/alerts/summary");
    // return response.data;
    
    return Promise.resolve(alertSummary);
  },

  // Acknowledge an alert
  acknowledgeAlert: async (id: string): Promise<void> => {
    // await api.put(`/alerts/${id}/acknowledge`, {});
    return Promise.resolve();
  },

  // Create a new alert (for testing)
  createAlert: async (alert: Omit<Alert, "id" | "timestamp">): Promise<Alert> => {
    // const response = await api.post<Alert>("/alerts", alert);
    // return response.data;
    
    return Promise.resolve({
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }
};
