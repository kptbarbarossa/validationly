import { PremiumPlatformData, PremiumAnalysisResult, PremiumSocialPosts } from '../types';

export class PremiumAIAnalyzerService {
  
  async analyzePlatforms(platforms: PremiumPlatformData[], query: string): Promise<PremiumAnalysisResult> {
    // Calculate overall demand index
    const demandIndex = this.calculateDemandIndex(platforms);
    
    // Generate insights
    const opportunities = this.identifyOpportunities(platforms, query);
    const risks = this.identifyRisks(platforms, query);
    const mvpSuggestions = this.generateMVPSuggestions(platforms, query);
    
    // Determine verdict
    const verdict = this.determineVerdict(demandIndex);
    
    return {
      demand_index: demandIndex,
      verdict,
      opportunities,
      risks,
      mvp_suggestions: mvpSuggestions,
      platforms
    };
  }

  private calculateDemandIndex(platforms: PremiumPlatformData[]): number {
    if (platforms.length === 0) return 0;
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    platforms.forEach(platform => {
      // Volume score (0-25 points)
      const volumeScore = Math.min(platform.metrics.volume / 10, 25);
      
      // Engagement score (0-25 points)
      const engagementScore = platform.metrics.engagement * 25;
      
      // Growth rate score (0-25 points)
      const growthScore = Math.max(0, Math.min(platform.metrics.growth_rate * 25, 25));
      
      // Sentiment score (0-25 points)
      const sentimentScore = platform.sentiment.positive * 25;
      
      const platformScore = volumeScore + engagementScore + growthScore + sentimentScore;
      totalScore += platformScore;
      maxPossibleScore += 100;
    });
    
    return Math.round((totalScore / maxPossibleScore) * 100);
  }

  private determineVerdict(demandIndex: number): 'high' | 'medium' | 'low' {
    if (demandIndex >= 70) return 'high';
    if (demandIndex >= 40) return 'medium';
    return 'low';
  }

  private identifyOpportunities(platforms: PremiumPlatformData[], query: string): string[] {
    const opportunities: string[] = [];
    
    // Analyze each platform for opportunities
    platforms.forEach(platform => {
      const { volume, engagement, growth_rate } = platform.metrics;
      const { positive } = platform.sentiment;
      
      if (volume > 50) {
        opportunities.push(`High volume on ${this.getPlatformDisplayName(platform.platform)} indicates strong market interest`);
      }
      
      if (engagement > 0.7) {
        opportunities.push(`High engagement on ${this.getPlatformDisplayName(platform.platform)} suggests market readiness`);
      }
      
      if (growth_rate > 0.3) {
        opportunities.push(`Growing interest on ${this.getPlatformDisplayName(platform.platform)} shows market momentum`);
      }
      
      if (positive > 0.6) {
        opportunities.push(`Positive sentiment on ${this.getPlatformDisplayName(platform.platform)} indicates market acceptance`);
      }
    });
    
    // Add cross-platform opportunities
    const highVolumePlatforms = platforms.filter(p => p.metrics.volume > 30);
    if (highVolumePlatforms.length >= 3) {
      opportunities.push(`Multiple platforms show high activity, indicating broad market appeal`);
    }
    
    const highGrowthPlatforms = platforms.filter(p => p.metrics.growth_rate > 0.2);
    if (highGrowthPlatforms.length >= 2) {
      opportunities.push(`Growth trends across multiple platforms suggest market expansion`);
    }
    
    // Add specific opportunities based on query type
    if (query.toLowerCase().includes('app') || query.toLowerCase().includes('tool')) {
      opportunities.push(`Developer tools and apps show consistent demand across platforms`);
    }
    
    if (query.toLowerCase().includes('startup') || query.toLowerCase().includes('business')) {
      opportunities.push(`Business solutions have strong community support and discussion`);
    }
    
    return opportunities.length > 0 ? opportunities : ['Market shows potential for growth', 'User needs are clearly identified'];
  }

  private identifyRisks(platforms: PremiumPlatformData[], query: string): string[] {
    const risks: string[] = [];
    
    // Analyze each platform for risks
    platforms.forEach(platform => {
      const { volume, engagement, growth_rate } = platform.metrics;
      const { negative } = platform.sentiment;
      
      if (volume > 100) {
        risks.push(`High volume on ${this.getPlatformDisplayName(platform.platform)} suggests market saturation`);
      }
      
      if (engagement < 0.3) {
        risks.push(`Low engagement on ${this.getPlatformDisplayName(platform.platform)} indicates weak market interest`);
      }
      
      if (growth_rate < -0.1) {
        risks.push(`Declining interest on ${this.getPlatformDisplayName(platform.platform)} shows market cooling`);
      }
      
      if (negative > 0.4) {
        risks.push(`Negative sentiment on ${this.getPlatformDisplayName(platform.platform)} suggests market resistance`);
      }
    });
    
    // Add cross-platform risks
    const lowEngagementPlatforms = platforms.filter(p => p.metrics.engagement < 0.4);
    if (lowEngagementPlatforms.length >= 3) {
      risks.push(`Low engagement across multiple platforms indicates weak market demand`);
    }
    
    const highCompetitionPlatforms = platforms.filter(p => p.metrics.volume > 80);
    if (highCompetitionPlatforms.length >= 4) {
      risks.push(`High competition across multiple platforms suggests market saturation`);
    }
    
    // Add specific risks based on query type
    if (query.toLowerCase().includes('app') || query.toLowerCase().includes('tool')) {
      risks.push(`Developer tools market is highly competitive with established players`);
    }
    
    if (query.toLowerCase().includes('startup') || query.toLowerCase().includes('business')) {
      risks.push(`Business solutions require significant marketing and sales investment`);
    }
    
    return risks.length > 0 ? risks : ['Market saturation risk', 'User acquisition challenges', 'Competitive pressure'];
  }

  private generateMVPSuggestions(platforms: PremiumPlatformData[], query: string): string[] {
    const suggestions: string[] = [];
    
    // Analyze platform-specific suggestions
    const githubData = platforms.find(p => p.platform === 'github');
    if (githubData && githubData.metrics.volume > 20) {
      suggestions.push('Provide clear API documentation and SDKs for developers');
      suggestions.push('Open source core components to build community');
    }
    
    const stackOverflowData = platforms.find(p => p.platform === 'stackoverflow');
    if (stackOverflowData && stackOverflowData.metrics.volume > 15) {
      suggestions.push('Create comprehensive documentation and tutorials');
      suggestions.push('Build active community support channels');
    }
    
    const redditData = platforms.find(p => p.platform === 'reddit');
    if (redditData && redditData.metrics.volume > 25) {
      suggestions.push('Engage with relevant subreddit communities');
      suggestions.push('Create shareable content and demos');
    }
    
    const productHuntData = platforms.find(p => p.platform === 'producthunt');
    if (productHuntData && productHuntData.metrics.volume > 10) {
      suggestions.push('Prepare for Product Hunt launch with strong positioning');
      suggestions.push('Build pre-launch community and waitlist');
    }
    
    // Add general MVP suggestions
    suggestions.push('Start with core features that address main pain points');
    suggestions.push('Focus on user experience and onboarding');
    suggestions.push('Build feedback loops for rapid iteration');
    
    return suggestions.slice(0, 6); // Limit to top 6 suggestions
  }

  private getPlatformDisplayName(platform: string): string {
    const platformNames: Record<string, string> = {
      'reddit': 'Reddit',
      'hackernews': 'Hacker News',
      'producthunt': 'Product Hunt',
      'github': 'GitHub',
      'stackoverflow': 'Stack Overflow',
      'googlenews': 'Google News',
      'youtube': 'YouTube'
    };
    
    return platformNames[platform] || platform;
  }

  async generateSocialPosts(analysis: PremiumAnalysisResult, query: string): Promise<PremiumSocialPosts> {
    const { demand_index, verdict, opportunities, risks } = analysis;
    
    // Generate Twitter post
    const twitterText = this.generateTwitterPost(query, demand_index, verdict, opportunities);
    
    // Generate Reddit post
    const redditPost = this.generateRedditPost(query, analysis);
    
    // Generate LinkedIn post
    const linkedinPost = this.generateLinkedInPost(query, analysis);
    
    return {
      twitter: {
        tone: 'analytical',
        text: twitterText
      },
      reddit: {
        title: redditPost.title,
        body: redditPost.body
      },
      linkedin: {
        tone: 'professional',
        text: linkedinPost.text,
        cta: linkedinPost.cta
      }
    };
  }

  private generateTwitterPost(query: string, demandIndex: number, verdict: string, opportunities: string[]): string {
    const topOpportunity = opportunities[0] || 'shows market potential';
    const emoji = verdict === 'high' ? '🚀' : verdict === 'medium' ? '📈' : '📊';
    
    return `${emoji} ${query} analysis: ${demandIndex}/100 demand index\n\n${topOpportunity}\n\n#startup #validation #marketresearch`;
  }

  private generateRedditPost(query: string, analysis: PremiumAnalysisResult): { title: string; body: string } {
    const { demand_index, opportunities, risks, platforms } = analysis;
    
    const title = `Market analysis for "${query}" - ${demand_index}/100 demand index`;
    
    const body = `**Demand Index:** ${demand_index}/100 (${analysis.verdict})\n\n` +
                 `**Top Opportunities:**\n` +
                 opportunities.slice(0, 3).map(opp => `• ${opp}`).join('\n') + '\n\n' +
                 `**Key Risks:**\n` +
                 risks.slice(0, 2).map(risk => `• ${risk}`).join('\n') + '\n\n' +
                 `**Platform Activity:**\n` +
                 platforms.slice(0, 4).map(p => `• ${this.getPlatformDisplayName(p.platform)}: ${p.metrics.volume} items, ${Math.round(p.metrics.engagement * 100)}% engagement`).join('\n') + '\n\n' +
                 `What do you think about this market opportunity?`;
    
    return { title, body };
  }

  private generateLinkedInPost(query: string, analysis: PremiumAnalysisResult): { text: string; cta: string } {
    const { demand_index, opportunities, risks, platforms } = analysis;
    
    const text = `📊 Market validation analysis for "${query}"\n\n` +
                 `**Demand Index:** ${demand_index}/100\n` +
                 `**Verdict:** ${analysis.verdict.charAt(0).toUpperCase() + analysis.verdict.slice(1)} market demand\n\n` +
                 `**Key Insights:**\n` +
                 `• ${opportunities[0] || 'Market shows potential for growth'}\n` +
                 `• ${opportunities[1] || 'User needs are clearly identified'}\n\n` +
                 `**Platform Activity:** ${platforms.length} platforms analyzed\n` +
                 `• GitHub: ${platforms.find(p => p.platform === 'github')?.metrics.volume || 0} repos\n` +
                 `• Reddit: ${platforms.find(p => p.platform === 'reddit')?.metrics.volume || 0} discussions\n` +
                 `• Product Hunt: ${platforms.find(p => p.platform === 'producthunt')?.metrics.volume || 0} launches\n\n` +
                 `This analysis shows ${analysis.verdict === 'high' ? 'strong market opportunity' : analysis.verdict === 'medium' ? 'moderate potential' : 'challenging market conditions'} for ${query}.`;
    
    const cta = `What's your take on this market opportunity?`;
    
    return { text, cta };
  }
}

// Export singleton instance
export const premiumAIAnalyzerService = new PremiumAIAnalyzerService();
