// Stack Overflow API integration
import { cache, CACHE_TTL } from '../cache';

interface StackOverflowQuestion {
  question_id: number;
  title: string;
  body?: string;
  link: string;
  score: number;
  view_count: number;
  answer_count: number;
  creation_date: number;
  last_activity_date: number;
  tags: string[];
  owner: {
    display_name: string;
    reputation: number;
  };
}

interface StackOverflowSearchResult {
  items: StackOverflowQuestion[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}

export class StackOverflowService {
  private baseUrl = 'https://api.stackexchange.com/2.3';
  private site = 'stackoverflow';

  // Main search method for multi-platform integration
  async searchQuestions(query: string, limit = 20): Promise<{
    questions: any[];
    totalResults: number;
    topTags: string[];
  }> {
    try {
      const questions = await this.searchQuestionsInternal(query, limit);
      const allTags = questions.flatMap(q => q.tags || []);
      const topTags = [...new Set(allTags)].slice(0, 5);
      
      return {
        questions,
        totalResults: questions.length,
        topTags
      };
    } catch (error) {
      console.error('StackOverflow search failed:', error);
      return {
        questions: [],
        totalResults: 0,
        topTags: []
      };
    }
  }

  private async searchQuestionsInternal(query: string, limit = 20): Promise<any[]> {

  async searchQuestions(query: string, limit = 20): Promise<any[]> {
    const cacheKey = `so:search:${query}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const searchUrl = `${this.baseUrl}/search/advanced?` +
        `q=${encodeURIComponent(query)}&` +
        `site=${this.site}&` +
        `sort=relevance&` +
        `pagesize=${limit}&` +
        `filter=withbody`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`StackOverflow API error: ${response.status}`);
      }

      const data: StackOverflowSearchResult = await response.json();
      
      const questions = data.items.map(question => ({
        id: question.question_id,
        title: question.title,
        body: question.body ? this.stripHtml(question.body) : '',
        url: question.link,
        score: question.score,
        views: question.view_count,
        answers: question.answer_count,
        tags: question.tags,
        author: question.owner.display_name,
        reputation: question.owner.reputation,
        created_at: new Date(question.creation_date * 1000).toISOString(),
        last_activity: new Date(question.last_activity_date * 1000).toISOString(),
        platform: 'stackoverflow'
      }));

      await cache.set(cacheKey, questions, CACHE_TTL.STACKOVERFLOW);
      
      return questions;
    } catch (error) {
      console.error('StackOverflow search error:', error);
      return [];
    }
  }

  async getQuestionsByTag(tag: string, limit = 20): Promise<any[]> {
    const cacheKey = `so:tag:${tag}:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const tagUrl = `${this.baseUrl}/questions?` +
        `tagged=${encodeURIComponent(tag)}&` +
        `site=${this.site}&` +
        `sort=votes&` +
        `order=desc&` +
        `pagesize=${limit}&` +
        `filter=withbody`;
      
      const response = await fetch(tagUrl);
      
      if (!response.ok) {
        throw new Error(`StackOverflow API error: ${response.status}`);
      }

      const data: StackOverflowSearchResult = await response.json();
      
      const questions = data.items.map(question => ({
        id: question.question_id,
        title: question.title,
        body: question.body ? this.stripHtml(question.body) : '',
        url: question.link,
        score: question.score,
        views: question.view_count,
        answers: question.answer_count,
        tags: question.tags,
        author: question.owner.display_name,
        reputation: question.owner.reputation,
        created_at: new Date(question.creation_date * 1000).toISOString(),
        last_activity: new Date(question.last_activity_date * 1000).toISOString(),
        platform: 'stackoverflow'
      }));

      await cache.set(cacheKey, questions, CACHE_TTL.STACKOVERFLOW);
      
      return questions;
    } catch (error) {
      console.error('StackOverflow tag search error:', error);
      return [];
    }
  }

  async getTrendingQuestions(limit = 20): Promise<any[]> {
    const cacheKey = `so:trending:${limit}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get questions from the last week, sorted by activity
      const oneWeekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
      
      const trendingUrl = `${this.baseUrl}/questions?` +
        `site=${this.site}&` +
        `sort=activity&` +
        `order=desc&` +
        `min=${oneWeekAgo}&` +
        `pagesize=${limit}&` +
        `filter=withbody`;
      
      const response = await fetch(trendingUrl);
      
      if (!response.ok) {
        throw new Error(`StackOverflow API error: ${response.status}`);
      }

      const data: StackOverflowSearchResult = await response.json();
      
      const questions = data.items.map(question => ({
        id: question.question_id,
        title: question.title,
        body: question.body ? this.stripHtml(question.body) : '',
        url: question.link,
        score: question.score,
        views: question.view_count,
        answers: question.answer_count,
        tags: question.tags,
        author: question.owner.display_name,
        reputation: question.owner.reputation,
        created_at: new Date(question.creation_date * 1000).toISOString(),
        last_activity: new Date(question.last_activity_date * 1000).toISOString(),
        platform: 'stackoverflow',
        trending: true
      }));

      await cache.set(cacheKey, questions, CACHE_TTL.STACKOVERFLOW);
      
      return questions;
    } catch (error) {
      console.error('StackOverflow trending error:', error);
      return [];
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}

export const stackOverflowService = new StackOverflowService();