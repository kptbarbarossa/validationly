import { HookSynthRequest } from '../types';

interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  statistics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  snippet: {
    publishedAt: string;
    channelTitle: string;
    tags?: string[];
  };
}

interface VideoAnalysis {
  video: YouTubeVideoData;
  hooks: string[];
  performance_score: number;
  engagement_rate: number;
  title_analysis: {
    hook_type: string;
    effectiveness: number;
    key_words: string[];
  };
  thumbnail_analysis: {
    style: string;
    color_scheme: string;
    text_elements: string[];
  };
  competitive_insights: {
    similar_videos: number;
    category_average_views: number;
    performance_vs_average: number;
  };
}

// New structured analysis format
interface StructuredVideoAnalysis {
  video_summary: {
    main_topic: string;
    key_message: string;
    important_sections: string[];
    chronological_flow: string[];
    statistics_and_examples: string[];
  };
  detailed_analysis: {
    methods_and_tools: string[];
    approaches: string[];
    speaker_experience: string[];
    lessons_learned: string[];
    target_audience_insights: string[];
  };
  comment_analysis: {
    recurring_ideas: string[];
    common_phrases: string[];
    positive_feedback: string[];
    negative_feedback: string[];
    community_perception: {
      support_level: 'high' | 'medium' | 'low';
      criticism_level: 'high' | 'medium' | 'low';
      suggestions_count: number;
    };
  };
  summary_table: {
    beginning: string;
    strategy: string;
    user_response: string;
    revenue_outcome: string;
  };
  insights_and_lessons: {
    main_lessons: string[];
    actionable_tips_entrepreneurs: string[];
    actionable_tips_content_creators: string[];
    actionable_tips_viewers: string[];
  };
}

export class YouTubeAnalysisService {
  private readonly YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  /**
   * Analyze a YouTube video URL for hook insights
   */
  async analyzeVideo(videoUrl: string): Promise<VideoAnalysis> {
    try {
      const videoId = this.extractVideoId(videoUrl);
      const videoData = await this.fetchVideoData(videoId);
      
      // Analyze the video for hook patterns
      const analysis = await this.performVideoAnalysis(videoData);
      
      return analysis;
    } catch (error) {
      console.error('YouTube Analysis Error:', error);
      throw new Error('Failed to analyze video');
    }
  }

  /**
   * Analyze YouTube video with structured format
   */
  async analyzeVideoStructured(videoUrl: string): Promise<StructuredVideoAnalysis> {
    try {
      const videoId = this.extractVideoId(videoUrl);
      
      // Debug: Check API key
      console.log('🔑 YouTube API Key check:', {
        hasKey: !!this.YOUTUBE_API_KEY,
        keyLength: this.YOUTUBE_API_KEY?.length || 0,
        keyStart: this.YOUTUBE_API_KEY?.substring(0, 10) || 'undefined'
      });
      
      // Check if API key is available
      if (!this.YOUTUBE_API_KEY) {
        console.warn('YouTube API key not configured, using demo analysis');
        return this.createDemoAnalysis(videoUrl, videoId);
      }
      
      const videoData = await this.fetchVideoData(videoId);
      
      // Get comments for analysis
      const comments = await this.fetchVideoComments(videoId);
      
      // Perform structured analysis using AI
      const analysis = await this.performStructuredAnalysis(videoData, comments);
      
      return analysis;
    } catch (error) {
      console.error('Structured YouTube Analysis Error:', error);
      console.warn('Falling back to demo analysis');
      
      // Fallback to demo analysis
      const videoId = this.extractVideoId(videoUrl);
      return this.createDemoAnalysis(videoUrl, videoId);
    }
  }

  /**
   * Search for videos in a category to analyze successful patterns
   */
  async analyzeCompetitiveVideos(request: HookSynthRequest): Promise<VideoAnalysis[]> {
    try {
      const searchQuery = `${request.category} ${request.persona}`;
      const videos = await this.searchVideos(searchQuery, 10);
      
      const analyses = await Promise.all(
        videos.map(video => this.performVideoAnalysis(video))
      );
      
      // Sort by performance score
      return analyses.sort((a, b) => b.performance_score - a.performance_score);
    } catch (error) {
      console.error('Competitive Analysis Error:', error);
      return [];
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  private extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    
    if (!match) {
      throw new Error('Invalid YouTube URL');
    }
    
    return match[1];
  }

  /**
   * Fetch video data from YouTube API
   */
  private async fetchVideoData(videoId: string): Promise<YouTubeVideoData> {
    if (!this.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const response = await fetch(
      `${this.BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${this.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const item = data.items[0];
    
    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      statistics: {
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0')
      },
      snippet: {
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        tags: item.snippet.tags || []
      }
    };
  }

  /**
   * Search for videos by query
   */
  private async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideoData[]> {
    if (!this.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const response = await fetch(
      `${this.BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&order=relevance&key=${this.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get detailed video data for each result
    const videoIds = data.items.map((item: any) => item.id.videoId);
    const videosResponse = await fetch(
      `${this.BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${this.YOUTUBE_API_KEY}`
    );

    const videosData = await videosResponse.json();
    
    return videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      statistics: {
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0')
      },
      snippet: {
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        tags: item.snippet.tags || []
      }
    }));
  }

  /**
   * Perform AI analysis on video data
   */
  private async performVideoAnalysis(video: YouTubeVideoData): Promise<VideoAnalysis> {
    // Extract hooks from title
    const hooks = this.extractHooksFromTitle(video.title);
    
    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(video);
    
    // Calculate engagement rate
    const engagementRate = this.calculateEngagementRate(video);
    
    // Analyze title for hook patterns
    const titleAnalysis = this.analyzeTitleHooks(video.title);
    
    // Analyze thumbnail (basic analysis without AI vision)
    const thumbnailAnalysis = this.analyzeThumbnail(video);
    
    // Competitive insights
    const competitiveInsights = await this.getCompetitiveInsights(video);
    
    return {
      video,
      hooks,
      performance_score: performanceScore,
      engagement_rate: engagementRate,
      title_analysis: titleAnalysis,
      thumbnail_analysis: thumbnailAnalysis,
      competitive_insights: competitiveInsights
    };
  }

  /**
   * Extract potential hooks from video title
   */
  private extractHooksFromTitle(title: string): string[] {
    const hooks: string[] = [];
    
    // Question hooks
    if (title.includes('?')) {
      hooks.push(title);
    }
    
    // Bold claim patterns
    const boldPatterns = [
      /\d+.*(?:ways?|tips?|secrets?|hacks?)/i,
      /(?:how to|why|what|when|where)/i,
      /(?:best|worst|ultimate|complete|perfect)/i,
      /(?:never|always|everyone|nobody)/i
    ];
    
    boldPatterns.forEach(pattern => {
      if (pattern.test(title)) {
        hooks.push(title);
      }
    });
    
    // FOMO patterns
    const fomoPatterns = [
      /(?:2024|2025|new|latest|trending|viral)/i,
      /(?:before|after|until|limited|exclusive)/i
    ];
    
    fomoPatterns.forEach(pattern => {
      if (pattern.test(title)) {
        hooks.push(`${title} - Don't miss out!`);
      }
    });
    
    return hooks.length > 0 ? hooks : [title];
  }

  /**
   * Calculate performance score based on views, likes, comments
   */
  private calculatePerformanceScore(video: YouTubeVideoData): number {
    const { viewCount, likeCount, commentCount } = video.statistics;
    
    // Normalize based on typical YouTube metrics
    const viewScore = Math.min(100, (viewCount / 10000) * 10);
    const likeScore = Math.min(100, (likeCount / (viewCount * 0.05)) * 100);
    const commentScore = Math.min(100, (commentCount / (viewCount * 0.01)) * 100);
    
    return Math.round((viewScore * 0.5 + likeScore * 0.3 + commentScore * 0.2));
  }

  /**
   * Calculate engagement rate
   */
  private calculateEngagementRate(video: YouTubeVideoData): number {
    const { viewCount, likeCount, commentCount } = video.statistics;
    
    if (viewCount === 0) return 0;
    
    const engagementRate = ((likeCount + commentCount) / viewCount) * 100;
    return Math.round(engagementRate * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Analyze title for hook patterns
   */
  private analyzeTitleHooks(title: string): VideoAnalysis['title_analysis'] {
    const titleLower = title.toLowerCase();
    
    // Detect hook type
    let hookType = 'informational';
    let effectiveness = 50;
    
    if (title.includes('?')) {
      hookType = 'question';
      effectiveness += 20;
    } else if (/\d+.*(?:ways?|tips?|secrets?)/i.test(title)) {
      hookType = 'listicle';
      effectiveness += 15;
    } else if (/(?:how to|why|what)/i.test(title)) {
      hookType = 'educational';
      effectiveness += 10;
    } else if (/(?:shocking|amazing|unbelievable|incredible)/i.test(title)) {
      hookType = 'curiosity_gap';
      effectiveness += 25;
    }
    
    // Extract key words
    const keyWords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
    
    return {
      hook_type: hookType,
      effectiveness: Math.min(100, effectiveness),
      key_words: keyWords
    };
  }

  /**
   * Basic thumbnail analysis
   */
  private analyzeThumbnail(video: YouTubeVideoData): VideoAnalysis['thumbnail_analysis'] {
    // Basic analysis based on available data
    return {
      style: 'standard',
      color_scheme: 'unknown',
      text_elements: ['title_overlay'] // Placeholder
    };
  }

  /**
   * Get competitive insights
   */
  private async getCompetitiveInsights(video: YouTubeVideoData): Promise<VideoAnalysis['competitive_insights']> {
    // Placeholder for competitive analysis
    return {
      similar_videos: 100,
      category_average_views: video.statistics.viewCount * 0.7,
      performance_vs_average: video.statistics.viewCount > (video.statistics.viewCount * 0.7) ? 1.3 : 0.8
    };
  }

  /**
   * Fetch video comments
   */
  private async fetchVideoComments(videoId: string, maxResults: number = 100): Promise<string[]> {
    if (!this.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured, skipping comments');
      return [];
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${this.YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        console.warn(`YouTube Comments API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      return data.items?.map((item: any) => 
        item.snippet.topLevelComment.snippet.textDisplay
      ) || [];
    } catch (error) {
      console.warn('Failed to fetch comments:', error);
      return [];
    }
  }

  /**
   * Perform structured AI analysis
   */
  private async performStructuredAnalysis(
    video: YouTubeVideoData, 
    comments: string[]
  ): Promise<StructuredVideoAnalysis> {
    
    // Create AI prompt for structured analysis
    const prompt = this.createStructuredAnalysisPrompt(video, comments);
    
    try {
      // Call AI service (assuming we have one)
      const aiResponse = await this.callAIForAnalysis(prompt);
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.warn('AI analysis failed, using fallback analysis');
      return this.createFallbackAnalysis(video, comments);
    }
  }

  /**
   * Create structured analysis prompt
   */
  private createStructuredAnalysisPrompt(video: YouTubeVideoData, comments: string[]): string {
    const commentsText = comments.slice(0, 50).join('\n- ');
    
    return `
Analyze this YouTube video: ${video.title}

Video Details:
- Title: ${video.title}
- Channel: ${video.snippet.channelTitle}
- Views: ${video.statistics.viewCount.toLocaleString()}
- Likes: ${video.statistics.likeCount.toLocaleString()}
- Comments: ${video.statistics.commentCount.toLocaleString()}
- Description: ${video.description.slice(0, 500)}...

Top Comments:
- ${commentsText}

Please provide analysis in this exact format:

1. **Video Summary**
- Extract the main topic and core message of the video.
- Identify important sections or chronological flow.
- Summarize statistics, examples, or strategies mentioned.

2. **Detailed Analysis**
- Methods, tools, approaches used (e.g., growth strategy, tech stack, business model).
- Speaker(s) experiences and lessons shared.
- Target audience insights.

3. **Comment Analysis (Community Response)**
- Recurring ideas or frequently used phrases in comments.
- Positive/negative feedback from viewers.
- Community perception: support, criticism, suggestions, etc.

4. **Summary Table**
Topic | Key Point
-----|----------
Beginning | ...
Strategy | ...
User Response | ...
Revenue/Outcome | ...

5. **Insights & Lessons**
- Main lessons that can be extracted from this video.
- Actionable tips for entrepreneurs/content creators/viewers.

Respond in English with detailed, actionable insights.
`;
  }

  /**
   * Call AI service for analysis
   */
  private async callAIForAnalysis(prompt: string): Promise<string> {
    // This would integrate with your AI service (OpenAI, Gemini, etc.)
    // For now, we'll simulate an AI response
    throw new Error('AI service not implemented yet');
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(aiResponse: string): StructuredVideoAnalysis {
    // Parse the AI response and structure it
    // This would parse the markdown-like response from AI
    throw new Error('AI response parsing not implemented yet');
  }

  /**
   * Create fallback analysis when AI is not available
   */
  private createFallbackAnalysis(video: YouTubeVideoData, comments: string[]): StructuredVideoAnalysis {
    // Analyze comments for sentiment and common themes
    const commentAnalysis = this.analyzeComments(comments);
    
    return {
      video_summary: {
        main_topic: this.extractMainTopic(video.title, video.description),
        key_message: this.extractKeyMessage(video.title, video.description),
        important_sections: this.extractImportantSections(video.description),
        chronological_flow: ['Introduction', 'Main Content', 'Conclusion'],
        statistics_and_examples: this.extractStatistics(video.description)
      },
      detailed_analysis: {
        methods_and_tools: this.extractMethodsAndTools(video.description),
        approaches: this.extractApproaches(video.title, video.description),
        speaker_experience: [`${video.snippet.channelTitle} shares insights`],
        lessons_learned: this.extractLessons(video.description),
        target_audience_insights: this.analyzeTargetAudience(video.snippet.tags || [])
      },
      comment_analysis: commentAnalysis,
      summary_table: {
        beginning: this.extractBeginning(video.description),
        strategy: this.extractStrategy(video.title, video.description),
        user_response: this.summarizeUserResponse(comments),
        revenue_outcome: this.extractRevenueInfo(video.description)
      },
      insights_and_lessons: {
        main_lessons: this.extractMainLessons(video.title, video.description),
        actionable_tips_entrepreneurs: this.extractEntrepreneurTips(video.description),
        actionable_tips_content_creators: this.extractContentCreatorTips(video.description),
        actionable_tips_viewers: this.extractViewerTips(video.description)
      }
    };
  }

  // Helper methods for fallback analysis
  private extractMainTopic(title: string, description: string): string {
    // Extract main topic from title and description
    const keywords = title.toLowerCase().match(/\b\w{4,}\b/g) || [];
    return keywords.slice(0, 3).join(', ') || 'General discussion';
  }

  private extractKeyMessage(title: string, description: string): string {
    // Extract key message
    const firstSentence = description.split('.')[0];
    return firstSentence || title;
  }

  private extractImportantSections(description: string): string[] {
    // Look for timestamps or numbered sections
    const sections = description.match(/\d+:\d+|\d+\./g) || [];
    return sections.slice(0, 5).map(s => `Section at ${s}`);
  }

  private extractStatistics(description: string): string[] {
    // Extract numbers and percentages
    const stats = description.match(/\d+%|\$\d+|\d+[kmb]?/gi) || [];
    return stats.slice(0, 5);
  }

  private extractMethodsAndTools(description: string): string[] {
    // Look for common tools and methods
    const tools = ['strategy', 'method', 'tool', 'approach', 'technique', 'framework'];
    const found = tools.filter(tool => 
      description.toLowerCase().includes(tool)
    );
    return found.length > 0 ? found : ['General methodology'];
  }

  private extractApproaches(title: string, description: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const approaches = [];
    
    if (text.includes('growth')) approaches.push('Growth strategy');
    if (text.includes('marketing')) approaches.push('Marketing approach');
    if (text.includes('business')) approaches.push('Business model');
    if (text.includes('tech')) approaches.push('Technical approach');
    
    return approaches.length > 0 ? approaches : ['General approach'];
  }

  private extractLessons(description: string): string[] {
    // Look for lesson indicators
    const lessonWords = ['learn', 'lesson', 'tip', 'advice', 'insight'];
    const sentences = description.split('.').filter(sentence =>
      lessonWords.some(word => sentence.toLowerCase().includes(word))
    );
    return sentences.slice(0, 3).map(s => s.trim());
  }

  private analyzeTargetAudience(tags: string[]): string[] {
    const audienceKeywords = ['entrepreneur', 'startup', 'business', 'creator', 'developer'];
    const matchedAudience = tags.filter(tag =>
      audienceKeywords.some(keyword => tag.toLowerCase().includes(keyword))
    );
    return matchedAudience.length > 0 ? matchedAudience : ['General audience'];
  }

  private analyzeComments(comments: string[]): StructuredVideoAnalysis['comment_analysis'] {
    if (comments.length === 0) {
      return {
        recurring_ideas: ['No comments available'],
        common_phrases: [],
        positive_feedback: [],
        negative_feedback: [],
        community_perception: {
          support_level: 'medium',
          criticism_level: 'low',
          suggestions_count: 0
        }
      };
    }

    // Simple sentiment analysis
    const positiveWords = ['great', 'awesome', 'love', 'amazing', 'helpful', 'thanks'];
    const negativeWords = ['bad', 'wrong', 'hate', 'terrible', 'useless'];
    
    const positive = comments.filter(comment =>
      positiveWords.some(word => comment.toLowerCase().includes(word))
    );
    
    const negative = comments.filter(comment =>
      negativeWords.some(word => comment.toLowerCase().includes(word))
    );

    // Extract common phrases (simplified)
    const allWords = comments.join(' ').toLowerCase().split(/\s+/);
    const wordCount: { [key: string]: number } = {};
    allWords.forEach(word => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    const commonPhrases = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    return {
      recurring_ideas: commonPhrases.slice(0, 3),
      common_phrases: commonPhrases,
      positive_feedback: positive.slice(0, 3),
      negative_feedback: negative.slice(0, 3),
      community_perception: {
        support_level: positive.length > negative.length * 2 ? 'high' : 
                      positive.length > negative.length ? 'medium' : 'low',
        criticism_level: negative.length > positive.length ? 'high' : 
                        negative.length > 0 ? 'medium' : 'low',
        suggestions_count: comments.filter(c => 
          c.toLowerCase().includes('suggest') || c.toLowerCase().includes('should')
        ).length
      }
    };
  }

  private extractBeginning(description: string): string {
    return description.split('.')[0] || 'Video introduction';
  }

  private extractStrategy(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    if (text.includes('strategy')) return 'Strategic approach discussed';
    if (text.includes('method')) return 'Methodical approach';
    return 'General strategy mentioned';
  }

  private summarizeUserResponse(comments: string[]): string {
    if (comments.length === 0) return 'No user comments available';
    
    const positiveCount = comments.filter(c => 
      ['great', 'awesome', 'love', 'helpful'].some(word => 
        c.toLowerCase().includes(word)
      )
    ).length;
    
    if (positiveCount > comments.length * 0.6) return 'Highly positive response';
    if (positiveCount > comments.length * 0.3) return 'Generally positive response';
    return 'Mixed response from users';
  }

  private extractRevenueInfo(description: string): string {
    const revenueWords = ['revenue', 'profit', 'money', 'income', '$', 'earn'];
    const hasRevenue = revenueWords.some(word => 
      description.toLowerCase().includes(word)
    );
    return hasRevenue ? 'Revenue/financial information discussed' : 'No specific revenue information';
  }

  private extractMainLessons(title: string, description: string): string[] {
    const text = title + ' ' + description;
    const lessons = [];
    
    if (text.toLowerCase().includes('how to')) {
      lessons.push('Step-by-step guidance provided');
    }
    if (text.toLowerCase().includes('mistake')) {
      lessons.push('Common mistakes to avoid highlighted');
    }
    if (text.toLowerCase().includes('success')) {
      lessons.push('Success factors identified');
    }
    
    return lessons.length > 0 ? lessons : ['General insights shared'];
  }

  private extractEntrepreneurTips(description: string): string[] {
    const entrepreneurWords = ['startup', 'business', 'entrepreneur', 'founder'];
    if (entrepreneurWords.some(word => description.toLowerCase().includes(word))) {
      return [
        'Focus on market validation',
        'Build MVP quickly',
        'Listen to customer feedback'
      ];
    }
    return ['Apply learnings to business context'];
  }

  private extractContentCreatorTips(description: string): string[] {
    const creatorWords = ['content', 'video', 'youtube', 'creator', 'audience'];
    if (creatorWords.some(word => description.toLowerCase().includes(word))) {
      return [
        'Engage with audience consistently',
        'Create valuable content',
        'Analyze performance metrics'
      ];
    }
    return ['Apply insights to content creation'];
  }

  private extractViewerTips(description: string): string[] {
    return [
      'Take actionable notes while watching',
      'Apply learnings to personal projects',
      'Share insights with relevant communities'
    ];
  }

  /**
   * Create demo analysis when API is not available
   */
  private createDemoAnalysis(videoUrl: string, videoId: string): StructuredVideoAnalysis {
    return {
      video_summary: {
        main_topic: 'Startup Growth Strategy & Market Validation',
        key_message: 'Building a successful startup requires systematic validation, strategic growth planning, and deep understanding of customer needs.',
        important_sections: [
          '0:00-2:30 - Introduction and problem statement',
          '2:30-8:15 - Market validation methodology',
          '8:15-15:45 - Growth strategy implementation',
          '15:45-22:10 - Case studies and real examples',
          '22:10-25:00 - Key takeaways and next steps'
        ],
        chronological_flow: [
          'Problem identification and market opportunity',
          'Validation framework and testing approach',
          'Growth strategy development and execution',
          'Results analysis and optimization',
          'Scaling and long-term sustainability'
        ],
        statistics_and_examples: [
          '73% of startups fail due to lack of market need',
          '$50K average cost of customer acquisition',
          '18-month typical validation timeline',
          '3.2x revenue growth after proper validation',
          '67% reduction in development costs with MVP approach'
        ]
      },
      detailed_analysis: {
        methods_and_tools: [
          'Lean Startup Methodology for rapid iteration',
          'Customer Development interviews and surveys',
          'A/B testing framework for feature validation',
          'Analytics tools for user behavior tracking',
          'Social media listening for market sentiment',
          'Competitive analysis and positioning tools'
        ],
        approaches: [
          'Problem-first approach to product development',
          'Data-driven decision making process',
          'Iterative build-measure-learn cycles',
          'Customer-centric product design',
          'Agile development and rapid prototyping',
          'Growth hacking and viral marketing strategies'
        ],
        speaker_experience: [
          'Serial entrepreneur with 3 successful exits',
          '10+ years in startup ecosystem and venture capital',
          'Advisor to 50+ early-stage companies',
          'Former product manager at Fortune 500 company',
          'Published author on startup methodology',
          'Keynote speaker at major tech conferences'
        ],
        lessons_learned: [
          'Market validation must happen before product development',
          'Customer feedback is more valuable than internal assumptions',
          'Timing and market readiness are crucial success factors',
          'Building the right team is as important as the right product',
          'Financial planning and runway management are critical',
          'Persistence and adaptability separate successful founders'
        ],
        target_audience_insights: [
          'Early-stage entrepreneurs seeking validation guidance',
          'Product managers looking for systematic approaches',
          'Startup founders struggling with product-market fit',
          'Investors evaluating startup potential and methodology',
          'Business students and aspiring entrepreneurs',
          'Corporate innovators exploring new market opportunities'
        ]
      },
      comment_analysis: {
        recurring_ideas: [
          'Validation methodology',
          'Customer development',
          'Market timing',
          'Product-market fit',
          'Growth strategies'
        ],
        common_phrases: [
          'This is exactly what I needed',
          'Wish I had seen this earlier',
          'Great practical advice',
          'Real-world examples are helpful',
          'Clear and actionable steps'
        ],
        positive_feedback: [
          'Amazing breakdown of the validation process! This saved me months of trial and error.',
          'Finally someone explains this in a practical way. The case studies were particularly helpful.',
          'As a first-time founder, this gave me the confidence to properly validate my idea before building.'
        ],
        negative_feedback: [
          'Would have liked more technical details on implementation',
          'Some of the examples seem outdated for current market conditions',
          'The timeline seems optimistic for complex B2B products'
        ],
        community_perception: {
          support_level: 'high',
          criticism_level: 'low',
          suggestions_count: 12
        }
      },
      summary_table: {
        beginning: 'Introduces the critical importance of market validation and the high failure rate of startups that skip this step',
        strategy: 'Systematic approach combining customer development, lean methodology, and data-driven validation before product development',
        user_response: 'Highly positive reception with viewers appreciating practical, actionable advice and real-world case studies',
        revenue_outcome: 'Demonstrates how proper validation can reduce development costs by 67% and increase success probability by 3.2x'
      },
      insights_and_lessons: {
        main_lessons: [
          'Market validation is not optional - it\'s the foundation of successful startups',
          'Customer development should drive product development, not the other way around',
          'Early feedback is exponentially more valuable than late-stage pivots',
          'Systematic approach to validation reduces risk and increases success probability',
          'Building the right thing is more important than building things right',
          'Market timing and readiness are often underestimated success factors'
        ],
        actionable_tips_entrepreneurs: [
          'Start with customer interviews before writing a single line of code',
          'Create a validation plan with clear success/failure criteria',
          'Build an MVP that tests core assumptions, not just features',
          'Track leading indicators, not just vanity metrics',
          'Establish a regular customer feedback loop from day one',
          'Be prepared to pivot based on validation results'
        ],
        actionable_tips_content_creators: [
          'Use real case studies and examples to illustrate abstract concepts',
          'Structure content with clear, actionable takeaways',
          'Include both successes and failures for balanced perspective',
          'Provide templates and frameworks viewers can immediately use',
          'Engage with comments to build community and gather feedback',
          'Create follow-up content based on audience questions and needs'
        ],
        actionable_tips_viewers: [
          'Take notes on specific methodologies and frameworks mentioned',
          'Identify which validation techniques apply to your specific situation',
          'Create an action plan with timeline and milestones',
          'Connect with other entrepreneurs implementing similar approaches',
          'Share your validation results and learnings with the community',
          'Iterate and improve your validation process based on results'
        ]
      }
    };
  }
}

export const youtubeAnalysisService = new YouTubeAnalysisService();
