// Reddit API + RSS integration
import { cache, CACHE_TTL } from '../cache';
import Parser from 'rss-parser';

interface RedditPost {
  id: string;
  title: string;
  content: string;
  author: string;
  subreddit: string;
  score: number;
  comments: number;
  url: string;
  created: string;
  platform: string;
}

interface RedditAPIResponse {
  data: {
    children: Array<{
      data: {
        id: string;
        title: string;
        selftext: string;
        author: string;
        subreddit: string;
        score: number;
        num_comments: number;
        url: string;
        permalink: string;
        created_utc: number;
      };
    }>;
  };
}

export class RedditService {
  private parser = new Parser({
    customFields: {
      item: ['content:encoded', 'description']
    }
  });

  // Reddit API Methods (for when we have credentials)
  async searchPostsAPI(query: string, subreddits: string[] = [], limit = 25): Promise<RedditPost[]> {
    const cacheKey = `reddit:api:search:${query}:${subreddits.join(',')}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const allPosts: RedditPost[] = [];

      // Search in specific subreddits or globally
      if (subreddits.length > 0) {
        for (const subreddit of subreddits) {
          const posts = await this.getSubredditPostsAPI(subreddit, query, Math.ceil(limit / subreddits.length));
          allPosts.push(...posts);
        }
      } else {
        // Global search
        const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`;
        const posts = await this.fetchRedditAPI(searchUrl);
        allPosts.push(...posts);
      }

      // Sort by score and limit
      const sortedPosts = allPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      await cache.set(cacheKey, sortedPosts, CACHE_TTL.REDDIT);
      
      return sortedPosts;
    } catch (error) {
      console.error('Reddit API search error:', error);
      // Fallback to RSS
      return this.searchPostsRSS(query, subreddits, limit);
    }
  }

  async getSubredditPostsAPI(subreddit: string, query?: string, limit = 25): Promise<RedditPost[]> {
    const cacheKey = `reddit:api:subreddit:${subreddit}:${query || 'hot'}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let url: string;
      if (query) {
        url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}&sort=relevance`;
      } else {
        url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
      }

      const posts = await this.fetchRedditAPI(url);
      
      await cache.set(cacheKey, posts, CACHE_TTL.REDDIT);
      
      return posts;
    } catch (error) {
      console.error(`Reddit API subreddit error for r/${subreddit}:`, error);
      // Fallback to RSS
      return this.getSubredditPostsRSS(subreddit, limit);
    }
  }

  private async fetchRedditAPI(url: string): Promise<RedditPost[]> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Validationly/1.0 (Startup Validation Tool)'
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data: RedditAPIResponse = await response.json();
    
    return data.data.children.map(child => ({
      id: child.data.id,
      title: child.data.title,
      content: child.data.selftext || '',
      author: child.data.author,
      subreddit: child.data.subreddit,
      score: child.data.score,
      comments: child.data.num_comments,
      url: `https://www.reddit.com${child.data.permalink}`,
      created: new Date(child.data.created_utc * 1000).toISOString(),
      platform: 'reddit'
    }));
  }

  // RSS Methods (current implementation)
  async searchPostsRSS(query: string, subreddits: string[] = ['startups', 'entrepreneur', 'SaaS'], limit = 25): Promise<RedditPost[]> {
    const cacheKey = `reddit:rss:search:${query}:${subreddits.join(',')}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const allPosts: RedditPost[] = [];
      
      // Fetch from each subreddit
      for (const subreddit of subreddits) {
        try {
          const posts = await this.getSubredditPostsRSS(subreddit, Math.ceil(limit / subreddits.length));
          
          // Filter posts by query
          const relevantPosts = posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())
          );
          
          allPosts.push(...relevantPosts);
        } catch (error) {
          console.error(`Error fetching r/${subreddit}:`, error);
        }
      }
      
      // Sort by score and limit
      const sortedPosts = allPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      await cache.set(cacheKey, sortedPosts, CACHE_TTL.REDDIT);
      
      return sortedPosts;
    } catch (error) {
      console.error('Reddit RSS search error:', error);
      return [];
    }
  }

  async getSubredditPostsRSS(subreddit: string, limit = 25): Promise<RedditPost[]> {
    const cacheKey = `reddit:rss:subreddit:${subreddit}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const rssUrl = `https://www.reddit.com/r/${subreddit}/new.rss?limit=${limit}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const feed = await this.parser.parseURL(rssUrl);
      clearTimeout(timeoutId);
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`No posts found in r/${subreddit}`);
        return [];
      }
      
      const posts = feed.items.map(item => this.parseRSSPost(item, subreddit));
      
      await cache.set(cacheKey, posts, CACHE_TTL.REDDIT);
      
      return posts;
    } catch (error) {
      console.error(`Error fetching RSS for r/${subreddit}:`, error);
      return [];
    }
  }

  private parseRSSPost(item: any, subreddit: string): RedditPost {
    const content = item['content:encoded'] || item.description || item.contentSnippet || '';
    
    // Extract score and comments from content (Reddit RSS includes this info)
    const scoreMatch = content.match(/(\d+) points?/);
    const commentsMatch = content.match(/(\d+) comments?/);
    
    return {
      id: item.guid || item.link || '',
      title: item.title || '',
      content: content.replace(/<[^>]*>/g, '').substring(0, 500), // Remove HTML tags and limit length
      author: item.creator || 'unknown',
      subreddit: subreddit,
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      comments: commentsMatch ? parseInt(commentsMatch[1]) : 0,
      url: item.link || '',
      created: new Date(item.pubDate || item.isoDate || Date.now()).toISOString(),
      platform: 'reddit'
    };
  }

  // Trending subreddits for different topics
  async getTrendingByTopic(topic: string, limit = 30): Promise<RedditPost[]> {
    const topicSubreddits: { [key: string]: string[] } = {
      'startup': ['startups', 'entrepreneur', 'SaaS', 'indiehackers', 'smallbusiness'],
      'tech': ['technology', 'programming', 'webdev', 'MachineLearning', 'artificial'],
      'business': ['business', 'marketing', 'sales', 'freelance', 'consulting'],
      'product': ['product_management', 'userexperience', 'design', 'ProductHunters'],
      'finance': ['investing', 'financialindependence', 'stocks', 'cryptocurrency'],
      'ai': ['artificial', 'MachineLearning', 'OpenAI', 'ChatGPT', 'singularity']
    };

    const subreddits = topicSubreddits[topic.toLowerCase()] || topicSubreddits['startup'];
    
    const allPosts: RedditPost[] = [];
    
    for (const subreddit of subreddits) {
      try {
        const posts = await this.getSubredditPostsRSS(subreddit, Math.ceil(limit / subreddits.length));
        allPosts.push(...posts);
      } catch (error) {
        console.error(`Error fetching trending from r/${subreddit}:`, error);
      }
    }
    
    // Sort by score and recency
    return allPosts
      .sort((a, b) => {
        const scoreA = b.score + (Date.now() - new Date(b.created).getTime()) / 1000000;
        const scoreB = a.score + (Date.now() - new Date(a.created).getTime()) / 1000000;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}

export const redditService = new RedditService();