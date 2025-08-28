import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PainPoint {
  category: string;
  topic: string;
  frequency: number;
  sentiment: 'negative' | 'neutral' | 'positive';
  commonIssues: string[];
  solutions: string[];
  impact: 'high' | 'medium' | 'low';
}

interface ShopifyCommunityData {
  categories: {
    name: string;
    topicCount: number;
    url: string;
    rssUrl: string;
  }[];
  painPoints: PainPoint[];
  insights: {
    totalIssues: number;
    topCategories: string[];
    commonThemes: string[];
    recommendations: string[];
  };
}

// Function to parse RSS feeds from Shopify Community
async function parseShopifyRSSFeed(rssUrl: string): Promise<any[]> {
  try {
    const response = await fetch(rssUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch RSS from ${rssUrl}`);
      return [];
    }
    
    const xmlText = await response.text();
    
    // Simple XML parsing for RSS feeds
    // In production, use a proper XML parser like 'xml2js'
    const topics: any[] = [];
    
    // Extract topic titles and basic info from RSS
    const titleMatches = xmlText.match(/<title>(.*?)<\/title>/g);
    const linkMatches = xmlText.match(/<link>(.*?)<\/link>/g);
    
    if (titleMatches && linkMatches) {
      for (let i = 0; i < Math.min(titleMatches.length, linkMatches.length); i++) {
        const title = titleMatches[i].replace(/<title>|<\/title>/g, '');
        const link = linkMatches[i].replace(/<link>|<\/link>/g, '');
        
        if (title && link && !title.includes('Shopify Community')) {
          topics.push({ title, link });
        }
      }
    }
    
    return topics;
  } catch (error) {
    console.error(`Error parsing RSS feed ${rssUrl}:`, error);
    return [];
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analysisType = 'comprehensive', useRealData = false } = req.body;

    let shopifyData: ShopifyCommunityData;

    if (useRealData) {
      // Use real RSS feeds from Shopify Community
      shopifyData = await analyzeShopifyCommunityFromRSS(analysisType);
    } else {
      // Use simulated data (current approach)
      shopifyData = await analyzeShopifyCommunity(analysisType);
    }

    res.status(200).json(shopifyData);
  } catch (error) {
    console.error('Shopify pain points analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze Shopify Community pain points',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// New function to analyze real RSS feeds
async function analyzeShopifyCommunityFromRSS(analysisType: string): Promise<ShopifyCommunityData> {
  const rssFeeds = [
    { name: 'Start a Business', url: 'https://community.shopify.com/c/start-a-business/282', topicCount: 5504 },
    { name: 'Store Design', url: 'https://community.shopify.com/c/store-design/133', topicCount: 94274 },
    { name: 'Technical Q&A', url: 'https://community.shopify.com/c/technical-qa/211', topicCount: 43314 },
    { name: 'Shopify Apps', url: 'https://community.shopify.com/c/shopify-apps/186', topicCount: 19136 },
    { name: 'Payments + Shipping', url: 'https://community.shopify.com/c/payments-shipping-fulfilment/217', topicCount: 14518 },
    { name: 'SEO', url: 'https://community.shopify.com/c/seo/288', topicCount: 36 },
    { name: 'Social Media', url: 'https://community.shopify.com/c/social-media/289', topicCount: 16 },
    { name: 'Email Marketing', url: 'https://community.shopify.com/c/email-marketing/292', topicCount: 15 }
  ];

  const categories = rssFeeds.map(feed => ({
    name: feed.name,
    topicCount: feed.topicCount,
    url: feed.url,
    rssUrl: `${feed.url}.rss`
  }));

  // Parse real RSS feeds to get current topics
  const realTopics: any[] = [];
  for (const category of categories) {
    const topics = await parseShopifyRSSFeed(category.rssUrl);
    realTopics.push(...topics.map(topic => ({ ...topic, category: category.name })));
  }

  // Analyze real topics for pain points
  const painPoints = analyzeTopicsForPainPoints(realTopics);

  const insights = {
    totalIssues: painPoints.reduce((sum, point) => sum + point.frequency, 0),
    topCategories: ['Store Design', 'Technical Q&A', 'Payments + Shipping'],
    commonThemes: [
      'User experience optimization',
      'Technical troubleshooting',
      'Performance improvement',
      'Customer trust building',
      'Operational efficiency'
    ],
    recommendations: [
      'Focus on mobile-first design and fast loading times',
      'Implement comprehensive testing before app installations',
      'Offer transparent pricing and multiple payment options',
      'Create detailed product descriptions and high-quality images',
      'Build trust through security badges and customer reviews',
      'Develop a content strategy for consistent social media presence'
    ]
  };

  return {
    categories,
    painPoints,
    insights
  };
}

// Function to analyze real topics and identify pain points
function analyzeTopicsForPainPoints(topics: any[]): PainPoint[] {
  // This is a simplified analysis - in production, use NLP/AI for better results
  const painPoints: PainPoint[] = [];
  
  // Analyze topics for common pain point keywords
  const painKeywords = {
    'Store Design': ['theme', 'customization', 'mobile', 'responsive', 'loading', 'speed'],
    'Technical Q&A': ['app', 'integration', 'conflict', 'performance', 'error', 'bug'],
    'Payments + Shipping': ['checkout', 'abandonment', 'shipping', 'cost', 'payment', 'trust'],
    'SEO': ['ranking', 'visibility', 'search', 'optimization', 'meta', 'title'],
    'Start a Business': ['supplier', 'sourcing', 'quality', 'shipping', 'cost', 'MOQ'],
    'Social Media': ['content', 'engagement', 'algorithm', 'ROI', 'follower', 'post']
  };

  // Count frequency of pain-related topics
  for (const [category, keywords] of Object.entries(painKeywords)) {
    const categoryTopics = topics.filter(t => t.category === category);
    let frequency = 0;
    
    for (const topic of categoryTopics) {
      const title = topic.title.toLowerCase();
      for (const keyword of keywords) {
        if (title.includes(keyword.toLowerCase())) {
          frequency++;
        }
      }
    }

    if (frequency > 0) {
      painPoints.push({
        category,
        topic: `Common ${category} Issues`,
        frequency,
        sentiment: 'negative',
        commonIssues: [`Based on ${frequency} recent community discussions`],
        solutions: ['Check community solutions and best practices'],
        impact: frequency > 10 ? 'high' : frequency > 5 ? 'medium' : 'low'
      });
    }
  }

  return painPoints;
}

async function analyzeShopifyCommunity(analysisType: string): Promise<ShopifyCommunityData> {
  // Real Shopify Community RSS feed URLs
  const rssFeeds = [
    { name: 'Start a Business', url: 'https://community.shopify.com/c/start-a-business/282', topicCount: 5504 },
    { name: 'Store Design', url: 'https://community.shopify.com/c/store-design/133', topicCount: 94274 },
    { name: 'Technical Q&A', url: 'https://community.shopify.com/c/technical-qa/211', topicCount: 43314 },
    { name: 'Shopify Apps', url: 'https://community.shopify.com/c/shopify-apps/186', topicCount: 19136 },
    { name: 'Payments + Shipping', url: 'https://community.shopify.com/c/payments-shipping-fulfilment/217', topicCount: 14518 },
    { name: 'SEO', url: 'https://community.shopify.com/c/seo/288', topicCount: 36 },
    { name: 'Social Media', url: 'https://community.shopify.com/c/social-media/289', topicCount: 16 },
    { name: 'Email Marketing', url: 'https://community.shopify.com/c/email-marketing/292', topicCount: 15 }
  ];

  // TODO: In production, implement RSS feed parsing from these URLs:
  // Example RSS feed URLs:
  // https://community.shopify.com/c/store-design/133.rss
  // https://community.shopify.com/c/technical-qa/211.rss
  
  // For now, using simulated data based on real community structure
  const categories = rssFeeds.map(feed => ({
    name: feed.name,
    topicCount: feed.topicCount,
    url: feed.url,
    rssUrl: `${feed.url}.rss` // Potential RSS feed URL
  }));

  const painPoints: PainPoint[] = [
    {
      category: 'Store Design',
      topic: 'Theme Customization Issues',
      frequency: 85,
      sentiment: 'negative',
      commonIssues: [
        'Difficulty customizing themes without coding knowledge',
        'Mobile responsiveness problems',
        'Slow loading times on custom themes',
        'Theme compatibility issues with apps'
      ],
      solutions: [
        'Use Shopify theme editor with visual customization',
        'Implement lazy loading for images',
        'Choose mobile-first responsive themes',
        'Test theme-app compatibility before purchase'
      ],
      impact: 'high'
    },
    {
      category: 'Technical Q&A',
      topic: 'App Integration Problems',
      frequency: 72,
      sentiment: 'negative',
      commonIssues: [
        'Apps conflicting with each other',
        'Performance degradation after app installation',
        'Difficult app removal and cleanup',
        'App support and documentation issues'
      ],
      solutions: [
        'Install apps one at a time and test thoroughly',
        'Monitor site performance before and after app installation',
        'Use app removal tools to clean up code',
        'Choose apps with good support and documentation'
      ],
      impact: 'high'
    },
    {
      category: 'Payments + Shipping',
      topic: 'Checkout Abandonment',
      frequency: 68,
      sentiment: 'negative',
      commonIssues: [
        'High shipping costs at checkout',
        'Payment method limitations',
        'Complex checkout process',
        'Trust and security concerns'
      ],
      solutions: [
        'Offer free shipping thresholds',
        'Add multiple payment options including PayPal, Apple Pay',
        'Simplify checkout to single page',
        'Display trust badges and security certificates'
      ],
      impact: 'high'
    },
    {
      category: 'SEO',
      topic: 'Search Engine Visibility',
      frequency: 45,
      sentiment: 'negative',
      commonIssues: [
        'Poor search engine rankings',
        'Duplicate content issues',
        'Slow page loading speeds',
        'Missing meta descriptions and titles'
      ],
      solutions: [
        'Optimize product titles and descriptions',
        'Use canonical URLs to prevent duplicate content',
        'Implement image optimization and compression',
        'Add structured data markup for products'
      ],
      impact: 'medium'
    },
    {
      category: 'Start a Business',
      topic: 'Product Sourcing Challenges',
      frequency: 38,
      sentiment: 'negative',
      commonIssues: [
        'Finding reliable suppliers',
        'Quality control issues',
        'Shipping delays and costs',
        'Minimum order quantities'
      ],
      solutions: [
        'Use supplier verification platforms like Alibaba Gold',
        'Request samples before bulk orders',
        'Negotiate shipping terms and costs',
        'Start with smaller suppliers for lower MOQs'
      ],
      impact: 'medium'
    },
    {
      category: 'Social Media',
      topic: 'Content Creation and Engagement',
      frequency: 32,
      sentiment: 'negative',
      commonIssues: [
        'Consistent content creation',
        'Low engagement rates',
        'Platform algorithm changes',
        'Measuring ROI from social media'
      ],
      solutions: [
        'Create content calendar and batch content creation',
        'Engage with followers and respond to comments',
        'Stay updated with platform changes',
        'Use UTM parameters to track social media traffic'
      ],
      impact: 'medium'
    }
  ];

  const insights = {
    totalIssues: painPoints.reduce((sum, point) => sum + point.frequency, 0),
    topCategories: ['Store Design', 'Technical Q&A', 'Payments + Shipping'],
    commonThemes: [
      'User experience optimization',
      'Technical troubleshooting',
      'Performance improvement',
      'Customer trust building',
      'Operational efficiency'
    ],
    recommendations: [
      'Focus on mobile-first design and fast loading times',
      'Implement comprehensive testing before app installations',
      'Offer transparent pricing and multiple payment options',
      'Create detailed product descriptions and high-quality images',
      'Build trust through security badges and customer reviews',
      'Develop a content strategy for consistent social media presence'
    ]
  };

  return {
    categories,
    painPoints,
    insights
  };
}
