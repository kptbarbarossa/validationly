import {
  PainExtractionRequest,
  PainExtractionResult,
  PainCluster,
  PainMention,
  PainCategory,
  PersonaType,
  PERSONA_WEIGHTS,
  PremiumPlatformDataWithArbitrage,
  UserPlan
} from '../types';
import { PremiumPlatformScannerService } from './platformScannerService';

export class PainExtractorService {
  private platformScanner = new PremiumPlatformScannerService();

  /**
   * Extract pain patterns for a specific ICP persona
   */
  async extractPainPatterns(request: PainExtractionRequest): Promise<PainExtractionResult> {
    console.log(`🔍 Extracting pain patterns for ${request.persona}: "${request.query}"`);
    
    try {
      // 1. Scan platforms for pain-related content
      const platformData = await this.scanPainData(request);
      
      // 2. Extract pain mentions from platform data
      const painMentions = await this.extractPainMentions(platformData, request.query);
      
      // 3. Cluster similar pain mentions
      const painClusters = await this.clusterPainMentions(painMentions, request.persona);
      
      // 4. Score and rank pain clusters
      const rankedClusters = this.scoreAndRankPains(painClusters, request.persona);
      
      // 5. Generate actionable insights
      const enrichedClusters = await this.enrichWithActions(rankedClusters, request.query);
      
      // 6. Generate summary and copy hooks
      const summary = this.generatePainSummary(enrichedClusters, request.persona);
      
      // 7. Generate social posts
      const socialPosts = this.generateSocialPosts(enrichedClusters, request.query);
      
      const result: PainExtractionResult = {
        query: request.query,
        persona: request.persona,
        time_range: request.time_range,
        language: request.language || 'en',
        summary,
        pain_clusters: enrichedClusters,
        social_posts,
        filters: {
          taxonomy: this.getTopTaxonomies(enrichedClusters),
          platforms: this.getActivePlatforms(platformData)
        },
        notes: [
          'APIs/RSS only. No scraping.',
          'Pain scores use persona-weighted taxonomy.',
          'Copy hooks optimized for conversion messaging.'
        ]
      };
      
      console.log(`✅ Pain extraction completed: ${enrichedClusters.length} clusters, confidence: ${summary.confidence}`);
      return result;
      
    } catch (error) {
      console.error('Error extracting pain patterns:', error);
      throw new Error(`Failed to extract pains: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scan platform data focusing on pain/complaint signals
   */
  private async scanPainData(request: PainExtractionRequest): Promise<PremiumPlatformDataWithArbitrage[]> {
    const scanRequest = {
      query: `${request.query} problems issues complaints pain points`,
      platforms: ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'] as const,
      time_range: this.getTimeRangeString(request.time_range),
      max_items_per_platform: 150,
      language: request.language || 'en',
      tones_for_posts: ['analytical', 'complaint'] as const,
      output_format: 'detailed' as const
    };

    return await this.platformScanner.scanAllPlatforms(scanRequest, request.user_plan || 'free');
  }

  /**
   * Extract pain mentions from platform content using pattern matching
   */
  private async extractPainMentions(
    platformData: PremiumPlatformDataWithArbitrage[], 
    query: string
  ): Promise<PainMention[]> {
    const mentions: PainMention[] = [];
    
    // Pain detection patterns
    const painPatterns = {
      Functional: [
        /doesn't work|not working|broken|missing feature|can't do|unable to/i,
        /need.*feature|wish.*had|would love.*to/i,
        /lacks|doesn't have|no way to|impossible to/i
      ],
      Integration: [
        /api.*fail|integration.*broken|doesn't connect/i,
        /sync.*issue|compatibility.*problem|won't work with/i,
        /webhook.*down|third.*party.*error/i
      ],
      Performance: [
        /slow|laggy|takes forever|timeout|crashes/i,
        /performance.*issue|speed.*problem|hangs|freezes/i,
        /memory.*leak|cpu.*high|resource.*usage/i
      ],
      UX: [
        /confusing|hard to use|complicated|unintuitive/i,
        /user.*experience|ux.*terrible|design.*bad/i,
        /navigation.*mess|interface.*clunky/i
      ],
      Onboarding: [
        /setup.*difficult|getting started.*hard|onboarding.*sucks/i,
        /documentation.*poor|tutorial.*missing|no guidance/i,
        /first.*time.*user|new.*user.*confused/i
      ],
      Pricing: [
        /too expensive|overpriced|pricing.*high|can't afford/i,
        /billing.*issue|payment.*problem|subscription.*confusing/i,
        /free.*tier.*limited|need.*cheaper.*option/i
      ],
      Docs: [
        /documentation.*bad|docs.*outdated|no examples/i,
        /help.*section.*useless|support.*articles.*missing/i,
        /readme.*incomplete|wiki.*empty/i
      ],
      Security: [
        /security.*concern|privacy.*issue|data.*breach/i,
        /authentication.*broken|login.*problem|access.*denied/i,
        /encryption.*weak|vulnerable.*to/i
      ]
    };

    // Complaint/negative intent patterns
    const complaintPatterns = [
      /frustrated|annoyed|disappointed|hate|terrible/i,
      /problem|issue|bug|error|fail/i,
      /why.*doesn't|how.*broken|what.*wrong/i
    ];

    platformData.forEach(platform => {
      // Simulate pain extraction from platform content
      platform.top_keywords.forEach((keyword, index) => {
        if (index >= 5) return; // Limit to top 5 keywords per platform
        
        // Check for pain patterns
        const detectedCategories: PainCategory[] = [];
        Object.entries(painPatterns).forEach(([category, patterns]) => {
          const hasPattern = patterns.some(pattern => 
            pattern.test(keyword) || pattern.test(platform.summary)
          );
          if (hasPattern) {
            detectedCategories.push(category as PainCategory);
          }
        });

        if (detectedCategories.length > 0) {
          // Determine intent
          const isComplaint = complaintPatterns.some(pattern => 
            pattern.test(platform.summary) || pattern.test(keyword)
          );
          
          const mention: PainMention = {
            text: `${keyword}: ${platform.summary.slice(0, 100)}...`,
            platform: platform.platform,
            sentiment: platform.sentiment.negative > 0.5 ? 'negative' : 
                      platform.sentiment.positive > 0.5 ? 'positive' : 'neutral',
            intent: isComplaint ? 'complaint' : 'feature_request',
            confidence: Math.min(0.9, platform.sentiment.negative + platform.metrics.engagement),
            taxonomy: detectedCategories,
            author_karma: Math.round(platform.metrics.engagement * 1000)
          };
          
          mentions.push(mention);
        }
      });
    });

    console.log(`🔍 Extracted ${mentions.length} pain mentions from ${platformData.length} platforms`);
    return mentions;
  }

  /**
   * Cluster similar pain mentions and label them
   */
  private async clusterPainMentions(
    mentions: PainMention[], 
    persona: PersonaType
  ): Promise<PainCluster[]> {
    // Group mentions by primary taxonomy category
    const categoryGroups: Record<string, PainMention[]> = {};
    
    mentions.forEach(mention => {
      const primaryCategory = mention.taxonomy[0] || 'Functional';
      if (!categoryGroups[primaryCategory]) {
        categoryGroups[primaryCategory] = [];
      }
      categoryGroups[primaryCategory].push(mention);
    });

    const clusters: PainCluster[] = [];
    
    Object.entries(categoryGroups).forEach(([category, categoryMentions], index) => {
      if (categoryMentions.length === 0) return;

      // Calculate cluster metrics
      const freq = Math.min(1, categoryMentions.length / 20); // Normalize frequency
      const sev = categoryMentions.reduce((acc, m) => acc + (m.sentiment === 'negative' ? 1 : 0.5), 0) / categoryMentions.length;
      const urg = categoryMentions.filter(m => m.intent === 'complaint').length / categoryMentions.length;
      const imp = categoryMentions.reduce((acc, m) => acc + (m.author_karma || 0), 0) / categoryMentions.length / 1000;
      const addr = Math.random() * 0.8 + 0.2; // Placeholder for addressability
      const comp_gap = Math.random() * 0.7 + 0.3; // Placeholder for competition gap
      
      // Calculate pain and opportunity scores
      const pain_score = 100 * (0.30 * freq + 0.25 * sev + 0.20 * urg + 0.15 * imp + 0.10 * (1 - addr));
      const opp_score = 100 * (0.50 * this.normalize(pain_score, 0, 100) + 0.30 * comp_gap + 0.20 * addr);

      // Generate cluster label
      const label = this.generateClusterLabel(category as PainCategory, categoryMentions);
      
      // Get representative quotes
      const topQuotes = categoryMentions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(mention => ({
          text: mention.text.replace(/^[^:]+:\s*/, ''), // Remove keyword prefix
          platform: mention.platform,
          sentiment: mention.sentiment,
          author: mention.author_karma ? `User (${mention.author_karma} karma)` : undefined
        }));

      // Extract keywords
      const keywords = this.extractKeywords(categoryMentions);

      const cluster: PainCluster = {
        cluster_id: `pc_${String(index + 1).padStart(3, '0')}`,
        label,
        taxonomy: [category as PainCategory],
        keywords,
        metrics: {
          freq: this.clamp(freq),
          sev: this.clamp(sev),
          urg: this.clamp(urg),
          imp: this.clamp(imp),
          addr: this.clamp(addr),
          comp_gap: this.clamp(comp_gap),
          pain_score: Math.round(pain_score * 10) / 10,
          opp_score: Math.round(opp_score * 10) / 10
        },
        intent_breakdown: {
          complaint: categoryMentions.filter(m => m.intent === 'complaint').length / categoryMentions.length,
          feature_request: categoryMentions.filter(m => m.intent === 'feature_request').length / categoryMentions.length,
          question: categoryMentions.filter(m => m.intent === 'question').length / categoryMentions.length
        },
        representative_quotes: topQuotes,
        solutions_mentioned: this.findMentionedSolutions(categoryMentions),
        actions: {
          mvp_features: [],
          gtm: [],
          success_metrics: []
        }
      };

      clusters.push(cluster);
    });

    console.log(`🔗 Created ${clusters.length} pain clusters`);
    return clusters;
  }

  /**
   * Score and rank pain clusters by persona weights
   */
  private scoreAndRankPains(clusters: PainCluster[], persona: PersonaType): PainCluster[] {
    const weights = PERSONA_WEIGHTS[persona];
    
    // Apply persona weights to pain scores
    const weightedClusters = clusters.map(cluster => {
      const categoryWeight = weights[cluster.taxonomy[0]] || 0.1;
      const weightedPainScore = cluster.metrics.pain_score * categoryWeight * 10; // Amplify by category importance
      const weightedOppScore = cluster.metrics.opp_score * categoryWeight * 10;
      
      return {
        ...cluster,
        metrics: {
          ...cluster.metrics,
          pain_score: Math.min(100, Math.round(weightedPainScore * 10) / 10),
          opp_score: Math.min(100, Math.round(weightedOppScore * 10) / 10)
        }
      };
    });

    // Sort by pain score descending
    return weightedClusters.sort((a, b) => b.metrics.pain_score - a.metrics.pain_score);
  }

  /**
   * Enrich clusters with actionable insights
   */
  private async enrichWithActions(clusters: PainCluster[], query: string): Promise<PainCluster[]> {
    return clusters.map(cluster => {
      const category = cluster.taxonomy[0];
      const actions = this.generateActions(category, cluster.label, query);
      
      return {
        ...cluster,
        actions
      };
    });
  }

  /**
   * Generate actionable insights based on pain category
   */
  private generateActions(category: PainCategory, painLabel: string, query: string) {
    const actionTemplates = {
      Functional: {
        mvp_features: [`Core ${painLabel} functionality`, `Advanced ${painLabel} options`, `${painLabel} automation`],
        gtm: [`Feature comparison content`, `Demo videos for ${painLabel}`, `Case studies solving ${painLabel}`],
        success_metrics: [`Feature adoption rate`, `User satisfaction score`, `Support ticket reduction`]
      },
      Integration: {
        mvp_features: [`Native ${painLabel} integration`, `API endpoints for ${painLabel}`, `Webhook support`],
        gtm: [`Integration marketplace listing`, `Developer documentation`, `Partner co-marketing`],
        success_metrics: [`API usage metrics`, `Integration success rate`, `Developer onboarding time`]
      },
      Performance: {
        mvp_features: [`Performance optimization`, `Caching layer`, `Load balancing`],
        gtm: [`Performance benchmark content`, `Speed comparison demos`, `Technical blog posts`],
        success_metrics: [`Page load time`, `System uptime`, `User retention`]
      },
      UX: {
        mvp_features: [`Redesigned ${painLabel} flow`, `User onboarding wizard`, `Contextual help`],
        gtm: [`UX case studies`, `Design system showcase`, `User testimonials`],
        success_metrics: [`Task completion rate`, `User onboarding time`, `Support requests`]
      },
      Onboarding: {
        mvp_features: [`Interactive tutorial`, `Quick setup wizard`, `Template library`],
        gtm: [`Onboarding success stories`, `Time-to-value content`, `Comparison guides`],
        success_metrics: [`Activation rate`, `Time to first value`, `Trial conversion`]
      },
      Pricing: {
        mvp_features: [`Flexible pricing tiers`, `Usage-based billing`, `Free tier expansion`],
        gtm: [`Pricing transparency content`, `ROI calculators`, `Cost comparison guides`],
        success_metrics: [`Conversion rate`, `Customer lifetime value`, `Churn rate`]
      },
      Docs: {
        mvp_features: [`Interactive documentation`, `Code examples`, `Video tutorials`],
        gtm: [`Developer content marketing`, `Community building`, `Documentation SEO`],
        success_metrics: [`Documentation usage`, `Developer satisfaction`, `Support deflection`]
      },
      Security: {
        mvp_features: [`Enhanced security features`, `Compliance certifications`, `Audit logging`],
        gtm: [`Security-first messaging`, `Compliance content`, `Trust signals`],
        success_metrics: [`Security incident rate`, `Compliance score`, `Enterprise adoption`]
      }
    };

    return actionTemplates[category] || actionTemplates.Functional;
  }

  /**
   * Generate pain summary with copy hooks
   */
  private generatePainSummary(clusters: PainCluster[], persona: PersonaType) {
    const topPains = clusters.slice(0, 3).map(cluster => ({
      label: cluster.label,
      pain_score: cluster.metrics.pain_score,
      opp_score: cluster.metrics.opp_score,
      why: [
        `High frequency: ${Math.round(cluster.metrics.freq * 100)}% of mentions`,
        `Severe impact: ${Math.round(cluster.metrics.sev * 100)}% negative sentiment`,
        `Growing urgency: ${Math.round(cluster.metrics.urg * 100)}% complaints`
      ],
      quick_wins: cluster.actions.mvp_features.slice(0, 2),
      copy_hooks: this.generateCopyHooks(cluster)
    }));

    return {
      top_pains: topPains,
      persona_hint: persona,
      confidence: Math.min(0.95, clusters.reduce((acc, c) => acc + c.metrics.freq, 0) / clusters.length)
    };
  }

  /**
   * Generate marketing copy hooks from pain insights
   */
  private generateCopyHooks(cluster: PainCluster): string[] {
    const category = cluster.taxonomy[0];
    const painLabel = cluster.label.toLowerCase();
    
    const hookTemplates = {
      Functional: [
        `Finally, a solution that actually handles ${painLabel}`,
        `Stop struggling with ${painLabel} - we've got you covered`,
        `${painLabel}? Solved in minutes, not hours`
      ],
      Integration: [
        `Seamless ${painLabel} integration - no more headaches`,
        `Connect everything. ${painLabel} made simple.`,
        `One-click ${painLabel} setup. Really.`
      ],
      Performance: [
        `10x faster ${painLabel}. Your users will notice.`,
        `Say goodbye to slow ${painLabel} forever`,
        `Lightning-fast ${painLabel} that actually works`
      ],
      UX: [
        `${painLabel} shouldn't be this hard. Now it isn't.`,
        `Beautiful ${painLabel} that users actually love`,
        `Intuitive ${painLabel} - no training required`
      ],
      Onboarding: [
        `Get started in 60 seconds, not 60 minutes`,
        `Zero-friction onboarding. Start creating immediately.`,
        `Setup so easy, your grandma could do it`
      ],
      Pricing: [
        `Fair pricing that scales with your success`,
        `Start free. Upgrade when you're ready.`,
        `Transparent pricing. No hidden fees. Ever.`
      ],
      Docs: [
        `Documentation that developers actually read`,
        `Clear guides, real examples, instant answers`,
        `Everything you need to know, right when you need it`
      ],
      Security: [
        `Enterprise security without the enterprise complexity`,
        `Your data, protected by default`,
        `Security-first design you can trust`
      ]
    };

    return hookTemplates[category] || hookTemplates.Functional;
  }

  /**
   * Generate social posts based on pain insights
   */
  private generateSocialPosts(clusters: PainCluster[], query: string) {
    const topPain = clusters[0];
    if (!topPain) {
      return {
        twitter: { tone: 'analytical', text: `No significant pain patterns found for ${query}` },
        reddit: { title: `${query} - What's your biggest challenge?`, body: 'Looking for insights on common pain points.' },
        linkedin: { tone: 'professional', text: `Researching ${query} challenges.`, cta: 'Share your experience' }
      };
    }

    const painLabel = topPain.label;
    const painScore = Math.round(topPain.metrics.pain_score);

    return {
      twitter: {
        tone: 'analytical',
        text: `Top pain we keep hearing: ${painLabel}. Seeing ${painScore}% severity across platforms. Quick wins: ${topPain.actions.mvp_features[0]}. What's your experience?`
      },
      reddit: {
        title: `What makes ${painLabel} so frustrating?`,
        body: `- ${topPain.representative_quotes[0]?.text || 'Common complaint pattern'}\n- High impact on user experience\n- ${topPain.actions.mvp_features[0]}\n\nWhich solution would help the most?`
      },
      linkedin: {
        tone: 'professional',
        text: `${query} teams cite ${painLabel} as a major blocker. Our analysis shows ${painScore}% pain severity. Quick wins: ${topPain.actions.mvp_features.slice(0, 2).join(', ')}. What's worked best for your team?`,
        cta: 'Share your solution'
      }
    };
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

  private generateClusterLabel(category: PainCategory, mentions: PainMention[]): string {
    const commonWords = mentions
      .flatMap(m => m.text.toLowerCase().split(/\s+/))
      .filter(word => word.length > 3)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topWord = Object.entries(commonWords)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || category.toLowerCase();

    const labelTemplates = {
      Functional: `${topWord} functionality gaps`,
      Integration: `${topWord} integration issues`,
      Performance: `${topWord} performance problems`,
      UX: `${topWord} usability concerns`,
      Onboarding: `${topWord} setup difficulties`,
      Pricing: `${topWord} pricing concerns`,
      Docs: `${topWord} documentation gaps`,
      Security: `${topWord} security issues`
    };

    return labelTemplates[category] || `${topWord} issues`;
  }

  private extractKeywords(mentions: PainMention[]): string[] {
    const allText = mentions.map(m => m.text).join(' ').toLowerCase();
    const words = allText.split(/\s+/).filter(word => word.length > 3);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private findMentionedSolutions(mentions: PainMention[]): Array<{type: 'producthunt' | 'github' | 'other'; name: string; url: string}> {
    // Placeholder for solution detection
    const solutions = [];
    if (mentions.some(m => m.platform === 'github')) {
      solutions.push({
        type: 'github' as const,
        name: 'example-solution',
        url: '#'
      });
    }
    return solutions;
  }

  private getTopTaxonomies(clusters: PainCluster[]): PainCategory[] {
    const taxonomyCounts = clusters.reduce((acc, cluster) => {
      cluster.taxonomy.forEach(tax => {
        acc[tax] = (acc[tax] || 0) + 1;
      });
      return acc;
    }, {} as Record<PainCategory, number>);

    return Object.entries(taxonomyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tax]) => tax as PainCategory);
  }

  private getActivePlatforms(platformData: PremiumPlatformDataWithArbitrage[]): string[] {
    return platformData.map(p => p.platform);
  }

  private normalize(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  private clamp(value: number, min: number = 0, max: number = 1): number {
    return Math.max(min, Math.min(max, value));
  }
}

export const painExtractorService = new PainExtractorService();
