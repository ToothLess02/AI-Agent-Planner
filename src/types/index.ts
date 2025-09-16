// Core type definitions for the AI Agent Orchestrator System
export interface Goal {
  id: string;
  description: string;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  tasks: Task[];
  results?: Record<string, any>;
}

export interface Task {
  id: string;
  goalId: string;
  type: TaskType;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  tool: string;
  function: string;
  params: Record<string, any>;
  result?: any;
  error?: string;
  executionTime?: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'busy';
  currentTask?: string;
  tasksCompleted: number;
  lastActivity: Date;
}

export interface APIIntegration {
  name: string;
  baseUrl: string;
  authRequired: boolean;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  status: 'active' | 'inactive' | 'error';
}

export type TaskType = 
  | 'github_analysis'
  | 'crypto_price'
  | 'data_processing'
  | 'api_call'
  | 'computation';

export interface SystemMetrics {
  totalGoals: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  activeAgents: number;
  averageExecutionTime: number;
  systemUptime: number;
}

export interface PlannerResult {
  success: boolean;
  tasks: Task[];
  estimatedDuration: number;
  requiredTools: string[];
}