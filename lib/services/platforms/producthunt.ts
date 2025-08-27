// Product Hunt RSS integration
import { cache, CACHE_TTL } from '../cache';

interface ProductHuntItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  platform: string;
}

export class ProductHuntService {
  private rssFeeds = {
    daily: 'https://www.producthunt.com/feed',
    upcoming: 'https://www.producthunt.com/feed/upcoming'
  };

  // Main search method for multi-platform integration
  async searchProducts(query: string, limit = 20): Promise<{
    products: ProductHuntItem[];
    totalResults: number;
  }> {
    try {
      const products = await this.searchProductsInternal(query, limit);
      return {
        products,
        totalResults: products.length
      };
    } catch (error) {
      console.error('ProductHunt search failed:', error);
      return {
        products: [],
        totalResults: 0
      };
    }
  }

  private async searchProductsInternal(query: string, limit = 20): Promise<ProductHuntItem[]> {
    const cacheKey = `ph:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const dailyProducts = await this.parseRSSFeed(this.rssFeeds.daily);
      const upcomingProducts = await this.parseRSSFeed(this.rssFeeds.upcoming);
      
      const allProducts = [...dailyProducts, ...upcomingProducts];
      
      // Filter by query
      const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);

      await cache.set(cacheKey, filteredProducts, CACHE_TTL.PRODUCTHUNT);
      return filteredProducts;
    } catch (error) {
      console.error('ProductHunt search error:', error);
      return [];
    }
  }

  async parseRSSFeed(url: string): Promise<ProductHuntItem[]> {
    try {
      const response = await fetch(url);
      const xmlText = await response.text();
      
      // Simple XML parsing for RSS
      const items: ProductHuntItem[] = [];
      const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
      
      for (const itemXml of itemMatches) {
        const title = this.extractXMLContent(itemXml, 'title');
        const description = this.extractXMLContent(itemXml, 'description');
        const link = this.extractXMLContent(itemXml, 'link');
        const pubDate = this.extractXMLContent(itemXml, 'pubDate');
        
        if (title && link) {
          items.push({
            title: this.cleanText(title),
            description: this.cleanText(description),
            link,
            pubDate,
            platform: 'producthunt'
          });
        }
      }
      
      return items;
    } catch (error) {
      console.error('ProductHunt RSS parsing error:', error);
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

  async getDailyProducts(limit = 20): Promise<ProductHuntItem[]> {
    const cacheKey = `ph:daily:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const products = await this.parseRSSFeed(this.rssFeeds.daily);
      const limitedProducts = products.slice(0, limit);
      
      await cache.set(cacheKey, limitedProducts, CACHE_TTL.PRODUCTHUNT);
      
      return limitedProducts;
    } catch (error) {
      console.error('ProductHunt daily products error:', error);
      return [];
    }
  }

  async getUpcomingProducts(limit = 20): Promise<ProductHuntItem[]> {
    const cacheKey = `ph:upcoming:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const products = await this.parseRSSFeed(this.rssFeeds.upcoming);
      const limitedProducts = products.slice(0, limit);
      
      await cache.set(cacheKey, limitedProducts, CACHE_TTL.PRODUCTHUNT);
      
      return limitedProducts;
    } catch (error) {
      console.error('ProductHunt upcoming products error:', error);
      return [];
    }
  }
}

export const productHuntService = new ProductHuntService();