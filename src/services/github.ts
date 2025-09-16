// GitHub API Service - Handles all GitHub-related operations
export class GitHubService {
  private apiUrl = 'https://api.github.com';

  /**
   * Analyze a GitHub repository comprehensively
   */
  async analyzeRepository(owner: string, repo: string): Promise<any> {
    try {
      console.log(`🔍 Analyzing repository: ${owner}/${repo}`);
      
      // Simulate API delay for realistic behavior
      await this.delay(1000 + Math.random() * 2000);

      // Get repository information
      const repoInfo = await this.getRepositoryInfo(owner, repo);
      const stats = await this.getRepositoryStats(owner, repo);
      const recentCommits = await this.getRecentCommits(owner, repo, 30);

      return {
        repository: `${owner}/${repo}`,
        info: repoInfo,
        stats: stats,
        recentActivity: recentCommits,
        analysisDate: new Date().toISOString(),
        summary: this.generateRepositorySummary(repoInfo, stats, recentCommits)
      };
    } catch (error) {
      throw new Error(`Failed to analyze repository: ${error}`);
    }
  }

  /**
   * Get basic repository information
   */
  async getRepositoryInfo(owner: string, repo: string): Promise<any> {
    // Mock repository data - in production, this would be a real API call
    return {
      name: repo,
      owner: owner,
      description: `${repo} - A comprehensive software project`,
      language: this.getRandomLanguage(),
      stars: Math.floor(Math.random() * 50000),
      forks: Math.floor(Math.random() * 10000),
      watchers: Math.floor(Math.random() * 5000),
      openIssues: Math.floor(Math.random() * 100),
      createdAt: this.getRandomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
      updatedAt: this.getRandomDate(new Date(2023, 6, 1), new Date()),
      size: Math.floor(Math.random() * 100000),
      license: this.getRandomLicense()
    };
  }

  /**
   * Get repository statistics
   */
  async getRepositoryStats(owner: string, repo: string): Promise<any> {
    await this.delay(800);

    return {
      contributors: Math.floor(Math.random() * 500) + 1,
      totalCommits: Math.floor(Math.random() * 5000) + 100,
      branches: Math.floor(Math.random() * 20) + 1,
      releases: Math.floor(Math.random() * 50),
      pullRequests: {
        open: Math.floor(Math.random() * 50),
        closed: Math.floor(Math.random() * 500)
      },
      issues: {
        open: Math.floor(Math.random() * 100),
        closed: Math.floor(Math.random() * 1000)
      },
      codeFrequency: this.generateCodeFrequency(),
      activity: this.generateActivityData()
    };
  }

  /**
   * Get recent commits
   */
  async getRecentCommits(owner: string, repo: string, days: number = 7): Promise<any> {
    await this.delay(600);

    const commits = [];
    const commitsCount = Math.floor(Math.random() * 50) + 5;

    for (let i = 0; i < commitsCount; i++) {
      commits.push({
        sha: this.generateSHA(),
        author: this.getRandomAuthor(),
        message: this.getRandomCommitMessage(),
        date: this.getRandomDate(
          new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          new Date()
        ),
        additions: Math.floor(Math.random() * 100),
        deletions: Math.floor(Math.random() * 50),
        changedFiles: Math.floor(Math.random() * 10) + 1
      });
    }

    return {
      totalCommits: commits.length,
      commits: commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      period: `${days} days`,
      analysis: {
        averageCommitsPerDay: Math.round(commits.length / days * 10) / 10,
        totalAdditions: commits.reduce((sum, c) => sum + c.additions, 0),
        totalDeletions: commits.reduce((sum, c) => sum + c.deletions, 0),
        activeContributors: new Set(commits.map(c => c.author.login)).size
      }
    };
  }

  /**
   * Generate a repository summary
   */
  private generateRepositorySummary(repoInfo: any, stats: any, commits: any): string {
    const activityLevel = commits.totalCommits > 20 ? 'High' : 
                         commits.totalCommits > 10 ? 'Medium' : 'Low';
    
    const popularityLevel = repoInfo.stars > 10000 ? 'Very Popular' :
                           repoInfo.stars > 1000 ? 'Popular' :
                           repoInfo.stars > 100 ? 'Growing' : 'New';

    return `${repoInfo.name} is a ${popularityLevel.toLowerCase()} ${repoInfo.language} project with ${activityLevel.toLowerCase()} activity. ` +
           `It has ${repoInfo.stars} stars, ${stats.contributors} contributors, and ${commits.analysis.activeContributors} active contributors in the recent period.`;
  }

  // Helper methods for generating mock data
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomLanguage(): string {
    const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'C#'];
    return languages[Math.floor(Math.random() * languages.length)];
  }

  private getRandomLicense(): string {
    const licenses = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC'];
    return licenses[Math.floor(Math.random() * licenses.length)];
  }

  private getRandomDate(start: Date, end: Date): string {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
  }

  private getRandomAuthor(): any {
    const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown'];
    const logins = ['alice_j', 'bobsmith', 'carol_dev', 'davidw', 'eva_codes'];
    const index = Math.floor(Math.random() * names.length);
    
    return {
      name: names[index],
      login: logins[index],
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64`
    };
  }

  private getRandomCommitMessage(): string {
    const messages = [
      'Fix bug in authentication system',
      'Add new feature for user management',
      'Update dependencies to latest versions',
      'Improve performance of data processing',
      'Add unit tests for core functionality',
      'Refactor code structure for better maintainability',
      'Update documentation with latest changes',
      'Fix security vulnerability in API',
      'Add support for new data format',
      'Optimize database queries for better performance'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private generateSHA(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private generateCodeFrequency(): any[] {
    const weeks = [];
    for (let i = 0; i < 12; i++) {
      weeks.push({
        week: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        additions: Math.floor(Math.random() * 500),
        deletions: Math.floor(Math.random() * 200)
      });
    }
    return weeks.reverse();
  }

  private generateActivityData(): any {
    const activity = {};
    for (let i = 0; i < 7; i++) {
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
      activity[day] = Math.floor(Math.random() * 20);
    }
    return activity;
  }
}