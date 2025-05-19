import api from "./api";

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

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  PASSWORD_CHANGE = 'password_change',
  ALERT_VIEW = 'alert_view',
  ALERT_ACKNOWLEDGE = 'alert_acknowledge',
  ALERT_RESOLVE = 'alert_resolve',
  SYSTEM_ACCESS = 'system_access',
  DATA_ACCESS = 'data_access',
  SETTINGS_CHANGE = 'settings_change'
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface LogUserActivityPayload {
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export const userService = {
  // Get all users (admin only)
  getUsers: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('Current user:', currentUser); // Debug log

      // Check if user is admin
      if (currentUser.role !== 'admin') {
        console.warn('Non-admin user attempted to access users list');
        return [];
      }

      const response = await fetch('http://localhost:7070/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('User does not have permission to access users list');
          return [];
        }
        throw new Error('Failed to fetch users');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      return []; // Return empty array instead of throwing to prevent UI breakage
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

  // Get user activities (admin only)
  getUserActivities: async (limit: number = 10): Promise<UserActivity[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/user-activity?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Only administrators can view all user activities');
        }
        throw new Error('Failed to fetch user activities');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching user activities:", error);
      throw error;
    }
  },
  
  // Get specific user's activity
  getUserSpecificActivity: async (userId: string): Promise<UserActivity[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Check if user is trying to access their own activities or is an admin
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        console.warn('User attempted to access activities of another user');
        return []; // Return empty array instead of throwing error
      }

      const response = await fetch(`http://localhost:7070/user-activity/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No activities found for user ${userId}`);
          return [];
        }
        throw new Error(`Failed to fetch activities: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching activities for user ${userId}:`, error);
      return []; // Return empty array instead of throwing to prevent UI breakage
    }
  },
  
  // Get activity summary (admin only)
  getActivitySummary: async (): Promise<Record<string, any>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/user-activity/summary', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Only administrators can view activity summary');
        }
        throw new Error('Failed to fetch activity summary');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching activity summary:", error);
      throw error;
    }
  },
  
  // Get activity type statistics (admin only)
  getActivityTypeStats: async (): Promise<Record<ActivityType, number>> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/user-activity/types', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Only administrators can view activity type statistics');
        }
        throw new Error('Failed to fetch activity type statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching activity type statistics:", error);
      throw error;
    }
  },

  // Log user activity (for client-side actions)
  logUserActivity: async (activity: LogUserActivityPayload): Promise<UserActivity> => {
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to log user activity');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error logging user activity:", error);
      throw error;
    }
  }
};