export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  type: 'security' | 'system' | 'hardware' | 'user';
  details: string;
  userId: string;
}

const API_URL = "https://security-threat-backend.onrender.com";

export const notificationService = {
  // Check if current user is admin
  isCurrentUserAdmin: (): boolean => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      return currentUser.role === 'admin';
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  },

  // Get notifications based on user role
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get current user to determine role
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = currentUser.role === 'admin';

      // Use different endpoints based on user role
      let endpoint;
      if (isAdmin) {
        endpoint = `${API_URL}/notifications`; // Admin gets all notifications
      } else {
        if (!currentUser.id) {
          console.error('User ID not found, cannot fetch user-specific notifications');
          return [];
        }
        endpoint = `${API_URL}/notifications/user/${currentUser.id}`; // User gets their own notifications
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('Notifications endpoint not found, returning empty array');
          return [];
        }
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<number> => {
    try {
      const notifications = await notificationService.getNotifications();
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error("Error calculating unread count:", error);
      return 0;
    }
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Send notification to specific user (admin only)
  sendNotificationToUser: async (userId: string, notification: { title: string; description: string; type: string; details?: string }): Promise<Notification> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/users/${userId}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(notification)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  // Send bulk notifications (admin only)
  sendBulkNotifications: async (userIds: string[], notification: { title: string; description: string; type: string; details?: string }, sendToAll: boolean = false): Promise<{ count: number; message: string }> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const payload = {
        notification,
        ...(sendToAll ? { all: true } : { userIds })
      };

      const response = await fetch(`${API_URL}/users/notifications/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send bulk notifications');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error sending bulk notifications:", error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (id: string, userId?: string): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get current user info to check permissions
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = currentUser.role === 'admin';

      // For non-admin users, ensure they can only delete their own notifications
      if (!isAdmin && userId && currentUser.id !== userId) {
        throw new Error('You can only delete your own notifications');
      }

      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // If notification doesn't exist (404), consider deletion successful
      if (response.status === 404) {
        return;
      }

      // Handle permission errors
      if (response.status === 403) {
        throw new Error('You do not have permission to delete this notification');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      // If the error is about the notification not being found, consider it a success
      if (error instanceof Error && error.message.includes('not found')) {
        return;
      }
      throw error;
    }
  }
};
