// AI Agent Planner - Core planning and task decomposition logic
import { Goal, Task, PlannerResult, TaskType } from '../types';
import { generateId } from '../utils/helpers';

export class AgentPlanner {
  private static instance: AgentPlanner;
  
  static getInstance(): AgentPlanner {
    if (!AgentPlanner.instance) {
      AgentPlanner.instance = new AgentPlanner();
    }
    return AgentPlanner.instance;
  }

  /**
   * Main planning method - decomposes high-level goals into executable tasks
   */
  async planGoal(goalDescription: string): Promise<PlannerResult> {
    console.log('🧠 Planning goal:', goalDescription);
    
    try {
      const tasks = await this.analyzeAndDecompose(goalDescription);
      const estimatedDuration = this.estimateExecutionTime(tasks);
      const requiredTools = this.extractRequiredTools(tasks);

      return {
        success: true,
        tasks,
        estimatedDuration,
        requiredTools
      };
    } catch (error) {
      console.error('❌ Planning failed:', error);
      return {
        success: false,
        tasks: [],
        estimatedDuration: 0,
        requiredTools: []
      };
    }
  }

  /**
   * Advanced goal analysis using pattern recognition and NLP-like parsing
   */
  private async analyzeAndDecompose(goal: string): Promise<Task[]> {
    const tasks: Task[] = [];
    const lowercaseGoal = goal.toLowerCase();

    // GitHub repository analysis patterns
    if (this.containsGitHubPattern(lowercaseGoal)) {
      const repoInfo = this.extractRepositoryInfo(goal);
      if (repoInfo) {
        tasks.push(this.createGitHubTask(repoInfo));
      }
    }

    // Cryptocurrency price patterns
    if (this.containsCryptoPattern(lowercaseGoal)) {
      const cryptoSymbols = this.extractCryptoSymbols(goal);
      cryptoSymbols.forEach(symbol => {
        tasks.push(this.createCryptoTask(symbol));
      });
    }

    // Data processing patterns
    if (this.containsDataProcessingPattern(lowercaseGoal)) {
      tasks.push(this.createDataProcessingTask(goal));
    }

    // API integration patterns
    if (this.containsAPIPattern(lowercaseGoal)) {
      const apiInfo = this.extractAPIInfo(goal);
      if (apiInfo) {
        tasks.push(this.createAPITask(apiInfo));
      }
    }

    return tasks;
  }

  private containsGitHubPattern(goal: string): boolean {
    return /\b(github|repo|repository|commit|pull request|issue)\b/.test(goal);
  }

  private containsCryptoPattern(goal: string): boolean {
    return /\b(price|crypto|bitcoin|eth|btc|trading|exchange)\b/.test(goal);
  }

  private containsDataProcessingPattern(goal: string): boolean {
    return /\b(analyze|process|aggregate|compute|calculate)\b/.test(goal);
  }

  private containsAPIPattern(goal: string): boolean {
    return /\b(api|endpoint|request|fetch|call)\b/.test(goal);
  }

  private extractRepositoryInfo(goal: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\s]+)/,
      /'([^'\/]+)\/([^'\/]+)'/,
      /"([^"\/]+)\/([^"\/]+)"/,
      /\b([a-zA-Z0-9-]+)\/([a-zA-Z0-9-_.]+)\b/
    ];

    for (const pattern of patterns) {
      const match = goal.match(pattern);
      if (match && match[1] && match[2]) {
        return { owner: match[1], repo: match[2] };
      }
    }
    return null;
  }

  private extractCryptoSymbols(goal: string): string[] {
    const symbols: string[] = [];
    const patterns = [
      /\b(BTC|ETH|ADA|DOT|LINK|UNI|AAVE|COMP)-USD\b/gi,
      /\b(bitcoin|ethereum|cardano|polkadot)\b/gi
    ];

    patterns.forEach(pattern => {
      const matches = goal.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const symbol = this.normalizeSymbol(match);
          if (symbol && !symbols.includes(symbol)) {
            symbols.push(symbol);
          }
        });
      }
    });

    return symbols.length ? symbols : ['BTC-USD']; // Default fallback
  }

  private normalizeSymbol(symbol: string): string {
    const symbolMap: Record<string, string> = {
      'bitcoin': 'BTC-USD',
      'ethereum': 'ETH-USD',
      'cardano': 'ADA-USD',
      'polkadot': 'DOT-USD'
    };
    
    return symbolMap[symbol.toLowerCase()] || symbol.toUpperCase();
  }

  private extractAPIInfo(goal: string): { endpoint: string; method: string } | null {
    // Simplified API extraction logic
    if (goal.includes('GET') || goal.includes('POST')) {
      return {
        endpoint: '/api/data',
        method: goal.includes('POST') ? 'POST' : 'GET'
      };
    }
    return null;
  }

  private createGitHubTask(repoInfo: { owner: string; repo: string }): Task {
    return {
      id: generateId(),
      goalId: '',
      type: 'github_analysis',
      status: 'pending',
      tool: 'github_tools',
      function: 'analyzeRepository',
      params: repoInfo,
      createdAt: new Date()
    };
  }

  private createCryptoTask(symbol: string): Task {
    return {
      id: generateId(),
      goalId: '',
      type: 'crypto_price',
      status: 'pending',
      tool: 'trading_tools',
      function: 'getCryptoPrice',
      params: { symbol },
      createdAt: new Date()
    };
  }

  private createDataProcessingTask(goal: string): Task {
    return {
      id: generateId(),
      goalId: '',
      type: 'data_processing',
      status: 'pending',
      tool: 'data_tools',
      function: 'processData',
      params: { description: goal },
      createdAt: new Date()
    };
  }

  private createAPITask(apiInfo: { endpoint: string; method: string }): Task {
    return {
      id: generateId(),
      goalId: '',
      type: 'api_call',
      status: 'pending',
      tool: 'api_tools',
      function: 'makeRequest',
      params: apiInfo,
      createdAt: new Date()
    };
  }

  private estimateExecutionTime(tasks: Task[]): number {
    const baseTime = 2000; // 2 seconds base time
    const taskTimeMap: Record<TaskType, number> = {
      'github_analysis': 5000,
      'crypto_price': 3000,
      'data_processing': 4000,
      'api_call': 2500,
      'computation': 3500
    };

    return tasks.reduce((total, task) => {
      return total + (taskTimeMap[task.type] || baseTime);
    }, 0);
  }

  private extractRequiredTools(tasks: Task[]): string[] {
    const tools = new Set(tasks.map(task => task.tool));
    return Array.from(tools);
  }
}