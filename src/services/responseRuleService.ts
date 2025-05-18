
import api from "./api";
import { responseRules, responseStats } from "@/data/mockData";

export interface ResponseRule {
  id: string;
  name: string;
  description: string;
  conditions: Array<{
    type: string;
    value: string;
  }>;
  actions: Array<{
    type: string;
    target: string;
  }>;
  status: "Active" | "Inactive";
  triggerCount: number;
  lastTriggered?: string;
}

export interface ResponseStat {
  totalTriggered: number;
  rulesTriggered: number;
  lastTriggeredTime?: string;
}

export const responseRuleService = {
  // Get all response rules
  getResponseRules: async (): Promise<ResponseRule[]> => {
    // const response = await api.get<ResponseRule[]>("/response-rules");
    // return response.data;
    
    return Promise.resolve(responseRules);
  },

  // Get response rule by ID
  getResponseRuleById: async (id: string): Promise<ResponseRule | undefined> => {
    // const response = await api.get<ResponseRule>(`/response-rules/${id}`);
    // return response.data;
    
    return Promise.resolve(responseRules.find(rule => rule.id === id));
  },

  // Get response rule statistics
  getResponseStats: async (): Promise<ResponseStat> => {
    // const response = await api.get<ResponseStat>("/response-rules/stats");
    // return response.data;
    
    return Promise.resolve(responseStats);
  },

  // Create a new response rule
  createResponseRule: async (rule: Omit<ResponseRule, "id" | "triggerCount" | "lastTriggered">): Promise<ResponseRule> => {
    // const response = await api.post<ResponseRule>("/response-rules", rule);
    // return response.data;
    
    return Promise.resolve({
      ...rule,
      id: `rule-${Date.now()}`,
      triggerCount: 0
    });
  },

  // Update a response rule
  updateResponseRule: async (id: string, rule: Partial<ResponseRule>): Promise<ResponseRule> => {
    // const response = await api.put<ResponseRule>(`/response-rules/${id}`, rule);
    // return response.data;
    
    console.log(`Response rule ${id} updated`);
    const existingRule = responseRules.find(r => r.id === id);
    
    return Promise.resolve({
      ...(existingRule || { 
        id, 
        name: "Unknown Rule",
        description: "",
        conditions: [],
        actions: [],
        status: "Inactive",
        triggerCount: 0
      }),
      ...rule
    });
  },

  // Toggle rule status (active/inactive)
  toggleRuleStatus: async (id: string): Promise<ResponseRule> => {
    // const response = await api.put<ResponseRule>(`/response-rules/${id}/toggle`, {});
    // return response.data;
    
    console.log(`Response rule ${id} status toggled`);
    const existingRule = responseRules.find(r => r.id === id);
    
    if (!existingRule) {
      throw new Error("Rule not found");
    }
    
    return Promise.resolve({
      ...existingRule,
      status: existingRule.status === "Active" ? "Inactive" : "Active"
    });
  }
};
