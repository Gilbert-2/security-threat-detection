
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

export const analyticsService = {
  // Get analytics for a date range
  getAnalytics: async (startDate?: string, endDate?: string): Promise<AnalyticsData[]> => {
    // const params = new URLSearchParams();
    // if (startDate) params.append('startDate', startDate);
    // if (endDate) params.append('endDate', endDate);
    // const response = await api.get<AnalyticsData[]>(`/analytics?${params}`);
    // return response.data;
    
    return Promise.resolve(mockAnalyticsData);
  },

  // Get analytics summary
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    // const response = await api.get<AnalyticsSummary>("/analytics/summary");
    // return response.data;
    
    const totalAlerts = mockAnalyticsData.reduce((sum, day) => sum + day.alertsCount, 0);
    const totalResponses = mockAnalyticsData.reduce((sum, day) => sum + day.responsesTriggered, 0);
    const averageResponseTime = mockAnalyticsData.reduce((sum, day) => sum + day.averageResponseTime, 0) / mockAnalyticsData.length;
    
    return Promise.resolve({
      totalAlerts,
      totalResponses,
      averageResponseTime,
      trendByDay: mockAnalyticsData
    });
  },

  // Get analytics for specific metrics
  getMetricsData: async (metric: string): Promise<any> => {
    // const response = await api.get<any>(`/analytics/metrics/${metric}`);
    // return response.data;
    
    console.log(`Getting data for metric: ${metric}`);
    
    // Return appropriate mock data based on the metric
    switch (metric) {
      case "alerts":
        return Promise.resolve({
          data: mockAnalyticsData.map(day => ({ date: day.date, value: day.alertsCount }))
        });
      case "responses":
        return Promise.resolve({
          data: mockAnalyticsData.map(day => ({ date: day.date, value: day.responsesTriggered }))
        });
      case "responseTime":
        return Promise.resolve({
          data: mockAnalyticsData.map(day => ({ date: day.date, value: day.averageResponseTime }))
        });
      default:
        return Promise.resolve({ data: [] });
    }
  }
};
