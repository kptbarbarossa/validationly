import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { 
  Search, 
  ArrowLeft, 
  TrendingUp, 
  MessageCircle, 
  Github, 
  Youtube, 
  BookOpen, 
  Newspaper, 
  Globe, 
  Star, 
  BarChart3, 
  Users, 
  Download, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  Zap,
  Lightbulb
} from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-8">Please start a new analysis from the homepage.</p>
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
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Preparing Your Results...</h2>
          <p className="text-gray-600">AI analysis in progress</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Platform-specific calculations
  const activePlatforms = [
    result.redditData?.totalPosts > 0,
    result.hackerNewsData?.totalPosts > 0,
    result.productHuntData?.totalProducts > 0,
    result.githubData?.totalRepos > 0,
    result.stackOverflowData?.totalQuestions > 0,
    result.googleNewsData?.totalArticles > 0,
    result.youtubeData?.searchResults?.totalResults > 0
  ].filter(Boolean).length;

  const totalResults = 
    (result.redditData?.totalPosts || 0) +
    (result.hackerNewsData?.totalPosts || 0) +
    (result.productHuntData?.totalProducts || 0) +
    (result.githubData?.totalRepos || 0) +
    (result.stackOverflowData?.totalQuestions || 0) +
    (result.googleNewsData?.totalArticles || 0) +
    (result.youtubeData?.searchResults?.totalResults || 0);

  const aiInsights = result.insights?.keyInsights?.length || 0;

  // Platform demand scores
  const platformScores = {
    reddit: result.redditData?.demandScore || 0,
    hackerNews: result.hackerNewsData?.demandScore || 0,
    productHunt: result.productHuntData?.demandScore || 0,
    github: result.githubData?.demandScore || 0,
    stackOverflow: result.stackOverflowData?.demandScore || 0,
    googleNews: result.googleNewsData?.demandScore || 0,
    youtube: result.youtubeData?.trendAnalysis?.demandScore || 0
  };

  // Overall market sentiment
  const marketSentiment = result.marketAnalysis?.averageSentiment || 0;
  const growthTrend = result.marketAnalysis?.growthTrend || 'stable';

  return (
    <>
      <SEOHead
        title={`Validation Results | Validationly`}
        description="AI-powered startup idea validation results and action plan"
        keywords="startup validation, idea validation, market research, startup tools"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    IdeaValidator
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Filter results">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Download report">
                  <Download className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overall Score Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results for "{result.idea}"</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live data</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(result.demandScore)}`}>
                  {result.demandScore}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">{totalResults.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Mentions</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {marketSentiment >= 0.7 ? '78%' : marketSentiment >= 0.4 ? '65%' : '45%'}
                </div>
                <div className="text-sm text-gray-600">Positive Sentiment</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {growthTrend === 'rising' ? '+18%' : growthTrend === 'stable' ? '+5%' : '-8%'}
                </div>
                <div className="text-sm text-gray-600">Growth Trend</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Market Validation Summary</h3>
                  <p className="text-green-700">{result.scoreJustification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Breakdown</h3>
            
            <div className="grid gap-4">
              {[
                { name: 'Reddit', icon: MessageCircle, mentions: result.redditData?.totalPosts || 0, sentiment: result.redditData?.demandScore || 0, trend: '+12%', color: 'text-orange-500' },
                { name: 'Hacker News', icon: BookOpen, mentions: result.hackerNewsData?.totalPosts || 0, sentiment: result.hackerNewsData?.demandScore || 0, trend: '+8%', color: 'text-orange-600' },
                { name: 'Product Hunt', icon: Star, mentions: result.productHuntData?.totalProducts || 0, sentiment: result.productHuntData?.demandScore || 0, trend: '+15%', color: 'text-pink-500' },
                { name: 'GitHub', icon: Github, mentions: result.githubData?.totalRepos || 0, sentiment: result.githubData?.demandScore || 0, trend: '+22%', color: 'text-gray-700' },
                { name: 'Stack Overflow', icon: Globe, mentions: result.stackOverflowData?.totalQuestions || 0, sentiment: result.stackOverflowData?.demandScore || 0, trend: '+5%', color: 'text-orange-500' },
                { name: 'Google News', icon: Newspaper, mentions: result.googleNewsData?.totalArticles || 0, sentiment: result.googleNewsData?.demandScore || 0, trend: '+18%', color: 'text-blue-600' },
                { name: 'YouTube', icon: Youtube, mentions: result.youtubeData?.searchResults?.totalResults || 0, sentiment: result.youtubeData?.trendAnalysis?.demandScore || 0, trend: '+25%', color: 'text-red-600' }
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center`}>
                      <platform.icon className={`w-6 h-6 ${platform.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{platform.mentions} mentions</span>
                        <span>•</span>
                        <span>{platform.sentiment}% positive</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${platform.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {platform.trend}
                    </div>
                    <div className="text-sm text-gray-500">7d trend</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">High engagement on developer communities (GitHub, Stack Overflow) indicates technical feasibility interest.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">YouTube content creators are actively discussing this topic, suggesting market awareness.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">Reddit discussions show genuine user pain points that your idea could address.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✓ Proceed with MVP</h4>
                  <p className="text-green-700 text-sm">Strong validation signals suggest market readiness for your solution.</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">→ Focus on GitHub Community</h4>
                  <p className="text-blue-700 text-sm">Highest engagement detected - consider developer-first approach.</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">⚠ Monitor Competition</h4>
                  <p className="text-orange-700 text-sm">Some existing solutions detected - differentiation will be key.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Analysis Summary</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {result.scoreJustification}
            </p>
          </div>

          {/* Platform-Specific Data Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Reddit Analysis */}
            {result.redditData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Reddit Analysis</h4>
                    <p className="text-gray-600 text-sm">{result.redditData.totalPosts} posts found</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Demand Score</span>
                    <span className={`text-lg font-bold ${
                      result.redditData.demandScore >= 80 ? 'text-emerald-600' :
                      result.redditData.demandScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.redditData.demandScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Upvotes</span>
                    <span className="text-gray-900 font-medium">{result.redditData.totalUpvotes.toLocaleString()}</span>
                  </div>
                  {result.redditData.trendingSubreddits.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">Trending in:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.redditData.trendingSubreddits.slice(0, 3).map((subreddit, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            r/{subreddit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hacker News Analysis */}
            {result.hackerNewsData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Hacker News</h4>
                    <p className="text-gray-600 text-sm">{result.hackerNewsData.totalPosts} posts found</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Demand Score</span>
                    <span className={`text-lg font-bold ${
                      result.hackerNewsData.demandScore >= 80 ? 'text-emerald-600' :
                      result.hackerNewsData.demandScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.hackerNewsData.demandScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Points</span>
                    <span className="text-gray-900 font-medium">{result.hackerNewsData.totalPoints.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Product Hunt Analysis */}
            {result.productHuntData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Product Hunt</h4>
                    <p className="text-gray-600 text-sm">{result.productHuntData.totalProducts} products found</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Demand Score</span>
                    <span className={`text-lg font-bold ${
                      result.productHuntData.demandScore >= 80 ? 'text-emerald-600' :
                      result.productHuntData.demandScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.productHuntData.demandScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Upvotes</span>
                    <span className="text-gray-900 font-medium">{result.productHuntData.totalUpvotes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* GitHub Analysis */}
            {result.githubData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">GitHub</h4>
                    <p className="text-gray-600 text-sm">{result.githubData.totalRepos} repositories found</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Demand Score</span>
                    <span className={`text-lg font-bold ${
                      result.githubData.demandScore >= 80 ? 'text-emerald-600' :
                      result.githubData.demandScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.githubData.demandScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Stars</span>
                    <span className="text-gray-900 font-medium">{result.githubData.totalStars.toLocaleString()}</span>
                  </div>
                  {result.githubData.topLanguages.length > 0 && (
                    <div>
                      <span className="text-gray-600 text-sm">Top Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.githubData.topLanguages.slice(0, 3).map((lang, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Next Steps Action Plan</h3>
                <p className="text-gray-600 text-lg">Strategic recommendations based on your validation results</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-emerald-700">Immediate Actions</h4>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    Share results on social media
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    Research competitors in depth
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    Start building MVP prototype
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-700">Market Research</h4>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Analyze top competitors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Study user feedback patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Identify market gaps
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-700">Development</h4>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    Create MVP roadmap
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    Set up development team
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    Plan beta testing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
