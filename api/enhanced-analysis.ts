// Enhanced Analysis System - Critic Agent, Evidence Mode, Advanced Confidence
import type { 
  CriticAnalysis, 
  QualityIssue, 
  EvidenceAnalysis, 
  EvidenceSource, 
  EnhancedConfidence, 
  ConfidenceFactors,
  RetryStrategy,
  FallbackConfig,
  ErrorContext,
  DynamicPromptResult
} from '../src/types';

// Critic Agent - Quality Control System
export class CriticAgent {
  private language: string;

  constructor(language: string = 'en') {
    this.language = language;
  }

  async analyzeQuality(result: any): Promise<CriticAnalysis> {
    const issues: QualityIssue[] = [];
    let completenessScore = 100;
    let consistencyScore = 100;

    // Check for missing critical fields
    const requiredFields = [
      'idea', 'demandScore', 'scoreJustification', 'platformAnalyses'
    ];

    for (const field of requiredFields) {
      if (!result[field]) {
        issues.push({
          type: 'missing_field',
          field,
          severity: 'high',
          description: `Critical field '${field}' is missing`,
          suggestion: `Add ${field} to the analysis result`
        });
        completenessScore -= 20;
      }
    }

    // Check platform analyses completeness
    if (result.platformAnalyses) {
      const platforms = Object.keys(result.platformAnalyses);
      for (const platform of platforms) {
        const analysis = result.platformAnalyses[platform];
        if (!analysis.summary || analysis.summary.length < 10) {
          issues.push({
            type: 'low_quality',
            field: `platformAnalyses.${platform}.summary`,
            severity: 'medium',
            description: `Platform summary for ${platform} is too short or missing`,
            suggestion: 'Provide a more detailed platform analysis summary'
          });
          completenessScore -= 5;
        }

        if (!analysis.keyFindings || analysis.keyFindings.length < 3) {
          issues.push({
            type: 'missing_field',
            field: `platformAnalyses.${platform}.keyFindings`,
            severity: 'medium',
            description: `Key findings for ${platform} are incomplete`,
            suggestion: 'Provide at least 3 key findings for each platform'
          });
          completenessScore -= 5;
        }
      }
    }

    // Check for unrealistic numbers
    if (result.demandScore && (result.demandScore < 0 || result.demandScore > 100)) {
      issues.push({
        type: 'unrealistic_numbers',
        field: 'demandScore',
        severity: 'high',
        description: 'Demand score is outside valid range (0-100)',
        suggestion: 'Ensure demand score is between 0 and 100'
      });
      consistencyScore -= 30;
    }

    // Check for language consistency
    if (result.language) {
      const expectedLanguage = result.language.toLowerCase();
      const textFields = this.extractTextFields(result);
      
      for (const [field, text] of textFields) {
        if (this.detectLanguageMixing(text, expectedLanguage)) {
          issues.push({
            type: 'language_mixing',
            field,
            severity: 'medium',
            description: `Language mixing detected in ${field}`,
            suggestion: `Ensure all text in ${field} is in ${expectedLanguage}`
          });
          consistencyScore -= 10;
        }
      }
    }

    // Generate suggestions
    const suggestions = this.generateSuggestions(issues);

    const overallQuality = Math.round((completenessScore + consistencyScore) / 2);
    const needsRepair = issues.some(issue => issue.severity === 'high') || overallQuality < 70;

    return {
      overallQuality,
      issues,
      suggestions,
      completenessScore: Math.max(0, completenessScore),
      consistencyScore: Math.max(0, consistencyScore),
      needsRepair
    };
  }

  private extractTextFields(obj: any, prefix = ''): [string, string][] {
    const textFields: [string, string][] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 0) {
        textFields.push([fieldPath, value]);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string') {
            textFields.push([`${fieldPath}[${index}]`, item]);
          } else if (typeof item === 'object' && item !== null) {
            textFields.push(...this.extractTextFields(item, `${fieldPath}[${index}]`));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        textFields.push(...this.extractTextFields(value, fieldPath));
      }
    }
    
    return textFields;
  }

  private detectLanguageMixing(text: string, expectedLanguage: string): boolean {
    if (expectedLanguage.includes('turk')) {
      // Turkish text should contain Turkish characters or common Turkish words
      const hasTurkishChars = /[çğıöşüÇĞİÖŞÜ]/.test(text);
      const hasTurkishWords = /\b(bir|bu|şu|için|ile|olan|var|yok|çok|az|büyük|küçük|iyi|kötü|yeni|eski|ve|veya|ama|ancak|çünkü)\b/i.test(text);
      const hasEnglishWords = /\b(the|and|or|but|because|with|for|this|that|good|bad|new|old|big|small)\b/i.test(text);
      
      return hasEnglishWords && !(hasTurkishChars || hasTurkishWords);
    } else {
      // English text should not contain Turkish characters
      return /[çğıöşüÇĞİÖŞÜ]/.test(text);
    }
  }

  private generateSuggestions(issues: QualityIssue[]): string[] {
    const suggestions: string[] = [];
    
    const highSeverityIssues = issues.filter(issue => issue.severity === 'high');
    if (highSeverityIssues.length > 0) {
      suggestions.push('Address high-severity issues immediately to improve analysis quality');
    }

    const missingFields = issues.filter(issue => issue.type === 'missing_field');
    if (missingFields.length > 0) {
      suggestions.push('Complete all required fields for comprehensive analysis');
    }

    const languageIssues = issues.filter(issue => issue.type === 'language_mixing');
    if (languageIssues.length > 0) {
      suggestions.push('Ensure consistent language usage throughout the analysis');
    }

    if (suggestions.length === 0) {
      suggestions.push('Analysis quality is good - consider minor refinements for optimization');
    }

    return suggestions;
  }

  async repairAnalysis(result: any, issues: QualityIssue[]): Promise<any> {
    // Create repair prompts for specific issues
    const repairPrompts: string[] = [];
    
    for (const issue of issues) {
      if (issue.severity === 'high') {
        repairPrompts.push(`Fix ${issue.field}: ${issue.suggestion}`);
      }
    }

    if (repairPrompts.length === 0) {
      return result;
    }

    // This would typically call the AI model with repair instructions
    // For now, return the original result with a repair flag
    return {
      ...result,
      _repairAttempted: true,
      _repairInstructions: repairPrompts
    };
  }
}

// Evidence-Based Analysis System
export class EvidenceAnalyzer {
  private apiKeys: Record<string, string>;

  constructor(apiKeys: Record<string, string> = {}) {
    this.apiKeys = apiKeys;
  }

  async gatherEvidence(idea: string, sectors: string[]): Promise<EvidenceAnalysis> {
    const sources: EvidenceSource[] = [];
    
    try {
      // Simulate evidence gathering from various sources
      // In a real implementation, this would make actual API calls
      
      // Reddit evidence (simulated)
      if (this.shouldGatherFromPlatform('reddit', sectors)) {
        const redditEvidence = await this.gatherRedditEvidence(idea);
        sources.push(...redditEvidence);
      }

      // Product Hunt evidence (simulated)
      if (this.shouldGatherFromPlatform('producthunt', sectors)) {
        const phEvidence = await this.gatherProductHuntEvidence(idea);
        sources.push(...phEvidence);
      }

      // Crunchbase evidence (simulated)
      if (this.shouldGatherFromPlatform('crunchbase', sectors)) {
        const cbEvidence = await this.gatherCrunchbaseEvidence(idea);
        sources.push(...cbEvidence);
      }

      // GitHub evidence (simulated)
      if (this.shouldGatherFromPlatform('github', sectors)) {
        const ghEvidence = await this.gatherGithubEvidence(idea);
        sources.push(...ghEvidence);
      }

    } catch (error) {
      console.warn('Evidence gathering failed:', error);
    }

    return this.analyzeEvidence(sources);
  }

  private shouldGatherFromPlatform(platform: string, sectors: string[]): boolean {
    const platformSectorMap: Record<string, string[]> = {
      reddit: ['all'],
      producthunt: ['saas', 'mobile', 'design'],
      crunchbase: ['fintech', 'saas', 'marketplace'],
      github: ['saas', 'mobile', 'design']
    };

    const relevantSectors = platformSectorMap[platform] || [];
    return relevantSectors.includes('all') || sectors.some(sector => relevantSectors.includes(sector));
  }

  private async gatherRedditEvidence(idea: string): Promise<EvidenceSource[]> {
    // Simulated Reddit evidence gathering
    // In real implementation, would use Reddit API
    return [
      {
        platform: 'reddit',
        type: 'reddit_post',
        content: `Discussion about similar concept: "${idea.substring(0, 100)}..." shows moderate community interest`,
        relevanceScore: 75,
        credibilityScore: 80
      }
    ];
  }

  private async gatherProductHuntEvidence(idea: string): Promise<EvidenceSource[]> {
    // Simulated Product Hunt evidence gathering
    return [
      {
        platform: 'producthunt',
        type: 'product_hunt',
        content: `Similar products in this space have received 200-500 upvotes on average`,
        relevanceScore: 85,
        credibilityScore: 90
      }
    ];
  }

  private async gatherCrunchbaseEvidence(idea: string): Promise<EvidenceSource[]> {
    // Simulated Crunchbase evidence gathering
    return [
      {
        platform: 'crunchbase',
        type: 'crunchbase',
        content: `Market shows $2.5B in total funding for similar solutions over past 2 years`,
        relevanceScore: 70,
        credibilityScore: 95
      }
    ];
  }

  private async gatherGithubEvidence(idea: string): Promise<EvidenceSource[]> {
    // Simulated GitHub evidence gathering
    return [
      {
        platform: 'github',
        type: 'github',
        content: `Open source projects in this domain have 1000+ stars on average`,
        relevanceScore: 65,
        credibilityScore: 85
      }
    ];
  }

  private analyzeEvidence(sources: EvidenceSource[]): EvidenceAnalysis {
    if (sources.length === 0) {
      return {
        sources: [],
        evidenceQuality: 0,
        supportingEvidence: [],
        contradictingEvidence: [],
        confidenceBoost: 0
      };
    }

    const avgRelevance = sources.reduce((sum, s) => sum + s.relevanceScore, 0) / sources.length;
    const avgCredibility = sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length;
    const evidenceQuality = Math.round((avgRelevance + avgCredibility) / 2);

    const supportingEvidence = sources
      .filter(s => s.relevanceScore > 60)
      .map(s => s.content);

    const contradictingEvidence = sources
      .filter(s => s.relevanceScore < 40)
      .map(s => s.content);

    // Calculate confidence boost based on evidence quality and quantity
    let confidenceBoost = 0;
    if (evidenceQuality > 80 && sources.length >= 3) {
      confidenceBoost = 15;
    } else if (evidenceQuality > 60 && sources.length >= 2) {
      confidenceBoost = 10;
    } else if (evidenceQuality > 40) {
      confidenceBoost = 5;
    } else {
      confidenceBoost = -5;
    }

    return {
      sources,
      evidenceQuality,
      supportingEvidence,
      contradictingEvidence,
      confidenceBoost
    };
  }
}

// Enhanced Confidence Scoring System
export class ConfidenceCalculator {
  calculateEnhancedConfidence(
    result: any,
    sectors: string[],
    evidenceAnalysis?: EvidenceAnalysis,
    criticAnalysis?: CriticAnalysis
  ): EnhancedConfidence {
    const factors: ConfidenceFactors = {
      sectorCoverage: this.calculateSectorCoverage(sectors),
      analysisDepth: this.calculateAnalysisDepth(result),
      schemaCompleteness: criticAnalysis?.completenessScore || 80,
      evidenceQuality: evidenceAnalysis?.evidenceQuality || 50,
      consistencyScore: criticAnalysis?.consistencyScore || 80,
      modelReliability: this.calculateModelReliability(result)
    };

    const weights = {
      sectorCoverage: 0.15,
      analysisDepth: 0.20,
      schemaCompleteness: 0.20,
      evidenceQuality: 0.15,
      consistencyScore: 0.15,
      modelReliability: 0.15
    };

    const overall = Math.round(
      Object.entries(factors).reduce((sum, [key, value]) => {
        return sum + (value * weights[key as keyof typeof weights]);
      }, 0)
    );

    const breakdown = this.generateConfidenceBreakdown(factors);
    const recommendations = this.generateConfidenceRecommendations(factors);

    return {
      overall: Math.max(0, Math.min(100, overall)),
      factors,
      breakdown,
      recommendations
    };
  }

  private calculateSectorCoverage(sectors: string[]): number {
    // More sectors detected = higher confidence in sector-specific analysis
    const maxSectors = 3;
    return Math.min(100, (sectors.length / maxSectors) * 100);
  }

  private calculateAnalysisDepth(result: any): number {
    let depth = 0;
    const components = [
      'platformAnalyses',
      'marketIntelligence',
      'competitiveLandscape',
      'revenueModel',
      'targetAudience',
      'riskAssessment',
      'goToMarket',
      'developmentRoadmap',
      'productMarketFit'
    ];

    for (const component of components) {
      if (result[component]) {
        depth += 10;
        
        // Bonus for detailed components
        if (typeof result[component] === 'object' && Object.keys(result[component]).length > 3) {
          depth += 5;
        }
      }
    }

    return Math.min(100, depth);
  }

  private calculateModelReliability(result: any): number {
    let reliability = 80; // Base reliability

    // Check if fallback was used
    if (result.fallbackUsed) {
      reliability -= 20;
    }

    // Check model used
    if (result.model?.includes('2.0') || result.model?.includes('2.5')) {
      reliability += 10;
    }

    // Check for repair attempts
    if (result._repairAttempted) {
      reliability -= 10;
    }

    return Math.max(0, Math.min(100, reliability));
  }

  private generateConfidenceBreakdown(factors: ConfidenceFactors): string[] {
    const breakdown: string[] = [];

    if (factors.sectorCoverage >= 80) {
      breakdown.push('Strong sector identification and coverage');
    } else if (factors.sectorCoverage >= 60) {
      breakdown.push('Moderate sector coverage');
    } else {
      breakdown.push('Limited sector coverage - may affect analysis accuracy');
    }

    if (factors.analysisDepth >= 80) {
      breakdown.push('Comprehensive analysis across multiple dimensions');
    } else if (factors.analysisDepth >= 60) {
      breakdown.push('Good analysis depth with room for improvement');
    } else {
      breakdown.push('Basic analysis - consider more detailed evaluation');
    }

    if (factors.evidenceQuality >= 70) {
      breakdown.push('High-quality evidence supporting analysis');
    } else if (factors.evidenceQuality >= 50) {
      breakdown.push('Moderate evidence quality');
    } else {
      breakdown.push('Limited evidence - analysis based primarily on AI reasoning');
    }

    return breakdown;
  }

  private generateConfidenceRecommendations(factors: ConfidenceFactors): string[] {
    const recommendations: string[] = [];

    if (factors.schemaCompleteness < 80) {
      recommendations.push('Complete missing analysis components for higher confidence');
    }

    if (factors.evidenceQuality < 60) {
      recommendations.push('Gather more market evidence to validate assumptions');
    }

    if (factors.consistencyScore < 70) {
      recommendations.push('Review analysis for internal consistency');
    }

    if (factors.analysisDepth < 70) {
      recommendations.push('Consider deeper analysis in key areas');
    }

    if (recommendations.length === 0) {
      recommendations.push('Analysis confidence is high - results are reliable');
    }

    return recommendations;
  }
}

// Enhanced Error Management System
export class ErrorManager {
  private retryStrategy: RetryStrategy;
  private fallbackConfig: FallbackConfig;
  private errorHistory: ErrorContext[] = [];

  constructor(
    retryStrategy: RetryStrategy = {
      maxRetries: 3,
      backoffMultiplier: 2,
      initialDelay: 1000,
      maxDelay: 10000,
      retryableErrors: ['timeout', 'rate_limit', 'server_error', 'parse_error']
    },
    fallbackConfig: FallbackConfig = {
      models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'],
      qualityThreshold: 60,
      gracefulDegradation: true,
      fallbackPrompts: {
        minimal: 'Provide a basic analysis with core fields only',
        repair: 'Fix the following issues in the analysis'
      }
    }
  ) {
    this.retryStrategy = retryStrategy;
    this.fallbackConfig = fallbackConfig;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext>
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.retryStrategy.initialDelay;

    for (let attempt = 1; attempt <= this.retryStrategy.maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Log successful execution after retries
        if (attempt > 1) {
          console.log(`✅ Operation succeeded on attempt ${attempt}`);
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        const errorContext: ErrorContext = {
          attempt,
          model: context.model || 'unknown',
          error: lastError.message,
          timestamp: new Date().toISOString(),
          inputLength: context.inputLength || 0,
          promptVersion: context.promptVersion || 'unknown'
        };
        
        this.errorHistory.push(errorContext);
        
        console.warn(`❌ Attempt ${attempt} failed:`, lastError.message);
        
        // Check if error is retryable
        if (!this.isRetryableError(lastError) || attempt === this.retryStrategy.maxRetries) {
          break;
        }
        
        // Wait before retry
        await this.delay(delay);
        delay = Math.min(delay * this.retryStrategy.backoffMultiplier, this.retryStrategy.maxDelay);
      }
    }

    // If all retries failed, attempt graceful degradation
    if (this.fallbackConfig.gracefulDegradation) {
      console.log('🔄 Attempting graceful degradation...');
      return this.attemptGracefulDegradation(context);
    }

    throw lastError || new Error('Operation failed after all retries');
  }

  private isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return this.retryStrategy.retryableErrors.some(retryableError =>
      errorMessage.includes(retryableError)
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async attemptGracefulDegradation<T>(context: Partial<ErrorContext>): Promise<T> {
    // Try with a simpler model or prompt
    const fallbackModels = this.fallbackConfig.models;
    
    for (const model of fallbackModels) {
      try {
        console.log(`🔄 Trying fallback model: ${model}`);
        
        // This would be implemented to use a simpler prompt/model
        // For now, return a basic fallback result
        const fallbackResult = this.createFallbackResult(context);
        return fallbackResult as T;
      } catch (error) {
        console.warn(`❌ Fallback model ${model} also failed:`, error);
        continue;
      }
    }

    throw new Error('All fallback options exhausted');
  }

  private createFallbackResult(context: Partial<ErrorContext>): any {
    // Create a minimal but valid result structure
    return {
      idea: 'Analysis temporarily unavailable',
      demandScore: 50,
      scoreJustification: 'Fallback analysis due to system limitations',
      platformAnalyses: {
        twitter: {
          platformName: 'X',
          score: 3,
          summary: 'Analysis temporarily unavailable',
          keyFindings: ['System fallback', 'Limited analysis', 'Retry recommended'],
          contentSuggestion: 'Please try again later'
        }
      },
      fallbackUsed: true,
      confidence: 30,
      language: 'English'
    };
  }

  getErrorHistory(): ErrorContext[] {
    return [...this.errorHistory];
  }

  clearErrorHistory(): void {
    this.errorHistory = [];
  }
}
