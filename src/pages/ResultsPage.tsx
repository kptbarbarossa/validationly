import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const result: ValidationResult = location.state?.result;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">No Results Found</h1>
          <p className="text-slate-400 mb-8">Please start a new analysis from the homepage.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Preparing Your Results...</h2>
          <p className="text-slate-400">AI analysis in progress</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
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

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={closeSidebar}
          />
        )}

        <div className="flex">
          {/* Sidebar */}
          <div 
            className={`
              fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="lg:hidden flex justify-end mb-4">
              <button 
                onClick={closeSidebar} 
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>

            <nav className="space-y-2">
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                aria-label="Go to overview section"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Overview</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Validation Results</h1>
                  <p className="text-slate-400">AI-powered analysis of your startup idea</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300">Analysis Complete</span>
                </div>
              </div>

              {/* Idea Card */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-400">STARTUP IDEA</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">"{result.idea}"</h2>
                    {result.classification && (
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                          {result.classification.primaryCategory}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                          {result.classification.businessModel}
                        </span>
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                          {result.classification.targetMarket}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.demandScore)}`}>
                      {result.demandScore}%
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${getScoreBg(result.demandScore)} border rounded-full`}>
                      <div className={`w-2 h-2 ${getScoreColor(result.demandScore).replace('text-', 'bg-')} rounded-full`}></div>
                      <span className={`${getScoreColor(result.demandScore)} text-sm font-medium`}>
                        Validation Score
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{activePlatforms}</div>
                <p className="text-slate-400 text-sm">Active Platforms</p>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{totalResults}</div>
                <p className="text-slate-400 text-sm">Total Results</p>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{aiInsights}</div>
                <p className="text-slate-400 text-sm">AI Insights</p>
              </div>

              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{result.insights?.validationScore || result.demandScore}</div>
                <p className="text-slate-400 text-sm">Market Score</p>
              </div>
            </div>

                         {/* Platform Performance Chart */}
             <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 mb-8">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Platform Performance Analysis</h3>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Platform Demand Scores */}
                 <div>
                   <h4 className="text-lg font-semibold text-white mb-4">Demand Scores by Platform</h4>
                   <div className="space-y-4">
                     {Object.entries(platformScores).map(([platform, score]) => (
                       <div key={platform} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                             platform === 'reddit' ? 'bg-orange-600' :
                             platform === 'hackerNews' ? 'bg-orange-500' :
                             platform === 'productHunt' ? 'bg-purple-600' :
                             platform === 'github' ? 'bg-gray-800' :
                             platform === 'stackOverflow' ? 'bg-orange-500' :
                             platform === 'googleNews' ? 'bg-blue-600' :
                             'bg-red-600'
                           }`}>
                             <span className="text-white text-sm font-bold">
                               {platform === 'reddit' ? 'R' :
                                platform === 'hackerNews' ? 'H' :
                                platform === 'productHunt' ? 'P' :
                                platform === 'github' ? 'G' :
                                platform === 'stackOverflow' ? 'S' :
                                platform === 'googleNews' ? 'N' :
                                'Y'}
                             </span>
                           </div>
                           <span className="text-slate-300 capitalize">{platform.replace(/([A-Z])/g, ' $1')}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="w-24 bg-slate-700 rounded-full h-2">
                             <div 
                               className={`h-2 rounded-full transition-all duration-1000 ${
                                 score >= 80 ? 'bg-emerald-500' :
                                 score >= 60 ? 'bg-yellow-500' :
                                 score >= 40 ? 'bg-orange-500' :
                                 'bg-red-500'
                               }`}
                               style={{ width: `${score}%` }}
                             ></div>
                           </div>
                           <span className={`text-sm font-medium w-12 text-right ${
                             score >= 80 ? 'text-emerald-400' :
                             score >= 60 ? 'text-yellow-400' :
                             score >= 40 ? 'text-orange-400' :
                             'text-red-400'
                           }`}>
                             {score}%
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Market Insights */}
                 <div>
                   <h4 className="text-lg font-semibold text-white mb-4">Market Insights</h4>
                   <div className="space-y-4">
                     <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-slate-400 text-sm">Market Sentiment</span>
                         <span className={`text-sm font-medium ${
                           marketSentiment >= 0.7 ? 'text-emerald-400' :
                           marketSentiment >= 0.4 ? 'text-yellow-400' :
                           'text-red-400'
                         }`}>
                           {marketSentiment >= 0.7 ? 'Positive' :
                            marketSentiment >= 0.4 ? 'Neutral' :
                            'Negative'}
                         </span>
                       </div>
                       <div className="w-full bg-slate-700 rounded-full h-2">
                         <div 
                           className="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                           style={{ width: `${(marketSentiment + 1) * 50}%` }}
                         ></div>
                       </div>
                     </div>

                     <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-slate-400 text-sm">Growth Trend</span>
                         <span className={`text-sm font-medium ${
                           growthTrend === 'rising' ? 'text-emerald-400' :
                           growthTrend === 'stable' ? 'text-yellow-400' :
                           'text-red-400'
                         }`}>
                           {growthTrend === 'rising' ? '↗ Rising' :
                            growthTrend === 'stable' ? '→ Stable' :
                            '↘ Declining'}
                         </span>
                       </div>
                     </div>

                     <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-slate-400 text-sm">Competition Level</span>
                         <span className={`text-sm font-medium ${
                           result.insights?.competitionLevel === 'low' ? 'text-emerald-400' :
                           result.insights?.competitionLevel === 'medium' ? 'text-yellow-400' :
                           'text-red-400'
                         }`}>
                           {result.insights?.competitionLevel || 'Medium'}
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Analysis Summary */}
             <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 mb-8">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Analysis Summary</h3>
               </div>
               <p className="text-slate-300 text-lg leading-relaxed">
                 {result.scoreJustification}
               </p>
             </div>

                         {/* Platform-Specific Data Cards */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               {/* Reddit Analysis */}
               {result.redditData && (
                 <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 backdrop-blur-md rounded-xl p-6 border border-orange-700/30">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                       <span className="text-white font-bold">R</span>
                     </div>
                     <div>
                       <h4 className="text-lg font-semibold text-white">Reddit Analysis</h4>
                       <p className="text-orange-300 text-sm">{result.redditData.totalPosts} posts found</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Demand Score</span>
                       <span className={`text-lg font-bold ${
                         result.redditData.demandScore >= 80 ? 'text-emerald-400' :
                         result.redditData.demandScore >= 60 ? 'text-yellow-400' :
                         'text-red-400'
                       }`}>
                         {result.redditData.demandScore}%
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Total Upvotes</span>
                       <span className="text-white font-medium">{result.redditData.totalUpvotes.toLocaleString()}</span>
                     </div>
                     {result.redditData.trendingSubreddits.length > 0 && (
                       <div>
                         <span className="text-slate-300 text-sm">Trending in:</span>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {result.redditData.trendingSubreddits.slice(0, 3).map((subreddit, index) => (
                             <span key={index} className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded text-xs">
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
                 <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 backdrop-blur-md rounded-xl p-6 border border-orange-700/30">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                       <span className="text-white font-bold">H</span>
                     </div>
                     <div>
                       <h4 className="text-lg font-semibold text-white">Hacker News</h4>
                       <p className="text-orange-300 text-sm">{result.hackerNewsData.totalPosts} posts found</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Demand Score</span>
                       <span className={`text-lg font-bold ${
                         result.hackerNewsData.demandScore >= 80 ? 'text-emerald-400' :
                         result.hackerNewsData.demandScore >= 60 ? 'text-yellow-400' :
                         'text-red-400'
                       }`}>
                         {result.hackerNewsData.demandScore}%
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Total Points</span>
                       <span className="text-white font-medium">{result.hackerNewsData.totalPoints.toLocaleString()}</span>
                     </div>
                   </div>
                 </div>
               )}

               {/* Product Hunt Analysis */}
               {result.productHuntData && (
                 <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-md rounded-xl p-6 border border-purple-700/30">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                       <span className="text-white font-bold">P</span>
                     </div>
                     <div>
                       <h4 className="text-lg font-semibold text-white">Product Hunt</h4>
                       <p className="text-purple-300 text-sm">{result.productHuntData.totalProducts} products found</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Demand Score</span>
                       <span className={`text-lg font-bold ${
                         result.productHuntData.demandScore >= 80 ? 'text-emerald-400' :
                         result.productHuntData.demandScore >= 60 ? 'text-yellow-400' :
                         'text-red-400'
                       }`}>
                         {result.productHuntData.demandScore}%
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Total Upvotes</span>
                       <span className="text-white font-medium">{result.productHuntData.totalUpvotes.toLocaleString()}</span>
                     </div>
                   </div>
                 </div>
               )}

               {/* GitHub Analysis */}
               {result.githubData && (
                 <div className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 backdrop-blur-md rounded-xl p-6 border border-gray-700/30">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                       <span className="text-white font-bold">G</span>
                     </div>
                     <div>
                       <h4 className="text-lg font-semibold text-white">GitHub</h4>
                       <p className="text-gray-300 text-sm">{result.githubData.totalRepos} repositories found</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Demand Score</span>
                       <span className={`text-lg font-bold ${
                         result.githubData.demandScore >= 80 ? 'text-emerald-400' :
                         result.githubData.demandScore >= 60 ? 'text-yellow-400' :
                         'text-red-400'
                       }`}>
                         {result.githubData.demandScore}%
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-slate-300 text-sm">Total Stars</span>
                       <span className="text-white font-medium">{result.githubData.totalStars.toLocaleString()}</span>
                     </div>
                     {result.githubData.topLanguages.length > 0 && (
                       <div>
                         <span className="text-slate-300 text-sm">Top Languages:</span>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {result.githubData.topLanguages.slice(0, 3).map((lang, index) => (
                             <span key={index} className="px-2 py-1 bg-gray-600/20 text-gray-300 rounded text-xs">
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
             <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-white">Next Steps Action Plan</h3>
                   <p className="text-slate-300 text-lg">Strategic recommendations based on your validation results</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 100 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                       </svg>
                     </div>
                     <h4 className="font-semibold text-emerald-400">Immediate Actions</h4>
                   </div>
                   <ul className="space-y-2 text-slate-300 text-sm">
                     <li className="flex items-start gap-2">
                       <span className="text-emerald-400 mt-1">•</span>
                       Share results on social media
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-emerald-400 mt-1">•</span>
                       Research competitors in depth
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-emerald-400 mt-1">•</span>
                       Start building MVP prototype
                     </li>
                   </ul>
                 </div>

                 <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                     </div>
                     <h4 className="font-semibold text-blue-400">Market Research</h4>
                   </div>
                   <ul className="space-y-2 text-slate-300 text-sm">
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">•</span>
                       Analyze top competitors
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">•</span>
                       Study user feedback patterns
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-400 mt-1">•</span>
                       Identify market gaps
                     </li>
                   </ul>
                 </div>

                 <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                        <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <h4 className="font-semibold text-purple-400">Development</h4>
                     </div>
                     <ul className="space-y-2 text-slate-300 text-sm">
                     <li className="flex items-start gap-2">
                       <span className="text-purple-400 mt-1">•</span>
                       Create MVP roadmap
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-purple-400 mt-1">•</span>
                       Set up development team
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-purple-400 mt-1">•</span>
                       Plan beta testing
                     </li>
                   </ul>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;

