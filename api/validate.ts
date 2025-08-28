import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { YouTubeService } from '../lib/services/platforms/youtube.js';
import { MultiPlatformService } from '../lib/services/multiPlatformService.js';
import { ValidationlyDB } from '../lib/supabase.js';

// Import our enhanced prompt system

export interface IdeaClassification {
  primaryCategory: string;
  businessModel: string;
  targetMarket: string;
  complexity: string;
  industryContext: string;
  keyTerms: string[];
}

// Quick classification function (simplified version for API)
const classifyIdea = (idea: string): IdeaClassification => {
  const lowerIdea = idea.toLowerCase();

  const categoryPatterns = {
    'SaaS': ['saas', 'software', 'platform', 'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'api', 'tool', 'system', 'solution'],
    'FinTech': ['payment', 'banking', 'finance', 'money', 'investment', 'trading', 'crypto', 'wallet', 'loan', 'fintech', 'financial'],
    'E-commerce': ['ecommerce', 'e-commerce', 'shop', 'store', 'marketplace', 'retail', 'product', 'selling', 'buy', 'sell', 'commerce'],
    'HealthTech': ['health', 'medical', 'healthcare', 'patient', 'doctor', 'clinic', 'diagnosis', 'therapy', 'wellness', 'fitness', 'mental'],
    'EdTech': ['education', 'learning', 'course', 'student', 'teacher', 'school', 'training', 'skill', 'knowledge', 'study', 'tutorial'],
    'Marketplace': ['marketplace', 'connect', 'freelancer', 'gig', 'peer-to-peer', 'sharing', 'platform', 'network', 'community'],
    'FoodTech': ['food', 'restaurant', 'delivery', 'recipe', 'cooking', 'meal', 'nutrition', 'diet', 'kitchen', 'chef'],
    'TravelTech': ['travel', 'trip', 'hotel', 'booking', 'vacation', 'tourism', 'flight', 'destination', 'journey'],
    'PropTech': ['property', 'real estate', 'rent', 'housing', 'apartment', 'home', 'building', 'construction'],
    'AgriTech': ['agriculture', 'farming', 'crop', 'farm', 'agricultural', 'harvest', 'livestock', 'rural'],
    'CleanTech': ['clean', 'green', 'sustainable', 'renewable', 'energy', 'solar', 'environment', 'eco'],
    'Gaming': ['game', 'gaming', 'player', 'entertainment', 'fun', 'play', 'mobile game', 'video game'],
    'Social': ['social', 'community', 'friends', 'chat', 'messaging', 'network', 'share', 'connect'],
    'Productivity': ['productivity', 'organize', 'task', 'time', 'efficiency', 'management', 'planning', 'schedule'],
    'Content': ['content', 'media', 'video', 'blog', 'writing', 'creator', 'publish', 'streaming'],
    'AI/ML': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'algorithm', 'prediction', 'automation'],
    'IoT': ['iot', 'internet of things', 'smart', 'sensor', 'device', 'connected', 'hardware', 'monitoring'],
    'Logistics': ['logistics', 'delivery', 'shipping', 'transport', 'supply chain', 'warehouse', 'fulfillment'],
    'Security': ['security', 'privacy', 'protection', 'safe', 'secure', 'cybersecurity', 'encryption', 'authentication']
  };

  const businessModelPatterns = {
    'B2B': ['business', 'enterprise', 'company', 'organization', 'corporate', 'team', 'professional', 'workplace', 'office'],
    'B2C': ['consumer', 'user', 'customer', 'individual', 'personal', 'people', 'everyone', 'anyone', 'public'],
    'Marketplace': ['marketplace', 'connect', 'platform', 'peer-to-peer', 'two-sided', 'network', 'community', 'matching'],
    'Subscription': ['subscription', 'monthly', 'recurring', 'saas', 'membership', 'premium', 'plan', 'tier'],
    'Freemium': ['free', 'freemium', 'basic', 'upgrade', 'premium features'],
    'E-commerce': ['sell', 'buy', 'purchase', 'order', 'product', 'store', 'shop', 'retail'],
    'Advertising': ['ads', 'advertising', 'sponsored', 'revenue', 'monetize', 'traffic']
  };

  const targetMarketPatterns = {
    'SMB': ['small business', 'smb', 'startup', 'entrepreneur', 'freelancer', 'small company', 'local business'],
    'Enterprise': ['enterprise', 'large company', 'corporation', 'fortune', 'big business', 'multinational'],
    'Consumer': ['consumer', 'individual', 'personal', 'everyday', 'people', 'user', 'customer', 'public'],
    'Developer': ['developer', 'programmer', 'api', 'code', 'technical', 'engineer', 'software developer'],
    'Students': ['student', 'university', 'college', 'school', 'academic', 'education'],
    'Professionals': ['professional', 'expert', 'specialist', 'consultant', 'manager', 'executive'],
    'Creators': ['creator', 'artist', 'designer', 'writer', 'influencer', 'content creator'],
    'Healthcare': ['doctor', 'nurse', 'patient', 'medical', 'healthcare professional', 'clinic'],
    'Parents': ['parent', 'family', 'children', 'kids', 'mother', 'father', 'baby']
  };

  // Detect primary category with weighted scoring
  let primaryCategory = 'Tech Startup';
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerIdea.includes(keyword)) {
        // Give higher weight to exact matches and longer keywords
        score += keyword.length > 5 ? 2 : 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      primaryCategory = category;
    }
  }

  // If no strong category match, try to infer from context
  if (maxScore === 0) {
    if (lowerIdea.includes('app') || lowerIdea.includes('mobile') || lowerIdea.includes('web')) {
      primaryCategory = 'SaaS';
    } else if (lowerIdea.includes('service') || lowerIdea.includes('help')) {
      primaryCategory = 'Service';
    } else if (lowerIdea.includes('market') || lowerIdea.includes('demand')) {
      primaryCategory = 'Market Research';
    } else {
      primaryCategory = 'Tech Startup'; // Better default than "Other"
    }
  }

  // Detect business model with weighted scoring
  let businessModel = 'B2C';
  maxScore = 0;

  for (const [model, keywords] of Object.entries(businessModelPatterns)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerIdea.includes(keyword)) {
        score += keyword.length > 5 ? 2 : 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      businessModel = model;
    }
  }

  // Detect target market with weighted scoring
  let targetMarket = 'Consumer';
  maxScore = 0;

  for (const [market, keywords] of Object.entries(targetMarketPatterns)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerIdea.includes(keyword)) {
        score += keyword.length > 5 ? 2 : 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      targetMarket = market;
    }
  }

  const complexity = lowerIdea.includes('ai') || lowerIdea.includes('blockchain') || lowerIdea.includes('hardware') ? 'High' : 'Medium';

  return {
    primaryCategory,
    businessModel,
    targetMarket,
    complexity,
    industryContext: primaryCategory,
    keyTerms: idea.split(' ').filter(word => word.length > 3).slice(0, 5)
  };
};

// Enhanced Analysis Functions
const identifyWeakAreas = (basicResult: any): string[] => {
  const weakAreas = [];

  if (basicResult.dimensionScores?.marketOpportunity?.score < 70) {
    weakAreas.push('market-opportunity');
  }
  if (basicResult.dimensionScores?.executionFeasibility?.score < 70) {
    weakAreas.push('execution-feasibility');
  }
  if (basicResult.dimensionScores?.businessModelViability?.score < 70) {
    weakAreas.push('business-model');
  }
  if (basicResult.dimensionScores?.goToMarketStrategy?.score < 70) {
    weakAreas.push('go-to-market');
  }

  return weakAreas;
};

const performDeepDiveAnalysis = async (
  idea: string,
  classification: IdeaClassification,
  basicResult: any,
  weakAreas: string[],
  gemini: any
): Promise<any> => {
  if (weakAreas.length === 0) {
    return { message: "No weak areas identified - strong overall analysis" };
  }

  const deepDivePrompt = `You are a Senior ${classification.primaryCategory} Consultant conducting a DEEP DIVE analysis.

ORIGINAL IDEA: "${idea}"
CLASSIFICATION: ${classification.primaryCategory} | ${classification.businessModel} | ${classification.targetMarket}

BASIC ANALYSIS RESULTS:
- Overall Score: ${basicResult.demandScore}/100
- Market Score: ${basicResult.dimensionScores?.marketOpportunity?.score || 'N/A'}
- Execution Score: ${basicResult.dimensionScores?.executionFeasibility?.score || 'N/A'}
- Business Model Score: ${basicResult.dimensionScores?.businessModelViability?.score || 'N/A'}
- GTM Score: ${basicResult.dimensionScores?.goToMarketStrategy?.score || 'N/A'}

WEAK AREAS IDENTIFIED: ${weakAreas.join(', ')}

DEEP DIVE TASK: Provide detailed analysis and improvement strategies for the weak areas.

RETURN JSON:
{
  "deepDiveInsights": {
    ${weakAreas.map(area => `"${area}": {
      "improvedScore": 0-100,
      "keyImprovements": ["improvement1", "improvement2", "improvement3"],
      "actionableSteps": ["step1", "step2", "step3"],
      "successMetrics": ["metric1", "metric2"],
      "timeframe": "estimated timeline",
      "resourcesNeeded": ["resource1", "resource2"]
    }`).join(',\n    ')}
  },
  "overallImprovementPotential": {
    "scoreIncrease": "potential score increase",
    "confidenceBoost": 0-100,
    "keyLeverages": ["leverage1", "leverage2", "leverage3"]
  },
  "premiumRecommendations": {
    "priorityActions": ["action1", "action2", "action3"],
    "quickWins": ["win1", "win2"],
    "longTermStrategy": ["strategy1", "strategy2"]
  }
}`;

  try {
    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: deepDivePrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    });

    return JSON.parse(result.text || '{}');
  } catch (error) {
    console.log('Deep dive analysis failed:', error);
    return { error: 'Deep dive analysis failed' };
  }
};

const performCompetitorAnalysis = async (
  idea: string,
  classification: IdeaClassification,
  gemini: any
): Promise<any> => {
  const competitorPrompt = `You are a Competitive Intelligence Expert specializing in ${classification.primaryCategory} market research.

STARTUP IDEA: "${idea}"
CATEGORY: ${classification.primaryCategory}
BUSINESS MODEL: ${classification.businessModel}
TARGET MARKET: ${classification.targetMarket}

COMPETITIVE ANALYSIS TASK: Conduct comprehensive competitor research and provide strategic insights.

RETURN JSON:
{
  "competitorAnalysis": {
    "directCompetitors": [
      {
        "name": "competitor name",
        "description": "what they do",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "marketShare": "estimated %",
        "fundingLevel": "funding stage/amount"
      }
    ],
    "indirectCompetitors": [
      {
        "name": "competitor name", 
        "approach": "their solution approach",
        "threatLevel": "Low/Medium/High"
      }
    ],
    "marketGaps": [
      {
        "gap": "market gap description",
        "opportunity": "opportunity description",
        "difficulty": "Low/Medium/High"
      }
    ]
  },
  "competitiveStrategy": {
    "differentiationStrategy": "recommended differentiation approach",
    "competitiveAdvantages": ["advantage1", "advantage2", "advantage3"],
    "marketPositioning": "recommended positioning",
    "entryStrategy": "market entry approach",
    "defensiveStrategies": ["defense1", "defense2"]
  },
  "competitiveScore": 0-100,
  "competitiveRisks": ["risk1", "risk2", "risk3"],
  "competitiveOpportunities": ["opportunity1", "opportunity2", "opportunity3"]
}`;

  try {
    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: competitorPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    });

    return JSON.parse(result.text || '{}');
  } catch (error) {
    console.log('Competitor analysis failed:', error);
    return { error: 'Competitor analysis failed' };
  }
};

const performMarketTimingAnalysis = async (
  idea: string,
  classification: IdeaClassification,
  gemini: any
): Promise<any> => {
  const timingPrompt = `You are a Market Timing Expert and Trend Analyst specializing in ${classification.primaryCategory} industry.

STARTUP IDEA: "${idea}"
INDUSTRY: ${classification.primaryCategory}
TARGET MARKET: ${classification.targetMarket}

MARKET TIMING ANALYSIS: Analyze the optimal timing for launching this startup idea.

RETURN JSON:
{
  "marketTiming": {
    "overallTimingScore": 0-100,
    "timingAssessment": "Perfect/Good/Fair/Poor",
    "industryLifecycleStage": "Early/Growth/Mature/Declining",
    "marketReadinessFactors": [
      {
        "factor": "factor name",
        "status": "Supporting/Neutral/Hindering",
        "impact": "High/Medium/Low"
      }
    ]
  },
  "timingRecommendations": {
    "launchTiming": "Immediate/3-6 months/6-12 months/Wait",
    "reasoningForTiming": "detailed explanation",
    "preparationSteps": ["step1", "step2", "step3"],
    "marketEntryStrategy": "timing-optimized strategy"
  },
  "trendAnalysis": {
    "supportingTrends": ["trend1", "trend2", "trend3"],
    "challengingTrends": ["challenge1", "challenge2"],
    "emergingOpportunities": ["opportunity1", "opportunity2"],
    "timingRisks": ["risk1", "risk2"]
  },
  "seasonalConsiderations": {
    "bestLaunchMonths": ["month1", "month2"],
    "seasonalFactors": "seasonal considerations",
    "cyclicalPatterns": "industry cycles to consider"
  }
}`;

  try {
    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: timingPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    });

    return JSON.parse(result.text || '{}');
  } catch (error) {
    console.log('Market timing analysis failed:', error);
    return { error: 'Market timing analysis failed' };
  }
};

const performEnhancedAnalysis = async (
  idea: string,
  classification: IdeaClassification,
  basicResult: any,
  userTier: 'pro' | 'business' | 'enterprise',
  gemini: any
): Promise<any> => {
  console.log('🚀 Starting enhanced analysis for', userTier, 'user');

  const weakAreas = identifyWeakAreas(basicResult);
  console.log('📊 Weak areas identified:', weakAreas);

  const enhancedResult: any = {
    basicAnalysis: basicResult,
    overallEnhancement: {
      confidenceBoost: 0,
      additionalInsights: [],
      premiumValue: []
    }
  };

  // Step 1: Deep dive analysis (all tiers)
  if (weakAreas.length > 0) {
    console.log('🔍 Performing deep dive analysis...');
    enhancedResult.deepDiveAnalysis = await performDeepDiveAnalysis(
      idea, classification, basicResult, weakAreas, gemini
    );
    enhancedResult.overallEnhancement.confidenceBoost += 20;
    enhancedResult.overallEnhancement.premiumValue.push('Deep dive analysis on weak areas');
  }

  // Step 2: Competitor analysis (business+ tiers)
  if (userTier === 'business' || userTier === 'enterprise') {
    console.log('🕵️ Performing competitor analysis...');
    enhancedResult.competitorAnalysis = await performCompetitorAnalysis(
      idea, classification, gemini
    );
    enhancedResult.overallEnhancement.confidenceBoost += 25;
    enhancedResult.overallEnhancement.premiumValue.push('Comprehensive competitor intelligence');
  }

  // Step 3: Market timing analysis (enterprise tier)
  if (userTier === 'enterprise') {
    console.log('⏰ Performing market timing analysis...');
    enhancedResult.marketTimingAnalysis = await performMarketTimingAnalysis(
      idea, classification, gemini
    );
    enhancedResult.overallEnhancement.confidenceBoost += 15;
    enhancedResult.overallEnhancement.premiumValue.push('Market timing optimization');
  }

  // Calculate additional insights
  enhancedResult.overallEnhancement.additionalInsights = [
    `Enhanced analysis completed with ${enhancedResult.overallEnhancement.confidenceBoost}% confidence boost`,
    `Identified ${weakAreas.length} areas for improvement with specific action plans`,
    ...(enhancedResult.competitorAnalysis ? ['Competitive landscape mapped with strategic recommendations'] : []),
    ...(enhancedResult.marketTimingAnalysis ? ['Market timing optimized for maximum success probability'] : [])
  ];

  console.log('✅ Enhanced analysis completed');
  return enhancedResult;
};

// Enhanced prompt generator
// Detect language of the input idea
const detectLanguage = (text: string): string => {
  // Simple language detection based on common words
  const turkishWords = ['ve', 'bir', 'bu', 'için', 'ile', 'olan', 'var', 'yok', 'gibi', 'kadar', 'çok', 'daha', 'en', 'de', 'da', 'ama', 'fakat', 'veya', 'ya', 'ki', 'şu', 'o', 'ben', 'sen', 'biz', 'siz', 'onlar'];
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among'];
  
  const words = text.toLowerCase().split(/\s+/);
  let turkishCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (turkishWords.includes(word)) turkishCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  // Also check for Turkish characters
  const hasTurkishChars = /[çğıöşüÇĞIİÖŞÜ]/.test(text);
  
  if (hasTurkishChars || turkishCount > englishCount) {
    return 'Turkish';
  }
  return 'English';
};

const generateEnhancedPrompt = (idea: string, classification: IdeaClassification, fast: boolean = false): string => {
  const language = detectLanguage(idea);
  
  const industryContexts = {
    'SaaS': {
      regulations: ['GDPR', 'SOC2', 'Data Privacy'],
      keyMetrics: ['MRR', 'Churn Rate', 'CAC', 'LTV'],
      competitors: ['Salesforce', 'HubSpot', 'Slack'],
      trends: ['AI Integration', 'No-Code', 'API-First']
    },
    'FinTech': {
      regulations: ['PCI DSS', 'KYC', 'AML'],
      keyMetrics: ['Transaction Volume', 'AUM', 'Fraud Rate'],
      competitors: ['Stripe', 'Square', 'PayPal'],
      trends: ['Open Banking', 'DeFi', 'BNPL']
    },
    'E-commerce': {
      regulations: ['Consumer Protection', 'Tax Compliance'],
      keyMetrics: ['GMV', 'AOV', 'Conversion Rate'],
      competitors: ['Amazon', 'Shopify', 'WooCommerce'],
      trends: ['Social Commerce', 'D2C', 'Sustainability']
    }
  };

  const context = industryContexts[classification.primaryCategory as keyof typeof industryContexts] || {
    regulations: ['General Business Law'],
    keyMetrics: ['Revenue', 'Growth Rate'],
    competitors: ['Market Leaders'],
    trends: ['Digital Transformation']
  };

  if (fast) {
    return `You are a Senior ${classification.primaryCategory} Industry Expert. Analyze: "${idea}" and provide a JSON response with demand score (0-100) and brief insights.`;
  }

  return `You are a Senior Startup Validation Expert with deep expertise in ${classification.primaryCategory} industry.

STARTUP IDEA: "${idea}"

CLASSIFICATION:
- Industry: ${classification.primaryCategory}
- Business Model: ${classification.businessModel}
- Target Market: ${classification.targetMarket}

INDUSTRY CONTEXT:
- Key Regulations: ${context.regulations.join(', ')}
- Success Metrics: ${context.keyMetrics.join(', ')}
- Major Competitors: ${context.competitors.join(', ')}
- Current Trends: ${context.trends.join(', ')}

Provide comprehensive validation analysis with actionable insights. Return detailed JSON response with overall demand score (0-100) and dimension-specific analysis.`;
};

// Trends integration
async function getGoogleTrendsData(keyword: string): Promise<any> {
  try {
    // Skip trends API call in production for now to avoid connection errors
    if (process.env.NODE_ENV === 'production') {
      return null;
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/google-trends?keyword=${encodeURIComponent(keyword)}`, {
      // timeout: 5000 // 5 second timeout - not supported in fetch
    });

    if (!response.ok) return null;
    const data = await response.json();
    return (data as any).data;
  } catch (error) {
    console.error('Trends fetch error:', error);
    return null;
  }
}

// YouTube data integration
async function getYouTubeData(keyword: string): Promise<any> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.log('⚠️ YouTube API key not available');
      return null;
    }

    console.log('📺 Fetching YouTube data for:', keyword, 'with API key:', apiKey.substring(0, 10) + '...');
    const youtubeService = new YouTubeService(apiKey);

    // Get both search results and trend analysis
    const [searchResults, trendAnalysis] = await Promise.all([
      youtubeService.searchVideos(keyword, 20),
      youtubeService.analyzeTrends(keyword)
    ]);

    return {
      searchResults,
      trendAnalysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('YouTube fetch error:', error);
    return null;
  }
}

// Multi-platform data integration
async function getMultiPlatformData(keyword: string): Promise<any> {
  try {
    console.log('🌐 Fetching multi-platform data for:', keyword);
    
    // Fetch Hacker News data directly using our new API
    const hnResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/hackernews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: keyword,
        analysisType: 'comprehensive'
      })
    });

    let hnData = null;
    if (hnResponse.ok) {
      hnData = await hnResponse.json();
      console.log('✅ Hacker News data fetched:', {
        totalResults: hnData.totalResults,
        itemsCount: hnData.items?.length || 0
      });
    } else {
      console.log('⚠️ Hacker News API failed, using fallback');
    }

    // Fetch Product Hunt data directly using our new API
    const phResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/producthunt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: keyword,
        analysisType: 'comprehensive'
      })
    });

    let phData = null;
    if (phResponse.ok) {
      phData = await phResponse.json();
      console.log('✅ Product Hunt data fetched:', {
        totalResults: phData.totalResults,
        itemsCount: phData.items?.length || 0
      });
    } else {
      console.log('⚠️ Product Hunt API failed, using fallback');
    }

    // Fetch GitHub data directly using our new API
    const ghResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: keyword,
        analysisType: 'comprehensive'
      })
    });

    let ghData = null;
    if (ghResponse.ok) {
      ghData = await ghResponse.json();
      console.log('✅ GitHub data fetched:', {
        totalResults: ghData.totalResults,
        itemsCount: ghData.items?.length || 0
      });
    } else {
      console.log('⚠️ GitHub API failed, using fallback');
    }

    // Use existing MultiPlatformService for other platforms
    const multiPlatformService = new MultiPlatformService();
    const analysis = await multiPlatformService.analyzeIdea(keyword, 10);

    // Integrate Hacker News data if available
    if (hnData && hnData.items && hnData.items.length > 0) {
      // Find and update Hacker News platform data
      const hnPlatformIndex = analysis.platforms.findIndex(p => p.platform === 'hackernews');
      if (hnPlatformIndex !== -1) {
        analysis.platforms[hnPlatformIndex] = {
          platform: 'hackernews',
          items: hnData.items.map((item: any) => ({
            id: item.objectID,
            title: item.title,
            url: item.url,
            author: item.author,
            score: item.points,
            comments: item.num_comments,
            created_at: item.created_at,
            platform: 'hackernews',
            source_url: `https://news.ycombinator.com/item?id=${item.objectID}`,
            // Add analysis data
            analysis: {
              points: item.points,
              comments: item.num_comments,
              engagement: item.points + item.num_comments
            }
          })),
          totalResults: hnData.totalResults,
          metadata: {
            analysis: hnData.analysis,
            averagePoints: hnData.analysis.averagePoints,
            averageComments: hnData.analysis.averageComments,
            sentiment: hnData.analysis.sentiment,
            engagementScore: hnData.analysis.engagementScore
          }
        };
      }

      // Update summary
      analysis.summary.hackernews = hnData.totalResults;
    }

    // Integrate Product Hunt data if available
    if (phData && phData.items && phData.items.length > 0) {
      // Find and update Product Hunt platform data
      const phPlatformIndex = analysis.platforms.findIndex(p => p.platform === 'producthunt');
      if (phPlatformIndex !== -1) {
        analysis.platforms[phPlatformIndex] = {
          platform: 'producthunt',
          items: phData.items.map((item: any) => ({
            id: item.id,
            title: item.name,
            description: item.tagline,
            score: item.votesCount,
            comments: item.commentsCount,
            created_at: item.createdAt,
            platform: 'producthunt',
            source_url: `https://www.producthunt.com/posts/${item.id}`,
            // Add analysis data
            analysis: {
              votes: item.votesCount,
              comments: item.commentsCount,
              engagement: item.votesCount + item.commentsCount,
              topics: item.topics.map((t: any) => t.name)
            }
          })),
          totalResults: phData.totalResults,
          metadata: {
            analysis: phData.analysis,
            averageVotes: phData.analysis.averageVotes,
            averageComments: phData.analysis.averageComments,
            sentiment: phData.analysis.sentiment,
            engagementScore: phData.analysis.engagementScore,
            marketValidation: phData.analysis.marketValidation
          }
        };
      }

      // Update summary
      analysis.summary.producthunt = phData.totalResults;
    }

    // Integrate GitHub data if available
    if (ghData && ghData.items && ghData.items.length > 0) {
      // Find and update GitHub platform data
      const ghPlatformIndex = analysis.platforms.findIndex(p => p.platform === 'github');
      if (ghPlatformIndex !== -1) {
        analysis.platforms[ghPlatformIndex] = {
          platform: 'github',
          items: ghData.items.map((item: any) => ({
            id: item.id,
            title: item.name,
            description: item.description,
            score: item.stargazers_count,
            forks: item.forks_count,
            issues: item.open_issues_count,
            language: item.language,
            created_at: item.created_at,
            updated_at: item.updated_at,
            platform: 'github',
            source_url: item.html_url,
            // Add analysis data
            analysis: {
              stars: item.stargazers_count,
              forks: item.forks_count,
              issues: item.open_issues_count,
              language: item.language,
              engagement: item.stargazers_count + item.forks_count
            }
          })),
          totalResults: ghData.totalResults,
          metadata: {
            analysis: ghData.analysis,
            averageStars: ghData.analysis.averageStars,
            averageForks: ghData.analysis.averageForks,
            averageIssues: ghData.analysis.averageIssues,
            topLanguages: ghData.analysis.topLanguages,
            sentiment: ghData.analysis.sentiment,
            engagementScore: ghData.analysis.engagementScore,
            marketValidation: ghData.analysis.marketValidation
          }
        };
      }

      // Update summary
      analysis.summary.github = ghData.totalResults;
    }

    // Integrate Google News data if available
    if (gnData && gnData.items && gnData.items.length > 0) {
      // Find and update Google News platform data
      const gnPlatformIndex = analysis.platforms.findIndex(p => p.platform === 'googlenews');
      if (gnPlatformIndex !== -1) {
        analysis.platforms[gnPlatformIndex] = {
          platform: 'googlenews',
          items: gnData.items.map((item: any) => ({
            id: `gn_${item.link}`,
            title: item.title,
            description: item.description || '',
            score: 0, // News articles don't have scores
            comments: 0, // News articles don't have comments
            created_at: item.pubDate,
            platform: 'googlenews',
            source_url: item.link,
            source: item.source,
            // Add analysis data
            analysis: {
              source: item.source,
              pubDate: item.pubDate,
              type: 'news_article'
            }
          })),
          totalResults: gnData.totalResults,
          metadata: {
            analysis: gnData.analysis,
            totalArticles: gnData.analysis.totalArticles,
            recentArticles: gnData.analysis.recentArticles,
            topSources: gnData.analysis.topSources,
            sentiment: gnData.analysis.sentiment,
            mediaCoverage: gnData.analysis.mediaCoverage,
            marketValidation: gnData.analysis.marketValidation
          }
        };
      }

      // Update summary
      analysis.summary.googlenews = gnData.totalResults;
    }

    // Recalculate total items
    analysis.totalItems = analysis.platforms.reduce((sum, p) => sum + p.items.length, 0);

    return {
      ...analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Multi-platform fetch error:', error);
    return null;
  }
}

// Generate AI Insights from platform data
async function generateInsights(idea: string, platformData: any, gemini: any): Promise<any> {
  try {
    console.log('🧠 Generating AI insights for idea:', idea);

    const prompt = `You are an expert startup analyst and market researcher.

ANALYZE THIS STARTUP IDEA: "${idea}"

PLATFORM DATA SUMMARY:
${JSON.stringify(platformData, null, 2)}

Based on the platform data analysis, provide comprehensive insights in JSON format:

{
  "validationScore": 0-100,
  "sentiment": "positive|negative|neutral",
  "keyInsights": [
    "Key insight 1 based on platform data",
    "Key insight 2 about market potential",
    "Key insight 3 about execution challenges"
  ],
  "opportunities": [
    "Opportunity 1 identified from data",
    "Opportunity 2 for market entry",
    "Opportunity 3 for differentiation"
  ],
  "painPoints": [
    "Challenge 1 from market analysis",
    "Challenge 2 from competitive landscape",
    "Challenge 3 from execution perspective"
  ],
  "trendingTopics": [
    "Relevant trend 1",
    "Relevant trend 2",
    "Relevant trend 3"
  ],
  "popularSolutions": [
    "Existing solution 1",
    "Existing solution 2",
    "Existing solution 3"
  ]
}

ANALYSIS REQUIREMENTS:
- Base insights on actual platform data provided
- Be realistic and data-driven
- Identify both opportunities and challenges
- Consider market timing and competition
- Provide actionable insights`;

    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json'
      }
    });

    const aiInsights = result.text?.trim();

    if (aiInsights) {
      try {
        const parsedInsights = JSON.parse(aiInsights);
        console.log('✅ AI insights generated successfully');
        return parsedInsights;
      } catch (parseError) {
        console.log('⚠️ Failed to parse AI insights, using fallback');
        return generateFallbackInsights(idea, platformData);
      }
    }

    return generateFallbackInsights(idea, platformData);
  } catch (error) {
    console.error('❌ AI insights generation failed:', error);
    return generateFallbackInsights(idea, platformData);
  }
}

// Fallback insights when AI fails
function generateFallbackInsights(idea: string, platformData: any): any {
  const totalItems = platformData?.totalItems || 0;
  const activePlatforms = platformData?.platforms?.filter((p: any) => p.items?.length > 0).length || 0;
  
  // Calculate validation score based on data
  const baseScore = Math.min(totalItems * 2, 60); // Max 60 from items
  const platformBonus = activePlatforms * 8; // Max 56 from 7 platforms
  const validationScore = Math.min(baseScore + platformBonus, 100);

  return {
    validationScore,
    sentiment: validationScore > 70 ? 'positive' : validationScore > 40 ? 'neutral' : 'negative',
    keyInsights: [
      `${totalItems} toplam sonuç ${activePlatforms} platformda bulundu`,
      `${activePlatforms > 4 ? 'Güçlü' : activePlatforms > 2 ? 'Orta' : 'Zayıf'} platform çeşitliliği mevcut`,
      totalItems > 50 ? 'Yüksek topluluk ilgisi tespit edildi' : 'Pazar doğrulaması için daha fazla araştırma önerilir'
    ],
    opportunities: [
      activePlatforms > 3 ? 'Çoklu platform stratejisi uygulanabilir' : 'Platform çeşitliliği artırılabilir',
      totalItems > 30 ? 'Mevcut talep üzerine inşa edilebilir' : 'Niş pazar fırsatı değerlendirilebilir',
      'Topluluk geri bildiriminden yararlanılarak ürün geliştirilebilir'
    ],
    painPoints: [
      activePlatforms < 3 ? 'Sınırlı platform görünürlüğü' : 'Rekabet yoğunluğu analiz edilmeli',
      totalItems < 20 ? 'Düşük pazar ilgisi riski' : 'Müşteri kazanma stratejisi belirsiz',
      'Teknik uygulama ve kaynak gereksinimleri değerlendirilmeli'
    ],
    trendingTopics: [
      'Startup validation',
      'Market research', 
      'Product development',
      'Community feedback'
    ],
    popularSolutions: [
      'Mevcut pazar liderleri',
      'Alternatif çözümler',
      'DIY yaklaşımları'
    ]
  };
}

// Enhance YouTube data with AI analysis
async function enhanceYouTubeWithGemini(youtubeData: any, idea: string): Promise<any> {
  try {
    if (!process.env.GOOGLE_API_KEY || !youtubeData) {
      console.log('⚠️ Gemini API key not available or no YouTube data, returning raw data');
      return youtubeData;
    }

    console.log('🤖 Enhancing YouTube data with Gemini AI...');

    const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY!);

    const analysisPrompt = `You are an expert YouTube market analyst and content strategist.

ANALYZE THIS YOUTUBE DATA for the business idea: "${idea}"

YOUTUBE METRICS:
- Total Videos Found: ${youtubeData.trendAnalysis.totalVideos}
- Average Views: ${youtubeData.trendAnalysis.averageViews.toLocaleString()}
- Total Views: ${youtubeData.trendAnalysis.totalViews.toLocaleString()}
- Recent Activity: ${youtubeData.trendAnalysis.recentActivity ? 'Yes' : 'No'}
- Top Channels: ${youtubeData.trendAnalysis.topChannels.join(', ')}

TOP VIDEOS: ${youtubeData.searchResults.videos.slice(0, 5).map((v: any) =>
      `"${v.title}" by ${v.channelTitle} (${parseInt(v.viewCount).toLocaleString()} views)`
    ).join(', ')}

Provide comprehensive YouTube market analysis in JSON format:

{
  "youtubeAnalysis": {
    "marketDemand": "High/Medium/Low - based on video volume and engagement",
    "contentSaturation": "Oversaturated/Competitive/Emerging/Untapped",
    "audienceEngagement": "Analysis of view counts and channel diversity",
    "contentGaps": ["Gap 1", "Gap 2", "Gap 3"],
    "competitorChannels": ["Channel analysis based on top performers"],
    "marketOpportunity": "Detailed opportunity assessment"
  },
  "contentStrategy": {
    "recommendedApproach": "Content strategy for this market",
    "keyTopics": ["Topic 1", "Topic 2", "Topic 3"],
    "targetAudience": "Primary audience based on channel analysis",
    "contentFormats": ["Format 1", "Format 2", "Format 3"]
  },
  "validationInsights": [
    "Insight 1 about market validation from YouTube data",
    "Insight 2 about audience interest",
    "Insight 3 about competitive landscape"
  ]
}`;

    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: analysisPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json'
      }
    });

    const aiAnalysis = result.text?.trim();

    if (aiAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(aiAnalysis);
        return {
          ...youtubeData,
          aiAnalysis: parsedAnalysis,
          geminiEnhanced: true
        };
      } catch (parseError) {
        console.log('⚠️ Failed to parse YouTube Gemini response');
        return youtubeData;
      }
    }

    return youtubeData;
  } catch (error) {
    console.error('❌ YouTube Gemini enhancement failed:', error);
    return youtubeData;
  }
}

// Enhance trends data with Gemini AI analysis
async function enhanceTrendsWithGemini(trendsData: any, idea: string): Promise<any> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.log('⚠️ Gemini API key not available, returning raw trends data');
      return trendsData;
    }

    console.log('🤖 Enhancing trends data with Gemini AI...');

    const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY!);

    const analysisPrompt = `You are an expert market analyst and trend interpreter.

ANALYZE THIS TREND DATA for the business idea: "${idea}"

TREND DATA:
- Current Interest Score: ${trendsData.metrics.currentScore}/100
- Average Interest: ${trendsData.metrics.averageScore}/100
- Momentum: ${trendsData.metrics.momentum}%
- Trend Direction: ${trendsData.metrics.trendDirection}
- Volatility: ${trendsData.metrics.volatility}

RELATED TOPICS: ${trendsData.relatedTopics.map((t: any) => `${t.topic} (${t.score}/100, ${t.growth > 0 ? '+' : ''}${t.growth}%)`).join(', ')}

GEOGRAPHIC INTEREST: ${trendsData.geographicInterest.map((c: any) => `${c.country} (${c.score}/100, ${c.trend})`).join(', ')}

Provide a comprehensive analysis in the following JSON format (NO markdown, ONLY valid JSON):

{
  "aiAnalysis": {
    "trendInterpretation": "Detailed interpretation of what this trend data means for the business idea",
    "marketTiming": "Assessment of whether this is good timing to enter the market",
    "competitiveLandscape": "Analysis of competitive environment based on trend patterns",
    "growthPotential": "Evaluation of growth potential and scalability",
    "riskFactors": ["Risk factor 1", "Risk factor 2", "Risk factor 3"],
    "strategicRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
  },
  "enhancedInsights": [
    "Enhanced insight 1 based on AI analysis",
    "Enhanced insight 2 based on AI analysis",
    "Enhanced insight 3 based on AI analysis"
  ]
}

Keep the original trends data intact and add these AI-enhanced fields.`;

    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: analysisPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    });

    const aiAnalysis = result.text?.trim();

    if (aiAnalysis) {
      try {
        // Try to parse the AI response
        const parsedAnalysis = JSON.parse(aiAnalysis);

        // Merge AI analysis with original trends data
        return {
          ...trendsData,
          aiAnalysis: parsedAnalysis.aiAnalysis,
          enhancedInsights: parsedAnalysis.enhancedInsights,
          geminiEnhanced: true
        };
      } catch (parseError) {
        console.log('⚠️ Failed to parse Gemini response, returning raw trends data');
        return trendsData;
      }
    } else {
      console.log('⚠️ Gemini response empty, returning raw trends data');
      return trendsData;
    }

  } catch (error) {
    console.error('❌ Gemini trends enhancement failed:', error);
    return trendsData; // Return original data if enhancement fails
  }
}

// Optimize prompt with parallel AI models for better analysis
async function optimizePromptWithAI(inputContent: string): Promise<string> {
  const availableModels = {
    gemini: !!process.env.GOOGLE_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  };

  console.log('🤖 AI Models available:', Object.keys(availableModels).filter(key => availableModels[key as keyof typeof availableModels]).length);

  // Try Gemini first
  if (availableModels.gemini) {
    try {
      const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY!);
      const result = await gemini.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Optimize this business idea for comprehensive market validation analysis. Transform it into a clear, specific, and actionable description that includes:

1. Clear problem statement
2. Target audience/market
3. Proposed solution approach
4. Key value proposition
5. Business model hint (if applicable)

Original idea: "${inputContent}"

Return ONLY the optimized version without explanations or formatting:`,
        config: { temperature: 0.7, maxOutputTokens: 500 }
      });

      if (result.text?.trim()) {
        console.log('✅ Gemini optimization successful');
        return result.text.trim();
      }
    } catch (error) {
      console.log('⚠️ Gemini optimization failed, trying OpenAI...');
    }
  }

  // Try OpenAI if Gemini fails
  if (availableModels.openai) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst. Enhance business idea descriptions to be more specific and analysis-friendly.'
          },
          {
            role: 'user',
            content: `Enhance this business idea description: ${inputContent}. Return only the enhanced description.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      if (completion.choices[0]?.message?.content?.trim()) {
        console.log('✅ OpenAI optimization successful');
        return completion.choices[0].message.content.trim();
      }
    } catch (error) {
      console.log('⚠️ OpenAI optimization failed, trying Groq...');
    }
  }

  // Try Groq if OpenAI fails
  if (availableModels.groq) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst. Enhance business idea descriptions to be more specific and analysis-friendly.'
          },
          {
            role: 'user',
            content: `Enhance this business idea description: ${inputContent}. Return only the enhanced description.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      if (completion.choices[0]?.message?.content?.trim()) {
        console.log('✅ Groq optimization successful');
        return completion.choices[0].message.content.trim();
      }
    } catch (error) {
      console.log('⚠️ Groq optimization failed, using manual optimization');
    }
  }

  // If all AI models fail, return optimized manual version
  return `Optimized Business Idea: ${inputContent}

Problem Statement: This solution addresses a specific market pain point that affects the target audience's daily operations and productivity.

Target Market: Small to medium businesses, entrepreneurs, and professionals in relevant industries who need efficient solutions for their operational challenges.

Solution Approach: A comprehensive platform/service that streamlines processes, reduces manual work, and provides actionable insights.

Value Proposition: Saves time, reduces costs, and improves efficiency for the target market through innovative technology and user-friendly design.

Business Model: Subscription-based service with tiered pricing to accommodate different business sizes and needs.

Key Benefits: Improved efficiency, cost reduction, market differentiation, and scalability.`;
}

// Get AI instance based on availability
function getAI() {
  const availableModels = {
    gemini: !!process.env.GOOGLE_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  };

  // Auto-select AI model with fallback
  if (availableModels.gemini) {
    return new GoogleGenAI(process.env.GOOGLE_API_KEY!);
  } else if (availableModels.openai) {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } else if (availableModels.groq) {
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
  } else {
    throw new Error('No AI models available');
  }
}

// Input validation
function validateInput(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  if (input.length < 10 || input.length > 1000) return false;

  // Block potentially dangerous content
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /vbscript:/gi,
    /data:/gi
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_WINDOW = 30;
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
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
}

async function validateHandler(req: any, res: any) {
  const startTime = Date.now();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://validationly.com');
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
    const { content, optimize, enhance, fast, model, userTier } = req.body;

    // Check if content exists
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        message: 'Content is required and must be a string.',
        error: 'Missing content'
      });
    }

    // Input validation
    if (!validateInput(content)) {
      return res.status(400).json({
        message: 'Invalid input. Content must be 10-1000 characters and contain no dangerous content.',
        error: 'Validation failed'
      });
    }

    let inputContent = content;

    // Optimize prompt if requested
    if (optimize === true || enhance === true) {
      try {
        const optimized = await optimizePromptWithAI(inputContent);
        if (optimized && optimized !== inputContent) {
          inputContent = optimized;
          console.log('✅ Prompt optimized successfully');

          // Return optimized prompt immediately if this is an optimization request
          if (optimize === true) {
            return res.status(200).json({
              optimizedPrompt: optimized,
              originalPrompt: content
            });
          }
        }
      } catch (error) {
        console.log('⚠️ Prompt optimization failed, continuing with original input');
      }
    }

    // Fast mode: Enhanced analysis with classification
    if (fast === true) {
      try {
        console.log('🚀 Starting enhanced fast analysis...');

        // Step 1: Classify the idea
        const classification = classifyIdea(inputContent);
        console.log('📊 Idea classified as:', classification);

        // Step 2: Generate enhanced prompt
        const enhancedPrompt = generateEnhancedPrompt(inputContent, classification, true);

        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
          model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
          contents: `${enhancedPrompt}

STARTUP IDEA: "${inputContent}"

CLASSIFICATION:
- Category: ${classification.primaryCategory}
- Business Model: ${classification.businessModel}  
- Target Market: ${classification.targetMarket}
- Complexity: ${classification.complexity}

REQUIRED JSON OUTPUT:
{
  "demandScore": 0-100,
  "scoreJustification": "detailed explanation with ${classification.primaryCategory}-specific insights",
  "classification": {
    "primaryCategory": "${classification.primaryCategory}",
    "businessModel": "${classification.businessModel}",
    "targetMarket": "${classification.targetMarket}",
    "complexity": "${classification.complexity}"
  },
  "dimensionScores": {
    "marketOpportunity": {"score": 0-100, "justification": "market analysis"},
    "executionFeasibility": {"score": 0-100, "justification": "execution analysis"},
    "businessModelViability": {"score": 0-100, "justification": "business model analysis"},
    "goToMarketStrategy": {"score": 0-100, "justification": "GTM analysis"}
  },
  "industryInsights": {
    "keyOpportunities": ["opportunity1", "opportunity2"],
    "majorRisks": ["risk1", "risk2"],
    "competitiveLandscape": "landscape assessment",
    "regulatoryConsiderations": ["consideration1", "consideration2"]
  },
  "platformAnalyses": [
    {"platform": "X", "signalStrength": "weak/moderate/strong", "analysis": "${classification.targetMarket}-specific X strategy", "score": 1-5},
    {"platform": "Reddit", "signalStrength": "weak/moderate/strong", "analysis": "${classification.primaryCategory} community engagement", "score": 1-5},
    {"platform": "LinkedIn", "signalStrength": "weak/moderate/strong", "analysis": "${classification.businessModel} professional networking", "score": 1-5}
  ],
  "actionableRecommendations": {
    "immediateNextSteps": ["step1", "step2", "step3"],
    "validationMethods": ["method1", "method2"],
    "keyMetricsToTrack": ["metric1", "metric2"]
  },
  "tweetSuggestion": "optimized tweet for ${classification.targetMarket}",
  "redditTitleSuggestion": "engaging title for ${classification.primaryCategory} communities",
  "redditBodySuggestion": "detailed post for validation feedback",
  "linkedinSuggestion": "professional post for ${classification.businessModel} networking",
  "realWorldData": {
    "socialMediaSignals": {
      "twitter": {"trending": false, "sentiment": "neutral/positive/negative", "volume": "low/medium/high"},
      "facebook": {"groupActivity": "low/medium/high", "engagement": "low/medium/high"},
      "tiktok": {"viralPotential": "low/medium/high", "userReaction": "neutral/positive/negative"}
    },
    "forumInsights": {
      "reddit": {"discussionVolume": "low/medium/high", "painPoints": ["pain1", "pain2"]},
      "quora": {"questionFrequency": "low/medium/high", "topics": ["topic1", "topic2"]}
    },
    "marketplaceData": {
      "amazon": {"similarProducts": 0, "avgRating": 0, "reviewCount": 0},
      "appStore": {"competitorApps": 0, "avgRating": 0, "downloads": "low/medium/high"}
    },
    "consumerSentiment": {
      "overallSentiment": "negative/neutral/positive",
      "keyComplaints": ["complaint1", "complaint2"],
      "positiveFeedback": ["feedback1", "feedback2"]
    }
  },
  "dataConfidence": "low/medium/high",
  "lastDataUpdate": "${new Date().toISOString()}"
}

Provide realistic, industry-specific analysis for ${classification.primaryCategory} targeting ${classification.targetMarket}.`,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            maxOutputTokens: 2500
          }
        });

        console.log('Raw AI response:', result.text);

        let parsed: any = null;
        try {
          const cleanedText = (result.text || '').trim();
          const jsonStart = cleanedText.indexOf('{');
          const jsonEnd = cleanedText.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            const jsonText = cleanedText.substring(jsonStart, jsonEnd);
            parsed = JSON.parse(jsonText);
          }
        } catch (e) {
          console.log('JSON parse error:', e);
        }

        if (parsed && typeof parsed === 'object') {
          console.log('✅ Enhanced analysis completed successfully');

          // Validate and ensure required fields with enhanced defaults
          if (typeof parsed.demandScore !== 'number' || parsed.demandScore < 0 || parsed.demandScore > 100) {
            parsed.demandScore = 50;
          }

          // Ensure classification exists
          if (!parsed.classification) {
            parsed.classification = classification;
          }

          // Ensure dimension scores exist
          if (!parsed.dimensionScores) {
            parsed.dimensionScores = {
              marketOpportunity: { score: 50, justification: "Market analysis completed" },
              executionFeasibility: { score: 50, justification: "Execution analysis completed" },
              businessModelViability: { score: 50, justification: "Business model analysis completed" },
              goToMarketStrategy: { score: 50, justification: "GTM analysis completed" }
            };
          }

          // Ensure industry insights exist
          if (!parsed.industryInsights && !parsed.industrySpecificInsights) {
            parsed.industrySpecificInsights = {
              regulatoryConsiderations: [`${classification.primaryCategory} compliance requirements`],
              industryTrends: [`${classification.primaryCategory} market trends`],
              competitiveLandscape: `Competitive analysis for ${classification.primaryCategory}`,
              successFactors: [`${classification.businessModel} success factors`]
            };
          }

          // Ensure actionable recommendations exist
          if (!parsed.actionableRecommendations) {
            parsed.actionableRecommendations = {
              immediateNextSteps: [
                `Validate ${classification.primaryCategory} market demand`,
                `Build MVP for ${classification.targetMarket}`,
                `Test ${classification.businessModel} model`
              ],
              validationMethods: [
                `${classification.targetMarket} interviews`,
                `${classification.primaryCategory} market research`
              ]
            };
          }

          if (!parsed.platformAnalyses) {
            parsed.platformAnalyses = [
              {
                platform: "X",
                signalStrength: "moderate",
                analysis: `${classification.targetMarket}-focused X strategy for ${classification.primaryCategory}`,
                score: 3
              },
              {
                platform: "Reddit",
                signalStrength: "moderate",
                analysis: `${classification.primaryCategory} community engagement and validation`,
                score: 3
              },
              {
                platform: "LinkedIn",
                signalStrength: "moderate",
                analysis: `${classification.businessModel} professional networking strategy`,
                score: 3
              }
            ];
          }

          // Enhanced social media suggestions
          if (!parsed.socialMediaSuggestions && !parsed.tweetSuggestion) {
            const targetAudience = classification.targetMarket.toLowerCase();
            const category = classification.primaryCategory.toLowerCase();

            parsed.tweetSuggestion = `🚀 Building something exciting in ${category}! Working on: "${inputContent.substring(0, 100)}..." What do ${targetAudience}s think? Would you use this? #${classification.primaryCategory} #Startup #Innovation`;
            parsed.redditTitleSuggestion = `[${classification.primaryCategory}] Looking for feedback on my ${category} startup idea`;
            parsed.redditBodySuggestion = `Hey r/${category}! 👋\n\nI'm working on a ${classification.primaryCategory} solution: "${inputContent}"\n\n**Target audience:** ${classification.targetMarket}\n**Business model:** ${classification.businessModel}\n\nWhat are your thoughts? Would this solve a real problem for you?\n\nAny feedback appreciated! 🙏`;
            parsed.linkedinSuggestion = `Excited to share my latest ${classification.primaryCategory} venture! 🚀\n\nI'm developing: "${inputContent}"\n\nThis addresses a key challenge in the ${classification.targetMarket} market. As someone passionate about ${category} innovation, I'd love to hear your professional insights.\n\nWhat are your thoughts on this approach? #${classification.primaryCategory} #Innovation #Startup`;
          }

          if (!parsed.realWorldData) {
            parsed.realWorldData = {
              socialMediaSignals: {
                twitter: {
                  trending: false,
                  sentiment: 'neutral',
                  volume: 'medium',
                  keyHashtags: [`#${classification.primaryCategory}`, `#${classification.businessModel}`]
                },
                facebook: {
                  groupActivity: 'medium',
                  engagement: 'medium',
                  relevantGroups: [`${classification.primaryCategory} Entrepreneurs`, `${classification.targetMarket} Network`]
                },
                tiktok: {
                  viralPotential: 'medium',
                  userReaction: 'neutral',
                  contentTypes: [`${classification.primaryCategory} tips`, 'startup journey']
                }
              },
              forumInsights: {
                reddit: {
                  discussionVolume: 'medium',
                  painPoints: [`${classification.primaryCategory} challenges`, `${classification.targetMarket} needs`],
                  relevantSubreddits: [`r/${classification.primaryCategory.toLowerCase()}`, `r/startups`]
                },
                quora: {
                  questionFrequency: 'medium',
                  topics: [`${classification.primaryCategory} solutions`, `${classification.businessModel} strategies`]
                }
              },
              marketplaceData: {
                amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0, priceRange: 'TBD' },
                appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium', categories: [classification.primaryCategory] }
              },
              consumerSentiment: {
                overallSentiment: 'neutral',
                keyComplaints: [`${classification.primaryCategory} complexity`, 'pricing concerns'],
                positiveFeedback: [`${classification.primaryCategory} innovation`, 'market need'],
                sentimentTrends: 'stable'
              }
            };
          }

          // Ensure metadata
          if (!parsed.dataConfidence) parsed.dataConfidence = 'medium';
          if (!parsed.lastDataUpdate) parsed.lastDataUpdate = new Date().toISOString();

          // Add enhanced metadata
          if (!parsed.analysisMetadata) {
            parsed.analysisMetadata = {
              analysisDate: new Date().toISOString(),
              aiModel: 'gemini-enhanced',
              industryExpertise: classification.primaryCategory,
              analysisDepth: fast ? 'fast' : 'comprehensive',
              confidence: 75
            };
          }

          // Enhanced analysis for premium users
          if (userTier && ['pro', 'business', 'enterprise'].includes(userTier) && process.env.GOOGLE_API_KEY) {
            try {
              console.log(`🚀 Performing enhanced analysis for ${userTier} user...`);
              const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY);
              const enhancedResult = await performEnhancedAnalysis(
                inputContent,
                classification,
                parsed,
                userTier as 'pro' | 'business' | 'enterprise',
                gemini
              );

              // Merge enhanced results with basic analysis
              parsed.enhancedAnalysis = enhancedResult;
              parsed.isPremiumAnalysis = true;
              parsed.premiumTier = userTier;

              console.log(`✅ Enhanced ${userTier} analysis completed with ${enhancedResult.overallEnhancement.confidenceBoost}% confidence boost`);
            } catch (enhancedError) {
              console.log('⚠️ Enhanced analysis failed, continuing with basic analysis:', enhancedError);
              // Continue with basic analysis if enhanced fails
            }
          }

          // Generate fallback insights for fast mode
          parsed.insights = generateFallbackInsights(inputContent, null);

          console.log(`✅ Enhanced ${fast ? 'fast' : 'standard'} analysis completed - Score: ${parsed.demandScore}/100, Category: ${classification.primaryCategory}`);
          
          // Save to Supabase (async, don't wait for completion)
          try {
            const userId = req.headers['x-user-id'] || 'anonymous';
            if (userId !== 'anonymous') {
              ValidationlyDB.saveValidation({
                user_id: userId,
                idea_text: inputContent,
                demand_score: parsed.demandScore,
                category: classification.primaryCategory,
                business_model: classification.businessModel,
                target_market: classification.targetMarket,
                analysis_result: parsed,
                validation_type: fast ? 'fast' : 'standard',
                processing_time: Date.now() - startTime,
                is_favorite: false,
                is_public: false
              }).catch((err: any) => console.log('Supabase save error:', err));
              
              // Update user credits
              ValidationlyDB.updateUserCredits(userId, 1).catch((err: any) => console.log('Credits update error:', err));
            }
          } catch (error) {
            console.log('Supabase integration error:', error);
          }
          
          return res.status(200).json(parsed);
        } else {
          console.log('Failed to parse AI response, using fallback data');
          // Return fallback data if parsing fails
          const fallbackData = {
            idea: inputContent,
            demandScore: 50,
            scoreJustification: "Analysis completed with fallback data due to parsing issues.",
            platformAnalyses: [
              {
                platform: "X",
                signalStrength: "moderate",
                analysis: "Analysis completed with AI insights",
                score: 3
              },
              {
                platform: "Reddit",
                signalStrength: "moderate",
                analysis: "Community validation potential exists",
                score: 3
              },
              {
                platform: "LinkedIn",
                signalStrength: "moderate",
                analysis: "Professional network opportunity",
                score: 3
              }
            ],
            realWorldData: {
              socialMediaSignals: {
                twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
                facebook: { groupActivity: 'medium', engagement: 'medium' },
                tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
              },
              forumInsights: {
                reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
                quora: { questionFrequency: 'medium', topics: ['General discussion'] }
              },
              marketplaceData: {
                amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
                appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
              },
              consumerSentiment: {
                overallSentiment: 'neutral',
                keyComplaints: ['Data unavailable'],
                positiveFeedback: ['Analysis pending']
              }
            },
            tweetSuggestion: "Share your idea on X to get feedback!",
            redditTitleSuggestion: "Looking for feedback on my startup idea",
            redditBodySuggestion: "I'm working on a new startup idea and would love your thoughts.",
            linkedinSuggestion: "Excited to share my latest startup idea and looking for feedback.",
            dataConfidence: 'low',
            lastDataUpdate: new Date().toISOString(),
            insights: generateFallbackInsights(inputContent, null)
          };
          return res.status(200).json(fallbackData);
        }
      } catch (error) {
        console.log('Fast mode failed:', error);
        // Continue to normal analysis path
      }
    }

    // Normal analysis path - Enhanced with classification
    console.log('🔍 Starting enhanced standard analysis...');

    // Step 1: Classify the idea
    const classification = classifyIdea(inputContent);
    console.log('📊 Idea classified as:', classification);

    // Step 2: Generate comprehensive enhanced prompt
    const enhancedPrompt = generateEnhancedPrompt(inputContent, classification, false);

    const aiInstance = getAI();
    const result = await aiInstance.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents: `${enhancedPrompt}

STARTUP IDEA ANALYSIS REQUEST:

IDEA: "${inputContent}"

CLASSIFICATION:
- Category: ${classification.primaryCategory}
- Business Model: ${classification.businessModel}
- Target Market: ${classification.targetMarket}
- Complexity: ${classification.complexity}

COMPREHENSIVE JSON OUTPUT REQUIRED:
{
  "demandScore": 0-100,
  "scoreJustification": "comprehensive explanation with ${classification.primaryCategory}-specific insights",
  "classification": {
    "primaryCategory": "${classification.primaryCategory}",
    "businessModel": "${classification.businessModel}",
    "targetMarket": "${classification.targetMarket}",
    "complexity": "${classification.complexity}",
    "confidence": 0-100
  },
  "dimensionScores": {
    "marketOpportunity": {
      "score": 0-100,
      "justification": "detailed market analysis",
      "keyInsights": ["insight1", "insight2", "insight3"],
      "risks": ["risk1", "risk2"],
      "opportunities": ["opportunity1", "opportunity2"]
    },
    "executionFeasibility": {
      "score": 0-100,
      "justification": "detailed execution analysis",
      "technicalComplexity": "Low/Medium/High",
      "timeToMarket": "estimated months",
      "resourceRequirements": ["requirement1", "requirement2"],
      "keyRisks": ["risk1", "risk2"]
    },
    "businessModelViability": {
      "score": 0-100,
      "justification": "detailed business model analysis",
      "revenueModel": "primary revenue stream",
      "unitEconomics": "LTV/CAC assessment",
      "monetizationTimeline": "months to revenue",
      "scalabilityFactors": ["factor1", "factor2"]
    },
    "goToMarketStrategy": {
      "score": 0-100,
      "justification": "detailed GTM analysis",
      "primaryChannels": ["channel1", "channel2"],
      "customerAcquisitionStrategy": "strategy description",
      "competitiveDifferentiation": "key differentiators",
      "launchStrategy": "recommended approach"
    }
  },
  "industrySpecificInsights": {
    "regulatoryConsiderations": ["consideration1", "consideration2"],
    "industryTrends": ["trend1", "trend2"],
    "competitiveLandscape": "detailed landscape assessment",
    "successFactors": ["factor1", "factor2", "factor3"],
    "commonFailureReasons": ["reason1", "reason2"]
  },
  "actionableRecommendations": {
    "immediateNextSteps": ["step1", "step2", "step3"],
    "validationMethods": ["method1", "method2", "method3"],
    "pivotOpportunities": ["pivot1", "pivot2"],
    "riskMitigation": ["mitigation1", "mitigation2"],
    "keyMetricsToTrack": ["metric1", "metric2", "metric3"]
  },
  "platformAnalyses": [
    {"platform": "X", "signalStrength": "weak/moderate/strong", "analysis": "detailed ${classification.targetMarket}-specific X strategy", "score": 1-5},
    {"platform": "Reddit", "signalStrength": "weak/moderate/strong", "analysis": "detailed ${classification.primaryCategory} community engagement strategy", "score": 1-5},
    {"platform": "LinkedIn", "signalStrength": "weak/moderate/strong", "analysis": "detailed ${classification.businessModel} professional networking strategy", "score": 1-5}
  ],
  "socialMediaSuggestions": {
    "tweetSuggestion": "optimized tweet for ${classification.targetMarket} with relevant hashtags",
    "linkedinSuggestion": "professional LinkedIn post for ${classification.businessModel} networking",
    "redditTitleSuggestion": "engaging title for ${classification.primaryCategory} communities",
    "redditBodySuggestion": "detailed Reddit post for comprehensive validation feedback"
  },
  "marketData": {
    "estimatedMarketSize": "TAM estimation for ${classification.primaryCategory}",
    "growthRate": "annual growth percentage",
    "competitorCount": "number of direct competitors",
    "marketMaturity": "Early/Growth/Mature/Declining",
    "keyTrends": ["trend1", "trend2", "trend3"]
  },
  "realWorldData": {
    "socialMediaSignals": {
      "twitter": {"trending": false, "sentiment": "neutral/positive/negative", "volume": "low/medium/high", "keyHashtags": ["hashtag1", "hashtag2"]},
      "facebook": {"groupActivity": "low/medium/high", "engagement": "low/medium/high", "relevantGroups": ["group1", "group2"]},
      "tiktok": {"viralPotential": "low/medium/high", "userReaction": "neutral/positive/negative", "contentTypes": ["type1", "type2"]}
    },
    "forumInsights": {
      "reddit": {"discussionVolume": "low/medium/high", "painPoints": ["pain1", "pain2", "pain3"], "relevantSubreddits": ["sub1", "sub2"]},
      "quora": {"questionFrequency": "low/medium/high", "topics": ["topic1", "topic2", "topic3"], "expertAnswers": "summary"}
    },
    "marketplaceData": {
      "amazon": {"similarProducts": 0, "avgRating": 0, "reviewCount": 0, "priceRange": "range"},
      "appStore": {"competitorApps": 0, "avgRating": 0, "downloads": "low/medium/high", "categories": ["cat1", "cat2"]}
    },
    "consumerSentiment": {
      "overallSentiment": "negative/neutral/positive",
      "keyComplaints": ["complaint1", "complaint2", "complaint3"],
      "positiveFeedback": ["feedback1", "feedback2", "feedback3"],
      "sentimentTrends": "improving/stable/declining"
    }
  },
  "dataConfidence": "low/medium/high",
  "lastDataUpdate": "${new Date().toISOString()}",
  "analysisMetadata": {
    "analysisDate": "${new Date().toISOString()}",
    "aiModel": "gemini-enhanced",
    "industryExpertise": "${classification.primaryCategory}",
    "analysisDepth": "comprehensive"
  }
}

Provide realistic, comprehensive, industry-specific analysis for ${classification.primaryCategory} startup targeting ${classification.targetMarket} market using ${classification.businessModel} business model.`,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 4000
      }
    });

    console.log('Raw AI response:', result.text);

    let parsed: any = null;
    try {
      const cleanedText = (result.text || '').trim();
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonText = cleanedText.substring(jsonStart, jsonEnd);
        parsed = JSON.parse(jsonText);
      }
    } catch (e) {
      console.log('JSON parse error:', e);
    }

    if (parsed && typeof parsed === 'object') {
      // Get trends, YouTube, and multi-platform data if available
      let trendsData = null;
      let youtubeData = null;
      let multiPlatformData = null;

      try {
        // Fetch all external data in parallel
        const [trends, youtube, multiPlatform] = await Promise.all([
          getGoogleTrendsData(inputContent),
          getYouTubeData(inputContent),
          getMultiPlatformData(inputContent)
        ]);

        if (trends) {
          trendsData = await enhanceTrendsWithGemini(trends, inputContent);
        }

        if (youtube) {
          youtubeData = await enhanceYouTubeWithGemini(youtube, inputContent);
          console.log('📺 YouTube data processed:', {
            hasData: !!youtubeData,
            videosCount: youtubeData?.searchResults?.videos?.length || 0
          });
        } else {
          console.log('⚠️ No YouTube data received');
        }

        if (multiPlatform) {
          multiPlatformData = multiPlatform;
          console.log('✅ Multi-platform data collected:', {
            totalItems: multiPlatform.totalItems,
            platforms: Object.keys(multiPlatform.summary).filter(k => multiPlatform.summary[k] > 0)
          });
        }
      } catch (error) {
        console.log('External data fetch failed:', error);
      }

      // Ensure required fields exist
      if (typeof parsed.demandScore !== 'number' || parsed.demandScore < 0 || parsed.demandScore > 100) {
        parsed.demandScore = 50;
      }

      if (!parsed.platformAnalyses) {
        parsed.platformAnalyses = [
          {
            platform: "X",
            signalStrength: "moderate",
            analysis: "Analysis completed with AI insights",
            score: 3
          },
          {
            platform: "Reddit",
            signalStrength: "moderate",
            analysis: "Community validation potential exists",
            score: 3
          },
          {
            platform: "LinkedIn",
            signalStrength: "moderate",
            analysis: "Professional network opportunity",
            score: 3
          }
        ];
      }

      if (!parsed.realWorldData) {
        parsed.realWorldData = {
          socialMediaSignals: {
            twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
            facebook: { groupActivity: 'medium', engagement: 'medium' },
            tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
          },
          forumInsights: {
            reddit: { discussionVolume: 'medium', painPoints: ['Analysis pending'] },
            quora: { questionFrequency: 'medium', topics: ['General discussion'] }
          },
          marketplaceData: {
            amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
            appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
          },
          consumerSentiment: {
            overallSentiment: 'neutral',
            keyComplaints: ['Data unavailable'],
            positiveFeedback: ['Analysis pending']
          }
        };
      }

      // Add trends data if available
      if (trendsData) {
        parsed.googleTrends = trendsData;
      }

      // Enhanced analysis for premium users (normal mode)
      if (userTier && ['pro', 'business', 'enterprise'].includes(userTier) && process.env.GOOGLE_API_KEY) {
        try {
          console.log(`🚀 Performing enhanced analysis for ${userTier} user (normal mode)...`);
          const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY);
          const enhancedResult = await performEnhancedAnalysis(
            inputContent,
            classification,
            parsed,
            userTier as 'pro' | 'business' | 'enterprise',
            gemini
          );

          // Merge enhanced results with basic analysis
          parsed.enhancedAnalysis = enhancedResult;
          parsed.isPremiumAnalysis = true;
          parsed.premiumTier = userTier;

          console.log(`✅ Enhanced ${userTier} analysis completed with ${enhancedResult.overallEnhancement.confidenceBoost}% confidence boost`);
        } catch (enhancedError) {
          console.log('⚠️ Enhanced analysis failed, continuing with basic analysis:', enhancedError);
          // Continue with basic analysis if enhanced fails
        }
      }

      // Ensure other required fields
      if (!parsed.tweetSuggestion) parsed.tweetSuggestion = "Share your idea on X to get feedback!";
      if (!parsed.redditTitleSuggestion) parsed.redditTitleSuggestion = "Looking for feedback on my startup idea";
      if (!parsed.redditBodySuggestion) parsed.redditBodySuggestion = "I'm working on a new startup idea and would love your thoughts.";
      if (!parsed.linkedinSuggestion) parsed.linkedinSuggestion = "Excited to share my latest startup idea and looking for feedback.";
      if (!parsed.dataConfidence) parsed.dataConfidence = 'medium';
      if (!parsed.lastDataUpdate) parsed.lastDataUpdate = new Date().toISOString();

      const processingTime = Date.now() - startTime;
      const enhancedResult = {
        ...parsed,
        analysisMetadata: {
          analysisDate: new Date().toISOString(),
          aiModel: 'gemini-1.5-flash',
          processingTime,
          confidence: 75,
          language: 'English'
        },
        // Add external data sources
        ...(trendsData && { trendsData }),
        ...(youtubeData && { youtubeData }),
        ...(multiPlatformData && { multiPlatformData })
      };

      console.log(`Analysis completed - Score: ${enhancedResult.demandScore}/100, Time: ${processingTime}ms`);
      
      // Save to Supabase (async, don't wait for completion)
      try {
        const userId = req.headers['x-user-id'] || 'anonymous';
        if (userId !== 'anonymous') {
          const classification = classifyIdea(inputContent);
          ValidationlyDB.saveValidation({
            user_id: userId,
            idea_text: inputContent,
            demand_score: enhancedResult.demandScore,
            category: classification.primaryCategory,
            business_model: classification.businessModel,
            target_market: classification.targetMarket,
            analysis_result: enhancedResult,
            platform_analyses: multiPlatformData,
            real_world_data: { trendsData, youtubeData },
            validation_type: 'premium',
            processing_time: processingTime,
            is_favorite: false,
            is_public: false
          }).catch((err: any) => console.log('Supabase save error:', err));
          
          // Update user credits
          ValidationlyDB.updateUserCredits(userId, 1).catch((err: any) => console.log('Credits update error:', err));
        }
      } catch (error) {
        console.log('Supabase integration error:', error);
      }
      
      return res.status(200).json(enhancedResult);
    } else {
      // Return fallback data if parsing fails
      const fallbackResult = {
        idea: inputContent,
        demandScore: 50,
        scoreJustification: "Analysis completed with fallback data due to parsing issues.",
        platformAnalyses: [
          {
            platform: "X",
            signalStrength: "moderate",
            analysis: "Analysis completed with AI insights",
            score: 3
          },
          {
            platform: "Reddit",
            signalStrength: "moderate",
            analysis: "Community validation potential exists",
            score: 3
          },
          {
            platform: "LinkedIn",
            signalStrength: "moderate",
            analysis: "Professional network opportunity",
            score: 3
          }
        ],
        realWorldData: {
          socialMediaSignals: {
            twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
            facebook: { groupActivity: 'medium', engagement: 'medium' },
            tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
          },
          forumInsights: {
            reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
            quora: { questionFrequency: 'medium', topics: ['General discussion'] }
          },
          marketplaceData: {
            amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
            appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
          },
          consumerSentiment: {
            overallSentiment: 'neutral',
            keyComplaints: ['Data unavailable'],
            positiveFeedback: ['Analysis pending']
          }
        },
        tweetSuggestion: "Share your idea on X to get feedback!",
        redditTitleSuggestion: "Looking for feedback on my startup idea",
        redditBodySuggestion: "I'm working on a new startup idea and would love your thoughts.",
        linkedinSuggestion: "Excited to share my latest startup idea and looking for feedback.",
        dataConfidence: 'low',
        lastDataUpdate: new Date().toISOString(),
        analysisMetadata: {
          analysisDate: new Date().toISOString(),
          aiModel: 'fallback',
          processingTime: Date.now() - startTime,
          confidence: 50,
          language: 'English'
        },
        insights: generateFallbackInsights(inputContent, null)
      };

      console.log('Using fallback data due to parsing failure');
      return res.status(200).json(fallbackResult);
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);

    // Return error response
    return res.status(500).json({
      message: 'Analysis system temporarily unavailable. Please try again later.',
      error: 'Internal server error'
    });
  }
}

export default validateHandler;
