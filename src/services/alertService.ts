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

  // Create a new alert (POST to backend)
  createAlert: async (alertPayload: any): Promise<any> => {
    // Use the actual backend endpoint with authentication
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    try {
      return await api.post("https://security-threat-backend.onrender.com/alerts", alertPayload, headers);
    } catch (error) {
      // Fallback: Store incident locally
      const localIncident = {
        id: `local-${Date.now()}`,
        ...alertPayload,
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLocal: true // Flag to identify locally stored incidents
      };
      
      // Store in localStorage
      const existingIncidents = JSON.parse(localStorage.getItem('localIncidents') || '[]');
      existingIncidents.push(localIncident);
      localStorage.setItem('localIncidents', JSON.stringify(existingIncidents));
      
      return {
        data: localIncident,
        status: 200,
        message: "Incident stored locally (backend unavailable)"
      };
    }
  },

  // Test backend connectivity
  testBackend: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await api.get("https://security-threat-backend.onrender.com/alerts", headers);
      console.log("Backend test successful:", response);
      return response;
    } catch (error) {
      console.error("Backend test failed:", error);
      throw error;
    }
  }
};
