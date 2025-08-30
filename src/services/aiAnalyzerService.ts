import { PremiumPlatformData, PremiumAnalysisResult, PremiumSocialPosts } from '../types';

export class PremiumAIAnalyzerService {
  
  async analyzePlatforms(platforms: PremiumPlatformData[], query: string): Promise<PremiumAnalysisResult> {
    console.log(`🧠 Starting AI analysis for: "${query}"`);
    console.log(`📊 Analyzing ${platforms.length} platforms...`);
    
    // Calculate overall demand index with enhanced algorithm
    const demandIndex = this.calculateEnhancedDemandIndex(platforms, query);
    
    // Generate comprehensive insights
    const opportunities = this.identifyAdvancedOpportunities(platforms, query);
    const risks = this.identifyAdvancedRisks(platforms, query);
    const mvpSuggestions = this.generateAdvancedMVPSuggestions(platforms, query);
    
    // Determine verdict with confidence
    const verdict = this.determineVerdictWithConfidence(demandIndex, platforms);
    
    console.log(`✅ AI analysis completed. Demand Index: ${demandIndex}/100`);
    
    return {
      demand_index: demandIndex,
      verdict,
      opportunities,
      risks,
      mvp_suggestions: mvpSuggestions,
      platforms
    };
  }

  private calculateEnhancedDemandIndex(platforms: PremiumPlatformData[], query: string): number {
    if (platforms.length === 0) return 0;
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    platforms.forEach(platform => {
      // Enhanced volume score (0-20 points)
      const volumeScore = this.calculateVolumeScore(platform.metrics.volume);
      
      // Enhanced engagement score (0-25 points)
      const engagementScore = this.calculateEngagementScore(platform.metrics.engagement);
      
      // Enhanced growth rate score (0-20 points)
      const growthScore = this.calculateGrowthScore(platform.metrics.growth_rate);
      
      // Enhanced sentiment score (0-20 points)
      const sentimentScore = this.calculateSentimentScore(platform.sentiment);
      
      // New: Platform diversity bonus (0-15 points)
      const diversityBonus = this.calculateDiversityBonus(platforms, platform);
      
      const platformScore = volumeScore + engagementScore + growthScore + sentimentScore + diversityBonus;
      totalScore += platformScore;
      maxPossibleScore += 100;
    });
    
    // Apply market maturity adjustment
    const marketMaturityAdjustment = this.calculateMarketMaturityAdjustment(platforms, query);
    const adjustedScore = totalScore * marketMaturityAdjustment;
    
    return Math.round(Math.min(100, Math.max(0, (adjustedScore / maxPossibleScore) * 100)));
  }

  private calculateVolumeScore(volume: number): number {
    if (volume >= 100) return 20;
    if (volume >= 50) return 18;
    if (volume >= 30) return 15;
    if (volume >= 20) return 12;
    if (volume >= 10) return 8;
    if (volume >= 5) return 5;
    return 2;
  }

  private calculateEngagementScore(engagement: number): number {
    if (engagement >= 0.8) return 25;
    if (engagement >= 0.6) return 22;
    if (engagement >= 0.4) return 18;
    if (engagement >= 0.2) return 12;
    return 8;
  }

  private calculateGrowthScore(growthRate: number): number {
    if (growthRate >= 0.5) return 20;
    if (growthRate >= 0.3) return 18;
    if (growthRate >= 0.2) return 15;
    if (growthRate >= 0.1) return 10;
    if (growthRate >= 0) return 5;
    return 0;
  }

  private calculateSentimentScore(sentiment: { positive: number; neutral: number; negative: number }): number {
    const positiveWeight = 0.7;
    const neutralWeight = 0.2;
    const negativeWeight = 0.1;
    
    const weightedScore = (sentiment.positive * positiveWeight) + 
                         (sentiment.neutral * neutralWeight) + 
                         (sentiment.negative * negativeWeight);
    
    return Math.round(weightedScore * 20);
  }

  private calculateDiversityBonus(platforms: PremiumPlatformData[], currentPlatform: PremiumPlatformData): number {
    // Bonus for platforms that show different types of activity
    const platformType = this.getPlatformType(currentPlatform.platform);
    const similarPlatforms = platforms.filter(p => this.getPlatformType(p.platform) === platformType);
    
    if (similarPlatforms.length === 1) return 15; // Unique platform type
    if (similarPlatforms.length === 2) return 10; // Few similar platforms
    if (similarPlatforms.length === 3) return 5;  // Some similar platforms
    return 0; // Many similar platforms
  }

  private getPlatformType(platform: string): string {
    if (['reddit', 'hackernews'].includes(platform)) return 'community';
    if (['github', 'stackoverflow'].includes(platform)) return 'developer';
    if (['producthunt'].includes(platform)) return 'product';
    if (['googlenews'].includes(platform)) return 'media';
    if (['youtube'].includes(platform)) return 'content';
    return 'other';
  }

  private calculateMarketMaturityAdjustment(platforms: PremiumPlatformData[], query: string): number {
    // Adjust score based on market maturity
    const totalVolume = platforms.reduce((sum, p) => sum + p.metrics.volume, 0);
    const avgVolume = totalVolume / platforms.length;
    
    if (avgVolume > 100) return 0.9; // Mature market, slightly reduce score
    if (avgVolume > 50) return 1.0;  // Balanced market
    if (avgVolume > 20) return 1.1;  // Growing market, boost score
    return 1.2; // Emerging market, boost score significantly
  }

  private determineVerdictWithConfidence(demandIndex: number, platforms: PremiumPlatformData[]): 'high' | 'medium' | 'low' {
    // Enhanced verdict determination with confidence
    if (demandIndex >= 75) return 'high';
    if (demandIndex >= 50) return 'medium';
    if (demandIndex >= 25) return 'low';
    return 'low';
  }

  private identifyAdvancedOpportunities(platforms: PremiumPlatformData[], query: string): string[] {
    const opportunities: string[] = [];
    
    // Platform-specific opportunity analysis
    platforms.forEach(platform => {
      const { volume, engagement, growth_rate } = platform.metrics;
      const { positive } = platform.sentiment;
      const platformName = this.getPlatformDisplayName(platform.platform);
      
      // Volume-based opportunities
      if (volume > 80) {
        opportunities.push(`🔥 Very high volume on ${platformName} (${volume} items) indicates explosive market interest`);
      } else if (volume > 50) {
        opportunities.push(`📈 High volume on ${platformName} (${volume} items) shows strong market demand`);
      } else if (volume > 20) {
        opportunities.push(`📊 Moderate volume on ${platformName} (${volume} items) suggests growing market interest`);
      }
      
      // Engagement-based opportunities
      if (engagement > 0.8) {
        opportunities.push(`💪 Exceptional engagement on ${platformName} (${Math.round(engagement * 100)}%) indicates highly active community`);
      } else if (engagement > 0.6) {
        opportunities.push(`👍 Strong engagement on ${platformName} (${Math.round(engagement * 100)}%) shows engaged user base`);
      }
      
      // Growth-based opportunities
      if (growth_rate > 0.4) {
        opportunities.push(`🚀 Rapid growth on ${platformName} (${Math.round(growth_rate * 100)}% growth) suggests accelerating market momentum`);
      } else if (growth_rate > 0.2) {
        opportunities.push(`📈 Steady growth on ${platformName} (${Math.round(growth_rate * 100)}% growth) indicates sustainable market expansion`);
      }
      
      // Sentiment-based opportunities
      if (positive > 0.7) {
        opportunities.push(`😊 Very positive sentiment on ${platformName} (${Math.round(positive * 100)}% positive) indicates market acceptance`);
      } else if (positive > 0.5) {
        opportunities.push(`🙂 Positive sentiment on ${platformName} (${Math.round(positive * 100)}% positive) shows market optimism`);
      }
    });
    
    // Cross-platform opportunities
    const highVolumePlatforms = platforms.filter(p => p.metrics.volume > 40);
    if (highVolumePlatforms.length >= 4) {
      opportunities.push(`🌟 Multiple platforms show high activity - broad market appeal across different user segments`);
    }
    
    const highGrowthPlatforms = platforms.filter(p => p.metrics.growth_rate > 0.25);
    if (highGrowthPlatforms.length >= 3) {
      opportunities.push(`📈 Growth trends across multiple platforms suggest market expansion phase`);
    }
    
    const highEngagementPlatforms = platforms.filter(p => p.metrics.engagement > 0.7);
    if (highEngagementPlatforms.length >= 3) {
      opportunities.push(`💬 High engagement across platforms indicates strong user involvement and market readiness`);
    }
    
    // Query-specific opportunities
    if (query.toLowerCase().includes('app') || query.toLowerCase().includes('tool')) {
      opportunities.push(`🛠️ Developer tools and apps show consistent demand across technical platforms`);
    }
    
    if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('artificial intelligence')) {
      opportunities.push(`🤖 AI-related queries show high interest across all platforms - trending technology`);
    }
    
    if (query.toLowerCase().includes('health') || query.toLowerCase().includes('fitness')) {
      opportunities.push(`🏥 Health and fitness markets show sustained growth across consumer platforms`);
    }
    
    // Market gap opportunities
    const lowVolumePlatforms = platforms.filter(p => p.metrics.volume < 15);
    if (lowVolumePlatforms.length >= 2) {
      opportunities.push(`🎯 Some platforms show low activity - potential for market entry and differentiation`);
    }
    
    return opportunities.slice(0, 8); // Limit to top 8 opportunities
  }

  private identifyAdvancedRisks(platforms: PremiumPlatformData[], query: string): string[] {
    const risks: string[] = [];
    
    // Platform-specific risk analysis
    platforms.forEach(platform => {
      const { volume, engagement, growth_rate } = platform.metrics;
      const { negative } = platform.sentiment;
      const platformName = this.getPlatformDisplayName(platform.platform);
      
      // Volume-based risks
      if (volume > 100) {
        risks.push(`⚠️ Very high volume on ${platformName} (${volume} items) suggests market saturation risk`);
      } else if (volume < 10) {
        risks.push(`📉 Low volume on ${platformName} (${volume} items) indicates limited market interest`);
      }
      
      // Engagement-based risks
      if (engagement < 0.3) {
        risks.push(`😴 Low engagement on ${platformName} (${Math.round(engagement * 100)}%) suggests weak user interest`);
      }
      
      // Growth-based risks
      if (growth_rate < 0) {
        risks.push(`📉 Declining interest on ${platformName} (${Math.round(growth_rate * 100)}% growth) indicates market contraction`);
      }
      
      // Sentiment-based risks
      if (negative > 0.4) {
        risks.push(`😞 High negative sentiment on ${platformName} (${Math.round(negative * 100)}% negative) indicates market resistance`);
      }
    });
    
    // Cross-platform risks
    const lowVolumePlatforms = platforms.filter(p => p.metrics.volume < 20);
    if (lowVolumePlatforms.length >= 4) {
      risks.push(`🚨 Majority of platforms show low activity - overall market may be weak or oversaturated`);
    }
    
    const lowEngagementPlatforms = platforms.filter(p => p.metrics.engagement < 0.4);
    if (lowEngagementPlatforms.length >= 4) {
      risks.push(`💤 Low engagement across platforms suggests weak user involvement and market readiness`);
    }
    
    const decliningPlatforms = platforms.filter(p => p.metrics.growth_rate < 0);
    if (decliningPlatforms.length >= 3) {
      risks.push(`📉 Multiple platforms show declining interest - market may be in contraction phase`);
    }
    
    // Competition risks
    const highVolumePlatforms = platforms.filter(p => p.metrics.volume > 60);
    if (highVolumePlatforms.length >= 3) {
      risks.push(`🏆 High activity across platforms indicates strong competition - differentiation will be crucial`);
    }
    
    // Market maturity risks
    const totalVolume = platforms.reduce((sum, p) => sum + p.metrics.volume, 0);
    if (totalVolume > 500) {
      risks.push(`🏭 Very high total volume suggests mature market with established players - entry barriers may be high`);
    }
    
    // Query-specific risks
    if (query.toLowerCase().includes('crypto') || query.toLowerCase().includes('blockchain')) {
      risks.push(`💰 Crypto/blockchain markets are highly volatile and regulatory-dependent`);
    }
    
    if (query.toLowerCase().includes('social media') || query.toLowerCase().includes('network')) {
      risks.push(`📱 Social media markets are dominated by large players with high switching costs`);
    }
    
    return risks.slice(0, 6); // Limit to top 6 risks
  }

  private generateAdvancedMVPSuggestions(platforms: PremiumPlatformData[], query: string): string[] {
    const suggestions: string[] = [];
    
    // Analyze platform patterns for MVP guidance
    const developerPlatforms = platforms.filter(p => ['github', 'stackoverflow'].includes(p.platform));
    const communityPlatforms = platforms.filter(p => ['reddit', 'hackernews'].includes(p.platform));
    const productPlatforms = platforms.filter(p => ['producthunt'].includes(p.platform));
    const mediaPlatforms = platforms.filter(p => ['googlenews', 'youtube'].includes(p.platform));
    
    // Developer-focused suggestions
    if (developerPlatforms.some(p => p.metrics.volume > 30)) {
      suggestions.push(`💻 Start with developer tools and APIs - strong technical community demand detected`);
    }
    
    if (developerPlatforms.some(p => p.metrics.engagement > 0.6)) {
      suggestions.push(`🔧 Focus on developer experience and documentation - high engagement in technical discussions`);
    }
    
    // Community-focused suggestions
    if (communityPlatforms.some(p => p.metrics.volume > 40)) {
      suggestions.push(`👥 Build community features first - strong social discussion and interest detected`);
    }
    
    if (communityPlatforms.some(p => p.sentiment.positive > 0.6)) {
      suggestions.push(`😊 Emphasize user benefits and positive outcomes - community shows optimistic sentiment`);
    }
    
    // Product-focused suggestions
    if (productPlatforms.some(p => p.metrics.volume > 15)) {
      suggestions.push(`🚀 Launch on Product Hunt early - market shows readiness for new products`);
    }
    
    // Content-focused suggestions
    if (mediaPlatforms.some(p => p.metrics.volume > 25)) {
      suggestions.push(`📰 Create educational content and thought leadership - media interest indicates content demand`);
    }
    
    // Cross-platform suggestions
    const highVolumePlatforms = platforms.filter(p => p.metrics.volume > 50);
    if (highVolumePlatforms.length >= 3) {
      suggestions.push(`🌟 Build for multiple user segments - demand spans across different platform types`);
    }
    
    const highGrowthPlatforms = platforms.filter(p => p.metrics.growth_rate > 0.3);
    if (highGrowthPlatforms.length >= 2) {
      suggestions.push(`📈 Focus on growth features - market is expanding rapidly, capture momentum`);
    }
    
    // Query-specific suggestions
    if (query.toLowerCase().includes('app')) {
      suggestions.push(`📱 Start with mobile-first approach - app markets show strong mobile demand`);
    }
    
    if (query.toLowerCase().includes('api') || query.toLowerCase().includes('integration')) {
      suggestions.push(`🔌 Prioritize API-first architecture - developer platforms show strong integration demand`);
    }
    
    if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('machine learning')) {
      suggestions.push(`🤖 Focus on AI capabilities and automation - high interest in intelligent solutions`);
    }
    
    // Risk mitigation suggestions
    const lowEngagementPlatforms = platforms.filter(p => p.metrics.engagement < 0.4);
    if (lowEngagementPlatforms.length >= 3) {
      suggestions.push(`🎯 Focus on user engagement and retention - market shows weak user involvement`);
    }
    
    const highCompetitionPlatforms = platforms.filter(p => p.metrics.volume > 80);
    if (highCompetitionPlatforms.length >= 2) {
      suggestions.push(`🏆 Differentiate strongly - high competition requires unique value proposition`);
    }
    
    return suggestions.slice(0, 8); // Limit to top 8 suggestions
  }

  async generateSocialPosts(analysis: PremiumAnalysisResult, query: string): Promise<PremiumSocialPosts> {
    console.log(`📱 Generating social media posts for: "${query}"`);
    
    const { demand_index, verdict, opportunities, risks, platforms } = analysis;
    
    // Enhanced Twitter post
    const twitterText = this.generateTwitterPost(query, demand_index, verdict, opportunities, risks);
    
    // Enhanced Reddit post
    const redditPost = this.generateRedditPost(query, demand_index, verdict, opportunities, risks, platforms);
    
    // Enhanced LinkedIn post
    const linkedinPost = this.generateLinkedInPost(query, demand_index, verdict, opportunities, risks, platforms);
    
    console.log(`✅ Social media posts generated successfully`);
    
    return {
      twitter: { tone: 'analytical', text: twitterText },
      reddit: redditPost,
      linkedin: linkedinPost
    };
  }

  private generateTwitterPost(query: string, demandIndex: number, verdict: string, opportunities: string[], risks: string[]): string {
    const topOpportunity = opportunities[0] || 'Strong market interest detected';
    const topRisk = risks[0] || 'Market competition exists';
    
    let post = `🚀 Market Analysis: "${query}"\n\n`;
    post += `📊 Demand Index: ${demandIndex}/100 (${verdict})\n\n`;
    post += `💡 Top Opportunity: ${topOpportunity.substring(0, 60)}...\n\n`;
    post += `⚠️ Key Risk: ${topRisk.substring(0, 60)}...\n\n`;
    post += `#startup #validation #marketresearch #${query.replace(/\s+/g, '')}`;
    
    // Ensure it fits Twitter's character limit
    if (post.length > 280) {
      post = post.substring(0, 277) + '...';
    }
    
    return post;
  }

  private generateRedditPost(query: string, demandIndex: number, verdict: string, opportunities: string[], risks: string[], platforms: PremiumPlatformData[]): { title: string, body: string } {
    const title = `Market validation analysis for "${query}" - ${demandIndex}/100 demand index`;
    
    let body = `**Market Analysis Results for "${query}"**\n\n`;
    body += `**Demand Index:** ${demandIndex}/100 (${verdict} demand)\n\n`;
    
    body += `**Top Opportunities:**\n`;
    opportunities.slice(0, 4).forEach((opp, i) => {
      body += `${i + 1}. ${opp}\n`;
    });
    
    body += `\n**Key Risks:**\n`;
    risks.slice(0, 3).forEach((risk, i) => {
      body += `${i + 1}. ${risk}\n`;
    });
    
    body += `\n**Platform Activity Summary:**\n`;
    platforms.forEach(platform => {
      const platformName = this.getPlatformDisplayName(platform.platform);
      const { volume, engagement } = platform.metrics;
      body += `• ${platformName}: ${volume} items, ${Math.round(engagement * 100)}% engagement\n`;
    });
    
    body += `\n**Analysis:** This market shows ${verdict} demand with ${opportunities.length} key opportunities and ${risks.length} main risks.\n\n`;
    body += `What's your take on this market opportunity? Any insights from your experience?`;
    
    return { title, body };
  }

  private generateLinkedInPost(query: string, demandIndex: number, verdict: string, opportunities: string[], risks: string[], platforms: PremiumPlatformData[]): { tone: string, text: string, cta: string } {
    let text = `📊 Market validation analysis for "${query}"\n\n`;
    text += `**Demand Index:** ${demandIndex}/100\n`;
    text += `**Market Verdict:** ${verdict.charAt(0).toUpperCase() + verdict.slice(1)} demand\n\n`;
    
    text += `**Key Insights:**\n`;
    text += `• ${opportunities[0] || 'Strong market interest detected'}\n`;
    text += `• ${opportunities[1] || 'Multiple platforms show activity'}\n`;
    text += `• ${risks[0] || 'Market competition exists'}\n\n`;
    
    text += `**Platform Analysis:** ${platforms.length} platforms analyzed\n`;
    const highActivityPlatforms = platforms.filter(p => p.metrics.volume > 30);
    if (highActivityPlatforms.length > 0) {
      text += `• High activity on ${highActivityPlatforms.length} platforms\n`;
    }
    
    text += `\nThis analysis suggests ${verdict} market opportunity for "${query}". `;
    text += `The data shows ${opportunities.length} key opportunities and ${risks.length} main risks to consider.\n\n`;
    
    text += `**For entrepreneurs and product teams:** This could be the right time to validate your approach and build your MVP.\n\n`;
    
    const cta = `What's your experience with this market? Any insights to share?`;
    
    return { tone: 'professional', text, cta };
  }

  private getPlatformDisplayName(platform: string): string {
    const displayNames: { [key: string]: string } = {
      reddit: 'Reddit',
      hackernews: 'Hacker News',
      producthunt: 'Product Hunt',
      github: 'GitHub',
      stackoverflow: 'Stack Overflow',
      googlenews: 'Google News',
      youtube: 'YouTube'
    };
    
    return displayNames[platform] || platform;
  }
}

export const premiumAIAnalyzerService = new PremiumAIAnalyzerService();
