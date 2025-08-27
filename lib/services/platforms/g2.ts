// G2 Software Reviews Integration
import { cache, CACHE_TTL } from '../cache';
import Parser from 'rss-parser';

interface G2Software {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  category: string;
  url: string;
  platform: string;
}

class G2Service {
  private parser = new Parser();

  async searchSoftware(query: string, limit = 15): Promise<G2Software[]> {
    const cacheKey = `g2:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // G2 doesn't have public API, but we can use their category feeds
      // Alternative approach: scrape search results (more complex)
      
      // For now, let's use a simulated approach based on common software categories
      const results = await this.searchByCategory(query, limit);
      
      await cache.set(cacheKey, results, CACHE_TTL.G2 || 3600);
      return results;
      
    } catch (error) {
      console.error('G2 search error:', error);
      return [];
    }
  }

  private async searchByCategory(query: string, limit: number): Promise<G2Software[]> {
    // Map query to G2 categories
    const categoryMap: { [key: string]: string[] } = {
      'crm': ['customer-relationship-management', 'sales-automation'],
      'analytics': ['business-intelligence', 'web-analytics'],
      'marketing': ['marketing-automation', 'email-marketing'],
      'project': ['project-management', 'collaboration'],
      'ecommerce': ['ecommerce-platforms', 'shopping-cart'],
      'hr': ['human-resources', 'applicant-tracking'],
      'finance': ['accounting', 'invoicing', 'expense-management']
    };

    const queryLower = query.toLowerCase();
    let categories: string[] = [];
    
    // Find matching categories
    for (const [key, cats] of Object.entries(categoryMap)) {
      if (queryLower.includes(key)) {
        categories = cats;
        break;
      }
    }

    if (categories.length === 0) {
      categories = ['business-software']; // Default category
    }

    // Simulate G2 data structure (in real implementation, scrape or use unofficial API)
    const mockResults: G2Software[] = [
      {
        id: '1',
        name: `${query} Pro`,
        description: `Professional ${query} solution with advanced features`,
        rating: 4.2 + Math.random() * 0.6,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        category: categories[0],
        url: `https://www.g2.com/products/${query.toLowerCase().replace(/\s+/g, '-')}-pro`,
        platform: 'g2'
      },
      {
        id: '2', 
        name: `${query} Enterprise`,
        description: `Enterprise-grade ${query} platform for large organizations`,
        rating: 4.0 + Math.random() * 0.8,
        reviewCount: Math.floor(Math.random() * 300) + 100,
        category: categories[0],
        url: `https://www.g2.com/products/${query.toLowerCase().replace(/\s+/g, '-')}-enterprise`,
        platform: 'g2'
      }
    ];

    return mockResults.slice(0, limit);
  }

  async getTopSoftwareByCategory(category: string, limit = 20): Promise<G2Software[]> {
    const cacheKey = `g2:category:${category}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // In real implementation, scrape G2 category pages
      // For now, return simulated data
      const results = await this.searchByCategory(category, limit);
      
      await cache.set(cacheKey, results, CACHE_TTL.G2 || 3600);
      return results;
      
    } catch (error) {
      console.error('G2 category search error:', error);
      return [];
    }
  }
}

export const g2Service = new G2Service();