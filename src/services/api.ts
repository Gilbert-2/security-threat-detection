
/**
 * Core API client for security monitoring system
 * This will be connected to the actual backend once implemented
 */

// Mock data for development - will be replaced with actual API calls
import { alertSummary, responseRules, responseStats, userActivities } from "@/data/mockData";

// Constants for API endpoints (to be updated with actual endpoints)
const API_BASE_URL = "/api";

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic error handler for API calls
const handleApiError = (error: any): never => {
  console.error("API Error:", error);
  throw new Error(error.message || "An unknown error occurred");
};

// Simple fetch wrapper for API calls
const fetchApi = async <T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    // This will be replaced with actual API call implementation
    console.log(`API Call to ${API_BASE_URL}${endpoint}`);
    
    // For now return mock data based on the endpoint
    // In production, this would be:
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    // const data = await response.json();
    // return { data, status: response.status, message: "Success" };
    
    return {
      data: {} as T,
      status: 200,
      message: "Success (Mock)"
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint),
  post: <T>(endpoint: string, data: any) => fetchApi<T>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),
  put: <T>(endpoint: string, data: any) => fetchApi<T>(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, {
    method: "DELETE"
  })
};

export default api;
