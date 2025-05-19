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

export const notificationService = {
  // Get notifications based on user role
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://localhost:7070/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Notifications endpoint not found, returning empty array');
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
      const response = await fetch(`http://localhost:7070/notifications/${id}/read`, {
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
      const response = await fetch('http://localhost:7070/notifications/read-all', {
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
      const response = await fetch(`http://localhost:7070/users/${userId}/notifications`, {
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
  sendBulkNotifications: async (userIds: string[], notification: { title: string; description: string; type: string; details?: string }): Promise<{ count: number }> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/users/notifications/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userIds,
          notification
        })
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
  deleteNotification: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // First verify if the notification exists
      const verifyResponse = await fetch(`http://localhost:7070/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!verifyResponse.ok) {
        if (verifyResponse.status === 404) {
          // If notification doesn't exist, consider it already deleted
          console.warn(`Notification ${id} not found, considering it already deleted`);
          return;
        }
        throw new Error(`Failed to verify notification: ${verifyResponse.statusText}`);
      }

      // If notification exists, proceed with deletion
      const response = await fetch(`http://localhost:7070/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // If notification doesn't exist during deletion, consider it already deleted
          console.warn(`Notification ${id} not found during deletion, considering it already deleted`);
          return;
        }
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
