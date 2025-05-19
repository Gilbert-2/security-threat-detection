
import api from "./api";
import { userActivities } from "@/data/mockData";

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  picture?: string;
  token?: string;
  phoneNumber?: string;
}

export interface UserActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
  alertId?: string;
  ipAddress?: string;
  userAgent?: string;
  type?: string;
}

export const userService = {
  // Get all users (admin only)
  getUsers: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | undefined> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  // Get current logged in user
  getCurrentUser: async (): Promise<User> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Get user activities
  getUserActivities: async (limit: number = 10): Promise<UserActivity[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/user-activity?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching user activities:", error);
      return userActivities.slice(0, limit); // Fallback to mock data
    }
  },
  
  // Get user-specific activity
  getUserSpecificActivity: async (userId: string): Promise<UserActivity[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/user-activity/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user specific activities');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching activities for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get activity summary
  getActivitySummary: async (): Promise<Record<string, any>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/user-activity/summary', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity summary');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching activity summary:", error);
      throw error;
    }
  },
  
  // Get activity type statistics
  getActivityTypeStats: async (): Promise<Record<string, number>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/user-activity/types', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity type statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching activity type statistics:", error);
      throw error;
    }
  },

  // Log user activity (for client-side actions)
  logUserActivity: async (activity: Omit<UserActivity, "id" | "timestamp">): Promise<UserActivity> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/user-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(activity)
      });
      
      if (!response.ok) {
        throw new Error('Failed to log user activity');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error logging user activity:", error);
      
      // Fallback to mock response
      return {
        ...activity,
        id: `activity-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    }
  }
};
