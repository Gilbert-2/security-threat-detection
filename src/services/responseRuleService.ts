
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

// Enhanced mock data with conditions and actions
const enhancedResponseRules: ResponseRule[] = [
  {
    id: "rule-001",
    name: "Unauthorized Access Response",
    description: "Triggers alarm and notifies security team when unauthorized access is detected",
    conditions: [
      { type: "motion", value: "restricted-area" },
      { type: "time", value: "after-hours" }
    ],
    actions: [
      { type: "alarm", target: "security-system" },
      { type: "notify", target: "security-team" }
    ],
    status: "Active",
    triggerCount: 12,
    lastTriggered: "2025-05-17T14:32:18Z"
  },
  {
    id: "rule-002",
    name: "Suspicious Object Detection",
    description: "Tags recording and notifies supervisor when unattended objects are detected",
    conditions: [
      { type: "object", value: "unattended-package" },
      { type: "duration", value: "10-minutes" }
    ],
    actions: [
      { type: "tag", target: "recording" },
      { type: "notify", target: "supervisor" }
    ],
    status: "Active",
    triggerCount: 5,
    lastTriggered: "2025-05-17T10:15:42Z"
  },
  {
    id: "rule-003",
    name: "After-Hours Movement",
    description: "Records events and adds to morning report when movement is detected after business hours",
    conditions: [
      { type: "motion", value: "office-area" },
      { type: "time", value: "after-hours" }
    ],
    actions: [
      { type: "record", target: "event" },
      { type: "report", target: "morning-report" }
    ],
    status: "Active",
    triggerCount: 8,
    lastTriggered: "2025-05-16T23:47:09Z"
  },
];

// Enhanced response stats
const enhancedResponseStats: ResponseStat = {
  totalTriggered: 42,
  rulesTriggered: 3,
  lastTriggeredTime: "2025-05-17T14:32:18Z"
};

export const responseRuleService = {
  // Get all response rules
  getResponseRules: async (): Promise<ResponseRule[]> => {
    // const response = await api.get<ResponseRule[]>("/response-rules");
    // return response.data;
    
    return Promise.resolve(enhancedResponseRules);
  },

  // Get response rule by ID
  getResponseRuleById: async (id: string): Promise<ResponseRule | undefined> => {
    // const response = await api.get<ResponseRule>(`/response-rules/${id}`);
    // return response.data;
    
    return Promise.resolve(enhancedResponseRules.find(rule => rule.id === id));
  },

  // Get response rule statistics
  getResponseStats: async (): Promise<ResponseStat> => {
    // const response = await api.get<ResponseStat>("/response-rules/stats");
    // return response.data;
    
    return Promise.resolve(enhancedResponseStats);
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
    const existingRule = enhancedResponseRules.find(r => r.id === id);
    
    if (!existingRule) {
      // Create a default rule structure if no existing rule is found
      return Promise.resolve({
        id, 
        name: rule.name || "Unknown Rule",
        description: rule.description || "",
        conditions: rule.conditions || [{ type: "default", value: "default" }],
        actions: rule.actions || [{ type: "default", target: "default" }],
        status: rule.status || "Inactive",
        triggerCount: rule.triggerCount || 0,
        lastTriggered: rule.lastTriggered
      });
    }
    
    // Return the updated rule
    return Promise.resolve({
      ...existingRule,
      ...rule
    });
  },

  // Toggle rule status (active/inactive)
  toggleRuleStatus: async (id: string): Promise<ResponseRule> => {
    // const response = await api.put<ResponseRule>(`/response-rules/${id}/toggle`, {});
    // return response.data;
    
    console.log(`Response rule ${id} status toggled`);
    const existingRule = enhancedResponseRules.find(r => r.id === id);
    
    if (!existingRule) {
      throw new Error("Rule not found");
    }
    
    return Promise.resolve({
      ...existingRule,
      status: existingRule.status === "Active" ? "Inactive" : "Active"
    });
  }
};
