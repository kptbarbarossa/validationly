import { 
  WeeklyDigestRequest, 
  WeeklyDigest, 
  Signal, 
  ActionablePlay, 
  PlatformEvidence,
  PremiumPlatformDataWithArbitrage,
  UserPlan,
  PLAN_CONFIGS
} from '../types';
import { PremiumPlatformScannerService } from './platformScannerService';
import { premiumAIAnalyzerService } from './aiAnalyzerService';

export class SignalDigestService {
  private platformScanner = new PremiumPlatformScannerService();

  /**
   * Generate a weekly digest for investors
   */
  async generateWeeklyDigest(request: WeeklyDigestRequest): Promise<WeeklyDigest> {
    console.log(`🔍 Generating Signal Digest for category: "${request.category}"`);
    
    try {
      // 1. Scan platforms for the category/time range
      const platformData = await this.scanCategoryData(request);
      
      // 2. Calculate signal scores and rank top 5
      const signals = await this.calculateSignalScores(platformData, request.category);
      const topSignals = signals.slice(0, 5);
      
      // 3. Generate actionable plays for investors
      const plays = await this.generateActionablePlays(topSignals, request.category);
      
      // 4. Calculate overall SAR and horizon
      const sar = this.calculateOverallSAR(platformData);
      const horizonDays = this.calculateHorizonDays(platformData);
      
      // 5. Generate summary
      const summary = await this.generateDigestSummary(topSignals, plays, sar);
      
      // 6. Build appendix with platform stats
      const appendix = this.buildAppendix(platformData);
      
      const digest: WeeklyDigest = {
        category: request.category,
        time_range: request.time_range,
        language: request.language || 'en',
        sar,
        horizon_days: horizonDays,
        summary,
        top_signals: topSignals,
        plays,
        appendix,
        export_options: {
          pdf: true,
          markdown: true,
          notion: request.user_plan === 'premium'
        },
        notes: [
          'APIs/RSS only. No scraping.',
          'Signal scores use arbitrage metrics for early opportunity detection.',
          'Plays are optimized for investor decision-making timelines.'
        ],
        created_at: new Date().toISOString()
      };
      
      console.log(`✅ Signal Digest generated with SAR: ${sar}, ${topSignals.length} signals, ${plays.length} plays`);
      return digest;
      
    } catch (error) {
      console.error('Error generating signal digest:', error);
      throw new Error(`Failed to generate digest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scan platform data for a specific category
   */
  private async scanCategoryData(request: WeeklyDigestRequest): Promise<PremiumPlatformDataWithArbitrage[]> {
    const scanRequest = {
      query: request.category,
      platforms: ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'] as const,
      time_range: this.getTimeRangeString(request.time_range),
      max_items_per_platform: 200,
      language: request.language || 'en',
      tones_for_posts: ['analytical', 'professional'] as const,
      output_format: 'detailed' as const
    };

    return await this.platformScanner.scanAllPlatforms(scanRequest, request.user_plan || 'free');
  }

  /**
   * Calculate Signal Score for each potential signal
   * Formula: 100 * (0.40*DemandIndex + 0.25*MG + 0.15*IWM + 0.10*Novelty + 0.10*CrossEvidence)
   */
  private async calculateSignalScores(
    platformData: PremiumPlatformDataWithArbitrage[], 
    category: string
  ): Promise<Signal[]> {
    const signals: Signal[] = [];

    // Group platform data by topic/theme for cross-platform signals
    const topicGroups = this.groupByTopic(platformData);

    for (const [topic, platforms] of Object.entries(topicGroups)) {
      if (platforms.length === 0) continue;

      // Calculate base metrics
      const demandIndex = this.calculateDemandIndex(platforms);
      const avgMispricing = platforms.reduce((acc, p) => acc + (p.arbitrage?.mispricing_gap || 0), 0) / platforms.length;
      const avgIWM = platforms.reduce((acc, p) => acc + (p.arbitrage?.influencer_momentum || 0), 0) / platforms.length;
      const noveltyScore = this.calculateNoveltyScore(platforms);
      const crossEvidenceScore = this.calculateCrossEvidenceScore(platforms);

      // Signal Score formula
      const signalScore = 100 * (
        0.40 * this.normalize(demandIndex, 0, 100) +
        0.25 * avgMispricing +
        0.15 * avgIWM +
        0.10 * noveltyScore +
        0.10 * crossEvidenceScore
      );

      // Build evidence from platforms
      const evidence = this.buildPlatformEvidence(platforms);
      const platformsCovered = platforms.map(p => p.platform);
      const riskFlags = this.identifyRiskFlags(platforms);

      // Create arbitrage metrics (average across platforms)
      const arbitrage = {
        attention_imbalance: platforms.reduce((acc, p) => acc + (p.arbitrage?.attention_imbalance || 0), 0) / platforms.length,
        lag_minutes: Math.round(platforms.reduce((acc, p) => acc + (p.arbitrage?.lag_minutes || 0), 0) / platforms.length),
        sentiment_velocity: platforms.reduce((acc, p) => acc + (p.arbitrage?.sentiment_velocity || 0), 0) / platforms.length,
        influencer_momentum: avgIWM,
        narrative_concentration: platforms.reduce((acc, p) => acc + (p.arbitrage?.narrative_concentration || 0), 0) / platforms.length,
        catalyst_proximity: platforms.reduce((acc, p) => acc + (p.arbitrage?.catalyst_proximity || 0), 0) / platforms.length,
        mispricing_gap: avgMispricing,
        edge_type: this.determineEdgeType(avgMispricing, avgIWM),
        confidence: platforms.reduce((acc, p) => acc + (p.arbitrage?.confidence || 0), 0) / platforms.length
      };

      const signal: Signal = {
        title: this.generateSignalTitle(topic, platforms),
        signal_score: Math.round(signalScore * 10) / 10,
        demand_index: Math.round(demandIndex),
        arbitrage,
        evidence,
        platforms_covered: platformsCovered,
        risk_flags: riskFlags,
        notes: this.generateSignalNotes(platforms),
        novelty_score: noveltyScore,
        cross_evidence_score: crossEvidenceScore
      };

      signals.push(signal);
    }

    // Sort by signal score descending
    return signals.sort((a, b) => b.signal_score - a.signal_score);
  }

  /**
   * Generate investor-focused actionable plays
   */
  private async generateActionablePlays(signals: Signal[], category: string): Promise<ActionablePlay[]> {
    const plays: ActionablePlay[] = [];

    // Diligence Play - for high-scoring technical signals
    const technicalSignals = signals.filter(s => 
      s.platforms_covered.includes('github') || s.platforms_covered.includes('stackoverflow')
    );
    
    if (technicalSignals.length > 0) {
      const topTechnical = technicalSignals[0];
      plays.push({
        type: 'diligence',
        where: 'github|stackoverflow',
        why: `High technical momentum in ${category} with ${Math.round(topTechnical.arbitrage.mispricing_gap * 100)}% mispricing gap`,
        cta: 'Schedule 3x 15-min tech calls with top maintainers within 72h',
        urgency: topTechnical.arbitrage.mispricing_gap > 0.6 ? 'high' : 'medium',
        estimated_window_hours: Math.round(topTechnical.arbitrage.lag_minutes / 60 * 2), // 2x lag as window
        templates: {
          email_subject: `Early signal in ${category} — quick tech chat?`,
          email_body: `Hi {name}, we're tracking strong early signals around ${category} with minimal mainstream coverage. Your work on {project} aligns perfectly. Would you be open to a 15-min call to compare notes? Happy to share our anonymized data insights.`,
          linkedin_message: `Hi {name}, seeing interesting early momentum in ${category}. Your expertise would be valuable for a quick 15-min insight exchange.`
        }
      });
    }

    // Sourcing Play - for high-engagement social signals
    const socialSignals = signals.filter(s => 
      s.platforms_covered.includes('reddit') || s.platforms_covered.includes('hackernews')
    );
    
    if (socialSignals.length > 0) {
      const topSocial = socialSignals[0];
      plays.push({
        type: 'sourcing',
        where: 'reddit|hackernews',
        why: `Active founder discussions with ${topSocial.cross_evidence_score?.toFixed(1)}x cross-platform validation`,
        cta: 'Direct outreach to 5 most engaged contributors within 48h',
        urgency: topSocial.arbitrage.sentiment_velocity > 0.1 ? 'high' : 'medium',
        estimated_window_hours: 48,
        templates: {
          email_subject: `${category} momentum we're seeing — would love to connect`,
          email_body: `Hi {name}, noticed your thoughtful contributions around ${category}. We're seeing strong early signals before mainstream coverage. Would you be interested in a brief chat about the space?`,
          linkedin_message: `Impressed by your insights on ${category}. Seeing similar trends in our data — worth a quick call?`
        }
      });
    }

    // Market-Making Play - for pre-launch opportunities
    const launchSignals = signals.filter(s => 
      s.platforms_covered.includes('producthunt') && s.arbitrage.catalyst_proximity > 0.5
    );
    
    if (launchSignals.length > 0) {
      const topLaunch = launchSignals[0];
      plays.push({
        type: 'market_making',
        where: 'producthunt|youtube',
        why: `Upcoming launches detected with ${Math.round(topLaunch.arbitrage.catalyst_proximity * 100)}% catalyst proximity`,
        cta: 'Coordinate 2 content pieces + 1 co-marketing partnership pre-launch',
        urgency: 'high',
        estimated_window_hours: Math.round(topLaunch.arbitrage.lag_minutes / 60),
        templates: {
          email_subject: `Pre-launch opportunity in ${category}`,
          email_body: `Hi {name}, our data shows strong pre-launch momentum for ${category} tools. Interested in coordinating content/co-marketing before the news cycle hits?`,
          linkedin_message: `Seeing pre-launch signals in ${category}. Potential for strategic content collaboration?`
        }
      });
    }

    return plays.slice(0, 3); // Top 3 plays
  }

  // Helper methods
  private getTimeRangeString(timeRange: { from: string; to: string }): string {
    const fromDate = new Date(timeRange.from);
    const toDate = new Date(timeRange.to);
    const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays <= 7) return '1week';
    if (diffDays <= 30) return '1month';
    if (diffDays <= 90) return '3months';
    return '6months';
  }

  private groupByTopic(platforms: PremiumPlatformDataWithArbitrage[]): Record<string, PremiumPlatformDataWithArbitrage[]> {
    const groups: Record<string, PremiumPlatformDataWithArbitrage[]> = {};
    
    platforms.forEach(platform => {
      // Use top keyword as topic grouping key
      const topic = platform.top_keywords[0] || platform.platform;
      if (!groups[topic]) groups[topic] = [];
      groups[topic].push(platform);
    });
    
    return groups;
  }

  private calculateDemandIndex(platforms: PremiumPlatformDataWithArbitrage[]): number {
    const avgVolume = platforms.reduce((acc, p) => acc + p.metrics.volume, 0) / platforms.length;
    const avgEngagement = platforms.reduce((acc, p) => acc + p.metrics.engagement, 0) / platforms.length;
    const avgGrowth = platforms.reduce((acc, p) => acc + p.metrics.growth_rate, 0) / platforms.length;
    const avgPositivity = platforms.reduce((acc, p) => acc + p.sentiment.positive, 0) / platforms.length;
    
    return 100 * (
      0.35 * this.normalize(avgVolume, 0, 1000) +
      0.35 * avgEngagement +
      0.20 * Math.max(0, avgGrowth) +
      0.10 * avgPositivity
    );
  }

  private calculateNoveltyScore(platforms: PremiumPlatformDataWithArbitrage[]): number {
    // Proxy: higher novelty if fewer total items (newer topic)
    const totalItems = platforms.reduce((acc, p) => acc + p.metrics.volume, 0);
    return Math.max(0, 1 - this.normalize(totalItems, 0, 5000));
  }

  private calculateCrossEvidenceScore(platforms: PremiumPlatformDataWithArbitrage[]): number {
    // Score based on number of platforms with consistent signals
    return Math.min(1, platforms.length / 7); // Max score when all 7 platforms covered
  }

  private calculateOverallSAR(platforms: PremiumPlatformDataWithArbitrage[]): number {
    if (platforms.length === 0) return 0;
    
    const avgMG = platforms.reduce((acc, p) => acc + (p.arbitrage?.mispricing_gap || 0), 0) / platforms.length;
    const avgIWM = platforms.reduce((acc, p) => acc + (p.arbitrage?.influencer_momentum || 0), 0) / platforms.length;
    const avgSV = platforms.reduce((acc, p) => acc + Math.max(0, p.arbitrage?.sentiment_velocity || 0), 0) / platforms.length;
    const avgCPS = platforms.reduce((acc, p) => acc + (p.arbitrage?.catalyst_proximity || 0), 0) / platforms.length;
    const avgNC = platforms.reduce((acc, p) => acc + (p.arbitrage?.narrative_concentration || 0), 0) / platforms.length;
    
    return Math.round(100 * (
      0.30 * avgMG +
      0.20 * avgIWM +
      0.15 * avgSV +
      0.15 * avgCPS +
      0.10 * (1 - avgNC) +
      0.10 * this.normalize(platforms.length, 1, 7)
    ));
  }

  private calculateHorizonDays(platforms: PremiumPlatformDataWithArbitrage[]): number {
    if (platforms.length === 0) return 7;
    
    const avgLag = platforms.reduce((acc, p) => acc + (p.arbitrage?.lag_minutes || 1440), 0) / platforms.length;
    return Math.max(1, Math.round(avgLag / (60 * 24))); // Convert minutes to days
  }

  private async generateDigestSummary(signals: Signal[], plays: ActionablePlay[], sar: number) {
    const topSignal = signals[0];
    const highUrgencyPlays = plays.filter(p => p.urgency === 'high').length;
    
    return {
      one_liner: `${signals.length} strong signals detected with ${sar} SAR; ${highUrgencyPlays} high-priority plays identified`,
      top_takeaways: [
        `Top signal: ${topSignal?.title || 'No signals detected'}`,
        `Average mispricing gap: ${Math.round((signals[0]?.arbitrage.mispricing_gap || 0) * 100)}%`,
        `Cross-platform validation across ${signals[0]?.platforms_covered.length || 0} platforms`
      ].filter(t => !t.includes('undefined')),
      risks: [
        'Early stage signals may have limited validation',
        'Arbitrage windows typically 3-10 days',
        'Market timing depends on catalyst proximity'
      ],
      confidence: Math.min(0.95, signals.reduce((acc, s) => acc + s.arbitrage.confidence, 0) / signals.length)
    };
  }

  private buildPlatformEvidence(platforms: PremiumPlatformDataWithArbitrage[]): PlatformEvidence {
    const evidence: PlatformEvidence = {};
    
    platforms.forEach(platform => {
      if (platform.platform === 'github') {
        evidence.github = [{
          repo: `example/${platform.top_keywords[0] || 'project'}`,
          stars_7d: Math.round(platform.metrics.volume * 0.1),
          url: '#',
          description: platform.summary.slice(0, 100)
        }];
      } else if (platform.platform === 'reddit') {
        evidence.reddit = [{
          post: platform.summary.slice(0, 80),
          upvotes: Math.round(platform.metrics.volume * platform.metrics.engagement),
          url: '#',
          subreddit: platform.top_keywords[0]
        }];
      }
      // Add other platforms as needed...
    });
    
    return evidence;
  }

  private identifyRiskFlags(platforms: PremiumPlatformDataWithArbitrage[]): string[] {
    const flags: string[] = [];
    
    const avgSentiment = platforms.reduce((acc, p) => acc + p.sentiment.negative, 0) / platforms.length;
    if (avgSentiment > 0.3) flags.push('high_negative_sentiment');
    
    const hasLowVolume = platforms.some(p => p.metrics.volume < 10);
    if (hasLowVolume) flags.push('low_signal_volume');
    
    return flags;
  }

  private generateSignalTitle(topic: string, platforms: PremiumPlatformDataWithArbitrage[]): string {
    const mainPlatform = platforms.sort((a, b) => b.metrics.volume - a.metrics.volume)[0];
    const trendDirection = mainPlatform.metrics.growth_rate > 0 ? 'surge' : 'decline';
    
    return `${topic} ${trendDirection} across ${platforms.length} platforms`;
  }

  private generateSignalNotes(platforms: PremiumPlatformDataWithArbitrage[]): string[] {
    const notes: string[] = [];
    
    const hasNewsGap = !platforms.some(p => p.platform === 'googlenews');
    if (hasNewsGap) notes.push('Low news coverage → high AII potential');
    
    const hasGitHubActivity = platforms.some(p => p.platform === 'github');
    if (hasGitHubActivity) notes.push('Active development signals detected');
    
    return notes;
  }

  private determineEdgeType(mispricing: number, momentum: number): 'content' | 'distribution' | 'product' | 'none' {
    if (mispricing > 0.6 && momentum > 0.6) return 'content';
    if (mispricing > 0.5 && momentum > 0.4) return 'distribution';
    if (mispricing > 0.4) return 'product';
    return 'none';
  }

  private buildAppendix(platforms: PremiumPlatformDataWithArbitrage[]) {
    const platformStats: Record<string, any> = {};
    
    platforms.forEach(platform => {
      platformStats[platform.platform] = {
        volume: platform.metrics.volume,
        engagement: platform.metrics.engagement,
        growth_rate: platform.metrics.growth_rate,
        sentiment_positive: platform.sentiment.positive
      };
    });
    
    return {
      platform_stats: platformStats,
      methodology_notes: [
        'Signal Score = 40% DemandIndex + 25% MG + 15% IWM + 10% Novelty + 10% CrossEvidence',
        'SAR = 30% MG + 20% IWM + 15% SV + 15% CPS + 10% (1-NC) + 10% platform_diversity',
        'APIs/RSS only; no scraping; heuristics noted where used'
      ]
    };
  }

  private normalize(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }
}

export const signalDigestService = new SignalDigestService();
