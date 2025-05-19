
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
  // Get all notifications for current user
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
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
  }
};
