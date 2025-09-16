// Data Processing Service - Handles data analysis and aggregation
export class DataService {
  
  /**
   * Process raw data and perform analysis
   */
  async processData(data: any): Promise<any> {
    console.log('📊 Processing data...');
    
    // Simulate processing time
    await this.delay(1500 + Math.random() * 1000);

    if (Array.isArray(data)) {
      return this.processArrayData(data);
    } else if (typeof data === 'object') {
      return this.processObjectData(data);
    } else {
      return this.processStringData(data.toString());
    }
  }

  /**
   * Aggregate multiple results into a comprehensive report
   */
  async aggregateResults(results: any[]): Promise<any> {
    console.log('🔄 Aggregating results...');
    await this.delay(800);

    return {
      totalResults: results.length,
      aggregationDate: new Date().toISOString(),
      summary: this.generateSummary(results),
      breakdown: this.categorizeResults(results),
      insights: this.generateInsights(results),
      recommendations: this.generateRecommendations(results)
    };
  }

  /**
   * Generate a comprehensive report from data
   */
  async generateReport(data: any): Promise<any> {
    console.log('📝 Generating report...');
    await this.delay(1200);

    return {
      title: 'AI Agent Analysis Report',
      generatedAt: new Date().toISOString(),
      executive_summary: this.generateExecutiveSummary(data),
      key_findings: this.generateKeyFindings(data),
      detailed_analysis: this.performDetailedAnalysis(data),
      visualizations: this.generateVisualizationData(data),
      conclusions: this.generateConclusions(data),
      next_steps: this.generateNextSteps(data)
    };
  }

  // Private helper methods
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private processArrayData(data: any[]): any {
    return {
      type: 'array_analysis',
      length: data.length,
      sample: data.slice(0, 3),
      statistics: {
        numerical: this.analyzeNumerical(data.filter(item => typeof item === 'number')),
        categorical: this.analyzeCategorical(data.filter(item => typeof item === 'string')),
        objects: data.filter(item => typeof item === 'object').length
      },
      patterns: this.detectPatterns(data)
    };
  }

  private processObjectData(data: any): any {
    const keys = Object.keys(data);
    return {
      type: 'object_analysis',
      structure: {
        keys: keys,
        keyCount: keys.length,
        valueTypes: keys.reduce((acc, key) => {
          acc[key] = typeof data[key];
          return acc;
        }, {} as Record<string, string>)
      },
      content_analysis: this.analyzeObjectContent(data),
      complexity_score: this.calculateComplexityScore(data)
    };
  }

  private processStringData(data: string): any {
    return {
      type: 'text_analysis',
      length: data.length,
      wordCount: data.split(/\s+/).length,
      sentiment: this.analyzeSentiment(data),
      keywords: this.extractKeywords(data),
      readability: this.calculateReadabilityScore(data)
    };
  }

  private analyzeNumerical(numbers: number[]): any {
    if (numbers.length === 0) return null;

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    return {
      count: numbers.length,
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      mean: Math.round(mean * 100) / 100,
      median,
      sum
    };
  }

  private analyzeCategorical(strings: string[]): any {
    if (strings.length === 0) return null;

    const frequency = strings.reduce((acc, str) => {
      acc[str] = (acc[str] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      count: strings.length,
      unique: Object.keys(frequency).length,
      mostCommon: Object.entries(frequency).sort(([,a], [,b]) => b - a)[0],
      distribution: frequency
    };
  }

  private detectPatterns(data: any[]): string[] {
    const patterns = [];
    
    if (data.every(item => typeof item === typeof data[0])) {
      patterns.push('Uniform type pattern');
    }
    
    if (data.length > 0 && Array.isArray(data[0])) {
      patterns.push('Nested array structure');
    }
    
    if (data.some(item => item && typeof item === 'object' && 'id' in item)) {
      patterns.push('ID-based entities');
    }

    return patterns;
  }

  private analyzeObjectContent(obj: any): any {
    return {
      hasNumericFields: Object.values(obj).some(val => typeof val === 'number'),
      hasDateFields: Object.values(obj).some(val => 
        typeof val === 'string' && !isNaN(Date.parse(val))
      ),
      hasNestedObjects: Object.values(obj).some(val => 
        val && typeof val === 'object' && !Array.isArray(val)
      ),
      hasArrayFields: Object.values(obj).some(val => Array.isArray(val))
    };
  }

  private calculateComplexityScore(obj: any): number {
    let score = Object.keys(obj).length;
    
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) score += 2;
      else if (value && typeof value === 'object') score += 3;
    }
    
    return score;
  }

  private analyzeSentiment(text: string): string {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'poor', 'disappointing'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractKeywords(text: string): string[] {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.split(/\s+/).length;
    const syllables = this.countSyllables(text);
    
    // Simple readability score based on average sentence length and syllable complexity
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    return Math.round(206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord));
  }

  private countSyllables(text: string): number {
    return text.toLowerCase().match(/[aeiou]+/g)?.length || 1;
  }

  private generateSummary(results: any[]): string {
    const typeCount = results.reduce((acc, result) => {
      const type = typeof result;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return `Analysis complete. Processed ${results.length} results containing ${Object.entries(typeCount).map(([type, count]) => `${count} ${type}`).join(', ')} data.`;
  }

  private categorizeResults(results: any[]): any {
    return {
      byType: results.reduce((acc, result) => {
        const type = typeof result;
        if (!acc[type]) acc[type] = [];
        acc[type].push(result);
        return acc;
      }, {} as Record<string, any[]>),
      successful: results.filter(r => !r.error && r !== null && r !== undefined).length,
      failed: results.filter(r => r.error || r === null || r === undefined).length
    };
  }

  private generateInsights(results: any[]): string[] {
    const insights = [];
    
    if (results.length > 10) {
      insights.push('Large dataset detected - suitable for statistical analysis');
    }
    
    if (results.some(r => r && r.error)) {
      insights.push('Error patterns detected - may require data cleaning');
    }
    
    if (results.every(r => typeof r === 'object')) {
      insights.push('Structured data format - optimal for further processing');
    }

    return insights;
  }

  private generateRecommendations(results: any[]): string[] {
    const recommendations = [];
    
    if (results.length > 100) {
      recommendations.push('Consider implementing data pagination for better performance');
    }
    
    if (results.some(r => r && r.error)) {
      recommendations.push('Implement error handling and data validation');
    }
    
    recommendations.push('Regular data quality assessments recommended');
    recommendations.push('Consider caching frequently accessed results');

    return recommendations;
  }

  private generateExecutiveSummary(data: any): string {
    return `This report presents a comprehensive analysis of the processed data. Key metrics and patterns have been identified, providing valuable insights for decision-making. The analysis reveals important trends and opportunities for optimization.`;
  }

  private generateKeyFindings(data: any): string[] {
    return [
      'Data processing completed successfully with high accuracy',
      'Identified key patterns and anomalies in the dataset',
      'Performance metrics exceed baseline expectations',
      'Opportunities for process optimization identified'
    ];
  }

  private performDetailedAnalysis(data: any): any {
    return {
      data_quality: 'High',
      completeness: '95%',
      accuracy: '98%',
      consistency: 'Good',
      timeliness: 'Current',
      relevance: 'High'
    };
  }

  private generateVisualizationData(data: any): any {
    return {
      charts_recommended: ['bar', 'line', 'pie'],
      data_points: Math.floor(Math.random() * 100) + 50,
      trends: ['upward', 'stable', 'seasonal'],
      correlations: Math.round(Math.random() * 100) / 100
    };
  }

  private generateConclusions(data: any): string[] {
    return [
      'Analysis objectives successfully achieved',
      'Data provides strong foundation for decision-making',
      'Recommended actions are supported by evidence',
      'Continued monitoring will ensure sustained results'
    ];
  }

  private generateNextSteps(data: any): string[] {
    return [
      'Implement recommended optimizations',
      'Schedule regular data quality reviews',
      'Establish automated monitoring systems',
      'Plan for scaled data processing capabilities'
    ];
  }
}