import api from "./api";

export interface AnalyticsData {
  date: string;
  alertsCount: number;
  responsesTriggered: number;
  averageResponseTime: number;
}

export interface AnalyticsSummary {
  totalAlerts: number;
  totalResponses: number;
  averageResponseTime: number;
  trendByDay: AnalyticsData[];
}

// Mock analytics data (would come from backend)
const generateMockAnalytics = (): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      alertsCount: Math.floor(Math.random() * 30) + 10,
      responsesTriggered: Math.floor(Math.random() * 20) + 5,
      averageResponseTime: Math.floor(Math.random() * 120) + 30
    });
  }
  
  return data;
};

const mockAnalyticsData = generateMockAnalytics();

const API_URL = "https://security-threat-backend.onrender.com";

export const analyticsService = {
  // Get analytics for a date range or all analytics if no dates are provided
  getAnalytics: async (startDate?: string, endDate?: string): Promise<AnalyticsData[]> => {
    try {
      let url = `${API_URL}/analytics`;
      const params = new URLSearchParams();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = currentUser.role === 'admin';
      if (!isAdmin && currentUser.id) {
        params.append('userId', currentUser.id);
      }
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (params.toString()) {
        url += `?${params}`;
      }
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      if (!response.ok) throw new Error('Failed to fetch analytics data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Get analytics summary
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    try {
      let url = `${API_URL}/analytics/summary`;
      const params = new URLSearchParams();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = currentUser.role === 'admin';
      if (!isAdmin && currentUser.id) {
        params.append('userId', currentUser.id);
      }
      if (params.toString()) {
        url += `?${params}`;
      }
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      if (!response.ok) throw new Error('Failed to fetch analytics summary');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  },

  // Get analytics for specific metrics
  getMetricsData: async (metric: string): Promise<any> => {
    try {
      let url = `${API_URL}/analytics/metrics/${metric}`;
      const params = new URLSearchParams();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = currentUser.role === 'admin';
      if (!isAdmin && currentUser.id) {
        params.append('userId', currentUser.id);
      }
      if (params.toString()) {
        url += `?${params}`;
      }
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      if (!response.ok) throw new Error('Failed to fetch metrics data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics data:', error);
      throw error;
    }
  },
};
