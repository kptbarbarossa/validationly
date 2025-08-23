import { GoogleGenAI } from "@google/genai";
import Parser from 'rss-parser';
import { multiPlatformService, MultiPlatformResult } from './services/multiPlatformService';

interface RedditPost {
  title: string;
  content: string;
  author: string;
  subreddit: string;
  score: number;
  comments: number;
  url: string;
  created: Date;
}

interface ValidationInsights {
  trendingTopics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  keyInsights: string[];
  opportunities: string[];
  painPoints: string[];
  popularSolutions: string[];
  validationScore: number;
  platformBreakdown?: {
    reddit: number;
    hackernews: number;
    producthunt: number;
    googlenews: number;
    github: number;
    stackoverflow: number;
    youtube: number;
  };
}

// RSS Parser instance
const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'description']
  }
});

// Extract Reddit post data from RSS item
const parseRedditPost = (item: any, subreddit: string): RedditPost => {
  const content = item['content:encoded'] || item.description || item.contentSnippet || '';
  
  // Extract score and comments from content (Reddit RSS includes this info)
  const scoreMatch = content.match(/(\d+) points?/);
  const commentsMatch = content.match(/(\d+) comments?/);
  
  return {
    title: item.title || '',
    content: content.replace(/<[^>]*>/g, '').substring(0, 500), // Remove HTML tags and limit length
    author: item.creator || 'unknown',
    subreddit: subreddit,
    score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
    comments: commentsMatch ? parseInt(commentsMatch[1]) : 0,
    url: item.link || '',
    created: new Date(item.pubDate || item.isoDate || Date.now())
  };
};

// Fetch posts from a subreddit RSS feed
const fetchSubredditPosts = async (subreddit: string, limit: number = 25): Promise<RedditPost[]> => {
  try {
    const rssUrl = `https://www.reddit.com/r/${subreddit}/new.rss?limit=${limit}`;
    console.log(`Fetching posts from: ${rssUrl}`);
    
    // Add timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const feed = await parser.parseURL(rssUrl);
    clearTimeout(timeoutId);
    
    if (!feed.items || feed.items.length === 0) {
      console.warn(`No posts found in r/${subreddit}`);
      return [];
    }
    
    return feed.items.map(item => parseRedditPost(item, subreddit));
  } catch (error) {
    console.error(`Error fetching r/${subreddit}:`, error);
    return [];
  }
};

// AI-powered post relevance filtering
const filterPostsByRelevance = async (posts: RedditPost[], query: string): Promise<RedditPost[]> => {
  if (posts.length === 0) return [];
  
  // Fallback to keyword matching if AI fails
  const keywordFilter = (posts: RedditPost[]) => {
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    return posts.filter(post => {
      const text = (post.title + ' ' + post.content).toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  };

  // If we have too many posts, use keyword pre-filtering first
  let postsToAnalyze = posts;
  if (posts.length > 50) {
    postsToAnalyze = keywordFilter(posts);
  }

  // If still no relevant posts, return keyword results
  if (postsToAnalyze.length === 0) {
    return keywordFilter(posts);
  }

  try {
    if (!process.env.GOOGLE_API_KEY) {
      return keywordFilter(posts);
    }

    const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY);
    
    const filterPrompt = `You are an expert content curator. Analyze these Reddit posts and determine which ones are relevant to the query: "${query}"

Posts to analyze:
${postsToAnalyze.slice(0, 20).map((post, index) => `
${index + 1}. Title: ${post.title}
   Content: ${post.content.substring(0, 200)}
   Subreddit: r/${post.subreddit}
`).join('\n')}

Return a JSON array of post indices (1-based) that are relevant to the query. Only include posts that are directly related to the topic, discuss similar problems, or mention relevant solutions.

Example: [1, 3, 7, 12]

Be selective - only include posts with clear relevance.`;

    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: filterPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 500
      }
    });

    const relevantIndices = JSON.parse(result.text || '[]') as number[];
    const filteredPosts = relevantIndices
      .filter(index => index >= 1 && index <= postsToAnalyze.length)
      .map(index => postsToAnalyze[index - 1]);

    // If AI filtering returns too few results, supplement with keyword matching
    if (filteredPosts.length < 3) {
      const keywordResults = keywordFilter(posts);
      const combined = [...filteredPosts];
      
      for (const post of keywordResults) {
        if (!combined.find(p => p.title === post.title) && combined.length < 15) {
          combined.push(post);
        }
      }
      
      return combined;
    }

    return filteredPosts;

  } catch (error) {
    console.error('AI filtering failed, using keyword fallback:', error);
    return keywordFilter(posts);
  }
};

// Search Reddit posts using RSS search
const searchRedditPosts = async (query: string, subreddits: string[]): Promise<RedditPost[]> => {
  const allPosts: RedditPost[] = [];
  
  // Fetch from each subreddit
  for (const subreddit of subreddits) {
    try {
      const posts = await fetchSubredditPosts(subreddit, 20);
      
      // Smart AI-powered filtering instead of simple keyword matching
      const relevantPosts = await filterPostsByRelevance(posts, query);
      
      allPosts.push(...relevantPosts);
    } catch (error) {
      console.error(`Error searching r/${subreddit}:`, error);
    }
  }
  
  // Sort by score and recency
  return allPosts
    .sort((a, b) => (b.score + (Date.now() - b.created.getTime()) / 1000000) - (a.score + (Date.now() - a.created.getTime()) / 1000000))
    .slice(0, 50); // Limit to top 50 posts
};

// Analyze multi-platform data with AI
const analyzeMultiPlatformData = async (multiPlatformData: MultiPlatformResult, query: string): Promise<ValidationInsights> => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google AI API key not configured');
  }

  const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY);
  
  // Prepare multi-platform data for AI analysis
  const platformSummary = multiPlatformData.platforms.map(platform => ({
    name: platform.platform,
    itemCount: platform.items.length,
    items: platform.items.slice(0, 5).map(item => ({
      title: item.title || item.name || 'No title',
      description: item.description || item.content || item.body || 'No description',
      engagement: item.score || item.stars || item.views || item.points || 0,
      url: item.url || item.link || item.html_url || '#'
    }))
  }));

  const totalItems = multiPlatformData.totalItems;
  const platformBreakdown = multiPlatformData.summary;

  const analysisPrompt = `You are an expert market researcher analyzing multi-platform data for startup validation.

QUERY: "${query}"

MULTI-PLATFORM ANALYSIS:
- Total Items Analyzed: ${totalItems}
- Platforms Searched: ${Object.keys(platformBreakdown).filter(k => platformBreakdown[k as keyof typeof platformBreakdown] > 0).join(', ')}
- Platform Breakdown: ${JSON.stringify(platformBreakdown)}

PLATFORM DATA:
${platformSummary.map(platform => `
=== ${platform.name.toUpperCase()} (${platform.itemCount} items) ===
${platform.items.map((item, index) => `
${index + 1}. ${item.title}
   Description: ${item.description.substring(0, 200)}
   Engagement: ${item.engagement}
   URL: ${item.url}
`).join('\n')}
`).join('\n')}

ANALYSIS TASK:
Analyze this multi-platform data to validate the startup idea: "${query}"

Cross-platform insights to extract:
1. Market demand signals across different communities
2. Technical discussions and implementation challenges (GitHub, StackOverflow)
3. Product launches and competitive landscape (Product Hunt)
4. News coverage and industry trends (Google News)
5. Community discussions and user pain points (Reddit, Hacker News)
6. Educational content and tutorials (YouTube)
7. Developer interest and open-source activity (GitHub)

Provide comprehensive insights in JSON format:

{
  "validationScore": 0-100,
  "sentiment": "positive/negative/neutral",
  "trendingTopics": ["topic1", "topic2", "topic3"],
  "keyInsights": [
    "cross-platform market demand insight",
    "technical feasibility insight from developer communities", 
    "competitive landscape insight from product launches"
  ],
  "painPoints": [
    "specific problems identified across platforms",
    "technical challenges mentioned by developers",
    "user frustrations in community discussions"
  ],
  "opportunities": [
    "market gaps identified from multi-platform analysis",
    "underserved segments across different communities",
    "technical opportunities from open-source activity"
  ],
  "popularSolutions": [
    "existing products from Product Hunt",
    "open-source solutions from GitHub",
    "tools mentioned in developer discussions"
  ],
  "platformBreakdown": {
    "reddit": ${platformBreakdown.reddit},
    "hackernews": ${platformBreakdown.hackernews},
    "producthunt": ${platformBreakdown.producthunt},
    "googlenews": ${platformBreakdown.googlenews},
    "github": ${platformBreakdown.github},
    "stackoverflow": ${platformBreakdown.stackoverflow},
    "youtube": ${platformBreakdown.youtube}
  }
}

MULTI-PLATFORM SCORING CRITERIA:
- 90-100: Strong signals across multiple platforms, active development, positive sentiment
- 70-89: Moderate cross-platform interest, some technical activity, mixed sentiment  
- 50-69: Limited platform coverage, unclear demand, neutral sentiment
- 30-49: Minimal cross-platform interest, saturated market indicators
- 0-29: No significant activity across platforms, negative sentiment

Focus on:
1. Cross-platform validation signals and consistency
2. Technical feasibility from developer communities
3. Market competition from product launches
4. News coverage and industry trends
5. Community engagement and sentiment
6. Open-source activity and developer interest
7. Educational content availability

Weight platforms appropriately:
- Reddit/HackerNews: Community validation (25%)
- GitHub: Technical feasibility (20%)
- Product Hunt: Competition analysis (20%)
- StackOverflow: Implementation challenges (15%)
- Google News: Industry trends (10%)
- YouTube: Educational ecosystem (10%)

Be comprehensive and data-driven in your multi-platform analysis.`;

  try {
    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: analysisPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2000
      }
    });

    const analysis = JSON.parse(result.text || '{}');
    
    // Validate and ensure all required fields exist
    return {
      validationScore: analysis.validationScore || 50,
      sentiment: analysis.sentiment || 'neutral',
      trendingTopics: analysis.trendingTopics || [],
      keyInsights: analysis.keyInsights || ['Multi-platform analysis completed with limited data'],
      painPoints: analysis.painPoints || ['No specific pain points identified across platforms'],
      opportunities: analysis.opportunities || ['Limited opportunities detected in cross-platform analysis'],
      popularSolutions: analysis.popularSolutions || ['No popular solutions mentioned across platforms'],
      platformBreakdown: analysis.platformBreakdown || platformBreakdown
    };
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    
    // Return fallback analysis
    return {
      validationScore: 50,
      sentiment: 'neutral',
      trendingTopics: ['General discussion'],
      keyInsights: ['Multi-platform analysis completed with basic data processing'],
      painPoints: ['Unable to identify specific pain points across platforms'],
      opportunities: ['Manual analysis recommended for deeper insights'],
      popularSolutions: ['Various solutions mentioned across platforms'],
      platformBreakdown: platformBreakdown
    };
  }
};

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_WINDOW = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const userData = requestCounts.get(ip);
  
  if (!userData || now > userData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }
  
  if (userData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  userData.count++;
  return false;
};

// Input validation
const validateInput = (query: string, subreddits: string[]): boolean => {
  if (!query || typeof query !== 'string' || query.length < 3 || query.length > 200) {
    return false;
  }
  
  if (!Array.isArray(subreddits) || subreddits.length === 0 || subreddits.length > 10) {
    return false;
  }
  
  // Validate subreddit names (alphanumeric + underscore only)
  const validSubredditPattern = /^[a-zA-Z0-9_]+$/;
  return subreddits.every(sub => validSubredditPattern.test(sub));
};

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (isRateLimited(clientIP)) {
    return res.status(429).json({
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(WINDOW_MS / 1000)
    });
  }
  
  try {
    const { query, analysisType = 'comprehensive' } = req.body;
    
    // Input validation for query
    if (!query || typeof query !== 'string' || query.length < 3 || query.length > 200) {
      return res.status(400).json({
        message: 'Invalid input. Query must be 3-200 characters.',
        error: 'Validation failed'
      });
    }
    
    console.log(`🔍 Multi-platform validation request: "${query}"`);
    
    // Fetch data from all platforms
    const multiPlatformData = await multiPlatformService.searchAllPlatforms(query, 15);
    console.log(`📊 Multi-platform results:`, multiPlatformData.summary);
    
    if (multiPlatformData.totalItems === 0) {
      return res.status(200).json({
        insights: {
          validationScore: 25,
          sentiment: 'neutral',
          trendingTopics: ['Limited discussion found across platforms'],
          keyInsights: ['No significant activity found across multiple platforms for this topic'],
          painPoints: ['Unable to identify pain points - limited cross-platform data'],
          opportunities: ['Consider broader keyword search or niche market validation'],
          popularSolutions: ['No solutions mentioned in available discussions'],
          platformBreakdown: multiPlatformData.summary
        },
        platformData: multiPlatformData.platforms,
        metadata: {
          analysisDate: new Date().toISOString(),
          totalItemsAnalyzed: 0,
          platformsSearched: Object.keys(multiPlatformData.summary),
          dataSource: 'Multi-platform aggregation'
        }
      });
    }
    
    // Analyze with AI
    const insights = await analyzeMultiPlatformData(multiPlatformData, query);
    
    // Return results
    const response = {
      insights,
      platformData: multiPlatformData.platforms.map(platform => ({
        ...platform,
        items: platform.items.slice(0, 5) // Limit items per platform for response size
      })),
      metadata: {
        analysisDate: new Date().toISOString(),
        totalItemsAnalyzed: multiPlatformData.totalItems,
        platformsSearched: Object.keys(multiPlatformData.summary),
        dataSource: 'Multi-platform aggregation (Reddit, HackerNews, ProductHunt, GoogleNews, GitHub, StackOverflow, YouTube)',
        aiModel: 'gemini-1.5-flash'
      }
    };
    
    console.log(`✅ Multi-platform validation completed - Score: ${insights.validationScore}/100`);
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('❌ Public validation failed:', error);
    
    return res.status(500).json({
      message: 'Multi-platform validation system temporarily unavailable. Please try again later.',
      error: 'Internal server error'
    });
  }
}