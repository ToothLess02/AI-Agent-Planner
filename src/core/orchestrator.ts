// AI Agent Orchestrator - Core execution and task management system
import { Goal, Task, Agent, SystemMetrics } from '../types';
import { AgentPlanner } from './planner';
import { TaskExecutor } from './executor';
import { generateId } from '../utils/helpers';

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private planner: AgentPlanner;
  private executor: TaskExecutor;
  private agents: Map<string, Agent> = new Map();
  private goals: Map<string, Goal> = new Map();
  private taskQueue: Task[] = [];
  private isRunning: boolean = false;
  private listeners: Set<(data: any) => void> = new Set();

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  constructor() {
    this.planner = AgentPlanner.getInstance();
    this.executor = new TaskExecutor();
    this.initializeAgents();
  }

  /**
   * Initialize virtual agents for task processing
   */
  private initializeAgents(): void {
    const agentConfigs = [
      { name: 'GitHub Agent', id: 'github-agent' },
      { name: 'Trading Agent', id: 'trading-agent' },
      { name: 'Data Agent', id: 'data-agent' },
      { name: 'API Agent', id: 'api-agent' }
    ];

    agentConfigs.forEach(config => {
      this.agents.set(config.id, {
        id: config.id,
        name: config.name,
        status: 'idle',
        tasksCompleted: 0,
        lastActivity: new Date()
      });
    });
  }

  /**
   * Main orchestration method - creates and executes goals
   */
  async executeGoal(description: string): Promise<string> {
    console.log('🎯 Starting goal execution:', description);

    // Create the goal
    const goalId = generateId();
    const goal: Goal = {
      id: goalId,
      description,
      status: 'planning',
      createdAt: new Date(),
      tasks: [],
      results: {}
    };

    this.goals.set(goalId, goal);
    this.notifyListeners({ type: 'goal-created', goal });

    // Plan the goal
    const planResult = await this.planner.planGoal(description);
    
    if (!planResult.success) {
      goal.status = 'failed';
      this.goals.set(goalId, goal);
      this.notifyListeners({ type: 'goal-failed', goal });
      return goalId;
    }

    // Update goal with planned tasks
    goal.tasks = planResult.tasks.map(task => ({
      ...task,
      goalId
    }));
    goal.status = 'executing';
    this.goals.set(goalId, goal);

    // Add tasks to queue
    goal.tasks.forEach(task => {
      this.taskQueue.push(task);
    });

    this.notifyListeners({ type: 'goal-planned', goal, estimatedDuration: planResult.estimatedDuration });

    // Start processing if not already running
    if (!this.isRunning) {
      this.startProcessing();
    }

    return goalId;
  }

  /**
   * Start the main processing loop
   */
  private async startProcessing(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Orchestrator processing started');

    while (this.isRunning && (this.taskQueue.length > 0 || this.hasActiveTasks())) {
      await this.processTaskQueue();
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to prevent busy waiting
    }

    console.log('⏸️ Orchestrator processing paused');
    this.isRunning = false;
  }

  /**
   * Process tasks in the queue
   */
  private async processTaskQueue(): Promise<void> {
    const availableAgents = Array.from(this.agents.values()).filter(agent => agent.status === 'idle');
    
    while (this.taskQueue.length > 0 && availableAgents.length > 0) {
      const task = this.taskQueue.shift()!;
      const agent = availableAgents.shift()!;

      // Assign task to agent
      agent.status = 'busy';
      agent.currentTask = task.id;
      agent.lastActivity = new Date();
      this.agents.set(agent.id, agent);

      // Update task status
      task.status = 'executing';
      task.startedAt = new Date();
      this.updateTaskInGoal(task);

      this.notifyListeners({ type: 'task-started', task, agent });

      // Execute task asynchronously
      this.executeTask(task, agent).catch(error => {
        console.error('Task execution error:', error);
      });
    }
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: Task, agent: Agent): Promise<void> {
    try {
      console.log(`🔄 Executing task ${task.id} with ${agent.name}`);

      const result = await this.executor.executeTask(task);
      
      // Update task with result
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      task.executionTime = task.completedAt.getTime() - (task.startedAt?.getTime() || 0);

      // Update agent
      agent.status = 'idle';
      agent.currentTask = undefined;
      agent.tasksCompleted++;
      agent.lastActivity = new Date();
      this.agents.set(agent.id, agent);

      // Update goal
      this.updateTaskInGoal(task);
      this.checkGoalCompletion(task.goalId);

      this.notifyListeners({ type: 'task-completed', task, agent });

    } catch (error) {
      console.error('Task execution failed:', error);

      // Update task with error
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completedAt = new Date();

      // Update agent
      agent.status = 'idle';
      agent.currentTask = undefined;
      agent.lastActivity = new Date();
      this.agents.set(agent.id, agent);

      // Update goal
      this.updateTaskInGoal(task);
      this.checkGoalCompletion(task.goalId);

      this.notifyListeners({ type: 'task-failed', task, agent, error });
    }
  }

  /**
   * Update task in its parent goal
   */
  private updateTaskInGoal(task: Task): void {
    const goal = this.goals.get(task.goalId);
    if (goal) {
      const taskIndex = goal.tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        goal.tasks[taskIndex] = task;
        this.goals.set(goal.id, goal);
      }
    }
  }

  /**
   * Check if a goal is complete
   */
  private checkGoalCompletion(goalId: string): void {
    const goal = this.goals.get(goalId);
    if (!goal) return;

    const allTasksComplete = goal.tasks.every(task => 
      task.status === 'completed' || task.status === 'failed'
    );

    if (allTasksComplete) {
      const hasFailedTasks = goal.tasks.some(task => task.status === 'failed');
      
      goal.status = hasFailedTasks ? 'failed' : 'completed';
      goal.completedAt = new Date();

      // Aggregate results
      goal.results = goal.tasks.reduce((acc, task) => {
        if (task.result) {
          acc[task.id] = task.result;
        }
        return acc;
      }, {} as Record<string, any>);

      this.goals.set(goalId, goal);
      this.notifyListeners({ type: 'goal-completed', goal });
    }
  }

  /**
   * Check if there are any active tasks
   */
  private hasActiveTasks(): boolean {
    return Array.from(this.goals.values()).some(goal => 
      goal.status === 'executing' && 
      goal.tasks.some(task => task.status === 'executing')
    );
  }

  /**
   * Get current system metrics
   */
  getSystemMetrics(): SystemMetrics {
    const allTasks = Array.from(this.goals.values()).flatMap(goal => goal.tasks);
    const completedTasks = allTasks.filter(task => task.status === 'completed');
    const failedTasks = allTasks.filter(task => task.status === 'failed');
    const activeAgents = Array.from(this.agents.values()).filter(agent => agent.status === 'busy').length;

    const executionTimes = completedTasks
      .map(task => task.executionTime)
      .filter((time): time is number => time !== undefined);

    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length 
      : 0;

    return {
      totalGoals: this.goals.size,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      activeAgents,
      averageExecutionTime: Math.round(averageExecutionTime),
      systemUptime: Date.now() - (this.constructor as any).startTime || 0
    };
  }

  /**
   * Get all goals
   */
  getGoals(): Goal[] {
    return Array.from(this.goals.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Get all agents
   */
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get a specific goal by ID
   */
  getGoal(goalId: string): Goal | undefined {
    return this.goals.get(goalId);
  }

  /**
   * Subscribe to orchestrator events
   */
  subscribe(listener: (data: any) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of events
   */
  private notifyListeners(data: any): void {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Stop the orchestrator
   */
  stop(): void {
    this.isRunning = false;
    console.log('🛑 Orchestrator stopped');
  }
}

// Set start time for uptime calculation
(AgentOrchestrator as any).startTime = Date.now();