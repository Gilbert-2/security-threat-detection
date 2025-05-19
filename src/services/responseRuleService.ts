
import api from "./api";

// Types
export interface ResponseRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ResponseRuleStats {
  total: number;
  active: number;
  inactive: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  requiresApproval: number;
  activePercentage: number;
}

export const responseRuleService = {
  // Get all response rules
  getResponseRules: async (): Promise<ResponseRule[]> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/response-rules', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response rules');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching response rules:", error);
      throw error;
    }
  },

  // Get response rule by ID
  getResponseRuleById: async (id: string): Promise<ResponseRule> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/response-rules/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response rule');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching response rule ${id}:`, error);
      throw error;
    }
  },

  // Create response rule
  createResponseRule: async (rule: Omit<ResponseRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResponseRule> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/response-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(rule)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create response rule');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating response rule:", error);
      throw error;
    }
  },

  // Update response rule
  updateResponseRule: async (id: string, rule: Partial<ResponseRule>): Promise<ResponseRule> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/response-rules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(rule)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update response rule');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating response rule ${id}:`, error);
      throw error;
    }
  },

  // Delete response rule
  deleteResponseRule: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/response-rules/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete response rule');
      }
    } catch (error) {
      console.error(`Error deleting response rule ${id}:`, error);
      throw error;
    }
  },

  // Activate response rule
  activateRule: async (id: string): Promise<ResponseRule> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/response-rules/${id}/activate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to activate response rule');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error activating response rule ${id}:`, error);
      throw error;
    }
  },

  // Deactivate response rule
  deactivateRule: async (id: string): Promise<ResponseRule> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:7070/response-rules/${id}/deactivate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to deactivate response rule');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deactivating response rule ${id}:`, error);
      throw error;
    }
  },
  
  // Get response statistics
  getResponseStats: async (): Promise<ResponseRuleStats> => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:7070/response-rules/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching response stats:", error);
      // Return mock stats as fallback
      return {
        total: 0,
        active: 0,
        inactive: 0,
        bySeverity: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        },
        requiresApproval: 0,
        activePercentage: 0
      };
    }
  }
};
