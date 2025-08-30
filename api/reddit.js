import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, time_range = '3months', max_items = 100 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🔍 Reddit API: Searching for "${query}"`);

    // Search multiple subreddits
    const subreddits = [
      'entrepreneur', 'startups', 'business', 'smallbusiness',
      'SaaS', 'marketing', 'productivity', 'technology'
    ];

    const searchPromises = subreddits.slice(0, 3).map(async (subreddit) => {
      try {
        // Use Reddit's JSON API (no auth required)
        const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=10&sort=relevance`;
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Validationly/1.0 (Business Validation Tool)',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          console.warn(`Reddit API error for r/${subreddit}: ${response.status}`);
          return { subreddit, posts: [] };
        }

        const data = await response.json();
        const posts = data.data?.children?.map(child => ({
          id: child.data.id,
          title: child.data.title,
          text: child.data.selftext || '',
          author: child.data.author,
          score: child.data.score,
          num_comments: child.data.num_comments,
          created_utc: child.data.created_utc,
          url: `https://reddit.com${child.data.permalink}`,
          subreddit: child.data.subreddit
        })) || [];

        return { subreddit, posts };
      } catch (error) {
        console.error(`Error fetching from r/${subreddit}:`, error.message);
        return { subreddit, posts: [] };
      }
    });

    const subredditResults = await Promise.all(searchPromises);
    const allPosts = subredditResults.flatMap(result => result.posts);

    // Calculate metrics
    const totalVolume = allPosts.length;
    const totalScore = allPosts.reduce((sum, post) => sum + (post.score || 0), 0);
    const totalComments = allPosts.reduce((sum, post) => sum + (post.num_comments || 0), 0);
    const avgEngagement = totalVolume > 0 ? (totalScore + totalComments) / totalVolume : 0;

    // Calculate sentiment (basic approach)
    const positiveKeywords = ['great', 'amazing', 'love', 'excellent', 'good', 'best', 'awesome', 'perfect'];
    const negativeKeywords = ['bad', 'terrible', 'hate', 'worst', 'awful', 'problem', 'issue', 'sucks'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    allPosts.forEach(post => {
      const text = (post.title + ' ' + post.text).toLowerCase();
      positiveKeywords.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      negativeKeywords.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
    });

    const sentimentScore = positiveCount + negativeCount > 0 
      ? (positiveCount / (positiveCount + negativeCount)) * 100
      : 50; // neutral

    // Extract trending keywords
    const wordFreq = {};
    allPosts.forEach(post => {
      const words = (post.title + ' ' + post.text)
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'would'].includes(word));
      
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
    });

    const trendingKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    const result = {
      platform: 'reddit',
      query,
      total_posts: totalVolume,
      sentiment_score: Math.round(sentimentScore),
      engagement_metrics: {
        avg_score: totalVolume > 0 ? Math.round(totalScore / totalVolume) : 0,
        avg_comments: totalVolume > 0 ? Math.round(totalComments / totalVolume) : 0,
        total_engagement: totalScore + totalComments
      },
      trending_keywords: trendingKeywords,
      top_posts: allPosts
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5)
        .map(post => ({
          title: post.title,
          score: post.score,
          comments: post.num_comments,
          url: post.url,
          subreddit: post.subreddit
        })),
      subreddit_breakdown: subredditResults.map(result => ({
        subreddit: result.subreddit,
        post_count: result.posts.length,
        avg_score: result.posts.length > 0 
          ? Math.round(result.posts.reduce((sum, post) => sum + (post.score || 0), 0) / result.posts.length)
          : 0
      })),
      metadata: {
        search_timestamp: new Date().toISOString(),
        time_range,
        max_items,
        subreddits_searched: subreddits.slice(0, 3)
      }
    };

    console.log(`✅ Reddit API: Found ${totalVolume} posts with ${Math.round(sentimentScore)}% positive sentiment`);
    
    res.status(200).json(result);

  } catch (error) {
    console.error('Reddit API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Reddit data',
      details: error.message 
    });
  }
}
