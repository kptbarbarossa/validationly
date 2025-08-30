import { HookSynthRequest } from '../types';

interface SocialKitVideoData {
  summary: string;
  transcript: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    engagement_rate: number;
  };
  comments_analysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    top_topics: string[];
    pain_points: string[];
  };
}

interface SocialKitResponse {
  success: boolean;
  data: SocialKitVideoData;
  processing_time: number;
}

export class SocialKitService {
  private readonly API_BASE = 'https://api.socialkit.dev';
  private readonly API_KEY = process.env.SOCIALKIT_API_KEY;

  constructor() {
    if (!this.API_KEY) {
      console.warn('⚠️ SocialKit API key not configured');
    }
  }

  /**
   * Analyze a YouTube video for hook generation insights
   */
  async analyzeVideoForHooks(videoUrl: string): Promise<SocialKitVideoData | null> {
    if (!this.API_KEY) {
      console.warn('⚠️ SocialKit API key missing, skipping analysis');
      return null;
    }

    try {
      console.log('🔍 SocialKit: Analyzing video for hook insights...', videoUrl);

      // Get video summary for content understanding
      const summaryResponse = await fetch(`${this.API_BASE}/youtube/summarize?access_key=${this.API_KEY}&url=${encodeURIComponent(videoUrl)}`);
      
      if (!summaryResponse.ok) {
        throw new Error(`SocialKit API error: ${summaryResponse.status}`);
      }

      const summaryData: SocialKitResponse = await summaryResponse.json();
      
      // Get transcript for detailed analysis
      const transcriptResponse = await fetch(`${this.API_BASE}/youtube/transcript?access_key=${this.API_KEY}&url=${encodeURIComponent(videoUrl)}`);
      const transcriptData = transcriptResponse.ok ? await transcriptResponse.json() : null;

      // Get stats for performance context
      const statsResponse = await fetch(`${this.API_BASE}/youtube/stats?access_key=${this.API_KEY}&url=${encodeURIComponent(videoUrl)}`);
      const statsData = statsResponse.ok ? await statsResponse.json() : null;

      // Get comments for audience insights
      const commentsResponse = await fetch(`${this.API_BASE}/youtube/comments?access_key=${this.API_KEY}&url=${encodeURIComponent(videoUrl)}`);
      const commentsData = commentsResponse.ok ? await commentsResponse.json() : null;

      const result: SocialKitVideoData = {
        summary: summaryData.data?.summary || '',
        transcript: transcriptData?.data?.transcript || '',
        stats: {
          views: statsData?.data?.views || 0,
          likes: statsData?.data?.likes || 0,
          comments: statsData?.data?.comments || 0,
          engagement_rate: this.calculateEngagementRate(statsData?.data)
        },
        comments_analysis: {
          sentiment: this.analyzeSentiment(commentsData?.data?.comments),
          top_topics: this.extractTopics(commentsData?.data?.comments),
          pain_points: this.extractPainPoints(commentsData?.data?.comments)
        }
      };

      console.log('✅ SocialKit analysis completed successfully');
      return result;

    } catch (error) {
      console.error('❌ SocialKit analysis failed:', error);
      return null;
    }
  }

  /**
   * Generate enhanced hooks using SocialKit insights
   */
  async generateEnhancedHooks(request: HookSynthRequest, competitorVideos: string[]): Promise<string[]> {
    const insights: SocialKitVideoData[] = [];

    // Analyze competitor videos
    for (const videoUrl of competitorVideos.slice(0, 3)) { // Limit to 3 videos
      const analysis = await this.analyzeVideoForHooks(videoUrl);
      if (analysis) insights.push(analysis);
    }

    if (insights.length === 0) return [];

    // Extract successful patterns
    const successfulHooks = this.extractSuccessfulHookPatterns(insights);
    
    // Generate category-specific hooks based on insights
    return this.generateHooksFromInsights(request, successfulHooks, insights);
  }

  /**
   * Calculate engagement rate from stats
   */
  private calculateEngagementRate(stats: any): number {
    if (!stats || !stats.views) return 0;
    const totalEngagement = (stats.likes || 0) + (stats.comments || 0);
    return (totalEngagement / stats.views) * 100;
  }

  /**
   * Analyze sentiment from comments
   */
  private analyzeSentiment(comments: any[]): 'positive' | 'neutral' | 'negative' {
    if (!comments || comments.length === 0) return 'neutral';
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['great', 'amazing', 'love', 'awesome', 'perfect', 'excellent'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'worst', 'disappointing'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    comments.forEach(comment => {
      const text = comment.text?.toLowerCase() || '';
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
    });
    
    if (positiveCount > negativeCount * 1.5) return 'positive';
    if (negativeCount > positiveCount * 1.5) return 'negative';
    return 'neutral';
  }

  /**
   * Extract top topics from comments
   */
  private extractTopics(comments: any[]): string[] {
    if (!comments || comments.length === 0) return [];
    
    // Extract common keywords/topics
    const topicKeywords = new Map<string, number>();
    
    comments.forEach(comment => {
      const text = comment.text?.toLowerCase() || '';
      const words = text.split(/\s+/).filter(word => word.length > 3);
      
      words.forEach(word => {
        topicKeywords.set(word, (topicKeywords.get(word) || 0) + 1);
      });
    });
    
    return Array.from(topicKeywords.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  /**
   * Extract pain points from comments
   */
  private extractPainPoints(comments: any[]): string[] {
    if (!comments || comments.length === 0) return [];
    
    const painIndicators = ['problem', 'issue', 'difficult', 'hard', 'struggle', 'challenge', 'confusing'];
    const painPoints: string[] = [];
    
    comments.forEach(comment => {
      const text = comment.text?.toLowerCase() || '';
      painIndicators.forEach(indicator => {
        if (text.includes(indicator)) {
          painPoints.push(comment.text);
        }
      });
    });
    
    return painPoints.slice(0, 3); // Top 3 pain points
  }

  /**
   * Extract successful hook patterns from analyzed videos
   */
  private extractSuccessfulHookPatterns(insights: SocialKitVideoData[]): string[] {
    const patterns: string[] = [];
    
    insights.forEach(insight => {
      if (insight.stats.engagement_rate > 2.0) { // High engagement videos
        // Extract first sentences from transcript as successful hooks
        const sentences = insight.transcript.split(/[.!?]+/).slice(0, 3);
        patterns.push(...sentences.filter(s => s.length > 10 && s.length < 100));
      }
    });
    
    return patterns;
  }

  /**
   * Generate hooks from SocialKit insights
   */
  private generateHooksFromInsights(
    request: HookSynthRequest, 
    successfulHooks: string[], 
    insights: SocialKitVideoData[]
  ): string[] {
    const hooks: string[] = [];
    
    // Generate hooks based on successful patterns
    successfulHooks.forEach(pattern => {
      const adaptedHook = this.adaptHookToCategory(pattern, request.category);
      if (adaptedHook) hooks.push(adaptedHook);
    });
    
    // Generate hooks based on pain points
    insights.forEach(insight => {
      insight.comments_analysis.pain_points.forEach(painPoint => {
        const hookFromPain = this.generateHookFromPainPoint(painPoint, request.category);
        if (hookFromPain) hooks.push(hookFromPain);
      });
    });
    
    return hooks.slice(0, 5); // Return top 5 enhanced hooks
  }

  /**
   * Adapt a successful hook pattern to our category
   */
  private adaptHookToCategory(pattern: string, category: string): string | null {
    // Simple pattern adaptation logic
    const cleaned = pattern.trim();
    if (cleaned.length < 10) return null;
    
    // Replace generic terms with category-specific terms
    return cleaned
      .replace(/\b(this|that|it)\b/gi, category)
      .replace(/\b(thing|stuff|item)\b/gi, category)
      .substring(0, 80); // Limit length
  }

  /**
   * Generate hook from pain point
   */
  private generateHookFromPainPoint(painPoint: string, category: string): string | null {
    if (!painPoint || painPoint.length < 10) return null;
    
    // Generate question-based hooks from pain points
    const templates = [
      `Struggling with ${category}? Here's why...`,
      `Why ${category} isn't working for you`,
      `The ${category} mistake everyone makes`,
      `Stop doing ${category} wrong!`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

export const socialKitService = new SocialKitService();
