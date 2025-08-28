import { VercelRequest, VercelResponse } from '@vercel/node';

interface PainPoint {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  demandScore: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  evidence: Array<{
    source: string;
    url: string;
    snippet: string;
    upvotes?: number;
    comments?: number;
  }>;
  suggestedSolution: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  technicalComplexity: 'Low' | 'Medium' | 'High';
  estimatedMarketSize: string;
  tags: string[];
  createdAt: string;
  lastUpdated: string;
}

interface ShopifyPainPoint {
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
  }[];
  painPoints: ShopifyPainPoint[];
  insights: {
    totalIssues: number;
    topCategories: string[];
    commonThemes: string[];
    recommendations: string[];
  };
}

// Sample pain points database
const painPointsDB: PainPoint[] = [
  {
    id: '1',
    title: 'Freelancers struggle with client brief collection',
    description: 'Freelancers across all industries consistently report spending 20-40% of their project time just trying to extract proper requirements from clients. This leads to scope creep, missed deadlines, unhappy clients, and reduced profitability.',
    category: 'Freelancing',
    industry: 'Professional Services',
    demandScore: 85,
    difficultyLevel: 'Medium',
    evidence: [
      {
        source: 'Reddit r/freelance',
        url: 'https://reddit.com/r/freelance/example1',
        snippet: 'Getting briefs from clients is a nightmare. I spend more time trying to understand what they want than actually doing the work.',
        upvotes: 234,
        comments: 45
      },
      {
        source: 'IndieHackers',
        url: 'https://indiehackers.com/example2',
        snippet: 'Built a simple brief collection tool for my agency. Clients love it and we save 10+ hours per project.',
        upvotes: 89,
        comments: 23
      }
    ],
    suggestedSolution: 'Brief collection tool with templates + CRM integration',
    competitionLevel: 'Low',
    technicalComplexity: 'Medium',
    estimatedMarketSize: '$50M',
    tags: ['freelancing', 'client-management', 'forms', 'project-management'],
    createdAt: '2025-01-25',
    lastUpdated: '2025-01-25'
  },
  {
    id: '2',
    title: 'Small businesses need simple inventory tracking',
    description: 'Local shops and small businesses struggle with Excel-based inventory management. They need something simpler than enterprise solutions but more robust than spreadsheets.',
    category: 'SaaS',
    industry: 'Retail',
    demandScore: 78,
    difficultyLevel: 'Easy',
    evidence: [
      {
              source: 'Product Hunt',
      url: 'https://producthunt.com/example',
        snippet: 'Current inventory software is too complex for our small shop. We just need basic tracking.',
        upvotes: 156,
        comments: 32
      }
    ],
    suggestedSolution: 'Simple inventory tracker with barcode scanning',
    competitionLevel: 'Medium',
    technicalComplexity: 'Low',
    estimatedMarketSize: '$120M',
    tags: ['inventory', 'small-business', 'retail', 'pos'],
    createdAt: '2025-01-24',
    lastUpdated: '2025-01-24'
  },
  {
    id: '3',
    title: 'Content creators need better analytics dashboard',
    description: 'YouTubers and content creators juggle multiple platforms but lack unified analytics. Current tools are too complex or expensive for individual creators.',
    category: 'Marketing',
    industry: 'Content Creation',
    demandScore: 92,
    difficultyLevel: 'Hard',
    evidence: [
      {
        source: 'IndieHackers',
        url: 'https://indiehackers.com/example',
        snippet: 'Managing analytics across YouTube, TikTok, Instagram is a nightmare. Need one dashboard.',
        upvotes: 445,
        comments: 78
      }
    ],
    suggestedSolution: 'Unified analytics dashboard for content creators',
    competitionLevel: 'Medium',
    technicalComplexity: 'High',
    estimatedMarketSize: '$80M',
    tags: ['analytics', 'content-creation', 'youtube', 'social-media'],
    createdAt: '2025-01-23',
    lastUpdated: '2025-01-23'
  }
];

// Shopify Community Analysis Functions
async function analyzeShopifyCommunity(analysisType: string): Promise<ShopifyCommunityData> {
  // Simulated data for Shopify Community analysis
  const categories = [
    { name: 'Start a Business', topicCount: 5504, url: 'https://community.shopify.com/c/start-a-business/282', rssUrl: 'https://community.shopify.com/c/start-a-business/282.rss' },
    { name: 'Sell Online', topicCount: 3241, url: 'https://community.shopify.com/c/sell-online/283', rssUrl: 'https://community.shopify.com/c/sell-online/283.rss' },
    { name: 'Marketing', topicCount: 2897, url: 'https://community.shopify.com/c/marketing/284', rssUrl: 'https://community.shopify.com/c/marketing/284.rss' },
    { name: 'Apps & Integrations', topicCount: 2156, url: 'https://community.shopify.com/c/apps-integrations/285', rssUrl: 'https://community.shopify.com/c/apps-integrations/285.rss' },
    { name: 'Store Management', topicCount: 1987, url: 'https://community.shopify.com/c/store-management/286', rssUrl: 'https://community.shopify.com/c/store-management/286.rss' }
  ];

  const painPoints: ShopifyPainPoint[] = [
    {
      category: 'Start a Business',
      topic: 'Setting up payment processing',
      frequency: 89,
      sentiment: 'negative',
      commonIssues: ['Payment gateway setup complexity', 'Transaction fees confusion', 'International payment support'],
      solutions: ['Step-by-step payment setup guide', 'Fee calculator tool', 'Multi-currency support'],
      impact: 'high'
    },
    {
      category: 'Sell Online',
      topic: 'Inventory management',
      frequency: 76,
      sentiment: 'negative',
      commonIssues: ['Stock level tracking', 'Low stock alerts', 'Inventory sync across channels'],
      solutions: ['Automated inventory tracking', 'Real-time stock updates', 'Multi-channel sync'],
      impact: 'high'
    },
    {
      category: 'Marketing',
      topic: 'Email marketing automation',
      frequency: 65,
      sentiment: 'neutral',
      commonIssues: ['Email template design', 'Automation workflow setup', 'Performance tracking'],
      solutions: ['Template library', 'Drag-and-drop workflow builder', 'Analytics dashboard'],
      impact: 'medium'
    }
  ];

  return {
    categories,
    painPoints,
    insights: {
      totalIssues: 230,
      topCategories: ['Start a Business', 'Sell Online', 'Marketing'],
      commonThemes: ['Payment processing', 'Inventory management', 'Marketing automation'],
      recommendations: [
        'Focus on simplifying payment gateway setup',
        'Improve inventory management tools',
        'Enhance marketing automation features'
      ]
    }
  };
}

async function analyzeShopifyCommunityFromRSS(analysisType: string): Promise<ShopifyCommunityData> {
  const rssFeeds = [
    { name: 'Start a Business', url: 'https://community.shopify.com/c/start-a-business/282', topicCount: 5504, rssUrl: 'https://community.shopify.com/c/start-a-business/282.rss' },
    { name: 'Sell Online', url: 'https://community.shopify.com/c/sell-online/283', topicCount: 3241, rssUrl: 'https://community.shopify.com/c/sell-online/283.rss' },
    { name: 'Marketing', url: 'https://community.shopify.com/c/marketing/284', topicCount: 2897, rssUrl: 'https://community.shopify.com/c/marketing/284.rss' },
    { name: 'Apps & Integrations', url: 'https://community.shopify.com/c/apps-integrations/285', topicCount: 2156, rssUrl: 'https://community.shopify.com/c/apps-integrations/285.rss' },
    { name: 'Store Management', url: 'https://community.shopify.com/c/store-management/286', topicCount: 1987, rssUrl: 'https://community.shopify.com/c/store-management/286.rss' }
  ];

  try {
    // Parse RSS feeds to get real-time data
    const allTopics: any[] = [];
    
    for (const feed of rssFeeds) {
      const topics = await parseShopifyRSSFeed(feed.rssUrl);
      allTopics.push(...topics.map(topic => ({ ...topic, category: feed.name })));
    }

    // Analyze topics to identify pain points
    const painPoints = analyzeTopicsForPainPoints(allTopics);
    
    return {
      categories: rssFeeds,
      painPoints,
      insights: {
        totalIssues: painPoints.length,
        topCategories: rssFeeds.slice(0, 3).map(f => f.name),
        commonThemes: extractCommonThemes(allTopics),
        recommendations: generateRecommendations(painPoints)
      }
    };
  } catch (error) {
    console.error('Error analyzing Shopify Community from RSS:', error);
    // Fallback to simulated data
    return analyzeShopifyCommunity(analysisType);
  }
}

function analyzeTopicsForPainPoints(topics: any[]): ShopifyPainPoint[] {
  // Simple analysis of topics to identify pain points
  const painPoints: ShopifyPainPoint[] = [];
  
  // Group topics by category and analyze frequency
  const categoryTopics: { [key: string]: string[] } = {};
  topics.forEach(topic => {
    if (!categoryTopics[topic.category]) {
      categoryTopics[topic.category] = [];
    }
    categoryTopics[topic.category].push(topic.title);
  });

  // Analyze each category for common issues
  Object.entries(categoryTopics).forEach(([category, titles]) => {
    const commonIssues = findCommonIssues(titles);
    if (commonIssues.length > 0) {
      painPoints.push({
        category,
        topic: commonIssues[0],
        frequency: titles.length,
        sentiment: 'negative', // Most community posts are about issues
        commonIssues,
        solutions: generateSolutions(commonIssues),
        impact: titles.length > 10 ? 'high' : titles.length > 5 ? 'medium' : 'low'
      });
    }
  });

  return painPoints;
}

function findCommonIssues(titles: string[]): string[] {
  const issueKeywords = ['problem', 'issue', 'error', 'help', 'how to', 'trouble', 'fix', 'broken', 'not working'];
  const issues: string[] = [];
  
  titles.forEach(title => {
    const lowerTitle = title.toLowerCase();
    issueKeywords.forEach(keyword => {
      if (lowerTitle.includes(keyword)) {
        issues.push(title);
        return;
      }
    });
  });
  
  return issues.slice(0, 3); // Return top 3 issues
}

function generateSolutions(issues: string[]): string[] {
  return issues.map(issue => {
    if (issue.toLowerCase().includes('payment')) return 'Payment gateway setup guide';
    if (issue.toLowerCase().includes('inventory')) return 'Inventory management tutorial';
    if (issue.toLowerCase().includes('marketing')) return 'Marketing automation guide';
    return 'Step-by-step troubleshooting guide';
  });
}

function extractCommonThemes(topics: any[]): string[] {
  const themes = ['payment', 'inventory', 'marketing', 'shipping', 'taxes', 'apps'];
  const themeCounts: { [key: string]: number } = {};
  
  themes.forEach(theme => {
    themeCounts[theme] = topics.filter(topic => 
      topic.title.toLowerCase().includes(theme)
    ).length;
  });
  
  return Object.entries(themeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([theme]) => theme);
}

function generateRecommendations(painPoints: ShopifyPainPoint[]): string[] {
  const recommendations: string[] = [];
  
  painPoints.forEach(point => {
    if (point.impact === 'high') {
      recommendations.push(`Prioritize solutions for ${point.topic} in ${point.category}`);
    }
  });
  
  return recommendations.slice(0, 3);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, analysisType = 'comprehensive' } = req.body;

    if (type === 'shopify') {
      // Shopify Community pain points analysis
      const shopifyData = await analyzeShopifyCommunity(analysisType);
      res.status(200).json(shopifyData);
    } else {
      // General pain points search
      const { query, category, industry } = req.body;
      
      let filteredPoints = painPointsDB;

      if (query) {
        const searchQuery = query.toLowerCase();
        filteredPoints = filteredPoints.filter(point =>
          point.title.toLowerCase().includes(searchQuery) ||
          point.description.toLowerCase().includes(searchQuery) ||
          point.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
      }

      if (category) {
        filteredPoints = filteredPoints.filter(point => point.category === category);
      }

      if (industry) {
        filteredPoints = filteredPoints.filter(point => point.industry === industry);
      }

      // Sort by demand score
      filteredPoints.sort((a, b) => b.demandScore - a.demandScore);

      res.status(200).json({
        painPoints: filteredPoints,
        total: filteredPoints.length,
        query: query || null,
        category: category || null,
        industry: industry || null
      });
    }
  } catch (error) {
    console.error('Pain points analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze pain points',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}