import type { VercelRequest, VercelResponse } from '@vercel/node';

interface StackOverflowQuestion {
  question_id: number;
  title: string;
  body: string;
  tags: string[];
  score: number;
  view_count: number;
  answer_count: number;
  creation_date: number;
  last_activity_date: number;
  owner: {
    user_id: number;
    display_name: string;
    reputation: number;
    user_type: string;
  };
  is_answered: boolean;
  accepted_answer_id?: number;
  link: string;
}

interface StackOverflowSearchResponse {
  items: StackOverflowQuestion[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
  total: number;
}

interface StackOverflowValidationResult {
  totalResults: number;
  items: StackOverflowQuestion[];
  analysis: {
    totalQuestions: number;
    answeredQuestions: number;
    unansweredQuestions: number;
    averageScore: number;
    averageViews: number;
    averageAnswers: number;
    topTags: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    communityEngagement: {
      high: boolean;
      level: 'high' | 'medium' | 'low';
      description: string;
    };
    marketValidation: {
      communityInterest: boolean;
      questionTrend: 'increasing' | 'stable' | 'decreasing';
      technicalDemand: string;
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

    // Search Stack Overflow using Stack Exchange API
    const stackoverflowData = await searchStackOverflow(query, analysisType);

    res.status(200).json(stackoverflowData);
  } catch (error) {
    console.error('Stack Overflow API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Stack Overflow data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function searchStackOverflow(query: string, analysisType: string): Promise<StackOverflowValidationResult> {
  try {
    // Construct Stack Exchange API URL
    const searchUrl = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=50&filter=withbody`;
    
    console.log('🔍 Searching Stack Overflow:', searchUrl);
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Stack Overflow API error: ${response.status}`);
    }

    const data: StackOverflowSearchResponse = await response.json();
    
    // Analyze the results
    const analysis = analyzeStackOverflowResults(data.items, query);
    
    return {
      totalResults: data.total,
      items: data.items.slice(0, 20), // Return top 20 results
      analysis
    };
  } catch (error) {
    console.error('Error searching Stack Overflow:', error);
    
    // Return fallback data if API fails
    return generateFallbackData();
  }
}

function analyzeStackOverflowResults(questions: StackOverflowQuestion[], query: string): StackOverflowValidationResult['analysis'] {
  if (questions.length === 0) {
    return {
      totalQuestions: 0,
      answeredQuestions: 0,
      unansweredQuestions: 0,
      averageScore: 0,
      averageViews: 0,
      averageAnswers: 0,
      topTags: [],
      sentiment: 'neutral',
      trendingTopics: [],
      communityEngagement: {
        high: false,
        level: 'low',
        description: 'No questions found for this topic'
      },
      marketValidation: {
        communityInterest: false,
        questionTrend: 'stable',
        technicalDemand: 'No technical demand detected',
        strategicInsight: 'No community questions indicate potential untapped market opportunity'
      }
    };
  }

  // Calculate metrics
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.is_answered).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  
  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
  const totalViews = questions.reduce((sum, q) => sum + q.view_count, 0);
  const totalAnswers = questions.reduce((sum, q) => sum + q.answer_count, 0);
  
  const averageScore = Math.round(totalScore / totalQuestions);
  const averageViews = Math.round(totalViews / totalQuestions);
  const averageAnswers = Math.round(totalAnswers / totalQuestions);

  // Find top tags
  const tagCounts: { [key: string]: number } = {};
  questions.forEach(question => {
    question.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([tag]) => tag);

  // Analyze sentiment based on question scores and answers
  const sentiment = analyzeQuestionSentiment(questions);

  // Extract trending topics from titles
  const trendingTopics = extractTrendingTopics(questions.map(q => q.title));

  // Analyze community engagement level
  const communityEngagement = analyzeCommunityEngagement(totalQuestions, averageViews, averageAnswers);

  // Market validation analysis
  const marketValidation = analyzeMarketValidation(questions, query);

  return {
    totalQuestions,
    answeredQuestions,
    unansweredQuestions,
    averageScore,
    averageViews,
    averageAnswers,
    topTags,
    sentiment,
    trendingTopics,
    communityEngagement,
    marketValidation
  };
}

function analyzeQuestionSentiment(questions: StackOverflowQuestion[]): 'positive' | 'negative' | 'neutral' {
  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
  const avgScore = totalScore / questions.length;
  
  if (avgScore > 5) return 'positive';
  if (avgScore < -2) return 'negative';
  return 'neutral';
}

function extractTrendingTopics(titles: string[]): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'how', 'what', 'why'
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

function analyzeCommunityEngagement(totalQuestions: number, averageViews: number, averageAnswers: number): StackOverflowValidationResult['analysis']['communityEngagement'] {
  let level: 'high' | 'medium' | 'low' = 'low';
  let description = '';
  
  if (totalQuestions > 30 && averageViews > 100 && averageAnswers > 2) {
    level = 'high';
    description = 'High community engagement with many questions, views, and answers';
  } else if (totalQuestions > 15 && averageViews > 50 && averageAnswers > 1) {
    level = 'medium';
    description = 'Moderate community engagement with steady activity';
  } else {
    level = 'low';
    description = 'Low community engagement - potential untapped market opportunity';
  }

  return {
    high: level === 'high',
    level,
    description
  };
}

function analyzeMarketValidation(questions: StackOverflowQuestion[], query: string): StackOverflowValidationResult['analysis']['marketValidation'] {
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.is_answered).length;
  const recentQuestions = questions.filter(q => {
    const questionDate = new Date(q.creation_date * 1000);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return questionDate > threeMonthsAgo;
  }).length;

  // Determine question trend
  let questionTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (recentQuestions > totalQuestions * 0.4) {
    questionTrend = 'increasing';
  } else if (recentQuestions < totalQuestions * 0.2) {
    questionTrend = 'decreasing';
  }

  // Analyze technical demand
  let technicalDemand = '';
  if (totalQuestions > 50) {
    technicalDemand = 'High technical demand - strong developer interest';
  } else if (totalQuestions > 20) {
    technicalDemand = 'Moderate technical demand - growing developer interest';
  } else {
    technicalDemand = 'Low technical demand - potential untapped developer market';
  }

  // Generate strategic insight
  let strategicInsight = '';
  if (questionTrend === 'increasing') {
    strategicInsight = 'Growing developer questions indicate rising technical demand - good timing for market entry';
  } else if (questionTrend === 'stable') {
    strategicInsight = 'Stable question volume suggests consistent technical interest - reliable market opportunity';
  } else {
    strategicInsight = 'Declining questions may indicate market saturation - focus on differentiation';
  }

  return {
    communityInterest: totalQuestions > 10,
    questionTrend,
    technicalDemand,
    strategicInsight
  };
}

function generateFallbackData(): StackOverflowValidationResult {
  return {
    totalResults: 0,
    items: [],
    analysis: {
      totalQuestions: 0,
      answeredQuestions: 0,
      unansweredQuestions: 0,
      averageScore: 0,
      averageViews: 0,
      averageAnswers: 0,
      topTags: [],
      sentiment: 'neutral',
      trendingTopics: [],
      communityEngagement: {
        high: false,
        level: 'low',
        description: 'Stack Overflow data unavailable - check API configuration'
      },
      marketValidation: {
        communityInterest: false,
        questionTrend: 'stable',
        technicalDemand: 'No technical demand data available',
        strategicInsight: 'No community data available'
      }
    }
  };
}
