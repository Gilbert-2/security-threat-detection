
import api from "./api";
import { userActivities } from "@/data/mockData";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  lastLogin?: string;
  status: "active" | "inactive" | "locked";
}

export interface UserActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
  alertId?: string;
}

// Mock user data - this would come from the backend
const mockUsers: User[] = [
  { 
    id: "user-1", 
    username: "admin", 
    fullName: "Admin User", 
    email: "admin@securitysystem.com", 
    role: "Administrator", 
    lastLogin: new Date().toISOString(),
    status: "active"
  },
  { 
    id: "user-2", 
    username: "operator", 
    fullName: "Security Operator", 
    email: "operator@securitysystem.com", 
    role: "Operator", 
    lastLogin: new Date().toISOString(),
    status: "active"
  },
  { 
    id: "user-3", 
    username: "viewer", 
    fullName: "Security Viewer", 
    email: "viewer@securitysystem.com", 
    role: "Viewer", 
    lastLogin: new Date().toISOString(),
    status: "active"
  }
];

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    // const response = await api.get<User[]>("/users");
    // return response.data;
    
    return Promise.resolve(mockUsers);
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | undefined> => {
    // const response = await api.get<User>(`/users/${id}`);
    // return response.data;
    
    return Promise.resolve(mockUsers.find(user => user.id === id));
  },

  // Get current logged in user
  getCurrentUser: async (): Promise<User> => {
    // const response = await api.get<User>("/users/me");
    // return response.data;
    
    // For now return the admin user
    return Promise.resolve(mockUsers[0]);
  },

  // Get user activities
  getUserActivities: async (limit: number = 10): Promise<UserActivity[]> => {
    // const response = await api.get<UserActivity[]>(`/user-activities?limit=${limit}`);
    // return response.data;
    
    return Promise.resolve(userActivities.slice(0, limit));
  },

  // Log user activity (for client-side actions)
  logUserActivity: async (activity: Omit<UserActivity, "id" | "timestamp">): Promise<UserActivity> => {
    // const response = await api.post<UserActivity>("/user-activities", activity);
    // return response.data;
    
    console.log("User activity logged:", activity);
    return Promise.resolve({
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }
};
