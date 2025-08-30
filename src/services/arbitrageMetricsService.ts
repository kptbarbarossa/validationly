import { 
  SocialArbitrageMetrics, 
  ArbitrageCatalyst, 
  ArbitragePlay,
  PremiumPlatformData,
  PremiumPlatformDataWithArbitrage
} from '../types';

/**
 * Social Arbitrage Metrics Service
 * Calculates underpriced attention and cross-platform mispricings
 */
export class ArbitrageMetricsService {
  
  /**
   * Calculate Social Arbitrage Rating (SAR) for all platforms
   */
  calculateSAR(platforms: PremiumPlatformData[]): number {
    if (platforms.length === 0) return 0;
    
    const platformSARs = platforms.map(platform => {
      const arbitrageMetrics = this.calculateArbitrageMetrics(platform, platforms);
      return this.calculatePlatformSAR(arbitrageMetrics);
    });
    
    // Weighted average SAR across all platforms
    const totalSAR = platformSARs.reduce((sum, sar) => sum + sar, 0);
    return Math.round(totalSAR / platformSARs.length);
  }
  
  /**
   * Calculate arbitrage metrics for a single platform
   */
  calculateArbitrageMetrics(
    platform: PremiumPlatformData, 
    allPlatforms: PremiumPlatformData[]
  ): SocialArbitrageMetrics {
    
    // AII - Attention Imbalance Index
    const attention_imbalance = this.calculateAttentionImbalance(platform, allPlatforms);
    
    // CPL - Cross-Platform Lag (simplified)
    const lag_minutes = this.calculateCrossPlatformLag(platform, allPlatforms);
    
    // SV - Sentiment Velocity
    const sentiment_velocity = this.calculateSentimentVelocity(platform);
    
    // IWM - Influencer Weighted Momentum
    const influencer_momentum = this.calculateInfluencerMomentum(platform);
    
    // NC - Narrative Concentration
    const narrative_concentration = this.calculateNarrativeConcentration(platform);
    
    // CPS - Catalyst Proximity Score
    const catalyst_proximity = this.calculateCatalystProximity(platform);
    
    // MG - Mispricing Gap (composite)
    const mispricing_gap = this.calculateMispricingGap({
      attention_imbalance,
      lag_minutes,
      influencer_momentum,
      catalyst_proximity
    });
    
    // Edge Type Classification
    const edge_type = this.classifyEdgeType(platform, {
      attention_imbalance,
      catalyst_proximity,
      sentiment_velocity
    });
    
    // Confidence based on data quality
    const confidence = this.calculateConfidence(platform);
    
    return {
      attention_imbalance,
      lag_minutes,
      sentiment_velocity,
      influencer_momentum,
      narrative_concentration,
      catalyst_proximity,
      mispricing_gap,
      edge_type,
      confidence
    };
  }
  
  /**
   * Calculate Attention Imbalance Index (AII)
   * Social volume vs News volume comparison
   */
  private calculateAttentionImbalance(
    platform: PremiumPlatformData, 
    allPlatforms: PremiumPlatformData[]
  ): number {
    const socialPlatforms = ['reddit', 'hackernews', 'github', 'stackoverflow'];
    const newsPlatforms = ['googlenews', 'youtube'];
    
    const socialVolume = allPlatforms
      .filter(p => socialPlatforms.includes(p.platform))
      .reduce((sum, p) => sum + p.metrics.volume, 0);
    
    const newsVolume = allPlatforms
      .filter(p => newsPlatforms.includes(p.platform))
      .reduce((sum, p) => sum + p.metrics.volume, 0);
    
    if (newsVolume === 0) return 1; // High imbalance if no news
    if (socialVolume === 0) return 0; // No imbalance if no social
    
    // Normalize the ratio to [0,1]
    const ratio = socialVolume / (socialVolume + newsVolume);
    return Math.min(1, Math.max(0, ratio));
  }
  
  /**
   * Calculate Cross-Platform Lag (CPL)
   * Simplified: estimate based on platform types
   */
  private calculateCrossPlatformLag(
    platform: PremiumPlatformData,
    allPlatforms: PremiumPlatformData[]
  ): number {
    // Simplified lag estimation based on platform characteristics
    const platformLags: Record<string, number> = {
      'github': 0,      // Fastest (developers first)
      'hackernews': 60,  // 1 hour
      'reddit': 120,     // 2 hours
      'stackoverflow': 180, // 3 hours
      'producthunt': 360,   // 6 hours
      'googlenews': 720,    // 12 hours
      'youtube': 1440       // 24 hours
    };
    
    return platformLags[platform.platform] || 360;
  }
  
  /**
   * Calculate Sentiment Velocity (SV)
   * Rate of sentiment change
   */
  private calculateSentimentVelocity(platform: PremiumPlatformData): number {
    const { positive, negative } = platform.sentiment;
    
    // Simplified velocity based on sentiment polarity
    // High positive = positive velocity, high negative = negative velocity
    const velocity = positive - negative;
    return Math.min(1, Math.max(-1, velocity));
  }
  
  /**
   * Calculate Influencer Weighted Momentum (IWM)
   * Engagement weighted by platform authority
   */
  private calculateInfluencerMomentum(platform: PremiumPlatformData): number {
    const platformWeights: Record<string, number> = {
      'hackernews': 0.9,    // High authority
      'github': 0.85,       // High developer authority
      'stackoverflow': 0.8,  // High technical authority
      'reddit': 0.7,        // Medium authority
      'producthunt': 0.75,   // Medium authority
      'googlenews': 0.6,     // Variable authority
      'youtube': 0.65        // Variable authority
    };
    
    const platformWeight = platformWeights[platform.platform] || 0.5;
    const engagementScore = platform.metrics.engagement;
    
    return Math.min(1, platformWeight * engagementScore);
  }
  
  /**
   * Calculate Narrative Concentration (NC)
   * Herfindahl index on keyword distribution
   */
  private calculateNarrativeConcentration(platform: PremiumPlatformData): number {
    const keywords = platform.top_keywords;
    if (keywords.length === 0) return 0;
    
    // Simplified: assume equal distribution for now
    // In reality, would calculate actual frequency distribution
    const equalShare = 1 / keywords.length;
    const herfindahl = keywords.reduce((sum) => sum + (equalShare * equalShare), 0);
    
    // Normalize to [0,1] where 1 = high concentration
    return Math.min(1, herfindahl * keywords.length);
  }
  
  /**
   * Calculate Catalyst Proximity Score (CPS)
   * Distance to known/likely catalysts
   */
  private calculateCatalystProximity(platform: PremiumPlatformData): number {
    // Simplified: detect potential catalysts from platform data
    const catalystIndicators = [
      platform.platform === 'producthunt', // PH launches are catalysts
      platform.platform === 'github' && platform.metrics.total_forks && platform.metrics.total_forks > 10, // Active repos
      platform.representative_quotes.some(q => 
        q.text.toLowerCase().includes('launch') || 
        q.text.toLowerCase().includes('release') ||
        q.text.toLowerCase().includes('announce')
      )
    ];
    
    const catalystCount = catalystIndicators.filter(Boolean).length;
    return Math.min(1, catalystCount / 3);
  }
  
  /**
   * Calculate Mispricing Gap (MG)
   * Composite arbitrage opportunity score
   */
  private calculateMispricingGap(metrics: {
    attention_imbalance: number;
    lag_minutes: number;
    influencer_momentum: number;
    catalyst_proximity: number;
  }): number {
    const { attention_imbalance, lag_minutes, influencer_momentum, catalyst_proximity } = metrics;
    
    // Normalize lag to [0,1] (higher lag = higher gap)
    const normalizedLag = Math.min(1, lag_minutes / 1440); // 24 hours max
    
    // Weighted composite
    const gap = (
      0.4 * attention_imbalance +
      0.3 * normalizedLag +
      0.2 * influencer_momentum +
      0.1 * catalyst_proximity
    );
    
    return Math.min(1, Math.max(0, gap));
  }
  
  /**
   * Classify Edge Type
   */
  private classifyEdgeType(
    platform: PremiumPlatformData,
    metrics: {
      attention_imbalance: number;
      catalyst_proximity: number;
      sentiment_velocity: number;
    }
  ): 'content' | 'distribution' | 'product' | 'none' {
    const { attention_imbalance, catalyst_proximity, sentiment_velocity } = metrics;
    
    // Content arbitrage: high attention imbalance + positive sentiment
    if (attention_imbalance > 0.6 && sentiment_velocity > 0.2) {
      return 'content';
    }
    
    // Product arbitrage: high catalyst proximity + platform-specific signals
    if (catalyst_proximity > 0.5 && ['github', 'producthunt', 'stackoverflow'].includes(platform.platform)) {
      return 'product';
    }
    
    // Distribution arbitrage: moderate signals across multiple factors
    if (attention_imbalance > 0.4 && catalyst_proximity > 0.3) {
      return 'distribution';
    }
    
    return 'none';
  }
  
  /**
   * Calculate confidence in metrics
   */
  private calculateConfidence(platform: PremiumPlatformData): number {
    const factors = [
      platform.metrics.volume > 5 ? 1 : 0, // Sufficient volume
      platform.representative_quotes.length > 0 ? 1 : 0, // Has quotes
      platform.top_keywords.length >= 3 ? 1 : 0, // Sufficient keywords
      platform.sentiment.positive + platform.sentiment.negative > 0.5 ? 1 : 0 // Clear sentiment
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }
  
  /**
   * Calculate Platform-level SAR
   */
  private calculatePlatformSAR(metrics: SocialArbitrageMetrics): number {
    const sar = 100 * (
      0.30 * metrics.mispricing_gap +
      0.20 * metrics.influencer_momentum +
      0.15 * Math.max(0, metrics.sentiment_velocity) +
      0.15 * metrics.catalyst_proximity +
      0.10 * (1 - metrics.narrative_concentration) +
      0.10 * metrics.attention_imbalance
    );
    
    return Math.round(Math.min(100, Math.max(0, sar)));
  }
  
  /**
   * Generate arbitrage catalysts
   */
  generateCatalysts(platform: PremiumPlatformData): ArbitrageCatalyst[] {
    const catalysts: ArbitrageCatalyst[] = [];
    
    // Platform-specific catalyst detection
    if (platform.platform === 'producthunt') {
      catalysts.push({
        type: 'ph_launch',
        eta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
        likelihood: 0.7,
        description: 'Potential Product Hunt launch window'
      });
    }
    
    if (platform.platform === 'github' && platform.metrics.total_forks && platform.metrics.total_forks > 5) {
      catalysts.push({
        type: 'gh_release',
        eta: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks
        likelihood: 0.6,
        description: 'Active repository suggests upcoming release'
      });
    }
    
    return catalysts;
  }
  
  /**
   * Generate arbitrage plays
   */
  generatePlays(
    platform: PremiumPlatformData, 
    metrics: SocialArbitrageMetrics
  ): ArbitragePlay[] {
    const plays: ArbitragePlay[] = [];
    
    // Content arbitrage play
    if (metrics.edge_type === 'content' && metrics.mispricing_gap > 0.5) {
      plays.push({
        type: 'content',
        where: 'googlenews',
        why: `High attention imbalance (${(metrics.attention_imbalance * 100).toFixed(0)}%) before mainstream coverage`,
        cta: 'Publish explainer content within 48h targeting news outlets',
        urgency: 'high',
        estimated_window_hours: 48
      });
    }
    
    // Distribution arbitrage play
    if (metrics.edge_type === 'distribution' && metrics.catalyst_proximity > 0.4) {
      plays.push({
        type: 'distribution',
        where: platform.platform === 'reddit' ? 'hackernews' : 'reddit',
        why: `Cross-platform lag of ${metrics.lag_minutes} minutes detected`,
        cta: 'Cross-post with platform-specific angle',
        urgency: 'medium',
        estimated_window_hours: Math.max(24, metrics.lag_minutes / 60)
      });
    }
    
    // Product arbitrage play
    if (metrics.edge_type === 'product' && platform.platform === 'stackoverflow') {
      const unsolvedQuestions = platform.representative_quotes.filter(q => 
        q.text.toLowerCase().includes('how to') || 
        q.text.toLowerCase().includes('help')
      ).length;
      
      if (unsolvedQuestions > 0) {
        plays.push({
          type: 'product',
          where: 'producthunt',
          why: `${unsolvedQuestions} unsolved questions indicate feature gap`,
          cta: 'Build micro-feature addressing top pain point',
          urgency: 'medium',
          estimated_window_hours: 168 // 1 week
        });
      }
    }
    
    return plays;
  }
  
  /**
   * Calculate arbitrage horizon (days until mainstream adoption)
   */
  calculateArbitrageHorizon(platforms: PremiumPlatformData[]): number {
    const avgLag = platforms.reduce((sum, p) => {
      const metrics = this.calculateArbitrageMetrics(p, platforms);
      return sum + metrics.lag_minutes;
    }, 0) / platforms.length;
    
    // Convert minutes to days, with minimum 1 day
    return Math.max(1, Math.round(avgLag / (24 * 60)));
  }
  
  /**
   * Calculate decay half-life (how fast the arbitrage opportunity fades)
   */
  calculateDecayHalfLife(platforms: PremiumPlatformData[]): number {
    const avgConcentration = platforms.reduce((sum, p) => {
      const metrics = this.calculateArbitrageMetrics(p, platforms);
      return sum + metrics.narrative_concentration;
    }, 0) / platforms.length;
    
    // Higher concentration = faster decay
    // Lower concentration = slower decay
    const baseDays = 7; // 1 week base
    const concentrationMultiplier = 1 - avgConcentration; // Inverse relationship
    
    return Math.max(1, Math.round(baseDays * concentrationMultiplier));
  }
}

export const arbitrageMetricsService = new ArbitrageMetricsService();
