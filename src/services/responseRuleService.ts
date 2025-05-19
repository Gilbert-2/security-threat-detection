
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
  lastTriggered?: string;
  conditions?: any[]; // Added for backward compatibility
  actions?: any[]; // Added for backward compatibility
  // We don't need to add status here as it's a UI-only property
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
      
      // Convert from the UI model to the API model if needed
      const apiRule = {
        name: rule.name,
        description: rule.description,
        condition: rule.condition || (rule.conditions && JSON.stringify(rule.conditions)) || '',
        action: rule.action || (rule.actions && JSON.stringify(rule.actions)) || '',
        severity: rule.severity,
        active: rule.active,
        requiresApproval: rule.requiresApproval,
        createdBy: rule.createdBy || localStorage.getItem('userId') || 'admin'
      };
      
      const response = await fetch('http://localhost:7070/response-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(apiRule)
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
  updateResponseRule: async (id: string, rule: Partial<ResponseRule> & { status?: string }): Promise<ResponseRule> => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Convert from the UI model to the API model if needed
      const apiRule: Partial<ResponseRule> = {
        ...rule
      };
      
      // Handle special conversions
      if (rule.conditions && !rule.condition) {
        apiRule.condition = JSON.stringify(rule.conditions);
        delete apiRule.conditions;
      }
      
      if (rule.actions && !rule.action) {
        apiRule.action = JSON.stringify(rule.actions);
        delete apiRule.actions;
      }
      
      // Handle status to active conversion
      if (rule.status !== undefined) {
        apiRule.active = rule.status === 'Active';
        delete (apiRule as any).status; // Use type assertion to safely delete the status property
      }
      
      const response = await fetch(`http://localhost:7070/response-rules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(apiRule)
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
