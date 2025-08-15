import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock social media search functions (in real implementation, these would use actual APIs)
async function searchReddit(query: string) {
  // Mock Reddit search - replace with actual Reddit API
  const mockResults = [
    {
      title: `Looking for ${query} alternatives`,
      content: `Anyone know of good ${query} tools? Current solutions are too expensive.`,
      upvotes: 45,
      comments: 12,
      subreddit: 'entrepreneur',
      sentiment: 'positive'
    },
    {
      title: `${query} - worth building?`,
      content: `I'm thinking of building a ${query} solution. Market seems crowded but existing tools suck.`,
      upvotes: 23,
      comments: 8,
      subreddit: 'startups',
      sentiment: 'neutral'
    },
    {
      title: `Best ${query} platforms in 2024`,
      content: `What are the top ${query} tools you're using? Need something reliable and affordable.`,
      upvotes: 67,
      comments: 34,
      subreddit: 'smallbusiness',
      sentiment: 'positive'
    }
  ];
  
  return mockResults;
}

async function searchTwitter(query: string) {
  // Mock Twitter search - replace with actual Twitter API
  const mockResults = [
    {
      text: `Just discovered an amazing ${query} tool! Game changer for my business 🚀`,
      likes: 89,
      retweets: 23,
      replies: 12,
      sentiment: 'positive'
    },
    {
      text: `Anyone else frustrated with current ${query} solutions? They're all so expensive 😤`,
      likes: 156,
      retweets: 45,
      replies: 67,
      sentiment: 'negative'
    },
    {
      text: `Building a ${query} startup. Market research shows huge demand but poor execution.`,
      likes: 234,
      retweets: 78,
      replies: 34,
      sentiment: 'positive'
    }
  ];
  
  return mockResults;
}

async function searchLinkedIn(query: string) {
  // Mock LinkedIn search - replace with actual LinkedIn API
  const mockResults = [
    {
      text: `Excited to share that we're launching a new ${query} solution! Early access available.`,
      reactions: 45,
      comments: 8,
      sentiment: 'positive'
    },
    {
      text: `The ${query} market is growing rapidly. Here's my analysis of the top players...`,
      reactions: 123,
      comments: 23,
      sentiment: 'neutral'
    },
    {
      text: `Looking for ${query} experts to join our advisory board. DM if interested.`,
      reactions: 67,
      comments: 12,
      sentiment: 'positive'
    }
  ];
  
  return mockResults;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST requests allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { idea, industry, targetAudience } = await req.json();
    
    if (!idea || typeof idea !== 'string') {
      return new Response(JSON.stringify({ message: 'Idea is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const isTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(idea + (industry || '') + (targetAudience || ''));
    const language = isTurkish ? 'Turkish' : 'English';

    // Search social media platforms
    console.log(`🔍 Searching social media for: "${idea}"`);
    
    const [redditResults, twitterResults, linkedinResults] = await Promise.all([
      searchReddit(idea),
      searchTwitter(idea),
      searchLinkedIn(idea)
    ]);

    // Analyze social media data
    const socialData = {
      reddit: {
        totalPosts: redditResults.length,
        totalUpvotes: redditResults.reduce((sum, post) => sum + post.upvotes, 0),
        totalComments: redditResults.reduce((sum, post) => sum + post.comments, 0),
        sentiment: redditResults.map(post => post.sentiment),
        topPosts: redditResults.slice(0, 3)
      },
      twitter: {
        totalTweets: twitterResults.length,
        totalLikes: twitterResults.reduce((sum, tweet) => sum + tweet.likes, 0),
        totalRetweets: twitterResults.reduce((sum, tweet) => sum + tweet.retweets, 0),
        totalReplies: twitterResults.reduce((sum, tweet) => sum + tweet.replies, 0),
        sentiment: twitterResults.map(tweet => tweet.sentiment),
        topTweets: twitterResults.slice(0, 3)
      },
      linkedin: {
        totalPosts: linkedinResults.length,
        totalReactions: linkedinResults.reduce((sum, post) => sum + post.reactions, 0),
        totalComments: linkedinResults.reduce((sum, post) => sum + post.comments, 0),
        sentiment: linkedinResults.map(post => post.sentiment),
        topPosts: linkedinResults.slice(0, 3)
      }
    };

    // Calculate engagement metrics
    const totalEngagement = 
      socialData.reddit.totalUpvotes + socialData.reddit.totalComments +
      socialData.twitter.totalLikes + socialData.twitter.totalRetweets + socialData.twitter.totalReplies +
      socialData.linkedin.totalReactions + socialData.linkedin.totalComments;

    const avgEngagement = totalEngagement / (socialData.reddit.totalPosts + socialData.twitter.totalTweets + socialData.linkedin.totalPosts);

    // Sentiment analysis
    const allSentiments = [...socialData.reddit.sentiment, ...socialData.twitter.sentiment, ...socialData.linkedin.sentiment];
    const positiveSentiment = allSentiments.filter(s => s === 'positive').length;
    const negativeSentiment = allSentiments.filter(s => s === 'negative').length;
    const neutralSentiment = allSentiments.filter(s => s === 'neutral').length;
    
    const sentimentScore = (positiveSentiment - negativeSentiment) / allSentiments.length;

    // Generate AI analysis based on social media data
    const prompt = `You are an expert market validation analyst. Analyze this startup idea based on real social media data and provide a validation score.

IDEA: "${idea}"
INDUSTRY: ${industry || 'Not specified'}
TARGET AUDIENCE: ${targetAudience || 'Not specified'}
LANGUAGE: ${language}

SOCIAL MEDIA DATA:
- Reddit: ${socialData.reddit.totalPosts} posts, ${socialData.reddit.totalUpvotes} upvotes, ${socialData.reddit.totalComments} comments
- Twitter: ${socialData.twitter.totalTweets} tweets, ${socialData.twitter.totalLikes} likes, ${socialData.twitter.totalRetweets} retweets
- LinkedIn: ${socialData.linkedin.totalPosts} posts, ${socialData.linkedin.totalReactions} reactions, ${socialData.linkedin.totalComments} comments
- Total Engagement: ${totalEngagement}
- Average Engagement per Post: ${Math.round(avgEngagement)}
- Sentiment Score: ${(sentimentScore * 100).toFixed(1)}% (positive: ${positiveSentiment}, negative: ${negativeSentiment}, neutral: ${neutralSentiment})

TOP SOCIAL MEDIA POSTS:
Reddit: ${socialData.reddit.topPosts.map(p => `"${p.title}" (${p.upvotes} upvotes, ${p.comments} comments)`).join('; ')}
Twitter: ${socialData.twitter.topTweets.map(t => `"${t.text.substring(0, 100)}..." (${t.likes} likes, ${t.retweets} retweets)`).join('; ')}
LinkedIn: ${socialData.linkedin.topPosts.map(p => `"${p.text.substring(0, 100)}..." (${p.reactions} reactions, ${p.comments} comments)`).join('; ')}

Based on this real social media data, provide:
1. A validation score (0-100) considering engagement, sentiment, and market signals
2. Detailed justification for the score
3. Key insights from social media data
4. Market validation recommendations

Return ONLY valid JSON with this exact structure:
{
  "idea": "${idea}",
  "validationScore": number (0-100),
  "scoreJustification": "Detailed explanation of the score based on social media data",
  "socialMediaInsights": {
    "overallEngagement": "Analysis of total engagement across platforms",
    "sentimentAnalysis": "Analysis of positive/negative/neutral sentiment",
    "marketSignals": "What the social media data reveals about market demand",
    "competitionInsights": "Insights about existing solutions and market gaps"
  },
  "recommendations": [
    "Specific action item 1",
    "Specific action item 2",
    "Specific action item 3"
  ],
  "socialMetrics": {
    "totalEngagement": ${totalEngagement},
    "avgEngagementPerPost": ${Math.round(avgEngagement)},
    "sentimentScore": ${(sentimentScore * 100).toFixed(1)},
    "platformBreakdown": {
      "reddit": ${JSON.stringify(socialData.reddit)},
      "twitter": ${JSON.stringify(socialData.twitter)},
      "linkedin": ${JSON.stringify(socialData.linkedin)}
    }
  }
}

Rules:
- Score should be realistic based on actual social media engagement data
- Justification must reference specific social media metrics
- Recommendations should be actionable based on the data
- ${isTurkish ? 'Write in Turkish if the idea is in Turkish, otherwise in English' : 'Write in English'}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        maxOutputTokens: 3000,
        temperature: 0.7,
      }
    });

    const jsonText = result.text.trim();
    
    // Try to parse the JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw AI response:', jsonText);
      
      // Fallback: generate structured response manually
      const fallbackScore = Math.min(100, Math.max(0, Math.round(
        (totalEngagement / 100) * 20 + 
        (sentimentScore + 1) * 30 + 
        (avgEngagement / 10) * 10
      )));
      
      const fallbackResponse = {
        idea: idea,
        validationScore: fallbackScore,
        scoreJustification: isTurkish 
          ? `Sosyal medya verilerine dayalı validasyon skoru: ${fallbackScore}/100. Toplam ${totalEngagement} engagement, ${(sentimentScore * 100).toFixed(1)}% pozitif sentiment.`
          : `Social media data-based validation score: ${fallbackScore}/100. Total ${totalEngagement} engagement, ${(sentimentScore * 100).toFixed(1)}% positive sentiment.`,
        socialMediaInsights: {
          overallEngagement: `Total engagement: ${totalEngagement} across all platforms`,
          sentimentAnalysis: `Sentiment: ${positiveSentiment} positive, ${negativeSentiment} negative, ${neutralSentiment} neutral`,
          marketSignals: `Market shows ${avgEngagement > 50 ? 'strong' : 'moderate'} interest in ${idea}`,
          competitionInsights: `Existing solutions have ${avgEngagement > 100 ? 'high' : 'moderate'} engagement`
        },
        recommendations: [
          isTurkish ? 'Sosyal medya verilerini daha derinlemesine analiz et' : 'Analyze social media data more deeply',
          isTurkish ? 'Hedef kitle ile doğrudan görüşmeler yap' : 'Conduct direct interviews with target audience',
          isTurkish ? 'Rakip analizi yap ve farklılaşma fırsatları bul' : 'Analyze competitors and find differentiation opportunities'
        ],
        socialMetrics: {
          totalEngagement: totalEngagement,
          avgEngagementPerPost: Math.round(avgEngagement),
          sentimentScore: (sentimentScore * 100).toFixed(1),
          platformBreakdown: {
            reddit: socialData.reddit,
            twitter: socialData.twitter,
            linkedin: socialData.linkedin
          }
        }
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate the structure
    if (!parsedResult.validationScore || typeof parsedResult.validationScore !== 'number') {
      throw new Error('Invalid response structure from AI');
    }

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error in social validation:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return new Response(JSON.stringify({ 
      message: `Failed to generate social validation: ${errorMessage}`,
      error: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
