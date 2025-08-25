// Upwork Freelance Jobs Integration
import { cache, CACHE_TTL } from '../cache.js';
import Parser from 'rss-parser';

interface UpworkJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  skills: string[];
  postedDate: string;
  url: string;
  platform: string;
  category: string;
}

class UpworkService {
  private parser = new Parser();
  private baseUrl = 'https://www.upwork.com/ab/feed/jobs/rss';

  async searchJobs(query: string, limit = 15): Promise<UpworkJob[]> {
    const cacheKey = `upwork:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Upwork RSS feed with search query
      const rssUrl = `${this.baseUrl}?q=${encodeURIComponent(query)}&sort=recency`;
      
      console.log(`🔍 Searching Upwork jobs for: "${query}"`);
      
      const feed = await this.parser.parseURL(rssUrl);
      
      if (!feed.items || feed.items.length === 0) {
        console.warn(`No Upwork jobs found for: ${query}`);
        return [];
      }

      const jobs = feed.items.slice(0, limit).map(item => this.parseJobItem(item));
      
      await cache.set(cacheKey, jobs, CACHE_TTL.UPWORK || 1800); // 30 min cache
      
      return jobs;
      
    } catch (error) {
      console.error('Upwork search error:', error);
      return [];
    }
  }

  private parseJobItem(item: any): UpworkJob {
    const description = item.contentSnippet || item.content || '';
    const title = item.title || '';
    
    // Extract budget from description (Upwork includes this in RSS)
    const budgetMatch = description.match(/Budget:\s*\$?([\d,]+(?:\.\d{2})?)/i) || 
                       description.match(/Hourly Range:\s*\$?([\d,]+(?:\.\d{2})?)/i);
    
    // Extract skills from description
    const skillsMatch = description.match(/Skills:\s*([^.]+)/i);
    const skills = skillsMatch ? 
      skillsMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0) : 
      [];

    // Determine category from title/description
    const category = this.categorizeJob(title + ' ' + description);

    return {
      id: item.guid || item.link || '',
      title: title,
      description: description.substring(0, 300), // Limit description length
      budget: budgetMatch ? `$${budgetMatch[1]}` : 'Not specified',
      skills: skills.slice(0, 5), // Limit to 5 skills
      postedDate: new Date(item.pubDate || item.isoDate || Date.now()).toISOString(),
      url: item.link || '',
      platform: 'upwork',
      category: category
    };
  }

  private categorizeJob(content: string): string {
    const contentLower = content.toLowerCase();
    
    const categories = {
      'Web Development': ['website', 'web development', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
      'Mobile Development': ['mobile app', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'],
      'AI/ML': ['artificial intelligence', 'machine learning', 'ai', 'ml', 'data science', 'python', 'tensorflow'],
      'Design': ['ui/ux', 'graphic design', 'logo', 'branding', 'figma', 'photoshop', 'illustrator'],
      'Marketing': ['digital marketing', 'seo', 'social media', 'content marketing', 'ppc', 'advertising'],
      'Writing': ['content writing', 'copywriting', 'blog', 'article', 'technical writing'],
      'Data': ['data analysis', 'data entry', 'excel', 'database', 'sql', 'analytics'],
      'Business': ['business plan', 'market research', 'consulting', 'strategy', 'operations']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        return category;
      }
    }

    return 'Other';
  }

  async getJobsByCategory(category: string, limit = 20): Promise<UpworkJob[]> {
    const cacheKey = `upwork:category:${category}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Map category to Upwork search terms
      const categoryQueries: { [key: string]: string } = {
        'web-development': 'web development',
        'mobile-development': 'mobile app development',
        'ai-ml': 'artificial intelligence machine learning',
        'design': 'ui ux design',
        'marketing': 'digital marketing',
        'writing': 'content writing',
        'data': 'data analysis',
        'business': 'business consulting'
      };

      const query = categoryQueries[category] || category;
      const jobs = await this.searchJobs(query, limit);
      
      await cache.set(cacheKey, jobs, CACHE_TTL.UPWORK || 1800);
      return jobs;
      
    } catch (error) {
      console.error('Upwork category search error:', error);
      return [];
    }
  }

  // Get trending skills based on job postings
  async getTrendingSkills(limit = 10): Promise<{ skill: string; count: number }[]> {
    const cacheKey = `upwork:trending:skills:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get recent jobs from multiple categories
      const categories = ['web-development', 'mobile-development', 'ai-ml', 'design'];
      const allJobs: UpworkJob[] = [];
      
      for (const category of categories) {
        const jobs = await this.getJobsByCategory(category, 50);
        allJobs.push(...jobs);
      }

      // Count skill frequency
      const skillCounts: { [key: string]: number } = {};
      
      allJobs.forEach(job => {
        job.skills.forEach(skill => {
          const normalizedSkill = skill.toLowerCase().trim();
          skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
        });
      });

      // Sort by frequency and return top skills
      const trendingSkills = Object.entries(skillCounts)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      await cache.set(cacheKey, trendingSkills, CACHE_TTL.UPWORK || 3600);
      return trendingSkills;
      
    } catch (error) {
      console.error('Upwork trending skills error:', error);
      return [];
    }
  }
}

export const upworkService = new UpworkService();