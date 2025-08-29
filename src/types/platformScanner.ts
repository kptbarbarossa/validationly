// Platform Scanner Types and Interfaces

export interface PlatformScanResult {
  platform: string;
  success: boolean;
  error: string | null;
  data: PlatformData | null;
}

export interface PlatformData {
  totalPosts: number;
  totalEngagement: number;
  subredditAnalysis: SubredditAnalysis[];
  trendingTopics: string[];
  marketInsights: string[];
  demandScore: number;
  scanTime?: number;
  timestamp?: Date;
}

export interface SubredditAnalysis {
  subreddit: string;
  keyword: string;
  postCount: number;
  totalEngagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  topPosts: TopPost[];
}

export interface TopPost {
  title: string;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface KeywordAnalysis {
  keyword: string;
  totalMentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  trending: boolean;
  platformBreakdown: PlatformBreakdown[];
}

export interface PlatformBreakdown {
  platform: string;
  mentions: number;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface PlatformInsight {
  platform: string;
  strength: 'high' | 'medium' | 'low';
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  marketFit: number; // 0-100
}

export interface CrossPlatformAnalysis {
  overallDemand: number;
  platformStrengths: PlatformInsight[];
  marketOpportunities: string[];
  competitiveLandscape: string[];
  recommendedFocus: string[];
  riskFactors: string[];
}

export interface ScanningProgress {
  totalPlatforms: number;
  completedPlatforms: number;
  currentPlatform: string;
  estimatedTimeRemaining: number;
  status: 'scanning' | 'analyzing' | 'completed' | 'error';
}
