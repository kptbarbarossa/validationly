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
  private headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Validationly-App'
  };

  async searchRepositories(query: string, limit = 20): Promise<any[]> {
    const cacheKey = `gh:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const searchUrl = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;
      
      const response = await fetch(searchUrl, { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubSearchResult = await response.json();
      
      const repos = data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        platform: 'github'
      }));

      await cache.set(cacheKey, repos, CACHE_TTL.GITHUB);
      
      return repos;
    } catch (error) {
      console.error('GitHub search error:', error);
      return [];
    }
  }

  async getTrendingRepositories(language = '', limit = 20): Promise<any[]> {
    const cacheKey = `gh:trending:${language}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Search for repositories created in the last week, sorted by stars
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const dateStr = oneWeekAgo.toISOString().split('T')[0];
      
      let query = `created:>${dateStr}`;
      if (language) {
        query += ` language:${language}`;
      }
      
      const searchUrl = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;
      
      const response = await fetch(searchUrl, { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubSearchResult = await response.json();
      
      const repos = data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        platform: 'github',
        trending: true
      }));

      await cache.set(cacheKey, repos, CACHE_TTL.GITHUB);
      
      return repos;
    } catch (error) {
      console.error('GitHub trending error:', error);
      return [];
    }
  }

  async searchByTopic(topic: string, limit = 20): Promise<any[]> {
    const cacheKey = `gh:topic:${topic}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const query = `topic:${topic}`;
      const searchUrl = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;
      
      const response = await fetch(searchUrl, { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubSearchResult = await response.json();
      
      const repos = data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        owner: repo.owner.login,
        avatar: repo.owner.avatar_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        platform: 'github'
      }));

      await cache.set(cacheKey, repos, CACHE_TTL.GITHUB);
      
      return repos;
    } catch (error) {
      console.error('GitHub topic search error:', error);
      return [];
    }
  }
}

export const gitHubService = new GitHubService();