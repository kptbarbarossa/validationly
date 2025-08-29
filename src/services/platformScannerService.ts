import { PremiumPlatformData, PremiumValidationRequest } from '../types';

export class PremiumPlatformScannerService {
  private readonly API_ENDPOINTS = {
    reddit: '/api/reddit',
    hackernews: '/api/hackernews',
    producthunt: '/api/producthunt',
    github: '/api/github',
    stackoverflow: '/api/stackoverflow',
    googlenews: '/api/googlenews',
    youtube: '/api/youtube'
  };

  async scanAllPlatforms(request: PremiumValidationRequest): Promise<PremiumPlatformData[]> {
    const platforms = request.platforms || ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'];
    
    const scanPromises = platforms.map(platform => this.scanPlatform(platform, request));
    const results = await Promise.allSettled(scanPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<PremiumPlatformData> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  private async scanPlatform(platform: string, request: PremiumValidationRequest): Promise<PremiumPlatformData> {
    try {
      const endpoint = this.API_ENDPOINTS[platform as keyof typeof this.API_ENDPOINTS];
      if (!endpoint) {
        throw new Error(`Unknown platform: ${platform}`);
      }

      // Use the existing backend API endpoints
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: request.query,
          time_range: request.time_range,
          max_items: request.max_items_per_platform || 100
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformPlatformData(platform, data, request.query);
      
    } catch (error) {
      console.error(`Error scanning ${platform}:`, error);
      return this.generateFallbackData(platform, request.query);
    }
  }

  private transformPlatformData(platform: string, data: any, query: string): PremiumPlatformData {
    switch (platform) {
      case 'reddit':
        return this.transformRedditData(data, query);
      case 'hackernews':
        return this.transformHackerNewsData(data, query);
      case 'producthunt':
        return this.transformProductHuntData(data, query);
      case 'github':
        return this.transformGitHubData(data, query);
      case 'stackoverflow':
        return this.transformStackOverflowData(data, query);
      case 'googlenews':
        return this.transformGoogleNewsData(data, query);
      case 'youtube':
        return this.transformYouTubeData(data, query);
      default:
        return this.generateFallbackData(platform, query);
    }
  }

  private transformRedditData(data: any, query: string): PremiumPlatformData {
    // Transform Reddit API response to our format
    const posts = data.posts || data.data || [];
    const totalScore = posts.reduce((sum: number, post: any) => sum + (post.score || post.ups || 0), 0);
    const avgScore = posts.length > 0 ? totalScore / posts.length : 0;
    
    return {
      platform: 'reddit',
      summary: `Reddit community shows ${posts.length > 20 ? 'strong' : 'moderate'} interest in ${query}`,
      sentiment: this.calculateSentiment(posts, 'score'),
      metrics: {
        volume: posts.length,
        engagement: Math.min(1, avgScore / 100),
        growth_rate: this.calculateGrowthRate(posts, 'created_utc')
      },
      top_keywords: this.extractKeywords(posts, ['title', 'selftext']),
      representative_quotes: this.extractRepresentativeQuotes(posts, 'title')
    };
  }

  private transformHackerNewsData(data: any, query: string): PremiumPlatformData {
    // Transform Hacker News API response
    const stories = data.stories || data.data || [];
    const totalPoints = stories.reduce((sum: number, story: any) => sum + (story.points || story.score || 0), 0);
    const avgPoints = stories.length > 0 ? totalPoints / stories.length : 0;
    
    return {
      platform: 'hackernews',
      summary: `HN developers discussing ${query} with ${stories.length} relevant stories`,
      sentiment: this.calculateSentiment(stories, 'points'),
      metrics: {
        volume: stories.length,
        engagement: Math.min(1, avgPoints / 100),
        growth_rate: this.calculateGrowthRate(stories, 'time')
      },
      top_keywords: this.extractKeywords(stories, ['title', 'text']),
      representative_quotes: this.extractRepresentativeQuotes(stories, 'title')
    };
  }

  private transformProductHuntData(data: any, query: string): PremiumPlatformData {
    // Transform Product Hunt API response
    const products = data.products || data.data || [];
    const totalVotes = products.reduce((sum: number, product: any) => sum + (product.votes || product.vote_count || 0), 0);
    const avgVotes = products.length > 0 ? totalVotes / products.length : 0;
    
    return {
      platform: 'producthunt',
      summary: `${products.length} ${query}-related products launched on Product Hunt`,
      sentiment: this.calculateSentiment(products, 'votes'),
      metrics: {
        volume: products.length,
        engagement: Math.min(1, avgVotes / 50),
        growth_rate: this.calculateGrowthRate(products, 'created_at')
      },
      top_keywords: this.extractKeywords(products, ['name', 'tagline']),
      representative_quotes: this.extractRepresentativeQuotes(products, 'name')
    };
  }

  private transformGitHubData(data: any, query: string): PremiumPlatformData {
    // Transform GitHub API response
    const repos = data.repositories || data.data || [];
    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || repo.stars || 0), 0);
    const avgStars = repos.length > 0 ? totalStars / repos.length : 0;
    
    return {
      platform: 'github',
      summary: `${repos.length} ${query} repositories with ${totalStars} total stars`,
      sentiment: this.calculateSentiment(repos, 'stargazers_count'),
      metrics: {
        volume: repos.length,
        engagement: Math.min(1, avgStars / 100),
        growth_rate: this.calculateGrowthRate(repos, 'created_at')
      },
      top_keywords: this.extractKeywords(repos, ['name', 'description', 'topics']),
      representative_quotes: this.extractRepresentativeQuotes(repos, 'name')
    };
  }

  private transformStackOverflowData(data: any, query: string): PremiumPlatformData {
    // Transform Stack Overflow API response
    const questions = data.questions || data.data || [];
    const totalVotes = questions.reduce((sum: number, q: any) => sum + (q.score || q.vote_count || 0), 0);
    const avgVotes = questions.length > 0 ? totalVotes / questions.length : 0;
    
    return {
      platform: 'stackoverflow',
      summary: `${questions.length} ${query} questions on Stack Overflow`,
      sentiment: this.calculateSentiment(questions, 'score'),
      metrics: {
        volume: questions.length,
        engagement: Math.min(1, avgVotes / 10),
        growth_rate: this.calculateGrowthRate(questions, 'creation_date')
      },
      top_keywords: this.extractKeywords(questions, ['title', 'body', 'tags']),
      representative_quotes: this.extractRepresentativeQuotes(questions, 'title')
    };
  }

  private transformGoogleNewsData(data: any, query: string): PremiumPlatformData {
    // Transform Google News API response
    const articles = data.articles || data.data || [];
    const totalRelevance = articles.reduce((sum: number, article: any) => sum + (article.relevance || article.score || 0), 0);
    const avgRelevance = articles.length > 0 ? totalRelevance / articles.length : 0;
    
    return {
      platform: 'googlenews',
      summary: `${articles.length} recent news articles about ${query}`,
      sentiment: this.calculateSentiment(articles, 'relevance'),
      metrics: {
        volume: articles.length,
        engagement: Math.min(1, avgRelevance / 100),
        growth_rate: this.calculateGrowthRate(articles, 'published_date')
      },
      top_keywords: this.extractKeywords(articles, ['title', 'snippet']),
      representative_quotes: this.extractRepresentativeQuotes(articles, 'title')
    };
  }

  private transformYouTubeData(data: any, query: string): PremiumPlatformData {
    // Transform YouTube API response
    const videos = data.videos || data.data || [];
    const totalViews = videos.reduce((sum: number, video: any) => sum + (video.view_count || video.views || 0), 0);
    const avgViews = videos.length > 0 ? totalViews / videos.length : 0;
    
    return {
      platform: 'youtube',
      summary: `${videos.length} ${query} videos with ${totalViews.toLocaleString()} total views`,
      sentiment: this.calculateSentiment(videos, 'view_count'),
      metrics: {
        volume: videos.length,
        engagement: Math.min(1, avgViews / 10000),
        growth_rate: this.calculateGrowthRate(videos, 'published_at')
      },
      top_keywords: this.extractKeywords(videos, ['title', 'description', 'tags']),
      representative_quotes: this.extractRepresentativeQuotes(videos, 'title')
    };
  }

  private calculateSentiment(items: any[], scoreField: string): { positive: number; neutral: number; negative: number } {
    if (items.length === 0) return { positive: 0.33, neutral: 0.34, negative: 0.33 };
    
    const scores = items.map(item => item[scoreField] || 0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const range = maxScore - minScore;
    
    if (range === 0) return { positive: 0.33, neutral: 0.34, negative: 0.33 };
    
    const positive = scores.filter(score => score > (maxScore + minScore) / 2).length / scores.length;
    const negative = scores.filter(score => score < (maxScore + minScore) / 2).length / scores.length;
    const neutral = 1 - positive - negative;
    
    return { positive, neutral, negative };
  }

  private calculateGrowthRate(items: any[], dateField: string): number {
    if (items.length < 2) return 0;
    
    const sortedItems = items
      .filter(item => item[dateField])
      .sort((a, b) => new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime());
    
    if (sortedItems.length < 2) return 0;
    
    const midPoint = Math.floor(sortedItems.length / 2);
    const earlyItems = sortedItems.slice(0, midPoint);
    const lateItems = sortedItems.slice(midPoint);
    
    const earlyAvg = earlyItems.reduce((sum, item) => sum + (item.score || item.points || item.votes || item.stargazers_count || item.view_count || 0), 0) / earlyItems.length;
    const lateAvg = lateItems.reduce((sum, item) => sum + (item.score || item.points || item.votes || item.stargazers_count || item.view_count || 0), 0) / lateItems.length;
    
    if (earlyAvg === 0) return lateAvg > 0 ? 1 : 0;
    return (lateAvg - earlyAvg) / earlyAvg;
  }

  private extractKeywords(items: any[], fields: string[]): string[] {
    const allText = items
      .map(item => fields.map(field => item[field] || '').join(' '))
      .join(' ')
      .toLowerCase();
    
    const commonKeywords = ['app', 'tool', 'platform', 'service', 'product', 'startup', 'business', 'development', 'technology', 'software'];
    const foundKeywords = commonKeywords.filter(keyword => allText.includes(keyword));
    
    return foundKeywords.length > 0 ? foundKeywords.slice(0, 5) : ['startup', 'business', 'innovation'];
  }

  private extractRepresentativeQuotes(items: any[], field: string): Array<{ text: string; sentiment: 'positive' | 'neutral' | 'negative' }> {
    if (items.length === 0) return [];
    
    const topItems = items
      .sort((a, b) => (b.score || b.points || b.votes || b.stargazers_count || b.view_count || 0) - (a.score || a.points || a.votes || a.stargazers_count || a.view_count || 0))
      .slice(0, 3);
    
    return topItems.map(item => ({
      text: item[field] || 'No content',
      sentiment: this.getSentimentFromScore(item.score || item.points || item.votes || item.stargazers_count || item.view_count || 0)
    }));
  }

  private getSentimentFromScore(score: number): 'positive' | 'neutral' | 'negative' {
    if (score > 50) return 'positive';
    if (score > 10) return 'neutral';
    return 'negative';
  }

  private generateFallbackData(platform: string, query: string): PremiumPlatformData {
    return {
      platform,
      summary: `Limited data available for ${query} on ${platform}`,
      sentiment: { positive: 0.33, neutral: 0.34, negative: 0.33 },
      metrics: { volume: 0, engagement: 0, growth_rate: 0 },
      top_keywords: ['startup', 'business', 'innovation'],
      representative_quotes: []
    };
  }
}

// Export singleton instance
export const premiumPlatformScannerService = new PremiumPlatformScannerService();

