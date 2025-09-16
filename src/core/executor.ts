// Task Executor - Handles individual task execution with API integrations
import { Task } from '../types';
import { GitHubService } from '../services/github';
import { TradingService } from '../services/trading';
import { DataService } from '../services/data';

export class TaskExecutor {
  private githubService: GitHubService;
  private tradingService: TradingService;
  private dataService: DataService;

  constructor() {
    this.githubService = new GitHubService();
    this.tradingService = new TradingService();
    this.dataService = new DataService();
  }

  /**
   * Execute a task based on its type and function
   */
  async executeTask(task: Task): Promise<any> {
    console.log(`⚡ Executing ${task.type} task: ${task.function}`);

    try {
      switch (task.tool) {
        case 'github_tools':
          return await this.executeGitHubTask(task);
        
        case 'trading_tools':
          return await this.executeTradingTask(task);
        
        case 'data_tools':
          return await this.executeDataTask(task);
        
        case 'api_tools':
          return await this.executeAPITask(task);
        
        default:
          throw new Error(`Unknown tool: ${task.tool}`);
      }
    } catch (error) {
      console.error(`Task execution failed for ${task.id}:`, error);
      throw error;
    }
  }

  /**
   * Execute GitHub-related tasks
   */
  private async executeGitHubTask(task: Task): Promise<any> {
    switch (task.function) {
      case 'analyzeRepository':
        return await this.githubService.analyzeRepository(
          task.params.owner,
          task.params.repo
        );
      
      case 'getRecentCommits':
        return await this.githubService.getRecentCommits(
          task.params.owner,
          task.params.repo,
          task.params.days || 7
        );
      
      case 'getRepositoryStats':
        return await this.githubService.getRepositoryStats(
          task.params.owner,
          task.params.repo
        );
      
      default:
        throw new Error(`Unknown GitHub function: ${task.function}`);
    }
  }

  /**
   * Execute trading-related tasks
   */
  private async executeTradingTask(task: Task): Promise<any> {
    switch (task.function) {
      case 'getCryptoPrice':
        return await this.tradingService.getCryptoPrice(task.params.symbol);
      
      case 'getCryptoPriceHistory':
        return await this.tradingService.getCryptoPriceHistory(
          task.params.symbol,
          task.params.days || 7
        );
      
      case 'getMarketData':
        return await this.tradingService.getMarketData(task.params.symbols);
      
      default:
        throw new Error(`Unknown trading function: ${task.function}`);
    }
  }

  /**
   * Execute data processing tasks
   */
  private async executeDataTask(task: Task): Promise<any> {
    switch (task.function) {
      case 'processData':
        return await this.dataService.processData(task.params.data);
      
      case 'aggregateResults':
        return await this.dataService.aggregateResults(task.params.results);
      
      case 'generateReport':
        return await this.dataService.generateReport(task.params.data);
      
      default:
        throw new Error(`Unknown data function: ${task.function}`);
    }
  }

  /**
   * Execute general API tasks
   */
  private async executeAPITask(task: Task): Promise<any> {
    switch (task.function) {
      case 'makeRequest':
        return await this.makeHTTPRequest(
          task.params.url,
          task.params.method || 'GET',
          task.params.headers,
          task.params.body
        );
      
      default:
        throw new Error(`Unknown API function: ${task.function}`);
    }
  }

  /**
   * Make a generic HTTP request
   */
  private async makeHTTPRequest(
    url: string,
    method: string = 'GET',
    headers?: Record<string, string>,
    body?: any
  ): Promise<any> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`HTTP request failed: ${error}`);
    }
  }
}