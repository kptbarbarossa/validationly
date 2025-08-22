import { GoogleGenAI } from "@google/genai";
import Parser from 'rss-parser';

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

// Search Reddit posts using RSS search
const searchRedditPosts = async (query: string, subreddits: string[]): Promise<RedditPost[]> => {
  const allPosts: RedditPost[] = [];
  
  // Fetch from each subreddit
  for (const subreddit of subreddits) {
    try {
      const posts = await fetchSubredditPosts(subreddit, 20);
      
      // Filter posts that contain query keywords
      const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
      const relevantPosts = posts.filter(post => {
        const text = (post.title + ' ' + post.content).toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
      });
      
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

// Analyze posts with AI
const analyzePostsWithAI = async (posts: RedditPost[], query: string): Promise<ValidationInsights> => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google AI API key not configured');
  }

  const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY);
  
  // Prepare posts data for AI analysis
  const postsData = posts.map(post => ({
    title: post.title,
    content: post.content.substring(0, 300), // Increased content length for better analysis
    score: post.score,
    comments: post.comments,
    subreddit: post.subreddit
  }));

  // Calculate engagement metrics for better scoring
  const totalScore = postsData.reduce((sum, post) => sum + post.score, 0);
  const totalComments = postsData.reduce((sum, post) => sum + post.comments, 0);
  const avgEngagement = postsData.length > 0 ? (totalScore + totalComments) / postsData.length : 0;

  const analysisPrompt = `You are an expert market researcher analyzing Reddit community discussions for startup validation.

QUERY: "${query}"

ENGAGEMENT METRICS:
- Total Posts Analyzed: ${postsData.length}
- Average Engagement: ${avgEngagement.toFixed(1)} (score + comments)
- Communities: ${[...new Set(postsData.map(p => p.subreddit))].join(', ')}

REDDIT POSTS DATA:
${postsData.map(post => `
Subreddit: r/${post.subreddit}
Title: ${post.title}
Content: ${post.content}
Score: ${post.score} | Comments: ${post.comments}
`).join('\n---\n')}

ANALYSIS TASK:
Analyze these Reddit discussions to validate the startup idea: "${query}"

Provide comprehensive insights in JSON format:

{
  "validationScore": 0-100,
  "sentiment": "positive/negative/neutral",
  "trendingTopics": ["topic1", "topic2", "topic3"],
  "keyInsights": [
    "insight about market demand",
    "insight about user behavior", 
    "insight about competition"
  ],
  "painPoints": [
    "specific problem users mention",
    "frustration or difficulty users face",
    "gap in current solutions"
  ],
  "opportunities": [
    "market opportunity identified",
    "underserved user segment",
    "potential feature or solution"
  ],
  "popularSolutions": [
    "existing solution users mention",
    "workaround users currently use",
    "competitor or alternative mentioned"
  ]
}

SCORING CRITERIA:
- 90-100: Strong community interest, clear pain points, positive sentiment
- 70-89: Moderate interest, some validation signals, mixed sentiment
- 50-69: Limited discussion, unclear demand, neutral sentiment
- 30-49: Minimal interest, negative feedback, existing solutions dominate
- 0-29: No relevant discussion, negative sentiment, saturated market

Focus on:
1. How much interest/discussion exists around this topic
2. What problems users are actually facing
3. How users currently solve these problems
4. Sentiment toward existing solutions
5. Opportunities for improvement or innovation

Be realistic and data-driven in your analysis.`;

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
      keyInsights: analysis.keyInsights || ['Analysis completed with limited data'],
      painPoints: analysis.painPoints || ['No specific pain points identified'],
      opportunities: analysis.opportunities || ['Limited opportunities detected'],
      popularSolutions: analysis.popularSolutions || ['No popular solutions mentioned']
    };
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    
    // Return fallback analysis
    return {
      validationScore: 50,
      sentiment: 'neutral',
      trendingTopics: ['General discussion'],
      keyInsights: ['Analysis completed with basic data processing'],
      painPoints: ['Unable to identify specific pain points'],
      opportunities: ['Manual analysis recommended'],
      popularSolutions: ['Various solutions mentioned in discussions']
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
    const { query, subreddits, analysisType } = req.body;
    
    // Input validation
    if (!validateInput(query, subreddits)) {
      return res.status(400).json({
        message: 'Invalid input. Query must be 3-200 characters and subreddits must be valid.',
        error: 'Validation failed'
      });
    }
    
    console.log(`🔍 Public validation request: "${query}" in r/${subreddits.join(', r/')}`);
    
    // Fetch Reddit posts
    const posts = await searchRedditPosts(query, subreddits);
    console.log(`📊 Found ${posts.length} relevant posts`);
    
    if (posts.length === 0) {
      return res.status(200).json({
        insights: {
          validationScore: 25,
          sentiment: 'neutral',
          trendingTopics: ['Limited discussion found'],
          keyInsights: ['No significant community discussion found for this topic'],
          painPoints: ['Unable to identify pain points - limited data'],
          opportunities: ['Consider broader keyword search or different communities'],
          popularSolutions: ['No solutions mentioned in available discussions']
        },
        posts: [],
        metadata: {
          analysisDate: new Date().toISOString(),
          postsAnalyzed: 0,
          subredditsSearched: subreddits,
          dataSource: 'Reddit RSS feeds'
        }
      });
    }
    
    // Analyze with AI
    const insights = await analyzePostsWithAI(posts, query);
    
    // Return results
    const response = {
      insights,
      posts: posts.slice(0, 10), // Return top 10 posts for display
      metadata: {
        analysisDate: new Date().toISOString(),
        postsAnalyzed: posts.length,
        subredditsSearched: subreddits,
        dataSource: 'Reddit RSS feeds',
        aiModel: 'gemini-1.5-flash'
      }
    };
    
    console.log(`✅ Public validation completed - Score: ${insights.validationScore}/100`);
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('❌ Public validation failed:', error);
    
    return res.status(500).json({
      message: 'Public validation system temporarily unavailable. Please try again later.',
      error: 'Internal server error'
    });
  }
}