import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GoogleNewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category?: string;
  description?: string;
}

interface GoogleNewsSearchResponse {
  articles: GoogleNewsArticle[];
  totalResults: number;
  query: string;
  searchTime: string;
}

interface GoogleNewsValidationResult {
  totalResults: number;
  items: GoogleNewsArticle[];
  analysis: {
    totalArticles: number;
    recentArticles: number;
    topSources: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    mediaCoverage: {
      high: boolean;
      level: 'high' | 'medium' | 'low';
      description: string;
    };
    marketValidation: {
      mediaInterest: boolean;
      coverageTrend: 'increasing' | 'stable' | 'decreasing';
      strategicInsight: string;
    };
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

    // Search Google News using RSS feeds
    const newsData = await searchGoogleNews(query, analysisType);

    res.status(200).json(newsData);
  } catch (error) {
    console.error('Google News API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Google News data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function searchGoogleNews(query: string, analysisType: string): Promise<GoogleNewsValidationResult> {
  try {
    // Construct Google News RSS URL
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;
    
    console.log('🔍 Searching Google News RSS:', rssUrl);
    
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Google News RSS error: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse RSS XML
    const articles = parseGoogleNewsRSS(xmlText, query);
    
    // Analyze the results
    const analysis = analyzeGoogleNewsResults(articles, query);
    
    return {
      totalResults: articles.length,
      items: articles.slice(0, 20), // Return top 20 results
      analysis
    };
  } catch (error) {
    console.error('Error searching Google News:', error);
    
    // Return fallback data if API fails
    return generateFallbackData();
  }
}

function parseGoogleNewsRSS(xmlText: string, query: string): GoogleNewsArticle[] {
  const articles: GoogleNewsArticle[] = [];
  
  try {
    // Extract articles from RSS XML
    const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);
    
    if (itemMatches) {
      itemMatches.forEach(itemXml => {
        const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
        const sourceMatch = itemXml.match(/<source>(.*?)<\/source>/);
        const descriptionMatch = itemXml.match(/<description>(.*?)<\/description>/);
        
        if (titleMatch && linkMatch && pubDateMatch) {
          const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').trim();
          const link = linkMatch[1].trim();
          const pubDate = pubDateMatch[1].trim();
          const source = sourceMatch ? sourceMatch[1].trim() : 'Unknown Source';
          const description = descriptionMatch ? descriptionMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').trim() : '';
          
          // Filter out Google News navigation items
          if (title && !title.includes('Google News') && !title.includes('Top stories')) {
            articles.push({
              title,
              link,
              pubDate,
              source,
              description
            });
          }
        }
      });
    }
  } catch (parseError) {
    console.error('RSS parsing error:', parseError);
  }
  
  return articles;
}

function analyzeGoogleNewsResults(articles: GoogleNewsArticle[], query: string): GoogleNewsValidationResult['analysis'] {
  if (articles.length === 0) {
    return {
      totalArticles: 0,
      recentArticles: 0,
      topSources: [],
      sentiment: 'neutral',
      trendingTopics: [],
      mediaCoverage: {
        high: false,
        level: 'low',
        description: 'No media coverage found for this topic'
      },
      marketValidation: {
        mediaInterest: false,
        coverageTrend: 'stable',
        strategicInsight: 'No media coverage indicates potential untapped market opportunity'
      }
    };
  }

  // Calculate metrics
  const totalArticles = articles.length;
  
  // Count recent articles (last 7 days)
  const recentArticles = articles.filter(article => {
    const pubDate = new Date(article.pubDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return pubDate > weekAgo;
  }).length;

  // Find top sources
  const sourceCounts: { [key: string]: number } = {};
  articles.forEach(article => {
    sourceCounts[article.source] = (sourceCounts[article.source] || 0) + 1;
  });
  const topSources = Object.entries(sourceCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([source]) => source);

  // Analyze sentiment based on article titles
  const sentiment = analyzeNewsSentiment(articles.map(a => a.title));

  // Extract trending topics from titles
  const trendingTopics = extractTrendingTopics(articles.map(a => a.title));

  // Analyze media coverage level
  const mediaCoverage = analyzeMediaCoverage(totalArticles, recentArticles);

  // Market validation analysis
  const marketValidation = analyzeMarketValidation(articles, query);

  return {
    totalArticles,
    recentArticles,
    topSources,
    sentiment,
    trendingTopics,
    mediaCoverage,
    marketValidation
  };
}

function analyzeNewsSentiment(titles: string[]): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['launch', 'success', 'growth', 'innovation', 'breakthrough', 'win', 'profit', 'revenue', 'funding', 'investment'];
  const negativeWords = ['failure', 'loss', 'decline', 'bankruptcy', 'layoff', 'shutdown', 'crisis', 'problem', 'issue', 'challenge'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  titles.forEach(title => {
    const lowerTitle = title.toLowerCase();
    positiveWords.forEach(word => {
      if (lowerTitle.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (lowerTitle.includes(word)) negativeCount++;
    });
  });
  
  if (positiveCount > negativeCount && positiveCount > 0) return 'positive';
  if (negativeCount > positiveCount && negativeCount > 0) return 'negative';
  return 'neutral';
}

function extractTrendingTopics(titles: string[]): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'new', 'news'
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

function analyzeMediaCoverage(totalArticles: number, recentArticles: number): GoogleNewsValidationResult['analysis']['mediaCoverage'] {
  let level: 'high' | 'medium' | 'low' = 'low';
  let description = '';
  
  if (totalArticles > 50 && recentArticles > 10) {
    level = 'high';
    description = 'High media coverage with recent activity - strong market interest';
  } else if (totalArticles > 20 && recentArticles > 5) {
    level = 'medium';
    description = 'Moderate media coverage with steady interest';
  } else {
    level = 'low';
    description = 'Low media coverage - potential untapped market opportunity';
  }

  return {
    high: level === 'high',
    level,
    description
  };
}

function analyzeMarketValidation(articles: GoogleNewsArticle[], query: string): GoogleNewsValidationResult['analysis']['marketValidation'] {
  const totalArticles = articles.length;
  const recentArticles = articles.filter(article => {
    const pubDate = new Date(article.pubDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return pubDate > weekAgo;
  }).length;

  // Determine coverage trend
  let coverageTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (recentArticles > totalArticles * 0.3) {
    coverageTrend = 'increasing';
  } else if (recentArticles < totalArticles * 0.1) {
    coverageTrend = 'decreasing';
  }

  // Generate strategic insight
  let strategicInsight = '';
  if (coverageTrend === 'increasing') {
    strategicInsight = 'Growing media interest indicates rising market demand - good timing for market entry';
  } else if (coverageTrend === 'stable') {
    strategicInsight = 'Stable media coverage suggests consistent market interest - reliable market opportunity';
  } else {
    strategicInsight = 'Declining media coverage may indicate market saturation - focus on differentiation';
  }

  return {
    mediaInterest: totalArticles > 10,
    coverageTrend,
    strategicInsight
  };
}

function generateFallbackData(): GoogleNewsValidationResult {
  return {
    totalResults: 0,
    items: [],
    analysis: {
      totalArticles: 0,
      recentArticles: 0,
      topSources: [],
      sentiment: 'neutral',
      trendingTopics: [],
      mediaCoverage: {
        high: false,
        level: 'low',
        description: 'Google News data unavailable - check RSS feed configuration'
      },
      marketValidation: {
        mediaInterest: false,
        coverageTrend: 'stable',
        strategicInsight: 'No media coverage data available'
      }
    }
  };
}
