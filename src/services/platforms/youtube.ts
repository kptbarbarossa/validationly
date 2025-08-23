// YouTube RSS integration (no API quota needed)
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