// YouTube API + RSS integration
import { cache, CACHE_TTL } from '../cache';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  channel: string;
  published: string;
  platform: string;
}

export class YouTubeService {
  private apiKey = process.env.YOUTUBE_API_KEY;
  private apiBaseUrl = 'https://www.googleapis.com/youtube/v3';

  // YouTube API Methods (for when we have API key)
  async searchVideosAPI(query: string, limit = 20): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      console.log('YouTube API key not available, falling back to RSS');
      return this.searchVideos(query, limit);
    }

    const cacheKey = `yt:api:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Search for videos
      const searchUrl = `${this.apiBaseUrl}/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(query)}&` +
        `type=video&` +
        `maxResults=${limit}&` +
        `order=relevance&` +
        `key=${this.apiKey}`;

      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channel: item.snippet.channelTitle,
        published: item.snippet.publishedAt,
        platform: 'youtube',
        thumbnail: item.snippet.thumbnails?.medium?.url
      }));

      await cache.set(cacheKey, videos, CACHE_TTL.YOUTUBE);
      
      return videos;
    } catch (error) {
      console.error('YouTube API search error:', error);
      // Fallback to RSS
      return this.searchVideos(query, limit);
    }
  }

  async getVideoDetailsAPI(videoIds: string[]): Promise<any[]> {
    if (!this.apiKey || videoIds.length === 0) {
      return [];
    }

    const cacheKey = `yt:api:details:${videoIds.join(',')}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const detailsUrl = `${this.apiBaseUrl}/videos?` +
        `part=snippet,statistics&` +
        `id=${videoIds.join(',')}&` +
        `key=${this.apiKey}`;

      const response = await fetch(detailsUrl);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      const videoDetails = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channel: item.snippet.channelTitle,
        published: item.snippet.publishedAt,
        views: parseInt(item.statistics.viewCount || '0'),
        likes: parseInt(item.statistics.likeCount || '0'),
        comments: parseInt(item.statistics.commentCount || '0'),
        url: `https://www.youtube.com/watch?v=${item.id}`,
        platform: 'youtube'
      }));

      await cache.set(cacheKey, videoDetails, CACHE_TTL.YOUTUBE);
      
      return videoDetails;
    } catch (error) {
      console.error('YouTube API details error:', error);
      return [];
    }
  }

  // RSS Methods (current implementation)
  async parseRSSFeed(url: string): Promise<YouTubeVideo[]> {
    try {
      const response = await fetch(url);
      const xmlText = await response.text();
      
      const videos: YouTubeVideo[] = [];
      const entryMatches = xmlText.match(/<entry[^>]*>[\s\S]*?<\/entry>/g) || [];
      
      for (const entryXml of entryMatches) {
        const title = this.extractXMLContent(entryXml, 'title');
        const description = this.extractXMLContent(entryXml, 'media:description');
        const videoId = this.extractVideoId(entryXml);
        const channel = this.extractXMLContent(entryXml, 'name');
        const published = this.extractXMLContent(entryXml, 'published');
        
        if (title && videoId) {
          videos.push({
            id: videoId,
            title: this.cleanText(title),
            description: this.cleanText(description),
            url: `https://www.youtube.com/watch?v=${videoId}`,
            channel: this.cleanText(channel),
            published,
            platform: 'youtube'
          });
        }
      }
      
      return videos;
    } catch (error) {
      console.error('YouTube RSS parsing error:', error);
      return [];
    }
  }

  private extractVideoId(xml: string): string {
    const regex = /<yt:videoId>([^<]+)<\/yt:videoId>/;
    const match = xml.match(regex);
    return match ? match[1] : '';
  }

  private extractXMLContent(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  private cleanText(text: string): string {
    return text
      .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  async searchVideos(query: string, limit = 20): Promise<YouTubeVideo[]> {
    const cacheKey = `yt:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const searchUrl = `https://www.youtube.com/feeds/videos.xml?search_query=${encodeURIComponent(query)}`;
      const videos = await this.parseRSSFeed(searchUrl);
      const limitedVideos = videos.slice(0, limit);
      
      await cache.set(cacheKey, limitedVideos, CACHE_TTL.YOUTUBE);
      
      return limitedVideos;
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  }

  async getChannelVideos(channelId: string, limit = 20): Promise<YouTubeVideo[]> {
    const cacheKey = `yt:channel:${channelId}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const channelUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const videos = await this.parseRSSFeed(channelUrl);
      const limitedVideos = videos.slice(0, limit);
      
      await cache.set(cacheKey, limitedVideos, CACHE_TTL.YOUTUBE);
      
      return limitedVideos;
    } catch (error) {
      console.error('YouTube channel videos error:', error);
      return [];
    }
  }

  async getTechChannelsVideos(limit = 30): Promise<YouTubeVideo[]> {
    // Popular tech channels
    const techChannels = [
      'UCVYamHliCI9rw1tHR1xbkfw', // Dave2D
      'UCBJycsmduvYEL83R_U4JriQ', // Marques Brownlee
      'UC2eYFnH61tmytImy1mTYvhA', // Luke Smith
      'UCld68syR8Wi-GY_n4CaoJGA', // Brodie Robertson
    ];

    const allVideos: YouTubeVideo[] = [];
    
    for (const channelId of techChannels) {
      try {
        const videos = await this.getChannelVideos(channelId, 10);
        allVideos.push(...videos);
      } catch (error) {
        console.error(`Error fetching videos from channel ${channelId}:`, error);
      }
    }

    // Sort by published date and limit
    return allVideos
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
      .slice(0, limit);
  }
}

export const youTubeService = new YouTubeService();