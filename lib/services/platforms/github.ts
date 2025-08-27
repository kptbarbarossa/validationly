// GitHub API integration
import { cache, CACHE_TTL } from '../cache';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubSearchResult {
  total_count: number;
  items: GitHubRepo[];
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';
  
  private getHeaders() {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Validationly-App'
    };
    
    // Add auth token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    return headers;
  }

  // Main search method for multi-platform integration
  async searchRepositories(query: string, limit = 20): Promise<{
    repositories: any[];
    totalResults: number;
    topLanguages: string[];
  }> {
    try {
      const repositories = await this.searchRepositoriesInternal(query, limit);
      const languages = [...new Set(repositories.map(r => r.language).filter(Boolean))];
      
      return {
        repositories,
        totalResults: repositories.length,
        topLanguages: languages.slice(0, 5)
      };
    } catch (error) {
      console.error('GitHub search failed:', error);
      return {
        repositories: [],
        totalResults: 0,
        topLanguages: []
      };
    }
  }

  private async searchRepositoriesInternal(query: string, limit = 20): Promise<any[]> {
    const cacheKey = `gh:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const searchUrl = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;
      
      const response = await fetch(searchUrl, { headers: this.getHeaders() });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('GitHub API rate limit exceeded. Consider adding GITHUB_TOKEN to .env.local');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: any = await response.json();
      
      const repositories = data.items.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        lastUpdated: repo.updated_at,
        url: repo.html_url,
        platform: 'github'
      }));

      await cache.set(cacheKey, repositories, CACHE_TTL.GITHUB);
      
      return repositories;
    } catch (error) {
      console.error('GitHub search error:', error);
      return [];
    }
  }

  async getTrendingRepositories(language?: string, limit = 30): Promise<any[]> {
    const cacheKey = `gh:trending:${language || 'all'}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Search for repositories created in the last week, sorted by stars
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const dateString = oneWeekAgo.toISOString().split('T')[0];
      
      let searchQuery = `created:>${dateString}`;
      if (language) {
        searchQuery += ` language:${language}`;
      }
      
      const searchUrl = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${limit}`;
      
      const response = await fetch(searchUrl, { headers: this.getHeaders() });
      
      if (!response.ok) {
        throw new Error(`GitHub trending API error: ${response.status}`);
      }

      const data: any = await response.json();
      
      const repositories = data.items.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        lastUpdated: repo.updated_at,
        url: repo.html_url,
        platform: 'github'
      }));

      await cache.set(cacheKey, repositories, CACHE_TTL.GITHUB);
      
      return repositories;
    } catch (error) {
      console.error('GitHub trending error:', error);
      return [];
    }
  }
}

export const githubService = new GitHubService();