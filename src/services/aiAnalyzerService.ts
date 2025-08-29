import type { 
  PlatformScanResult, 
  PlatformInsight, 
  CrossPlatformAnalysis,
  KeywordAnalysis 
} from '../types/platformScanner';

export class AIAnalyzerService {
  
  // Analyze all platform scan results and generate insights
  async analyzePlatformResults(
    scanResults: PlatformScanResult[], 
    idea: string, 
    keywords: string[]
  ): Promise<CrossPlatformAnalysis> {
    
    const successfulResults = scanResults.filter(r => r.success && r.data);
    const platformInsights = await this.generatePlatformInsights(successfulResults, idea);
    const marketOpportunities = this.identifyMarketOpportunities(successfulResults, keywords);
    const competitiveLandscape = this.analyzeCompetitiveLandscape(successfulResults);
    const recommendedFocus = this.generateRecommendedFocus(platformInsights);
    const riskFactors = this.identifyRiskFactors(successfulResults, platformInsights);
    
    const overallDemand = this.calculateOverallDemand(successfulResults);
    
    return {
      overallDemand,
      platformStrengths: platformInsights,
      marketOpportunities,
      competitiveLandscape,
      recommendedFocus,
      riskFactors
    };
  }

  // Generate insights for each platform
  private async generatePlatformInsights(
    scanResults: PlatformScanResult[], 
    idea: string
  ): Promise<PlatformInsight[]> {
    
    const insights: PlatformInsight[] = [];
    
    for (const result of scanResults) {
      if (!result.data) continue;
      
      const data = result.data;
      const strength = this.assessPlatformStrength(data);
      const opportunities = this.identifyPlatformOpportunities(data, result.platform, idea);
      const risks = this.identifyPlatformRisks(data, result.platform);
      const recommendations = this.generatePlatformRecommendations(data, result.platform, idea);
      const marketFit = this.calculateMarketFit(data, result.platform);
      
      insights.push({
        platform: result.platform,
        strength,
        opportunities,
        risks,
        recommendations,
        marketFit
      });
    }
    
    return insights;
  }

  // Assess platform strength based on data
  private assessPlatformStrength(data: any): 'high' | 'medium' | 'low' {
    const { totalPosts, totalEngagement, demandScore } = data;
    
    if (demandScore >= 80 || (totalPosts >= 50 && totalEngagement >= 2000)) {
      return 'high';
    } else if (demandScore >= 50 || (totalPosts >= 20 && totalEngagement >= 500)) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Identify opportunities for each platform
  private identifyPlatformOpportunities(data: any, platform: string, idea: string): string[] {
    const opportunities: string[] = [];
    const { totalPosts, totalEngagement, trendingTopics, marketInsights } = data;
    
    if (totalPosts >= 30) {
      opportunities.push(`High content volume indicates strong community interest`);
    }
    
    if (totalEngagement >= 1000) {
      opportunities.push(`High engagement suggests market readiness`);
    }
    
    if (trendingTopics.length > 0) {
      opportunities.push(`Trending topics: ${trendingTopics.join(', ')}`);
    }
    
    if (marketInsights.length > 0) {
      opportunities.push(...marketInsights);
    }
    
    // Platform-specific opportunities
    switch (platform) {
      case 'reddit':
        if (data.subredditAnalysis?.length > 0) {
          opportunities.push(`Active subreddits: ${data.subredditAnalysis.map(s => s.subreddit).join(', ')}`);
        }
        break;
      case 'github':
        if (data.totalPosts >= 20) {
          opportunities.push(`Developer community shows strong interest`);
        }
        break;
      case 'youtube':
        if (data.totalEngagement >= 5000) {
          opportunities.push(`High video engagement indicates content demand`);
        }
        break;
      case 'producthunt':
        if (data.totalPosts >= 5) {
          opportunities.push(`Product Hunt community receptive to similar products`);
        }
        break;
    }
    
    return opportunities;
  }

  // Identify risks for each platform
  private identifyPlatformRisks(data: any, platform: string): string[] {
    const risks: string[] = [];
    const { totalPosts, totalEngagement, demandScore } = data;
    
    if (totalPosts < 10) {
      risks.push(`Low content volume suggests limited market interest`);
    }
    
    if (totalEngagement < 200) {
      risks.push(`Low engagement indicates poor market response`);
    }
    
    if (demandScore < 30) {
      risks.push(`Low demand score suggests market saturation or poor fit`);
    }
    
    // Platform-specific risks
    switch (platform) {
      case 'reddit':
        if (data.subredditAnalysis?.some((s: any) => s.sentiment === 'negative')) {
          risks.push(`Negative sentiment in some subreddits`);
        }
        break;
      case 'github':
        if (data.totalPosts < 5) {
          risks.push(`Limited developer interest`);
        }
        break;
      case 'stackoverflow':
        if (data.totalPosts < 15) {
          risks.push(`Limited developer questions suggest low technical interest`);
        }
        break;
    }
    
    return risks;
  }

  // Generate recommendations for each platform
  private generatePlatformRecommendations(data: any, platform: string, idea: string): string[] {
    const recommendations: string[] = [];
    const { strength, totalPosts, totalEngagement } = data;
    
    if (strength === 'high') {
      recommendations.push(`Focus on ${platform} as primary marketing channel`);
      recommendations.push(`Leverage existing community engagement`);
      recommendations.push(`Consider platform-specific partnerships`);
    } else if (strength === 'medium') {
      recommendations.push(`Develop ${platform} presence gradually`);
      recommendations.push(`Focus on quality over quantity`);
      recommendations.push(`Monitor for growth opportunities`);
    } else {
      recommendations.push(`Limited immediate opportunity on ${platform}`);
      recommendations.push(`Focus on other platforms first`);
      recommendations.push(`Re-evaluate strategy in 3-6 months`);
    }
    
    // Platform-specific recommendations
    switch (platform) {
      case 'reddit':
        if (data.subredditAnalysis?.length > 0) {
          recommendations.push(`Engage with r/${data.subredditAnalysis[0].subreddit} community`);
        }
        break;
      case 'github':
        if (data.totalPosts >= 10) {
          recommendations.push(`Open source components to build developer trust`);
        }
        break;
      case 'youtube':
        if (data.totalEngagement >= 2000) {
          recommendations.push(`Create educational content about ${idea}`);
        }
        break;
      case 'producthunt':
        if (data.totalPosts >= 3) {
          recommendations.push(`Prepare for Product Hunt launch`);
        }
        break;
    }
    
    return recommendations;
  }

  // Calculate market fit score for platform
  private calculateMarketFit(data: any, platform: string): number {
    const { totalPosts, totalEngagement, demandScore } = data;
    
    let score = demandScore;
    
    // Adjust based on platform characteristics
    switch (platform) {
      case 'reddit':
        if (data.subredditAnalysis?.length >= 3) score += 10;
        break;
      case 'github':
        if (data.totalPosts >= 20) score += 15;
        break;
      case 'youtube':
        if (data.totalEngagement >= 5000) score += 10;
        break;
      case 'producthunt':
        if (data.totalPosts >= 5) score += 15;
        break;
    }
    
    return Math.min(score, 100);
  }

  // Identify market opportunities across platforms
  private identifyMarketOpportunities(scanResults: PlatformScanResult[], keywords: string[]): string[] {
    const opportunities: string[] = [];
    const totalDemand = scanResults.reduce((sum, r) => sum + (r.data?.demandScore || 0), 0);
    const avgDemand = totalDemand / scanResults.length;
    
    if (avgDemand >= 70) {
      opportunities.push(`Strong overall market demand across all platforms`);
    }
    
    if (scanResults.some(r => r.data?.demandScore >= 80)) {
      opportunities.push(`Exceptional performance on some platforms indicates market readiness`);
    }
    
    if (keywords.length >= 3) {
      opportunities.push(`Multiple keyword opportunities suggest broad market appeal`);
    }
    
    const highPerformingPlatforms = scanResults
      .filter(r => r.data?.demandScore >= 70)
      .map(r => r.platform);
    
    if (highPerformingPlatforms.length >= 3) {
      opportunities.push(`Strong performance on ${highPerformingPlatforms.length} platforms`);
    }
    
    return opportunities;
  }

  // Analyze competitive landscape
  private analyzeCompetitiveLandscape(scanResults: PlatformScanResult[]): string[] {
    const insights: string[] = [];
    
    const totalPosts = scanResults.reduce((sum, r) => sum + (r.data?.totalPosts || 0), 0);
    const totalEngagement = scanResults.reduce((sum, r) => sum + (r.data?.totalEngagement || 0), 0);
    
    if (totalPosts >= 200) {
      insights.push(`High content volume suggests competitive market`);
    }
    
    if (totalEngagement >= 10000) {
      insights.push(`High engagement indicates active market with strong competition`);
    }
    
    const highDemandPlatforms = scanResults.filter(r => r.data?.demandScore >= 70);
    if (highDemandPlatforms.length >= 4) {
      insights.push(`Strong demand across multiple platforms suggests market opportunity`);
    }
    
    return insights;
  }

  // Generate recommended focus areas
  private generateRecommendedFocus(platformInsights: PlatformInsight[]): string[] {
    const recommendations: string[] = [];
    
    const highStrengthPlatforms = platformInsights.filter(p => p.strength === 'high');
    const mediumStrengthPlatforms = platformInsights.filter(p => p.strength === 'medium');
    
    if (highStrengthPlatforms.length >= 2) {
      recommendations.push(`Focus on high-performing platforms: ${highStrengthPlatforms.map(p => p.platform).join(', ')}`);
    }
    
    if (mediumStrengthPlatforms.length >= 3) {
      recommendations.push(`Develop presence on medium-strength platforms for growth`);
    }
    
    const topPlatforms = platformInsights
      .sort((a, b) => b.marketFit - a.marketFit)
      .slice(0, 3)
      .map(p => p.platform);
    
    recommendations.push(`Prioritize: ${topPlatforms.join(', ')}`);
    
    return recommendations;
  }

  // Identify risk factors
  private identifyRiskFactors(
    scanResults: PlatformScanResult[], 
    platformInsights: PlatformInsight[]
  ): string[] {
    const risks: string[] = [];
    
    const lowStrengthPlatforms = platformInsights.filter(p => p.strength === 'low');
    if (lowStrengthPlatforms.length >= 4) {
      risks.push(`Weak performance on majority of platforms`);
    }
    
    const lowDemandPlatforms = scanResults.filter(r => r.data?.demandScore < 30);
    if (lowDemandPlatforms.length >= 3) {
      risks.push(`Low demand across multiple platforms`);
    }
    
    const totalDemand = scanResults.reduce((sum, r) => sum + (r.data?.demandScore || 0), 0);
    const avgDemand = totalDemand / scanResults.length;
    
    if (avgDemand < 40) {
      risks.push(`Overall low market demand`);
    }
    
    return risks;
  }

  // Calculate overall demand score
  private calculateOverallDemand(scanResults: PlatformScanResult[]): number {
    const totalDemand = scanResults.reduce((sum, r) => sum + (r.data?.demandScore || 0), 0);
    const avgDemand = totalDemand / scanResults.length;
    
    // Weight by platform importance
    const platformWeights = {
      reddit: 1.2,
      youtube: 1.1,
      github: 1.0,
      producthunt: 1.0,
      hackernews: 0.9,
      stackoverflow: 0.9,
      googlenews: 0.8
    };
    
    let weightedDemand = 0;
    let totalWeight = 0;
    
    for (const result of scanResults) {
      const weight = platformWeights[result.platform as keyof typeof platformWeights] || 1.0;
      weightedDemand += (result.data?.demandScore || 0) * weight;
      totalWeight += weight;
    }
    
    return Math.round(weightedDemand / totalWeight);
  }
}

// Export singleton instance
export const aiAnalyzerService = new AIAnalyzerService();
