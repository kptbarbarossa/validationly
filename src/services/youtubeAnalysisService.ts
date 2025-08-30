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

export class YouTubeAnalysisService {
  private readonly YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
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
}

export const youtubeAnalysisService = new YouTubeAnalysisService();
