// Multi-platform data aggregation service
import { hackerNewsService } from './platforms/hackernews';
import { productHuntService } from './platforms/producthunt';
import { googleNewsService } from './platforms/googlenews';
import { gitHubService } from './platforms/github';
import { stackOverflowService } from './platforms/stackoverflow';
import { youTubeService } from './platforms/youtube';
import { redditService } from './platforms/reddit';
import { g2Service } from './platforms/g2';
import { upworkService } from './platforms/upwork';

export interface PlatformData {
  platform: string;
  items: any[];
  error?: string;
}

export interface MultiPlatformResult {
  query: string;
  totalItems: number;
  platforms: PlatformData[];
  summary: {
    reddit: number;
    hackernews: number;
    producthunt: number;
    googlenews: number;
    github: number;
    stackoverflow: number;
    youtube: number;
    g2: number;
    upwork: number;
  };
}

export class MultiPlatformService {
  async searchAllPlatforms(query: string, limit = 15): Promise<MultiPlatformResult> {
    console.log(`🔍 Searching across all platforms for: "${query}"`);
    
    // Execute all searches in parallel for better performance
    const [
      redditResults,
      hackerNewsResults,
      productHuntResults,
      googleNewsResults,
      githubResults,
      stackOverflowResults,
      youtubeResults,
      g2Results,
      upworkResults
    ] = await Promise.allSettled([
      redditService.searchPostsRSS(query, ['startups', 'entrepreneur', 'SaaS', 'indiehackers'], limit),
      hackerNewsService.searchStories(query, limit),
      productHuntService.searchProducts(query),
      googleNewsService.searchNews(query, limit),
      gitHubService.searchRepositories(query, limit),
      stackOverflowService.searchQuestions(query, limit),
      youTubeService.searchVideos(query, limit),
      g2Service.searchSoftware(query, limit),
      upworkService.searchJobs(query, limit)
    ]);

    const platforms: PlatformData[] = [
      {
        platform: 'reddit',
        items: redditResults.status === 'fulfilled' ? redditResults.value : [],
        error: redditResults.status === 'rejected' ? redditResults.reason.message : undefined
      },
      {
        platform: 'hackernews',
        items: hackerNewsResults.status === 'fulfilled' ? hackerNewsResults.value : [],
        error: hackerNewsResults.status === 'rejected' ? hackerNewsResults.reason.message : undefined
      },
      {
        platform: 'producthunt',
        items: productHuntResults.status === 'fulfilled' ? productHuntResults.value : [],
        error: productHuntResults.status === 'rejected' ? productHuntResults.reason.message : undefined
      },
      {
        platform: 'googlenews',
        items: googleNewsResults.status === 'fulfilled' ? googleNewsResults.value : [],
        error: googleNewsResults.status === 'rejected' ? googleNewsResults.reason.message : undefined
      },
      {
        platform: 'github',
        items: githubResults.status === 'fulfilled' ? githubResults.value : [],
        error: githubResults.status === 'rejected' ? githubResults.reason.message : undefined
      },
      {
        platform: 'stackoverflow',
        items: stackOverflowResults.status === 'fulfilled' ? stackOverflowResults.value : [],
        error: stackOverflowResults.status === 'rejected' ? stackOverflowResults.reason.message : undefined
      },
      {
        platform: 'youtube',
        items: youtubeResults.status === 'fulfilled' ? youtubeResults.value : [],
        error: youtubeResults.status === 'rejected' ? youtubeResults.reason.message : undefined
      },
      {
        platform: 'g2',
        items: g2Results.status === 'fulfilled' ? g2Results.value : [],
        error: g2Results.status === 'rejected' ? g2Results.reason.message : undefined
      },
      {
        platform: 'upwork',
        items: upworkResults.status === 'fulfilled' ? upworkResults.value : [],
        error: upworkResults.status === 'rejected' ? upworkResults.reason.message : undefined
      }
    ];

    const totalItems = platforms.reduce((sum, platform) => sum + platform.items.length, 0);

    const summary = {
      reddit: platforms.find(p => p.platform === 'reddit')?.items.length || 0,
      hackernews: platforms.find(p => p.platform === 'hackernews')?.items.length || 0,
      producthunt: platforms.find(p => p.platform === 'producthunt')?.items.length || 0,
      googlenews: platforms.find(p => p.platform === 'googlenews')?.items.length || 0,
      github: platforms.find(p => p.platform === 'github')?.items.length || 0,
      stackoverflow: platforms.find(p => p.platform === 'stackoverflow')?.items.length || 0,
      youtube: platforms.find(p => p.platform === 'youtube')?.items.length || 0,
      g2: platforms.find(p => p.platform === 'g2')?.items.length || 0,
      upwork: platforms.find(p => p.platform === 'upwork')?.items.length || 0,
    };

    console.log(`✅ Multi-platform search completed:`, summary);

    return {
      query,
      totalItems,
      platforms,
      summary
    };
  }

  async getTrendingContent(): Promise<MultiPlatformResult> {
    console.log(`📈 Fetching trending content from all platforms`);
    
    const [
      redditTrending,
      hackerNewsTop,
      productHuntDaily,
      googleNewsTech,
      githubTrending,
      stackOverflowTrending,
      youtubeTech
    ] = await Promise.allSettled([
      redditService.getTrendingByTopic('startup', 15),
      hackerNewsService.getTopStories(15),
      productHuntService.getDailyProducts(15),
      googleNewsService.getTechNews(15),
      gitHubService.getTrendingRepositories('', 15),
      stackOverflowService.getTrendingQuestions(15),
      youTubeService.getTechChannelsVideos(15)
    ]);

    const platforms: PlatformData[] = [
      {
        platform: 'reddit',
        items: redditTrending.status === 'fulfilled' ? redditTrending.value : [],
        error: redditTrending.status === 'rejected' ? redditTrending.reason.message : undefined
      },
      {
        platform: 'hackernews',
        items: hackerNewsTop.status === 'fulfilled' ? hackerNewsTop.value : [],
        error: hackerNewsTop.status === 'rejected' ? hackerNewsTop.reason.message : undefined
      },
      {
        platform: 'producthunt',
        items: productHuntDaily.status === 'fulfilled' ? productHuntDaily.value : [],
        error: productHuntDaily.status === 'rejected' ? productHuntDaily.reason.message : undefined
      },
      {
        platform: 'googlenews',
        items: googleNewsTech.status === 'fulfilled' ? googleNewsTech.value : [],
        error: googleNewsTech.status === 'rejected' ? googleNewsTech.reason.message : undefined
      },
      {
        platform: 'github',
        items: githubTrending.status === 'fulfilled' ? githubTrending.value : [],
        error: githubTrending.status === 'rejected' ? githubTrending.reason.message : undefined
      },
      {
        platform: 'stackoverflow',
        items: stackOverflowTrending.status === 'fulfilled' ? stackOverflowTrending.value : [],
        error: stackOverflowTrending.status === 'rejected' ? stackOverflowTrending.reason.message : undefined
      },
      {
        platform: 'youtube',
        items: youtubeTech.status === 'fulfilled' ? youtubeTech.value : [],
        error: youtubeTech.status === 'rejected' ? youtubeTech.reason.message : undefined
      }
    ];

    const totalItems = platforms.reduce((sum, platform) => sum + platform.items.length, 0);

    const summary = {
      reddit: platforms.find(p => p.platform === 'reddit')?.items.length || 0,
      hackernews: platforms.find(p => p.platform === 'hackernews')?.items.length || 0,
      producthunt: platforms.find(p => p.platform === 'producthunt')?.items.length || 0,
      googlenews: platforms.find(p => p.platform === 'googlenews')?.items.length || 0,
      github: platforms.find(p => p.platform === 'github')?.items.length || 0,
      stackoverflow: platforms.find(p => p.platform === 'stackoverflow')?.items.length || 0,
      youtube: platforms.find(p => p.platform === 'youtube')?.items.length || 0,
    };

    console.log(`✅ Trending content fetched:`, summary);

    return {
      query: 'trending',
      totalItems,
      platforms,
      summary
    };
  }

  // Reddit search is now handled by redditService directly

  async getPlatformStats(): Promise<{ [key: string]: { available: boolean; lastCheck: string } }> {
    const stats: { [key: string]: { available: boolean; lastCheck: string } } = {};
    const now = new Date().toISOString();

    // Test each platform with a simple query
    const testPromises = [
      { name: 'reddit', test: () => redditService.getSubredditPostsRSS('startups', 1) },
      { name: 'hackernews', test: () => hackerNewsService.getTopStories(1) },
      { name: 'producthunt', test: () => productHuntService.getDailyProducts(1) },
      { name: 'googlenews', test: () => googleNewsService.getTechNews(1) },
      { name: 'github', test: () => gitHubService.searchRepositories('test', 1) },
      { name: 'stackoverflow', test: () => stackOverflowService.searchQuestions('test', 1) },
      { name: 'youtube', test: () => youTubeService.searchVideos('test', 1) }
    ];

    for (const { name, test } of testPromises) {
      try {
        await test();
        stats[name] = { available: true, lastCheck: now };
      } catch (error) {
        stats[name] = { available: false, lastCheck: now };
      }
    }

    return stats;
  }
}

export const multiPlatformService = new MultiPlatformService();