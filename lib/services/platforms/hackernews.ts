// Hacker News API integration
import { cache } from '../cache';
import { CACHE_TTL } from '../cache';

interface HNSearchResult {
  hits: Array<{
    objectID: string;
    title: string;
    url?: string;
    author: string;
    points: number;
    created_at: string;
    num_comments: number;
  }>;
}

export class HackerNewsService {
  private baseUrl = 'https://hacker-news.firebaseio.com/v0';
  private searchUrl = 'http://hn.algolia.com/api/v1/search';

  // Main search method for multi-platform integration
  async searchStories(query: string, limit = 20): Promise<{
    stories: any[];
    totalResults: number;
  }> {
    const stories = await this.searchStoriesInternal(query, limit);
    return {
      stories,
      totalResults: stories.length
    };
  }

  private async searchStoriesInternal(query: string, limit = 20): Promise<any[]> {
    const cacheKey = `hn:search:${query}:${limit}`;
    
    // Check cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use Algolia search for better results
      const searchResponse = await fetch(
        `${this.searchUrl}?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit}`
      );
      
      if (!searchResponse.ok) {
        throw new Error(`HN search failed: ${searchResponse.status}`);
      }

      const searchData: any = await searchResponse.json();
      
      const stories = searchData.hits.map((hit: any) => ({
        id: hit.objectID,
        title: hit.title,
        url: hit.url,
        author: hit.author,
        score: hit.points,
        comments: hit.num_comments,
        created_at: hit.created_at,
        platform: 'hackernews',
        source_url: `https://news.ycombinator.com/item?id=${hit.objectID}`
      }));

      // Cache results
      await cache.set(cacheKey, stories, CACHE_TTL.HACKERNEWS);
      
      return stories;
    } catch (error) {
      console.error('HackerNews search error:', error);
      return [];
    }
  }

  async getTopStories(limit = 30): Promise<any[]> {
    const cacheKey = `hn:top:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get top story IDs
      const topStoriesResponse = await fetch(`${this.baseUrl}/topstories.json`);
      const topStoryIds: any = await topStoriesResponse.json();
      
      // Get first 'limit' stories
      const storyPromises = topStoryIds.slice(0, limit).map(async (id: number) => {
        const storyResponse = await fetch(`${this.baseUrl}/item/${id}.json`);
        return storyResponse.json();
      });

      const stories = await Promise.all(storyPromises);
      
      const formattedStories = stories
        .filter((story: any) => story && story.title)
        .map((story: any) => ({
          id: story.id,
          title: story.title,
          url: story.url,
          author: story.by,
          score: story.score,
          comments: story.descendants || 0,
          created_at: new Date(story.time * 1000).toISOString(),
          platform: 'hackernews',
          source_url: `https://news.ycombinator.com/item?id=${story.id}`
        }));

      await cache.set(cacheKey, formattedStories, CACHE_TTL.HACKERNEWS);
      
      return formattedStories;
    } catch (error) {
      console.error('HackerNews top stories error:', error);
      return [];
    }
  }
}

export const hackerNewsService = new HackerNewsService();