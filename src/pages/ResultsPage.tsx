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
      }>;
      totalResults: number;
    };
    trendAnalysis: {
      totalViews: number;
      averageViews: number;
      totalVideos: number;
      recentActivity: boolean;
      topChannels: string[];
    };
  };
  multiPlatformData?: {
    platforms: Array<{
      platform: string;
      items: any[];
      error?: string;
    }>;
    totalItems: number;
  };
  insights?: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keyInsights: string[];
    opportunities: string[];
    painPoints: string[];
    trendingTopics: string[];
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

  // Calculate metrics
  const activePlatforms = result.multiPlatformData?.platforms?.filter(p => p.items?.length > 0).length || 0;
  const totalResults = result.multiPlatformData?.totalItems || 0;
  const aiInsights = result.insights?.keyInsights?.length || 0;

  return (
    <>
      <SEOHead
        title={`Validation Results | Validationly`}
        description="AI-powered startup idea validation results and action plan"
        keywords="startup validation, idea validation, market research, startup tools"
      />

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Modern Dashboard Layout */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">
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

            {/* Navigation */}
            <nav className="space-y-2">
              <a href="#overview" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Overview</span>
              </a>
              <a href="#insights" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI Insights</span>
              </a>
              <a href="#platforms" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                <span>Platforms</span>
              </a>
              <a href="#content" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Content</span>
              </a>
            </nav>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-sm font-medium">Share</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Export PDF</span>
              </button>
            </div>
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
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{activePlatforms}</div>
                <p className="text-slate-400 text-sm">Active Platforms</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                      style={{width: `${(activePlatforms / 7) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{Math.round((activePlatforms / 7) * 100)}%</span>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{totalResults}</div>
                <p className="text-slate-400 text-sm">Total Results</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-cyan-600 h-2 rounded-full transition-all duration-1000" 
                      style={{width: `${Math.min((totalResults / 100) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{Math.min(Math.round((totalResults / 100) * 100), 100)}%</span>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{aiInsights}</div>
                <p className="text-slate-400 text-sm">AI Insights</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        result.insights?.sentiment === 'positive' ? 'bg-green-600' : 
                        result.insights?.sentiment === 'negative' ? 'bg-red-600' : 'bg-purple-600'
                      }`}
                      style={{width: '75%'}}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {result.insights?.sentiment === 'positive' ? 'Positive' : 
                     result.insights?.sentiment === 'negative' ? 'Negative' : 'Neutral'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{result.insights?.validationScore || result.demandScore}</div>
                <p className="text-slate-400 text-sm">Market Score</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-1000" 
                      style={{width: `${(result.insights?.validationScore || result.demandScore)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{result.insights?.validationScore || result.demandScore}%</span>
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

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Insights */}
              {result.insights && (
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">AI Insights</h3>
                  </div>

                  <div className="space-y-6">
                    {result.insights.keyInsights && result.insights.keyInsights.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                          Key Insights
                        </h4>
                        <ul className="space-y-2">
                          {result.insights.keyInsights.slice(0, 3).map((insight, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-3">
                              <span className="text-cyan-400 mt-1 text-xs">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.insights.opportunities && result.insights.opportunities.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                          Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {result.insights.opportunities.slice(0, 3).map((opportunity, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-3">
                              <span className="text-emerald-400 mt-1 text-xs">•</span>
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.insights.painPoints && result.insights.painPoints.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          Challenges
                        </h4>
                        <ul className="space-y-2">
                          {result.insights.painPoints.slice(0, 3).map((painPoint, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-start gap-3">
                              <span className="text-red-400 mt-1 text-xs">•</span>
                              {painPoint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Platform Data Summary */}
              {result.multiPlatformData && (
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Platform Analysis</h3>
                  </div>

                  <div className="space-y-4">
                    {result.multiPlatformData.platforms.map((platform, index) => {
                      if (!platform.items || platform.items.length === 0) return null;
                      
                      const platformConfig = {
                        reddit: { name: 'Reddit', color: 'bg-orange-500', icon: '🔴' },
                        hackernews: { name: 'Hacker News', color: 'bg-orange-600', icon: '🟠' },
                        producthunt: { name: 'Product Hunt', color: 'bg-pink-500', icon: '🚀' },
                        github: { name: 'GitHub', color: 'bg-gray-600', icon: '⚫' },
                        stackoverflow: { name: 'Stack Overflow', color: 'bg-yellow-600', icon: '📚' },
                        googlenews: { name: 'Google News', color: 'bg-blue-600', icon: '📰' }
                      };

                      const config = platformConfig[platform.platform as keyof typeof platformConfig];
                      if (!config) return null;

                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                              {config.icon}
                            </div>
                            <div>
                              <p className="font-medium text-white">{config.name}</p>
                              <p className="text-xs text-slate-400">{platform.items.length} results found</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">{platform.items.length}</div>
                            <div className="text-xs text-slate-400">items</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Content */}
            {result.socialMediaSuggestions && (
              <div className="mt-8 bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Content Suggestions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.socialMediaSuggestions.tweetSuggestion && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs">🐦</span>
                        </div>
                        <span className="font-medium text-blue-400">Twitter/X</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result.socialMediaSuggestions.tweetSuggestion}
                      </p>
                    </div>
                  )}

                  {result.socialMediaSuggestions.linkedinSuggestion && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-blue-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs">💼</span>
                        </div>
                        <span className="font-medium text-blue-600">LinkedIn</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result.socialMediaSuggestions.linkedinSuggestion}
                      </p>
                    </div>
                  )}

                  {result.socialMediaSuggestions.redditTitleSuggestion && (
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs">🔴</span>
                        </div>
                        <span className="font-medium text-orange-500">Reddit</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium mb-2">
                        {result.socialMediaSuggestions.redditTitleSuggestion}
                      </p>
                      {result.socialMediaSuggestions.redditBodySuggestion && (
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {result.socialMediaSuggestions.redditBodySuggestion.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;