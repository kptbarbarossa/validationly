import { RedditService } from './platforms/reddit';
import { HackerNewsService } from './platforms/hackernews';
import { ProductHuntService } from './platforms/producthunt';
import { GitHubService } from './platforms/github';
import { StackOverflowService } from './platforms/stackoverflow';
import { GoogleNewsService } from './platforms/googlenews';
import { YouTubeService } from './platforms/youtube';

export interface PlatformResult {
  platform: string;
  items: any[];
  totalResults: number;
  error?: string;
  metadata?: any;
}

export interface MultiPlatformAnalysis {
  platforms: PlatformResult[];
  summary: {
    reddit: number;
    hackernews: number;
    producthunt: number;
    googlenews: number;
    github: number;
    stackoverflow: number;
    youtube: number;
  };
  totalItems: number;
  insights: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    keyInsights: string[];
    painPoints: string[];
    opportunities: string[];
    popularSolutions: string[];
  };
}

export class MultiPlatformService {
  private redditService: RedditService;
  private hackerNewsService: HackerNewsService;
  private productHuntService: ProductHuntService;
  private githubService: GitHubService;
  private stackOverflowService: StackOverflowService;
  private googleNewsService: GoogleNewsService;
  private youtubeService: YouTubeService | null = null;

  constructor() {
    this.redditService = new RedditService();
    this.hackerNewsService = new HackerNewsService();
    this.productHuntService = new ProductHuntService();
    this.githubService = new GitHubService();
    this.stackOverflowService = new StackOverflowService();
    this.googleNewsService = new GoogleNewsService();
    
    // YouTube service requires API key
    if (process.env.YOUTUBE_API_KEY) {
      this.youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);
    }
  }

  async analyzeIdea(idea: string, maxResultsPerPlatform: number = 10): Promise<MultiPlatformAnalysis> {
    console.log('🚀 Starting multi-platform analysis for:', idea);

    // Run all platform searches in parallel
    const platformPromises = [
      this.searchReddit(idea, maxResultsPerPlatform),
      this.searchHackerNews(idea, maxResultsPerPlatform),
      this.searchProductHunt(idea, maxResultsPerPlatform),
      this.searchGitHub(idea, maxResultsPerPlatform),
      this.searchStackOverflow(idea, maxResultsPerPlatform),
      this.searchGoogleNews(idea, maxResultsPerPlatform),
      this.searchYouTube(idea, maxResultsPerPlatform)
    ];

    const results = await Promise.allSettled(platformPromises);
    
    const platforms: PlatformResult[] = [];
    const summary = {
      reddit: 0,
      hackernews: 0,
      producthunt: 0,
      googlenews: 0,
      github: 0,
      stackoverflow: 0,
      youtube: 0
    };

    // Process results
    results.forEach((result, index) => {
      const platformNames = ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'];
      const platformName = platformNames[index];

      if (result.status === 'fulfilled' && result.value) {
        platforms.push(result.value);
        summary[platformName as keyof typeof summary] = result.value.items.length;
      } else {
        console.log(`❌ ${platformName} search failed:`, result.status === 'rejected' ? result.reason : 'No data');
        platforms.push({
          platform: platformName,
          items: [],
          totalResults: 0,
          error: result.status === 'rejected' ? result.reason?.message || 'Search failed' : 'No data available'
        });
      }
    });

    const totalItems = Object.values(summary).reduce((sum, count) => sum + count, 0);

    // Generate insights from collected data
    const insights = this.generateInsights(platforms, idea);

    console.log('✅ Multi-platform analysis completed:', {
      totalItems,
      platformsWithData: platforms.filter(p => p.items.length > 0).length
    });

    return {
      platforms,
      summary,
      totalItems,
      insights
    };
  }

  private async searchReddit(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      const results = await this.redditService.searchPosts(idea, maxResults);
      return {
        platform: 'reddit',
        items: results.posts,
        totalResults: results.totalResults,
        metadata: { subreddits: results.subreddits }
      };
    } catch (error) {
      throw new Error(`Reddit search failed: ${error}`);
    }
  }

  private async searchHackerNews(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      const results = await this.hackerNewsService.searchStories(idea, maxResults);
      return {
        platform: 'hackernews',
        items: results.stories,
        totalResults: results.totalResults
      };
    } catch (error) {
      throw new Error(`Hacker News search failed: ${error}`);
    }
  }

  private async searchProductHunt(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      const results = await this.productHuntService.searchProducts(idea, maxResults);
      return {
        platform: 'producthunt',
        items: results.products,
        totalResults: results.totalResults
      };
    } catch (error) {
      throw new Error(`Product Hunt search failed: ${error}`);
    }
  }

  private async searchGitHub(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      const results = await this.githubService.searchRepositories(idea, maxResults);
      return {
        platform: 'github',
        items: results.repositories,
        totalResults: results.totalResults,
        metadata: { languages: results.topLanguages }
      };
    } catch (error) {
      throw new Error(`GitHub search failed: ${error}`);
    }
  }

  private async searchStackOverflow(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      const results = await this.stackOverflowService.searchQuestions(idea, maxResults);
      return {
        platform: 'stackoverflow',
        items: results.questions,
        totalResults: results.totalResults,
        metadata: { tags: results.topTags }
      };
    } catch (error) {
      throw new Error(`Stack Overflow search failed: ${error}`);
    }
  }

  private async searchGoogleNews(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      const results = await this.googleNewsService.searchNews(idea, maxResults);
      return {
        platform: 'googlenews',
        items: results.articles,
        totalResults: results.totalResults
      };
    } catch (error) {
      throw new Error(`Google News search failed: ${error}`);
    }
  }

  private async searchYouTube(idea: string, maxResults: number): Promise<PlatformResult> {
    try {
      if (!this.youtubeService) {
        throw new Error('YouTube API key not configured');
      }
      
      const results = await this.youtubeService.searchVideos(idea, maxResults);
      return {
        platform: 'youtube',
        items: results.videos,
        totalResults: results.totalResults
      };
    } catch (error) {
      throw new Error(`YouTube search failed: ${error}`);
    }
  }

  private generateInsights(platforms: PlatformResult[], idea: string): MultiPlatformAnalysis['insights'] {
    const allItems = platforms.flatMap(p => p.items);
    const totalItems = allItems.length;

    // Calculate validation score based on data availability and engagement
    let validationScore = 0;
    let sentimentScore = 0;
    const trendingTopics: string[] = [];
    const keyInsights: string[] = [];
    const painPoints: string[] = [];
    const opportunities: string[] = [];
    const popularSolutions: string[] = [];

    platforms.forEach(platform => {
      if (platform.items.length > 0) {
        validationScore += Math.min(platform.items.length * 5, 20); // Max 20 points per platform
        
        // Platform-specific insights
        switch (platform.platform) {
          case 'reddit':
            keyInsights.push(`Found ${platform.items.length} Reddit discussions`);
            if (platform.metadata?.subreddits) {
              trendingTopics.push(...platform.metadata.subreddits.slice(0, 3));
            }
            break;
            
          case 'hackernews':
            keyInsights.push(`${platform.items.length} Hacker News stories found`);
            sentimentScore += platform.items.length * 2; // HN is tech-positive
            break;
            
          case 'producthunt':
            keyInsights.push(`${platform.items.length} similar products on Product Hunt`);
            popularSolutions.push(...platform.items.slice(0, 3).map((item: any) => item.name || item.title));
            break;
            
          case 'github':
            keyInsights.push(`${platform.items.length} related GitHub repositories`);
            if (platform.metadata?.languages) {
              trendingTopics.push(...platform.metadata.languages.slice(0, 2));
            }
            break;
            
          case 'stackoverflow':
            painPoints.push(`${platform.items.length} related developer questions found`);
            if (platform.metadata?.tags) {
              trendingTopics.push(...platform.metadata.tags.slice(0, 3));
            }
            break;
            
          case 'googlenews':
            keyInsights.push(`${platform.items.length} recent news articles`);
            sentimentScore += platform.items.length;
            break;
            
          case 'youtube':
            keyInsights.push(`${platform.items.length} YouTube videos found`);
            opportunities.push('Content marketing potential on YouTube');
            break;
        }
      } else if (platform.error) {
        painPoints.push(`${platform.platform} data unavailable: ${platform.error}`);
      }
    });

    // Normalize validation score (0-100)
    validationScore = Math.min(validationScore, 100);

    // Determine overall sentiment
    const sentiment: 'positive' | 'negative' | 'neutral' = 
      sentimentScore > totalItems ? 'positive' : 
      sentimentScore < totalItems / 2 ? 'negative' : 'neutral';

    // Add general insights based on data availability
    if (totalItems > 50) {
      keyInsights.push('High market interest detected across platforms');
      opportunities.push('Strong validation signals for market entry');
    } else if (totalItems > 20) {
      keyInsights.push('Moderate market interest with growth potential');
      opportunities.push('Niche market opportunity identified');
    } else if (totalItems > 5) {
      keyInsights.push('Limited but focused market interest');
      opportunities.push('Early market opportunity with less competition');
    } else {
      painPoints.push('Limited online discussion about this topic');
      opportunities.push('Blue ocean opportunity - be the first to market');
    }

    return {
      validationScore,
      sentiment,
      trendingTopics: [...new Set(trendingTopics)].slice(0, 5),
      keyInsights: keyInsights.slice(0, 5),
      painPoints: painPoints.slice(0, 3),
      opportunities: opportunities.slice(0, 3),
      popularSolutions: [...new Set(popularSolutions)].slice(0, 5)
    };
  }
}