import type { VercelRequest, VercelResponse } from '@vercel/node';

interface HNItem {
  objectID: string;
  title: string;
  url?: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
  tags: string[];
  story_text?: string;
  story_id?: string;
  parent_id?: string;
  created_at_i: number;
}

interface HNSearchResponse {
  hits: HNItem[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
}

interface HNValidationResult {
  totalResults: number;
  items: HNItem[];
  analysis: {
    averagePoints: number;
    averageComments: number;
    topAuthors: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    engagementScore: number;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, analysisType = 'comprehensive' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Search Hacker News using Algolia API
    const hnData = await searchHackerNews(query, analysisType);

    res.status(200).json(hnData);
  } catch (error) {
    console.error('Hacker News API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Hacker News data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function searchHackerNews(query: string, analysisType: string): Promise<HNValidationResult> {
  try {
    // Search for recent discussions (last 30 days)
    const searchUrl = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>${Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000)}&hitsPerPage=100`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Hacker News API error: ${response.status}`);
    }

    const data: HNSearchResponse = await response.json();
    
    // Analyze the results
    const analysis = analyzeHNResults(data.hits);
    
    return {
      totalResults: data.nbHits,
      items: data.hits.slice(0, 20), // Return top 20 results
      analysis
    };
  } catch (error) {
    console.error('Error searching Hacker News:', error);
    
    // Return fallback data if API fails
    return {
      totalResults: 0,
      items: [],
      analysis: {
        averagePoints: 0,
        averageComments: 0,
        topAuthors: [],
        sentiment: 'neutral',
        trendingTopics: [],
        engagementScore: 0
      }
    };
  }
}

function analyzeHNResults(items: HNItem[]) {
  if (items.length === 0) {
    return {
      averagePoints: 0,
      averageComments: 0,
      topAuthors: [],
      sentiment: 'neutral',
      trendingTopics: [],
      engagementScore: 0
    };
  }

  // Calculate averages
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const totalComments = items.reduce((sum, item) => sum + item.num_comments, 0);
  const averagePoints = Math.round(totalPoints / items.length);
  const averageComments = Math.round(totalComments / items.length);

  // Find top authors
  const authorCounts: { [key: string]: number } = {};
  items.forEach(item => {
    authorCounts[item.author] = (authorCounts[item.author] || 0) + 1;
  });
  const topAuthors = Object.entries(authorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([author]) => author);

  // Analyze sentiment based on points and comments
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (averagePoints > 50 && averageComments > 10) {
    sentiment = 'positive';
  } else if (averagePoints < 10 && averageComments < 5) {
    sentiment = 'negative';
  }

  // Extract trending topics from titles
  const trendingTopics = extractTrendingTopics(items.map(item => item.title));

  // Calculate engagement score (0-100)
  const engagementScore = Math.min(100, Math.round(
    ((averagePoints / 100) * 0.6 + (averageComments / 20) * 0.4) * 100
  ));

  return {
    averagePoints,
    averageComments,
    topAuthors,
    sentiment,
    trendingTopics,
    engagementScore
  };
}

function extractTrendingTopics(titles: string[]): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  const wordCounts: { [key: string]: number } = {};
  
  titles.forEach(title => {
    const words = title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  return Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}
