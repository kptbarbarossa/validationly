import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
  topics: Array<{ name: string }>;
  user: { username: string };
}

interface ProductHuntSearchResponse {
  data: {
    posts: {
      edges: Array<{
        node: ProductHuntPost;
      }>;
    };
  };
}

interface ProductHuntValidationResult {
  totalResults: number;
  items: ProductHuntPost[];
  analysis: {
    averageVotes: number;
    averageComments: number;
    topTopics: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingProducts: string[];
    engagementScore: number;
    marketValidation: {
      highDemand: boolean;
      competitionLevel: 'high' | 'medium' | 'low';
      marketOpportunity: string;
    };
  };
}

// GraphQL query for Product Hunt product search
const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    posts(query: $query, first: $first) {
      edges {
        node {
          id
          name
          tagline
          votesCount
          commentsCount
          createdAt
          topics {
            name
          }
          user {
            username
          }
        }
      }
    }
  }
`;

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

    // Search Product Hunt using GraphQL API
    const phData = await searchProductHunt(query, analysisType);

    res.status(200).json(phData);
  } catch (error) {
    console.error('Product Hunt API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Product Hunt data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function searchProductHunt(query: string, analysisType: string): Promise<ProductHuntValidationResult> {
  try {
    // Get Product Hunt access token from environment
    const accessToken = process.env.PRODUCTHUNT_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('Product Hunt access token not configured, using fallback data');
      return generateFallbackData();
    }

    // Make GraphQL request to Product Hunt API
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: SEARCH_PRODUCTS_QUERY,
        variables: {
          query: query,
          first: 50 // Get up to 50 products
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Product Hunt API error: ${response.status}`);
    }

    const data: ProductHuntSearchResponse = await response.json();
    
    // Extract posts from GraphQL response
    const posts = data.data.posts.edges.map(edge => edge.node);
    
    // Analyze the results
    const analysis = analyzeProductHuntResults(posts, query);
    
    return {
      totalResults: posts.length,
      items: posts.slice(0, 20), // Return top 20 results
      analysis
    };
  } catch (error) {
    console.error('Error searching Product Hunt:', error);
    
    // Return fallback data if API fails
    return generateFallbackData();
  }
}

function analyzeProductHuntResults(posts: ProductHuntPost[], query: string): ProductHuntValidationResult['analysis'] {
  if (posts.length === 0) {
    return {
      averageVotes: 0,
      averageComments: 0,
      topTopics: [],
      sentiment: 'neutral',
      trendingProducts: [],
      engagementScore: 0,
      marketValidation: {
        highDemand: false,
        competitionLevel: 'low',
        marketOpportunity: 'No existing products found - potential blue ocean opportunity'
      }
    };
  }

  // Calculate averages
  const totalVotes = posts.reduce((sum, post) => sum + post.votesCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentsCount, 0);
  const averageVotes = Math.round(totalVotes / posts.length);
  const averageComments = Math.round(totalComments / posts.length);

  // Find top topics
  const topicCounts: { [key: string]: number } = {};
  posts.forEach(post => {
    post.topics.forEach(topic => {
      topicCounts[topic.name] = (topicCounts[topic.name] || 0) + 1;
    });
  });
  const topTopics = Object.entries(topicCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([topic]) => topic);

  // Analyze sentiment based on votes and comments
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (averageVotes > 100 && averageComments > 20) {
    sentiment = 'positive';
  } else if (averageVotes < 20 && averageComments < 5) {
    sentiment = 'negative';
  }

  // Extract trending product names
  const trendingProducts = posts
    .sort((a, b) => b.votesCount - a.votesCount)
    .slice(0, 5)
    .map(post => post.name);

  // Calculate engagement score (0-100)
  const engagementScore = Math.min(100, Math.round(
    ((averageVotes / 200) * 0.7 + (averageComments / 50) * 0.3) * 100
  ));

  // Market validation analysis
  const marketValidation = analyzeMarketValidation(posts, query);

  return {
    averageVotes,
    averageComments,
    topTopics,
    sentiment,
    trendingProducts,
    engagementScore,
    marketValidation
  };
}

function analyzeMarketValidation(posts: ProductHuntPost[], query: string): ProductHuntValidationResult['analysis']['marketValidation'] {
  const totalVotes = posts.reduce((sum, post) => sum + post.votesCount, 0);
  const avgVotes = totalVotes / posts.length;
  
  // Determine competition level
  let competitionLevel: 'high' | 'medium' | 'low' = 'low';
  if (posts.length > 20 && avgVotes > 50) {
    competitionLevel = 'high';
  } else if (posts.length > 10 && avgVotes > 20) {
    competitionLevel = 'medium';
  }

  // Determine market opportunity
  let marketOpportunity = '';
  if (competitionLevel === 'high') {
    marketOpportunity = 'High competition indicates strong market demand - focus on differentiation';
  } else if (competitionLevel === 'medium') {
    marketOpportunity = 'Moderate competition with growth potential - identify underserved niches';
  } else {
    marketOpportunity = 'Low competition suggests untapped market opportunity';
  }

  return {
    highDemand: avgVotes > 30,
    competitionLevel,
    marketOpportunity
  };
}

function generateFallbackData(): ProductHuntValidationResult {
  return {
    totalResults: 0,
    items: [],
    analysis: {
      averageVotes: 0,
      averageComments: 0,
      topTopics: [],
      sentiment: 'neutral',
      trendingProducts: [],
      engagementScore: 0,
      marketValidation: {
        highDemand: false,
        competitionLevel: 'low',
        marketOpportunity: 'Product Hunt data unavailable - check API configuration'
      }
    }
  };
}
