import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import ResultsDashboard from '../components/ResultsDashboard';
import type { AnalysisResult } from '../types';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  classification?: {
    primaryCategory: string;
    businessModel: string;
    targetMarket: string;
    complexity: string;
  };
  socialMediaSuggestions?: {
    tweetSuggestion?: string;
    linkedinSuggestion?: string;
    redditTitleSuggestion?: string;
    redditBodySuggestion?: string;
  };
  // Platform-specific data for each of the 7 platforms
  redditData?: {
    posts: Array<{
      title: string;
      content: string;
      upvotes: number;
      comments: number;
      subreddit: string;
      postedAt: string;
      sentiment: 'positive' | 'negative' | 'neutral';
    }>;
    totalPosts: number;
    totalUpvotes: number;
    trendingSubreddits: string[];
    demandScore: number;
  };
  hackerNewsData?: {
    posts: Array<{
      title: string;
      url: string;
      points: number;
      comments: number;
      postedAt: string;
      sentiment: 'positive' | 'negative' | 'neutral';
    }>;
    totalPosts: number;
    totalPoints: number;
    demandScore: number;
  };
  productHuntData?: {
    products: Array<{
      name: string;
      description: string;
      upvotes: number;
      comments: number;
      launchedAt: string;
      category: string;
      demandScore: number;
    }>;
    totalProducts: number;
    totalUpvotes: number;
    demandScore: number;
  };
  githubData?: {
    repositories: Array<{
      name: string;
      description: string;
      stars: number;
      forks: number;
      language: string;
      lastUpdated: string;
      demandScore: number;
    }>;
    totalRepos: number;
    totalStars: number;
    topLanguages: string[];
    demandScore: number;
  };
  stackOverflowData?: {
    questions: Array<{
      title: string;
      content: string;
      votes: number;
      answers: number;
      tags: string[];
      askedAt: string;
      demandScore: number;
    }>;
    totalQuestions: number;
    totalVotes: number;
    topTags: string[];
    demandScore: number;
  };
  googleNewsData?: {
    articles: Array<{
      title: string;
      snippet: string;
      source: string;
      publishedAt: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      demandScore: number;
    }>;
    totalArticles: number;
    topSources: string[];
    demandScore: number;
  };
  youtubeData?: {
    searchResults: {
      videos: Array<{
        id: string;
        title: string;
        description: string;
        viewCount: string;
        likeCount: string;
        commentCount: string;
        publishedAt: string;
        channelTitle: string;
        demandScore: number;
      }>;
      totalResults: number;
    };
    trendAnalysis: {
      totalViews: number;
      averageViews: number;
      totalVideos: number;
      recentActivity: boolean;
      topChannels: string[];
      demandScore: number;
    };
  };
  // Overall insights
  insights?: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keyInsights: string[];
    opportunities: string[];
    painPoints: string[];
    trendingTopics: string[];
    marketGap: number;
    competitionLevel: 'low' | 'medium' | 'high';
    timeToMarket: 'immediate' | 'short-term' | 'long-term';
  };
  // Market analysis
  marketAnalysis?: {
    totalMentions: number;
    averageSentiment: number;
    growthTrend: 'rising' | 'stable' | 'declining';
    seasonalPatterns: string[];
    geographicDistribution: string[];
    targetAudience: string[];
  };
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const result: ValidationResult = location.state?.result;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">No Results Found</h1>
          <p className="text-gray-400 mb-8">Please start a new analysis from the homepage.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Preparing Your Results...</h2>
          <p className="text-gray-400">AI analysis in progress</p>
        </div>
      </div>
    );
  }

  // Convert ValidationResult to AnalysisResult format
  const convertToAnalysisResult = (): AnalysisResult => {
    // Calculate overall score from platform scores
    const platformScores = [
      result.redditData?.demandScore || 0,
      result.hackerNewsData?.demandScore || 0,
      result.productHuntData?.demandScore || 0,
      result.githubData?.demandScore || 0,
      result.stackOverflowData?.demandScore || 0,
      result.googleNewsData?.demandScore || 0,
      result.youtubeData?.trendAnalysis?.demandScore || 0
    ];
    
    const overallScore = Math.round(
      platformScores.reduce((sum, score) => sum + score, 0) / platformScores.length
    );

    // Create platform analyses with interest levels (1-10 scale)
    const platformAnalyses = [
      { platform: 'reddit', interestLevel: Math.round((result.redditData?.demandScore || 0) / 10) },
      { platform: 'hackernews', interestLevel: Math.round((result.hackerNewsData?.demandScore || 0) / 10) },
      { platform: 'producthunt', interestLevel: Math.round((result.productHuntData?.demandScore || 0) / 10) },
      { platform: 'github', interestLevel: Math.round((result.githubData?.demandScore || 0) / 10) },
      { platform: 'stackoverflow', interestLevel: Math.round((result.stackOverflowData?.demandScore || 0) / 10) },
      { platform: 'googlenews', interestLevel: Math.round((result.googleNewsData?.demandScore || 0) / 10) },
      { platform: 'youtube', interestLevel: Math.round((result.youtubeData?.trendAnalysis?.demandScore || 0) / 10) }
    ].filter(p => p.interestLevel > 0); // Only include platforms with data

    // Generate summary and insights
    const summary = result.scoreJustification || "Analysis shows mixed market signals across different platforms.";
    
    const potentialMarket = result.marketAnalysis?.targetAudience?.length > 0 
      ? `Target market includes ${result.marketAnalysis.targetAudience.join(', ')}. Market size and growth patterns indicate ${result.marketAnalysis.growthTrend} demand.`
      : "Market analysis shows potential for growth with proper positioning and execution.";
    
    const risks = result.insights?.painPoints?.length > 0
      ? `Key risks include: ${result.insights.painPoints.join(', ')}. Competition level is ${result.insights.competitionLevel} and time to market is ${result.insights.timeToMarket}.`
      : "Standard market risks apply. Consider competitive analysis and market timing for optimal launch strategy.";

    return {
      overallScore,
      summary,
      potentialMarket,
      risks,
      platformAnalyses
    };
  };

  const handleReset = () => {
    navigate('/');
  };

  return (
    <>
      <SEOHead
        title={`Validation Results | Validationly`}
        description="AI-powered startup idea validation results and action plan"
        keywords="startup validation, idea validation, market research, startup tools"
      />

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800/50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/')}
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Back to home"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Validationly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Results Dashboard */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResultsDashboard 
            result={convertToAnalysisResult()}
            idea={result.idea}
            onReset={handleReset}
          />
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
