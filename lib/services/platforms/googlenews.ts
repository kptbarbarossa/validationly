// Google News RSS integration
import { cache, CACHE_TTL } from '../cache';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  platform: string;
}

export class GoogleNewsService {
  private baseUrl = 'https://news.google.com/rss';

  // Main search method for multi-platform integration
  async searchNews(query: string, limit = 20): Promise<{
    articles: NewsItem[];
    totalResults: number;
  }> {
    try {
      const articles = await this.searchNewsInternal(query, limit);
      return {
        articles,
        totalResults: articles.length
      };
    } catch (error) {
      console.error('GoogleNews search failed:', error);
      return {
        articles: [],
        totalResults: 0
      };
    }
  }

  private async searchNewsInternal(query: string, limit = 20): Promise<NewsItem[]> {
    const cacheKey = `gn:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;
      const articles = await this.parseRSSFeed(searchUrl);
      
      const limitedArticles = articles.slice(0, limit);
      await cache.set(cacheKey, limitedArticles, CACHE_TTL.GOOGLENEWS);
      
      return limitedArticles;
    } catch (error) {
      console.error('GoogleNews search error:', error);
      return [];
    }
  }

  async parseRSSFeed(url: string): Promise<NewsItem[]> {
    try {
      const response = await fetch(url);
      const xmlText = await response.text();
      
      const items: NewsItem[] = [];
      const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
      
      for (const itemXml of itemMatches) {
        const title = this.extractXMLContent(itemXml, 'title');
        const description = this.extractXMLContent(itemXml, 'description');
        const link = this.extractXMLContent(itemXml, 'link');
        const pubDate = this.extractXMLContent(itemXml, 'pubDate');
        const source = this.extractXMLContent(itemXml, 'source');
        
        if (title && link) {
          items.push({
            title: this.cleanText(title),
            description: this.cleanText(description),
            link,
            pubDate,
            source: this.cleanText(source) || 'Google News',
            platform: 'googlenews'
          });
        }
      }
      
      return items;
    } catch (error) {
      console.error('Google News RSS parsing error:', error);
      return [];
    }
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

  async getTechNews(limit = 20): Promise<NewsItem[]> {
    const cacheKey = `gn:tech:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const techUrl = `${this.baseUrl}/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en&gl=US`;
      const articles = await this.parseRSSFeed(techUrl);
      const limitedArticles = articles.slice(0, limit);
      
      await cache.set(cacheKey, limitedArticles, CACHE_TTL.GOOGLENEWS);
      
      return limitedArticles;
    } catch (error) {
      console.error('Google News tech news error:', error);
      return [];
    }
  }

  async getBusinessNews(limit = 20): Promise<NewsItem[]> {
    const cacheKey = `gn:business:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const businessUrl = `${this.baseUrl}/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en&gl=US`;
      const articles = await this.parseRSSFeed(businessUrl);
      const limitedArticles = articles.slice(0, limit);
      
      await cache.set(cacheKey, limitedArticles, CACHE_TTL.GOOGLENEWS);
      
      return limitedArticles;
    } catch (error) {
      console.error('Google News business news error:', error);
      return [];
    }
  }
}

export const googleNewsService = new GoogleNewsService();