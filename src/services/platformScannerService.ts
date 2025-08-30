import { 
  PremiumPlatformData, 
  PremiumValidationRequest,
  PremiumPlatformDataWithArbitrage,
  UserPlan,
  PLAN_CONFIGS
} from '../types';
import { arbitrageMetricsService } from './arbitrageMetricsService';

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

  async scanAllPlatforms(
    request: PremiumValidationRequest,
    userPlan: UserPlan = 'free'
  ): Promise<PremiumPlatformDataWithArbitrage[]> {
    // Apply plan restrictions
    const planConfig = PLAN_CONFIGS[userPlan];
    const allowedPlatforms = request.platforms?.filter(p => planConfig.platforms.includes(p)) || planConfig.platforms;
    
    console.log(`🚀 Starting premium platform scan for: "${request.query}"`);
    console.log(`📊 Scanning ${allowedPlatforms.length} platforms (${userPlan} plan)...`);
    
    const scanPromises = allowedPlatforms.map(platform => this.scanPlatform(platform, request));
    const results = await Promise.allSettled(scanPromises);
    
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<PremiumPlatformData> => result.status === 'fulfilled')
      .map(result => result.value);
    
    console.log(`✅ Successfully scanned ${successfulResults.length}/${allowedPlatforms.length} platforms`);
    
    // Add arbitrage metrics if premium plan
    if (planConfig.arbitrage_metrics && successfulResults.length > 0) {
      return this.enhanceWithArbitrageMetrics(successfulResults, request.query);
    }
    
    // Return basic data for non-premium plans
    return successfulResults.map(platform => ({ ...platform }));
  }

  private async scanPlatform(platform: string, request: PremiumValidationRequest): Promise<PremiumPlatformData> {
    try {
      const endpoint = this.API_ENDPOINTS[platform as keyof typeof this.API_ENDPOINTS];
      if (!endpoint) {
        throw new Error(`Unknown platform: ${platform}`);
      }

      console.log(`🔍 Scanning ${platform}...`);

      // Enhanced API call with better error handling
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: request.query,
          time_range: request.time_range || '3months',
          max_items: request.max_items_per_platform || 100,
          include_metadata: true,
          include_sentiment: true
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`📊 ${platform} data received:`, data);
      
      const transformedData = this.transformPlatformData(platform, data, request.query);
      console.log(`✨ ${platform} transformed successfully`);
      
      return transformedData;
      
    } catch (error) {
      console.error(`❌ Error scanning ${platform}:`, error);
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
    // Enhanced Reddit data transformation
    const posts = data.posts || data.data || [];
    const totalScore = posts.reduce((sum: number, post: any) => sum + (post.score || post.ups || 0), 0);
    const avgScore = posts.length > 0 ? totalScore / posts.length : 0;
    const totalComments = posts.reduce((sum: number, post: any) => sum + (post.num_comments || 0), 0);
    
    // Enhanced sentiment analysis
    const sentiment = this.calculateAdvancedSentiment(posts, 'score', 'num_comments');
    
    // Enhanced metrics
    const metrics = {
      volume: posts.length,
      engagement: this.calculateEngagement(posts.length, totalScore, totalComments),
      growth_rate: this.calculateGrowthRate(posts, 'created_utc'),
      avg_score: avgScore,
      total_comments: totalComments
    };
    
    // Enhanced keywords extraction
    const keywords = this.extractAdvancedKeywords(posts, ['title', 'selftext'], query);
    
    // Enhanced representative quotes
    const quotes = this.extractRepresentativeQuotes(posts, 'title', 'score');
    
    return {
      platform: 'reddit',
      summary: this.generateRedditSummary(posts.length, avgScore, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateRedditInsights(posts, query)
    };
  }

  private transformGitHubData(data: any, query: string): PremiumPlatformData {
    // Enhanced GitHub data transformation
    const repos = data.repos || data.data || [];
    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || repo.stars || 0), 0);
    const totalForks = repos.reduce((sum: number, repo: any) => sum + (repo.forks_count || repo.forks || 0), 0);
    const totalIssues = repos.reduce((sum: number, repo: any) => sum + (repo.open_issues_count || 0), 0);
    
    // Enhanced sentiment based on stars, forks, and activity
    const sentiment = this.calculateGitHubSentiment(repos);
    
    // Enhanced metrics
    const metrics = {
      volume: repos.length,
      engagement: this.calculateGitHubEngagement(repos.length, totalStars, totalForks),
      growth_rate: this.calculateGitHubGrowthRate(repos),
      total_stars: totalStars,
      total_forks: totalForks,
      total_issues: totalIssues
    };
    
    // Enhanced keywords from repo names, descriptions, and topics
    const keywords = this.extractGitHubKeywords(repos, query);
    
    // Enhanced quotes from repo names and descriptions
    const quotes = this.extractGitHubQuotes(repos);
    
    return {
      platform: 'github',
      summary: this.generateGitHubSummary(repos.length, totalStars, totalForks, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateGitHubInsights(repos, query)
    };
  }

  private transformProductHuntData(data: any, query: string): PremiumPlatformData {
    // Enhanced Product Hunt data transformation
    const products = data.products || data.data || [];
    const totalVotes = products.reduce((sum: number, product: any) => sum + (product.votes_count || product.votes || 0), 0);
    const avgVotes = products.length > 0 ? totalVotes / products.length : 0;
    
    // Enhanced sentiment analysis
    const sentiment = this.calculateProductHuntSentiment(products);
    
    // Enhanced metrics
    const metrics = {
      volume: products.length,
      engagement: this.calculateProductHuntEngagement(products.length, totalVotes),
      growth_rate: this.calculateProductHuntGrowthRate(products),
      total_votes: totalVotes,
      avg_votes: avgVotes
    };
    
    // Enhanced keywords
    const keywords = this.extractProductHuntKeywords(products, query);
    
    // Enhanced quotes
    const quotes = this.extractProductHuntQuotes(products);
    
    return {
      platform: 'producthunt',
      summary: this.generateProductHuntSummary(products.length, avgVotes, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateProductHuntInsights(products, query)
    };
  }

  private transformStackOverflowData(data: any, query: string): PremiumPlatformData {
    // Enhanced Stack Overflow data transformation
    const questions = data.questions || data.data || [];
    const totalVotes = questions.reduce((sum: number, q: any) => sum + (q.score || q.votes || 0), 0);
    const totalAnswers = questions.reduce((sum: number, q: any) => sum + (q.answer_count || 0), 0);
    const avgVotes = questions.length > 0 ? totalVotes / questions.length : 0;
    
    // Enhanced sentiment analysis
    const sentiment = this.calculateStackOverflowSentiment(questions);
    
    // Enhanced metrics
    const metrics = {
      volume: questions.length,
      engagement: this.calculateStackOverflowEngagement(questions.length, totalVotes, totalAnswers),
      growth_rate: this.calculateStackOverflowGrowthRate(questions),
      total_votes: totalVotes,
      total_answers: totalAnswers,
      avg_votes: avgVotes
    };
    
    // Enhanced keywords
    const keywords = this.extractStackOverflowKeywords(questions, query);
    
    // Enhanced quotes
    const quotes = this.extractStackOverflowQuotes(questions);
    
    return {
      platform: 'stackoverflow',
      summary: this.generateStackOverflowSummary(questions.length, avgVotes, totalAnswers, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateStackOverflowInsights(questions, query)
    };
  }

  private transformHackerNewsData(data: any, query: string): PremiumPlatformData {
    // Enhanced Hacker News data transformation
    const stories = data.stories || data.data || [];
    const totalPoints = stories.reduce((sum: number, story: any) => sum + (story.points || story.score || 0), 0);
    const totalComments = stories.reduce((sum: number, story: any) => sum + (story.num_comments || 0), 0);
    const avgPoints = stories.length > 0 ? totalPoints / stories.length : 0;
    
    // Enhanced sentiment analysis
    const sentiment = this.calculateHackerNewsSentiment(stories);
    
    // Enhanced metrics
    const metrics = {
      volume: stories.length,
      engagement: this.calculateHackerNewsEngagement(stories.length, totalPoints, totalComments),
      growth_rate: this.calculateHackerNewsGrowthRate(stories),
      total_points: totalPoints,
      total_comments: totalComments,
      avg_points: avgPoints
    };
    
    // Enhanced keywords
    const keywords = this.extractHackerNewsKeywords(stories, query);
    
    // Enhanced quotes
    const quotes = this.extractHackerNewsQuotes(stories);
    
    return {
      platform: 'hackernews',
      summary: this.generateHackerNewsSummary(stories.length, avgPoints, totalComments, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateHackerNewsInsights(stories, query)
    };
  }

  private transformGoogleNewsData(data: any, query: string): PremiumPlatformData {
    // Enhanced Google News data transformation
    const articles = data.articles || data.data || [];
    const totalRelevance = articles.reduce((sum: number, article: any) => sum + (article.relevance_score || 1), 0);
    const avgRelevance = articles.length > 0 ? totalRelevance / articles.length : 0;
    
    // Enhanced sentiment analysis
    const sentiment = this.calculateGoogleNewsSentiment(articles);
    
    // Enhanced metrics
    const metrics = {
      volume: articles.length,
      engagement: this.calculateGoogleNewsEngagement(articles.length, avgRelevance),
      growth_rate: this.calculateGoogleNewsGrowthRate(articles),
      total_relevance: totalRelevance,
      avg_relevance: avgRelevance
    };
    
    // Enhanced keywords
    const keywords = this.extractGoogleNewsKeywords(articles, query);
    
    // Enhanced quotes
    const quotes = this.extractGoogleNewsQuotes(articles);
    
    return {
      platform: 'googlenews',
      summary: this.generateGoogleNewsSummary(articles.length, avgRelevance, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateGoogleNewsInsights(articles, query)
    };
  }

  private transformYouTubeData(data: any, query: string): PremiumPlatformData {
    // Enhanced YouTube data transformation
    const videos = data.data?.videos || data.videos || data.data || [];
    
    // Ensure videos is an array
    if (!Array.isArray(videos)) {
      console.warn('⚠️ YouTube videos data is not an array:', videos);
      return this.generateFallbackData('youtube', query);
    }
    const totalViews = videos.reduce((sum: number, video: any) => sum + (video.view_count || video.views || 0), 0);
    const totalLikes = videos.reduce((sum: number, video: any) => sum + (video.like_count || video.likes || 0), 0);
    const totalComments = videos.reduce((sum: number, video: any) => sum + (video.comment_count || 0), 0);
    const avgViews = videos.length > 0 ? totalViews / videos.length : 0;
    
    // Enhanced sentiment analysis
    const sentiment = this.calculateYouTubeSentiment(videos);
    
    // Enhanced metrics
    const metrics = {
      volume: videos.length,
      engagement: this.calculateYouTubeEngagement(videos.length, totalViews, totalLikes, totalComments),
      growth_rate: this.calculateYouTubeGrowthRate(videos),
      total_views: totalViews,
      total_likes: totalLikes,
      total_comments: totalComments,
      avg_views: avgViews
    };
    
    // Enhanced keywords
    const keywords = this.extractYouTubeKeywords(videos, query);
    
    // Enhanced quotes
    const quotes = this.extractYouTubeQuotes(videos);
    
    return {
      platform: 'youtube',
      summary: this.generateYouTubeSummary(videos.length, avgViews, totalLikes, sentiment, query),
      sentiment,
      metrics,
      top_keywords: keywords,
      representative_quotes: quotes,
      additional_insights: this.generateYouTubeInsights(videos, query)
    };
  }

  // Enhanced helper methods
  private calculateAdvancedSentiment(posts: any[], scoreField: string, commentField: string) {
    const positivePosts = posts.filter(post => (post[scoreField] || 0) > 10);
    const neutralPosts = posts.filter(post => (post[scoreField] || 0) >= 0 && (post[scoreField] || 0) <= 10);
    const negativePosts = posts.filter(post => (post[scoreField] || 0) < 0);
    
    const total = posts.length || 1;
    
    return {
      positive: positivePosts.length / total,
      neutral: neutralPosts.length / total,
      negative: negativePosts.length / total
    };
  }

  private calculateEngagement(volume: number, totalScore: number, totalComments: number): number {
    if (volume === 0) return 0;
    
    // Normalize engagement score (0-1)
    const avgScore = totalScore / volume;
    const avgComments = totalComments / volume;
    
    // Weight: 70% score, 30% comments
    const scoreComponent = Math.min(avgScore / 100, 1) * 0.7;
    const commentComponent = Math.min(avgComments / 10, 1) * 0.3;
    
    return scoreComponent + commentComponent;
  }

  private calculateGrowthRate(items: any[], dateField: string): number {
    if (items.length < 2) return 0;
    
    // Calculate growth rate based on creation dates
    const sortedItems = items
      .filter(item => item[dateField])
      .sort((a, b) => a[dateField] - b[dateField]);
    
    if (sortedItems.length < 2) return 0;
    
    const recentItems = sortedItems.slice(-Math.floor(sortedItems.length * 0.3));
    const olderItems = sortedItems.slice(0, Math.floor(sortedItems.length * 0.3));
    
    const recentAvg = recentItems.length > 0 ? recentItems.length : 1;
    const olderAvg = olderItems.length > 0 ? olderItems.length : 1;
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  private extractAdvancedKeywords(items: any[], textFields: string[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    items.forEach(item => {
      textFields.forEach(field => {
        if (item[field]) {
          const text = item[field].toLowerCase();
          const words = text.split(/\s+/).filter(word => 
            word.length > 3 && 
            !['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will', 'from'].includes(word)
          );
          
          words.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (cleanWord.length > 3) {
              keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
            }
          });
        }
      });
    });
    
    // Sort by frequency and return top keywords
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractRepresentativeQuotes(items: any[], textField: string, scoreField?: string): Array<{text: string, sentiment: string}> {
    if (!items || items.length === 0) return [];
    
    let sortedItems = [...items];
    
    // Sort by score if available, otherwise by length
    if (scoreField) {
      sortedItems.sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0));
    } else {
      sortedItems.sort((a, b) => (b[textField]?.length || 0) - (a[textField]?.length || 0));
    }
    
    return sortedItems
      .slice(0, 3)
      .filter(item => item[textField] && item[textField].length > 10)
      .map(item => ({
        text: item[textField].substring(0, 100) + (item[textField].length > 100 ? '...' : ''),
        sentiment: this.getSentimentFromScore(item[scoreField] || 0)
      }));
  }

  private getSentimentFromScore(score: number): string {
    if (score > 10) return 'positive';
    if (score >= 0) return 'neutral';
    return 'negative';
  }

  // Platform-specific summary generators
  private generateRedditSummary(volume: number, avgScore: number, sentiment: any, query: string): string {
    const activityLevel = volume > 50 ? 'very high' : volume > 20 ? 'high' : volume > 10 ? 'moderate' : 'low';
    const sentimentLevel = sentiment.positive > 0.6 ? 'very positive' : sentiment.positive > 0.4 ? 'positive' : 'mixed';
    
    return `Reddit shows ${activityLevel} activity (${volume} posts) with ${sentimentLevel} sentiment (avg score: ${Math.round(avgScore)}) for "${query}"`;
  }

  private generateGitHubSummary(volume: number, totalStars: number, totalForks: number, sentiment: any, query: string): string {
    const activityLevel = volume > 30 ? 'very high' : volume > 15 ? 'high' : volume > 5 ? 'moderate' : 'low';
    const engagementLevel = totalStars > 1000 ? 'very high' : totalStars > 500 ? 'high' : totalStars > 100 ? 'moderate' : 'low';
    
    return `GitHub shows ${activityLevel} activity (${volume} repos) with ${engagementLevel} engagement (${totalStars} stars, ${totalForks} forks) for "${query}"`;
  }

  private generateProductHuntSummary(volume: number, avgVotes: number, sentiment: any, query: string): string {
    const activityLevel = volume > 20 ? 'very high' : volume > 10 ? 'high' : volume > 5 ? 'moderate' : 'low';
    const voteLevel = avgVotes > 50 ? 'very high' : avgVotes > 25 ? 'high' : avgVotes > 10 ? 'moderate' : 'low';
    
    return `Product Hunt shows ${activityLevel} activity (${volume} products) with ${voteLevel} community interest (avg ${Math.round(avgVotes)} votes) for "${query}"`;
  }

  private generateStackOverflowSummary(volume: number, avgVotes: number, totalAnswers: number, sentiment: any, query: string): string {
    const activityLevel = volume > 50 ? 'very high' : volume > 25 ? 'high' : volume > 10 ? 'moderate' : 'low';
    const answerLevel = totalAnswers > 100 ? 'very high' : totalAnswers > 50 ? 'high' : totalAnswers > 20 ? 'moderate' : 'low';
    
    return `Stack Overflow shows ${activityLevel} activity (${volume} questions) with ${answerLevel} community support (${totalAnswers} answers, avg ${Math.round(avgVotes)} votes) for "${query}"`;
  }

  private generateHackerNewsSummary(volume: number, avgPoints: number, totalComments: number, sentiment: any, query: string): string {
    const activityLevel = volume > 20 ? 'very high' : volume > 10 ? 'high' : volume > 5 ? 'moderate' : 'low';
    const pointLevel = avgPoints > 50 ? 'very high' : avgPoints > 25 ? 'high' : avgPoints > 10 ? 'moderate' : 'low';
    
    return `Hacker News shows ${activityLevel} activity (${volume} stories) with ${pointLevel} community interest (avg ${Math.round(avgPoints)} points, ${totalComments} comments) for "${query}"`;
  }

  private generateGoogleNewsSummary(volume: number, avgRelevance: number, sentiment: any, query: string): string {
    const activityLevel = volume > 30 ? 'very high' : volume > 15 ? 'high' : volume > 8 ? 'moderate' : 'low';
    const relevanceLevel = avgRelevance > 0.8 ? 'very high' : avgRelevance > 0.6 ? 'high' : avgRelevance > 0.4 ? 'moderate' : 'low';
    
    return `Google News shows ${activityLevel} activity (${volume} articles) with ${relevanceLevel} relevance (avg ${avgRelevance.toFixed(2)} score) for "${query}"`;
  }

  private generateYouTubeSummary(volume: number, avgViews: number, totalLikes: number, sentiment: any, query: string): string {
    const activityLevel = volume > 25 ? 'very high' : volume > 15 ? 'high' : volume > 8 ? 'moderate' : 'low';
    const viewLevel = avgViews > 100000 ? 'very high' : avgViews > 50000 ? 'high' : avgViews > 10000 ? 'moderate' : 'low';
    
    return `YouTube shows ${activityLevel} activity (${volume} videos) with ${viewLevel} engagement (avg ${this.formatNumber(avgViews)} views, ${this.formatNumber(totalLikes)} likes) for "${query}"`;
  }

  // Platform-specific insight generators
  private generateRedditInsights(posts: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (posts.length > 30) insights.push('High post volume indicates strong community interest');
    if (posts.some(p => (p.score || 0) > 100)) insights.push('Some posts have viral potential');
    if (posts.some(p => (p.num_comments || 0) > 50)) insights.push('Active discussions suggest engaged community');
    
    return insights;
  }

  private generateGitHubInsights(repos: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (repos.length > 20) insights.push('High repository count indicates strong developer interest');
    if (repos.some(r => (r.stargazers_count || 0) > 500)) insights.push('Some repositories have significant community support');
    if (repos.some(r => (r.forks_count || 0) > 100)) insights.push('High fork count suggests active development');
    
    return insights;
  }

  private generateProductHuntInsights(products: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (products.length > 15) insights.push('High product count indicates market readiness');
    if (products.some(p => (p.votes_count || 0) > 100)) insights.push('Some products have strong community validation');
    
    return insights;
  }

  private generateStackOverflowInsights(questions: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (questions.length > 40) insights.push('High question count indicates strong developer need');
    if (questions.some(q => (q.answer_count || 0) > 10)) insights.push('Well-answered questions suggest community expertise');
    
    return insights;
  }

  private generateHackerNewsInsights(stories: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (stories.length > 15) insights.push('High story count indicates strong developer interest');
    if (stories.some(s => (s.points || 0) > 100)) insights.push('Some stories have significant community validation');
    
    return insights;
  }

  private generateGoogleNewsInsights(articles: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (articles.length > 20) insights.push('High article count indicates strong media interest');
    if (articles.some(a => (a.relevance_score || 0) > 0.8)) insights.push('High relevance articles suggest focused coverage');
    
    return insights;
  }

  private generateYouTubeInsights(videos: any[], query: string): string[] {
    const insights: string[] = [];
    
    if (videos.length > 20) insights.push('High video count indicates strong content creator interest');
    if (videos.some(v => (v.view_count || 0) > 100000)) insights.push('Some videos have significant reach');
    
    return insights;
  }

  // Platform-specific calculation methods
  private calculateGitHubSentiment(repos: any[]) {
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const totalIssues = repos.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0);
    
    const avgStars = repos.length > 0 ? totalStars / repos.length : 0;
    const avgForks = repos.length > 0 ? totalForks / repos.length : 0;
    
    // Positive if high stars/forks, negative if many issues
    const positive = Math.min(1, (avgStars + avgForks) / 100);
    const negative = Math.min(1, totalIssues / (repos.length * 10));
    const neutral = Math.max(0, 1 - positive - negative);
    
    return { positive, neutral, negative };
  }

  private calculateGitHubEngagement(volume: number, totalStars: number, totalForks: number): number {
    if (volume === 0) return 0;
    
    const avgStars = totalStars / volume;
    const avgForks = totalForks / volume;
    
    // Normalize engagement score (0-1)
    return Math.min(1, (avgStars + avgForks * 2) / 200);
  }

  private calculateGitHubGrowthRate(repos: any[]): number {
    if (repos.length < 2) return 0;
    
    const sortedRepos = repos
      .filter(repo => repo.created_at)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    if (sortedRepos.length < 2) return 0;
    
    const recentRepos = sortedRepos.slice(-Math.floor(sortedRepos.length * 0.3));
    const olderRepos = sortedRepos.slice(0, Math.floor(sortedRepos.length * 0.3));
    
    const recentAvg = recentRepos.length > 0 ? recentRepos.length : 1;
    const olderAvg = olderRepos.length > 0 ? olderRepos.length : 1;
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  private extractGitHubKeywords(repos: any[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    repos.forEach(repo => {
      const text = `${repo.name || ''} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
      const words = text.split(/\s+/).filter(word => 
        word.length > 3 && 
        !['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will', 'from'].includes(word)
      );
      
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });
    
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractGitHubQuotes(repos: any[]): Array<{text: string, sentiment: string}> {
    return repos
      .slice(0, 3)
      .filter(repo => repo.name || repo.description)
      .map(repo => ({
        text: repo.description ? `${repo.name}: ${repo.description.substring(0, 80)}...` : repo.name,
        sentiment: 'positive'
      }));
  }

  // Similar methods for other platforms...
  private calculateProductHuntSentiment(products: any[]) {
    const totalVotes = products.reduce((sum, product) => sum + (product.votes_count || 0), 0);
    const avgVotes = products.length > 0 ? totalVotes / products.length : 0;
    
    const positive = Math.min(1, avgVotes / 50);
    const neutral = Math.max(0, 1 - positive);
    
    return { positive, neutral, negative: 0 };
  }

  private calculateProductHuntEngagement(volume: number, totalVotes: number): number {
    if (volume === 0) return 0;
    return Math.min(1, (totalVotes / volume) / 50);
  }

  private calculateProductHuntGrowthRate(products: any[]): number {
    // Product Hunt growth rate calculation
    return 0.2; // Placeholder
  }

  private extractProductHuntKeywords(products: any[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    products.forEach(product => {
      const text = `${product.name || ''} ${product.tagline || ''} ${(product.topics || []).join(' ')}`.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 3);
      
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });
    
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractProductHuntQuotes(products: any[]): Array<{text: string, sentiment: string}> {
    return products
      .slice(0, 3)
      .filter(product => product.name || product.tagline)
      .map(product => ({
        text: product.tagline ? `${product.name}: ${product.tagline}` : product.name,
        sentiment: 'positive'
      }));
  }

  // Stack Overflow methods
  private calculateStackOverflowSentiment(questions: any[]) {
    const totalVotes = questions.reduce((sum, q) => sum + (q.score || 0), 0);
    const avgVotes = questions.length > 0 ? totalVotes / questions.length : 0;
    
    const positive = Math.min(1, Math.max(0, avgVotes + 10) / 20);
    const neutral = Math.max(0, 1 - positive);
    
    return { positive, neutral, negative: 0 };
  }

  private calculateStackOverflowEngagement(volume: number, totalVotes: number, totalAnswers: number): number {
    if (volume === 0) return 0;
    
    const avgVotes = totalVotes / volume;
    const avgAnswers = totalAnswers / volume;
    
    return Math.min(1, (avgVotes + avgAnswers * 2) / 30);
  }

  private calculateStackOverflowGrowthRate(questions: any[]): number {
    return 0.15; // Placeholder
  }

  private extractStackOverflowKeywords(questions: any[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    questions.forEach(q => {
      const text = `${q.title || ''} ${(q.tags || []).join(' ')}`.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 3);
      
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });
    
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractStackOverflowQuotes(questions: any[]): Array<{text: string, sentiment: string}> {
    return questions
      .slice(0, 3)
      .filter(q => q.title)
      .map(q => ({
        text: q.title.length > 80 ? q.title.substring(0, 80) + '...' : q.title,
        sentiment: 'neutral'
      }));
  }

  // Hacker News methods
  private calculateHackerNewsSentiment(stories: any[]) {
    const totalPoints = stories.reduce((sum, story) => sum + (story.points || 0), 0);
    const avgPoints = stories.length > 0 ? totalPoints / stories.length : 0;
    
    const positive = Math.min(1, avgPoints / 50);
    const neutral = Math.max(0, 1 - positive);
    
    return { positive, neutral, negative: 0 };
  }

  private calculateHackerNewsEngagement(volume: number, totalPoints: number, totalComments: number): number {
    if (volume === 0) return 0;
    
    const avgPoints = totalPoints / volume;
    const avgComments = totalComments / volume;
    
    return Math.min(1, (avgPoints + avgComments * 2) / 100);
  }

  private calculateHackerNewsGrowthRate(stories: any[]): number {
    return 0.18; // Placeholder
  }

  private extractHackerNewsKeywords(stories: any[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    stories.forEach(story => {
      const text = `${story.title || ''}`.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 3);
      
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });
    
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractHackerNewsQuotes(stories: any[]): Array<{text: string, sentiment: string}> {
    return stories
      .slice(0, 3)
      .filter(story => story.title)
      .map(story => ({
        text: story.title.length > 80 ? story.title.substring(0, 80) + '...' : story.title,
        sentiment: 'neutral'
      }));
  }

  // Google News methods
  private calculateGoogleNewsSentiment(articles: any[]) {
    // Google News sentiment is typically neutral
    return { positive: 0.4, neutral: 0.5, negative: 0.1 };
  }

  private calculateGoogleNewsEngagement(volume: number, avgRelevance: number): number {
    return Math.min(1, avgRelevance);
  }

  private calculateGoogleNewsGrowthRate(articles: any[]): number {
    return 0.12; // Placeholder
  }

  private extractGoogleNewsKeywords(articles: any[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    articles.forEach(article => {
      const text = `${article.title || ''} ${article.snippet || ''}`.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 3);
      
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });
    
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractGoogleNewsQuotes(articles: any[]): Array<{text: string, sentiment: string}> {
    return articles
      .slice(0, 3)
      .filter(article => article.title)
      .map(article => ({
        text: article.title.length > 80 ? article.title.substring(0, 80) + '...' : article.title,
        sentiment: 'neutral'
      }));
  }

  // YouTube methods
  private calculateYouTubeSentiment(videos: any[]) {
    const totalLikes = videos.reduce((sum, video) => sum + (video.like_count || 0), 0);
    const totalViews = videos.reduce((sum, video) => sum + (video.view_count || 0), 0);
    
    const likeRatio = totalViews > 0 ? totalLikes / totalViews : 0;
    const positive = Math.min(1, likeRatio * 10);
    const neutral = Math.max(0, 1 - positive);
    
    return { positive, neutral, negative: 0 };
  }

  private calculateYouTubeEngagement(volume: number, totalViews: number, totalLikes: number, totalComments: number): number {
    if (volume === 0) return 0;
    
    const avgViews = totalViews / volume;
    const avgLikes = totalLikes / volume;
    const avgComments = totalComments / volume;
    
    // Normalize engagement score (0-1)
    return Math.min(1, (avgViews / 10000 + avgLikes / 1000 + avgComments / 100) / 3);
  }

  private calculateYouTubeGrowthRate(videos: any[]): number {
    return 0.25; // Placeholder
  }

  private extractYouTubeKeywords(videos: any[], query: string): string[] {
    const keywordMap = new Map<string, number>();
    
    videos.forEach(video => {
      const text = `${video.title || ''} ${video.description || ''}`.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 3);
      
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          keywordMap.set(cleanWord, (keywordMap.get(cleanWord) || 0) + 1);
        }
      });
    });
    
    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([keyword]) => keyword);
  }

  private extractYouTubeQuotes(videos: any[]): Array<{text: string, sentiment: string}> {
    return videos
      .slice(0, 3)
      .filter(video => video.title)
      .map(video => ({
        text: video.title.length > 80 ? video.title.substring(0, 80) + '...' : video.title,
        sentiment: 'positive'
      }));
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  private generateFallbackData(platform: string, query: string): PremiumPlatformData {
    console.warn(`⚠️ Using fallback data for ${platform}`);
    
    return {
      platform: platform as any,
      summary: `Limited data available for ${platform} - using fallback analysis`,
      sentiment: { positive: 0.5, neutral: 0.4, negative: 0.1 },
      metrics: { volume: 10, engagement: 0.5, growth_rate: 0.1 },
      top_keywords: [query, 'analysis', 'data'],
      representative_quotes: [
        { text: `Analysis for ${query} on ${platform}`, sentiment: 'neutral' }
      ],
      additional_insights: [`Limited data available for ${platform}`]
    };
  }

  /**
   * Enhance platform data with Social Arbitrage metrics (Premium feature)
   */
  private enhanceWithArbitrageMetrics(
    platforms: PremiumPlatformData[], 
    query: string
  ): PremiumPlatformDataWithArbitrage[] {
    console.log('🧠 Enhancing platforms with Social Arbitrage metrics...');
    
    return platforms.map(platform => {
      try {
        // Calculate arbitrage metrics
        const arbitrageMetrics = arbitrageMetricsService.calculateArbitrageMetrics(platform, platforms);
        
        // Generate catalysts
        const catalysts = arbitrageMetricsService.generateCatalysts(platform);
        
        // Generate plays
        const plays = arbitrageMetricsService.generatePlays(platform, arbitrageMetrics);
        
        const enhancedPlatform: PremiumPlatformDataWithArbitrage = {
          ...platform,
          arbitrage: arbitrageMetrics,
          catalysts,
          plays
        };
        
        console.log(`✨ ${platform.platform} enhanced with arbitrage metrics (MG: ${(arbitrageMetrics.mispricing_gap * 100).toFixed(1)}%)`);
        
        return enhancedPlatform;
      } catch (error) {
        console.warn(`⚠️ Failed to enhance ${platform.platform} with arbitrage metrics:`, error);
        // Return platform without arbitrage data
        return { ...platform };
      }
    });
  }

  /**
   * Sort platforms by arbitrage opportunity (Premium feature)
   */
  sortByArbitrage(platforms: PremiumPlatformDataWithArbitrage[]): PremiumPlatformDataWithArbitrage[] {
    return platforms.sort((a, b) => {
      const aGap = a.arbitrage?.mispricing_gap || 0;
      const bGap = b.arbitrage?.mispricing_gap || 0;
      
      if (aGap !== bGap) {
        return bGap - aGap; // Higher gap first
      }
      
      // Secondary sort by influencer momentum
      const aMomentum = a.arbitrage?.influencer_momentum || 0;
      const bMomentum = b.arbitrage?.influencer_momentum || 0;
      
      return bMomentum - aMomentum;
    });
  }
}

export const premiumPlatformScannerService = new PremiumPlatformScannerService();

