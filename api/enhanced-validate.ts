import AIEnsemble from './ai-ensemble';
import RedditAnalyzer from './reddit-analyzer';
import GoogleTrendsAnalyzer from './google-trends';
import type { ValidationResult } from '../src/types';

// Enhanced validation with real-time data integration
export class EnhancedValidator {
  private aiEnsemble: AIEnsemble;
  private redditAnalyzer: RedditAnalyzer;
  private trendsAnalyzer: GoogleTrendsAnalyzer;

  constructor() {
    this.aiEnsemble = new AIEnsemble();
    this.redditAnalyzer = new RedditAnalyzer();
    this.trendsAnalyzer = new GoogleTrendsAnalyzer();
  }

  async validateIdea(
    content: string,
    systemInstruction: string,
    responseSchema: any
  ): Promise<ValidationResult> {
    console.log('🚀 Starting enhanced validation process...');
    
    try {
      // Run AI analysis and real-time data collection in parallel
      const [ensembleResult, redditAnalysis, trendsAnalysis] = await Promise.allSettled([
        this.aiEnsemble.analyzeWithEnsemble(content, systemInstruction, responseSchema),
        this.redditAnalyzer.analyzeRedditCommunity(content),
        this.trendsAnalyzer.analyzeTrends(content)
      ]);

      // Extract AI result
      let baseResult: any;
      if (ensembleResult.status === 'fulfilled') {
        baseResult = ensembleResult.value.primaryResponse;
        console.log(`✅ AI Ensemble succeeded with confidence: ${ensembleResult.value.confidence}%`);
      } else {
        console.error('❌ AI Ensemble failed:', ensembleResult.reason);
        throw new Error("AI analysis failed");
      }

      // Enhance with real-time data
      const enhancedResult = await this.enhanceWithRealTimeData(
        baseResult,
        redditAnalysis.status === 'fulfilled' ? redditAnalysis.value : null,
        trendsAnalysis.status === 'fulfilled' ? trendsAnalysis.value : null,
        ensembleResult.status === 'fulfilled' ? ensembleResult.value : null
      );

      console.log('✅ Enhanced validation completed');
      return enhancedResult;

    } catch (error) {
      console.error('❌ Enhanced validation failed:', error);
      throw error;
    }
  }

  private async enhanceWithRealTimeData(
    baseResult: any,
    redditData: any,
    trendsData: any,
    ensembleData: any
  ): Promise<ValidationResult> {
    
    // Enhance score with real-time data
    let enhancedScore = baseResult.demandScore || 65;
    
    // Reddit sentiment boost/penalty
    if (redditData) {
      const sentimentBoost = Math.round(redditData.averageSentiment / 10); // -10 to +10
      const interestBoost = Math.round(redditData.communityInterest / 10); // 0 to +10
      enhancedScore += sentimentBoost + interestBoost;
      console.log(`📊 Reddit boost: ${sentimentBoost + interestBoost} points`);
    }

    // Google Trends boost/penalty
    if (trendsData) {
      const trendBoost = Math.round((trendsData.trendScore - 50) / 5); // -10 to +10
      enhancedScore += trendBoost;
      console.log(`📈 Trends boost: ${trendBoost} points`);
    }

    // Ensure score stays within bounds
    enhancedScore = Math.max(0, Math.min(100, enhancedScore));

    // Enhance signal summary with real-time insights
    const enhancedSignalSummary = this.enhanceSignalSummary(
      baseResult.signalSummary || [],
      redditData,
      trendsData
    );

    // Add real-time insights to score breakdown
    const enhancedScoreBreakdown = this.enhanceScoreBreakdown(
      baseResult.scoreBreakdown,
      redditData,
      trendsData
    );

    // Add ValidationlyScore with real-time data
    const validationlyScore = this.calculateValidationlyScore(
      enhancedScore,
      redditData,
      trendsData,
      ensembleData
    );

    return {
      ...baseResult,
      demandScore: enhancedScore,
      signalSummary: enhancedSignalSummary,
      scoreBreakdown: enhancedScoreBreakdown,
      validationlyScore,
      // Add metadata about enhancements
      enhancementMetadata: {
        redditAnalyzed: !!redditData,
        trendsAnalyzed: !!trendsData,
        aiConfidence: ensembleData?.confidence || 75,
        fallbackUsed: ensembleData?.fallbackUsed || false,
        enhancementApplied: true
      }
    };
  }

  private enhanceSignalSummary(
    originalSummary: any[],
    redditData: any,
    trendsData: any
  ): any[] {
    const enhanced = [...originalSummary];

    // Add Reddit insights
    if (redditData && redditData.keyInsights.length > 0) {
      const redditSummary = enhanced.find(s => s.platform === 'Reddit');
      if (redditSummary) {
        redditSummary.summary += ` ${redditData.keyInsights.join(' ')}`;
      } else {
        enhanced.push({
          platform: 'Reddit',
          summary: `Community analysis reveals: ${redditData.keyInsights.join(' ')} Discussion volume: ${redditData.totalPosts} posts across ${redditData.topSubreddits.length} subreddits.`
        });
      }
    }

    // Add Google Trends insights
    if (trendsData && trendsData.insights.length > 0) {
      enhanced.push({
        platform: 'Google Trends',
        summary: `Search trend analysis shows: ${trendsData.insights.join(' ')} Overall trend direction: ${trendsData.overallTrend} with ${trendsData.trendScore}% interest score.`
      });
    }

    return enhanced;
  }

  private enhanceScoreBreakdown(
    originalBreakdown: any,
    redditData: any,
    trendsData: any
  ): any {
    const breakdown = originalBreakdown || {
      marketSize: 16,
      competition: 16,
      trendMomentum: 16,
      feasibility: 17
    };

    // Enhance with real-time data
    if (trendsData) {
      // Adjust trend momentum based on Google Trends
      const trendAdjustment = trendsData.overallTrend === 'rising' ? 3 : 
                             trendsData.overallTrend === 'declining' ? -3 : 0;
      breakdown.trendMomentum = Math.max(0, Math.min(25, breakdown.trendMomentum + trendAdjustment));
    }

    if (redditData) {
      // Adjust market size based on community interest
      const interestAdjustment = Math.round((redditData.communityInterest - 50) / 10);
      breakdown.marketSize = Math.max(0, Math.min(25, breakdown.marketSize + interestAdjustment));
    }

    return breakdown;
  }

  private calculateValidationlyScore(
    demandScore: number,
    redditData: any,
    trendsData: any,
    ensembleData: any
  ): any {
    const baseScore = demandScore;
    
    // Calculate platform-specific scores
    const twitterScore = Math.round(baseScore * 0.4);
    const redditScore = redditData ? 
      Math.round((redditData.communityInterest + (redditData.averageSentiment + 100) / 2) / 2) :
      Math.round(baseScore * 0.3);
    const linkedinScore = Math.round(baseScore * 0.2);
    const googleTrendsScore = trendsData ? 
      trendsData.trendScore :
      Math.round(baseScore * 0.1);

    return {
      totalScore: baseScore,
      breakdown: {
        twitter: twitterScore,
        reddit: redditScore,
        linkedin: linkedinScore,
        googleTrends: googleTrendsScore
      },
      weighting: {
        twitter: 40,
        reddit: 30,
        linkedin: 20,
        googleTrends: 10
      },
      improvements: this.generateImprovements(baseScore, redditData, trendsData),
      confidence: ensembleData?.confidence || 75,
      dataQuality: {
        aiAnalysis: ensembleData ? 'high' : 'medium',
        redditData: redditData ? 'simulated' : 'unavailable',
        trendsData: trendsData ? 'simulated' : 'unavailable'
      }
    };
  }

  private generateImprovements(
    score: number,
    redditData: any,
    trendsData: any
  ): string[] {
    const improvements: string[] = [];

    if (score < 70) {
      improvements.push("Increase social media engagement to boost overall score");
    }

    if (redditData && redditData.averageSentiment < 0) {
      improvements.push("Address community concerns highlighted in Reddit discussions");
    }

    if (trendsData && trendsData.overallTrend === 'declining') {
      improvements.push("Consider pivoting as search interest is declining");
    }

    if (redditData && redditData.communityInterest < 30) {
      improvements.push("Build more community engagement and awareness");
    }

    if (improvements.length === 0) {
      improvements.push("Strong validation signals across all platforms");
    }

    return improvements;
  }

  // Health check for all services
  async healthCheck(): Promise<{
    ai: boolean;
    reddit: boolean;
    trends: boolean;
    overall: boolean;
  }> {
    try {
      const aiHealth = await this.aiEnsemble.healthCheck();
      const aiHealthy = aiHealth.some(h => h.healthy);

      return {
        ai: aiHealthy,
        reddit: true, // Simulated data always available
        trends: true, // Simulated data always available
        overall: aiHealthy
      };
    } catch (error) {
      return {
        ai: false,
        reddit: true,
        trends: true,
        overall: false
      };
    }
  }
}

export default EnhancedValidator;