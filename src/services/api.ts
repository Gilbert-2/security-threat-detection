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
const handleApiError = async (error: any): Promise<never> => {
  // Try to get the actual error response from the backend
  if (error.response) {
    try {
      const errorData = await error.response.text();
      throw new Error(`HTTP ${error.response.status}: ${errorData}`);
    } catch (parseError) {
      throw new Error(`HTTP ${error.response.status}: ${error.message || "Unknown error"}`);
    }
  }
  
  throw new Error(error.message || "An unknown error occurred");
};

// Simple fetch wrapper for API calls
const fetchApi = async <T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    // Make actual HTTP request
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      // Create an error object with the response for better error handling
      const error = new Error(`HTTP error! status: ${response.status}`);
      (error as any).response = response;
      throw error;
    }
    
    const data = await response.json();
    
    return {
      data,
      status: response.status,
      message: "Success"
    };
  } catch (error) {
    throw await handleApiError(error);
  }
};

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) => fetchApi<T>(endpoint, { headers }),
  post: <T>(endpoint: string, data: any, headers?: Record<string, string>) => fetchApi<T>(endpoint, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(data)
  }),
  put: <T>(endpoint: string, data: any, headers?: Record<string, string>) => fetchApi<T>(endpoint, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(data)
  }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) => fetchApi<T>(endpoint, {
    method: "DELETE",
    headers
  })
};

export default api;
