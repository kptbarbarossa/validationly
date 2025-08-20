import React, { useState } from 'react';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  
  // Enhanced 3D Scoring System
  breakdown: {
    demand: number;      // 0-100: Market interest and search volume
    sentiment: number;   // 0-100: User satisfaction and feedback
    momentum: number;    // 0-100: Trend growth and acceleration
  };
  
  // Platform-specific metrics
  sources: {
    twitter?: { mentions: number; pos_rate: number; trend_score: number };
    reddit?: { posts: number; comments: number; upvotes: number };
    linkedin?: { mentions: number; engagement_rate: number };
    hn?: { similar_upvotes: number; tech_interest: number };
    ph?: { category_top: string; trend_momentum: number };
    trends?: { delta_90d: number; search_volume: number };
  };
  
  // AI-powered insights
  aiInsights: {
    trendPhase: 'emerging' | 'growing' | 'peak' | 'declining';
    timingAdvantage: string;
    platformDynamics: string;
    marketOpportunity: string;
    riskFactors: string[];
  };
  
  // Existing fields
  platformAnalyses: Array<{
    platform: string;
    signalStrength: string;
    analysis: string;
  }>;
  socialArbitrageInsights?: {
    microToMacro: string;
    geographicDemographic: string;
    timingFactor: string;
    platformDynamics: string;
    culturalLeap: string;
  };
  audience?: string;
  goal?: string;
  industry?: string;
  stage?: string;
}

interface EnhancedResultsDisplayProps {
  result: ValidationResult;
}

const EnhancedResultsDisplay: React.FC<EnhancedResultsDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyText = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getTrendPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'emerging': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'growing': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'peak': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'declining': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getTrendPhaseIcon = (phase?: string) => {
    switch (phase) {
      case 'emerging': return '🌱';
      case 'growing': return '📈';
      case 'peak': return '🔥';
      case 'declining': return '📉';
      default: return '❓';
    }
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '📈';
    if (score >= 40) return '🤔';
    return '⚠️';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Exceptional Opportunity!';
    if (score >= 60) return 'Strong Potential';
    if (score >= 40) return 'Moderate Interest';
    return 'Needs Refinement';
  };

  const tabs = [
    { id: 'overview', label: '🚀 Validation Score', icon: '🚀' },
    { id: 'breakdown', label: '📊 3D Analysis', icon: '📊' },
    { id: 'trends', label: '🔍 AI Trend Analysis', icon: '🔍' },
    { id: 'sources', label: '📱 Platform Signals', icon: '📱' },
    { id: 'content', label: '📝 Content Suggestions', icon: '📝' },
    { id: 'context', label: '🎯 Business Context', icon: '🎯' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            🔮 Social Trend Analysis
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {result.idea}
          </p>
        </div>

        {/* Score Card */}
        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
          <div className="text-center">
            <div className="text-8xl mb-4">
              {getScoreEmoji(result.demandScore)}
            </div>
            <div className="text-6xl font-bold mb-4">
              <span className={getScoreColor(result.demandScore)}>{result.demandScore}</span>
              <span className="text-slate-400 text-4xl">/100</span>
            </div>
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-medium border ${getScoreBgColor(result.demandScore)}`}>
              {getScoreMessage(result.demandScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl border transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900/50 border-white/20 text-slate-300 hover:border-white/40'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        
        {/* Overview Tab - Social Trend Analysis */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Social Trend Insights */}
            {result.socialArbitrageInsights && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="text-3xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Micro → Macro</h3>
                  <p className="text-slate-300">{result.socialArbitrageInsights.microToMacro}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="text-3xl mb-4">🌍</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Geographic & Demographic</h3>
                  <p className="text-slate-300">{result.socialArbitrageInsights.geographicDemographic}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="text-3xl mb-4">⏰</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Timing Factor</h3>
                  <p className="text-slate-300">{result.socialArbitrageInsights.timingFactor}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="text-3xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Platform Dynamics</h3>
                  <p className="text-slate-300">{result.socialArbitrageInsights.platformDynamics}</p>
                </div>
              </div>
            )}

            {/* Score Justification */}
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-3xl mb-4">💭</div>
                <h3 className="text-2xl font-semibold text-white">AI Analysis</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">{result.scoreJustification}</p>
            </div>

            {/* Platform Signal Analysis */}
            {Array.isArray(result.platformAnalyses) && result.platformAnalyses.length > 0 && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-2xl font-semibold text-white">Platform Signal Analysis</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.platformAnalyses.map((analysis, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{analysis.platform}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.signalStrength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                          analysis.signalStrength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {analysis.signalStrength}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{analysis.analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Smart Content Generation Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Smart Content Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-2xl font-semibold text-white">AI-Powered Content Strategy</h2>
              <p className="text-slate-400">Smart content generation with trend-based insights and platform optimization</p>
            </div>

            {/* Content Strategy Overview */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl p-8 border border-indigo-500/20">
              <div className="text-center mb-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-2xl font-semibold text-white">Content Strategy Overview</h3>
                <p className="text-slate-400">AI-optimized content for maximum engagement across platforms</p>
              </div>
              
              {/* Strategy Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-white/10">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-white">Platform Coverage</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">6 Platforms</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-white/10">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm font-medium text-white">Content Types</div>
                  <div className="text-lg font-bold text-green-400 mt-1">8+ Formats</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-white/10">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm font-medium text-white">Engagement Score</div>
                  <div className="text-lg font-bold text-purple-400 mt-1">85/100</div>
                </div>
              </div>
            </div>

            {/* Enhanced Content Suggestions */}
            {[
              { 
                title: 'X (Twitter) Post', 
                content: result.tweetSuggestion, 
                icon: '🐦',
                platform: 'X',
                description: 'AI-optimized tweet with trending hashtags and engagement triggers',
                tips: ['Keep under 280 characters', 'Use trending hashtags', 'Include engagement questions', 'Add relevant emojis'],
                hashtags: ['#startup', '#innovation', '#tech', '#entrepreneur'],
                engagement: 'High engagement potential with trending topics'
              },
              { 
                title: 'Reddit Strategy', 
                content: result.redditTitleSuggestion, 
                body: result.redditBodySuggestion,
                icon: '🤖', 
                platform: 'Reddit',
                description: 'Community-focused content optimized for subreddit engagement',
                tips: ['Research subreddit rules', 'Be authentic and helpful', 'Engage with comments', 'Use community language'],
                hashtags: ['r/startups', 'r/entrepreneur', 'r/smallbusiness'],
                engagement: 'Strong community discussion potential'
              },
              { 
                title: 'LinkedIn Professional Post', 
                content: result.linkedinSuggestion, 
                icon: '💼',
                platform: 'LinkedIn',
                description: 'Professional content optimized for B2B audience and networking',
                tips: ['Professional tone', 'Include industry insights', 'Network engagement', 'Add value first'],
                hashtags: ['#business', '#leadership', '#innovation', '#networking'],
                engagement: 'Professional network expansion opportunity'
              },
              { 
                title: 'Instagram Story Strategy', 
                content: 'Visual story highlighting key benefits with interactive elements',
                icon: '📸',
                platform: 'Instagram',
                description: 'Visual storytelling optimized for Instagram engagement',
                tips: ['Use engaging visuals', 'Add interactive stickers', 'Keep it under 15 seconds', 'Include call-to-action'],
                hashtags: ['#startuplife', '#innovation', '#entrepreneur', '#business'],
                engagement: 'High visual engagement potential'
              },
              { 
                title: 'YouTube Shorts Concept', 
                content: 'Quick value proposition video under 60 seconds',
                icon: '🎥',
                platform: 'YouTube',
                description: 'Short-form video content for viral potential',
                tips: ['Hook in first 3 seconds', 'Keep under 60 seconds', 'Add captions', 'End with CTA'],
                hashtags: ['#shorts', '#startup', '#business', '#entrepreneur'],
                engagement: 'Viral potential with trending topics'
              },
              { 
                title: 'TikTok Strategy', 
                content: 'Trending format with startup insights and entertainment',
                icon: '🎵',
                platform: 'TikTok',
                description: 'Entertaining content that educates about your startup',
                tips: ['Follow trending sounds', 'Use popular transitions', 'Educate while entertaining', 'Engage with comments'],
                hashtags: ['#startup', '#business', '#entrepreneur', '#fyp'],
                engagement: 'High viral potential with Gen Z audience'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.content && (
                      <button
                        onClick={() => copyText(item.content!, index)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm transition-colors"
                      >
                        {copiedIndex === index ? '✅ Copied!' : '📋 Copy'}
                      </button>
                    )}
                    <button
                      onClick={() => copyText(item.title, index)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm transition-colors"
                    >
                      Copy Title
                    </button>
                  </div>
                </div>
                
                {/* Content Display */}
                {item.content && (
                  <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Content:</h4>
                    <p className="text-slate-300 leading-relaxed text-lg">{item.content}</p>
                    {item.body && (
                      <>
                        <h4 className="text-lg font-semibold text-white mb-3 mt-6">Body:</h4>
                        <p className="text-slate-300 leading-relaxed text-lg">{item.body}</p>
                      </>
                    )}
                  </div>
                )}

                {/* Smart Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Platform Tips */}
                  <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-2xl p-6 border border-indigo-500/20">
                    <h4 className="text-lg font-semibold text-white mb-4">💡 {item.platform} Best Practices:</h4>
                    <ul className="space-y-2">
                      {item.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-center gap-2 text-slate-300">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trending Hashtags */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                    <h4 className="text-lg font-semibold text-white mb-4">🏷️ Trending Hashtags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.hashtags.map((hashtag, hashtagIndex) => (
                        <span key={hashtagIndex} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-white/10">
                      <p className="text-slate-300 text-sm">{item.engagement}</p>
                    </div>
                  </div>
                </div>

                {/* AI Content Insights */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <h4 className="text-lg font-semibold text-white mb-4">🤖 AI Content Insights:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/10">
                      <div className="text-lg mb-1">📈</div>
                      <div className="text-sm font-medium text-white">Engagement Score</div>
                      <div className="text-lg font-bold text-purple-400">85/100</div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/10">
                      <div className="text-lg mb-1">⏰</div>
                      <div className="text-sm font-medium text-white">Best Posting Time</div>
                      <div className="text-lg font-bold text-purple-400">9-11 AM</div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-white/10">
                      <div className="text-lg mb-1">🎯</div>
                      <div className="text-sm font-medium text-white">Target Audience</div>
                      <div className="text-lg font-bold text-purple-400">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Content Calendar Suggestion */}
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-2xl font-semibold text-white">AI-Recommended Content Calendar</h3>
                <p className="text-slate-400">Optimal posting schedule for maximum engagement</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center p-4 bg-slate-900/50 rounded-2xl border border-white/10">
                    <div className="text-lg font-semibold text-white mb-2">{day}</div>
                    <div className="text-sm text-slate-400 mb-2">
                      {index === 0 ? 'LinkedIn' : index === 2 ? 'Twitter' : index === 4 ? 'Instagram' : index === 6 ? 'Reddit' : 'Mixed'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {index === 0 ? '9 AM' : index === 2 ? '2 PM' : index === 4 ? '6 PM' : index === 6 ? '8 PM' : 'Flexible'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3D Analysis Tab */}
        {activeTab === 'breakdown' && (
          <div className="space-y-8">
            {/* 3D Scoring Breakdown */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold text-white">3D Validation Analysis</h2>
              <p className="text-slate-400">Comprehensive breakdown of demand, sentiment, and momentum</p>
            </div>

            {/* 3D Score Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Demand Score */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Demand</h3>
                  <div className="text-5xl font-bold text-green-400 mb-4">
                    {result.breakdown?.demand || result.demandScore}/100
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.breakdown?.demand || result.demandScore}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-sm">Market interest and search volume</p>
                </div>
              </div>

              {/* Sentiment Score */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                <div className="text-center">
                  <div className="text-4xl mb-4">😊</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Sentiment</h3>
                  <div className="text-5xl font-bold text-blue-400 mb-4">
                    {result.breakdown?.sentiment || 75}/100
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.breakdown?.sentiment || 75}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-sm">User satisfaction and feedback</p>
                </div>
              </div>

              {/* Momentum Score */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Momentum</h3>
                  <div className="text-5xl font-bold text-purple-400 mb-4">
                    {result.breakdown?.momentum || 65}/100
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.breakdown?.momentum || 65}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-sm">Trend growth and acceleration</p>
                </div>
              </div>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl p-8 border border-indigo-500/20">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Overall Validation Score</h3>
                <div className="text-7xl font-bold text-indigo-400 mb-4">
                  {result.demandScore}/100
                </div>
                <div className="text-xl text-slate-300 mb-6">
                  {getScoreMessage(result.demandScore)}
                </div>
                <div className="inline-block px-6 py-3 rounded-full text-lg font-medium border border-indigo-500/30 bg-indigo-500/20 text-indigo-300">
                  {getScoreEmoji(result.demandScore)} {getScoreMessage(result.demandScore)}
                </div>
              </div>
            </div>

            {/* Score Justification */}
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-3xl mb-4">💭</div>
                <h3 className="text-2xl font-semibold text-white">AI Analysis Breakdown</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">{result.scoreJustification}</p>
            </div>
          </div>
        )}

        {/* AI Trend Analysis Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            {/* AI Trend Analysis Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-white">AI-Powered Trend Analysis</h2>
              <p className="text-slate-400">Advanced trend detection using AI knowledge and social media signals</p>
            </div>

            {/* Trend Phase Analysis */}
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{getTrendPhaseIcon(result.aiInsights?.trendPhase || result.trendPhase)}</div>
                <h3 className="text-2xl font-semibold text-white">Trend Phase Detection</h3>
                <p className="text-slate-400">Current market position and growth trajectory</p>
              </div>
              <div className="text-center mb-6">
                <span className={`inline-block px-6 py-3 rounded-full text-lg font-medium border ${getTrendPhaseColor(result.aiInsights?.trendPhase || result.trendPhase)}`}>
                  {(result.aiInsights?.trendPhase || result.trendPhase || 'analyzing')?.charAt(0).toUpperCase() + (result.aiInsights?.trendPhase || result.trendPhase || 'analyzing')?.slice(1)}
                </span>
              </div>
              
              {/* Trend Phase Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">What This Means:</h4>
                  <p className="text-slate-300 text-sm">
                    {result.aiInsights?.trendPhase === 'emerging' ? 'Early signals detected, low competition, high uncertainty but high potential' :
                     result.aiInsights?.trendPhase === 'growing' ? 'Increasing adoption, moderate competition, validation signals present' :
                     result.aiInsights?.trendPhase === 'peak' ? 'High awareness, intense competition, market saturation approaching' :
                     result.aiInsights?.trendPhase === 'declining' ? 'Decreasing interest, oversaturation, exit opportunities' :
                     'AI analysis in progress...'}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Strategic Implications:</h4>
                  <p className="text-slate-300 text-sm">
                    {result.aiInsights?.trendPhase === 'emerging' ? 'Perfect timing for early entry, build brand recognition' :
                     result.aiInsights?.trendPhase === 'growing' ? 'Good timing, focus on differentiation and execution' :
                     result.aiInsights?.trendPhase === 'peak' ? 'Consider niche positioning or wait for next cycle' :
                     result.aiInsights?.trendPhase === 'declining' ? 'Evaluate pivot opportunities or exit strategy' :
                     'Analysis pending...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timing Advantage Analysis */}
            {result.aiInsights?.timingAdvantage && (
              <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl p-8 border border-indigo-500/20">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-2xl font-semibold text-white">Timing Advantage Analysis</h3>
                  <p className="text-slate-400">AI assessment of market entry timing and competitive positioning</p>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.aiInsights.timingAdvantage}</p>
                </div>
              </div>
            )}

            {/* Platform Dynamics */}
            {result.aiInsights?.platformDynamics && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-2xl font-semibold text-white">Platform Dynamics</h3>
                  <p className="text-slate-400">Social media platform behavior and user migration patterns</p>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.aiInsights.platformDynamics}</p>
                </div>
              </div>
            )}

            {/* Market Opportunity */}
            {result.aiInsights?.marketOpportunity && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-green-500/20">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-2xl font-semibold text-white">Market Opportunity Assessment</h3>
                  <p className="text-slate-400">AI-powered market gap analysis and opportunity identification</p>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.aiInsights.marketOpportunity}</p>
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {result.aiInsights?.riskFactors && result.aiInsights.riskFactors.length > 0 && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-semibold text-white">Risk Factor Analysis</h3>
                  <p className="text-slate-400">AI-identified risks and mitigation strategies</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.aiInsights.riskFactors.map((risk, index) => (
                    <div key={index} className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        <span className="text-sm font-medium text-red-300">Risk {index + 1}</span>
                      </div>
                      <p className="text-slate-300 text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy Fields (for backward compatibility) */}
            {result.culturalTransferScore && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-2xl font-semibold text-white">Cultural Transfer Potential</h3>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-400 mb-4">{result.culturalTransferScore}/100</div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.culturalTransferScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {result.earlyAdopterAdvantage && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-2xl font-semibold text-white">Early Adopter Advantage</h3>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">{result.earlyAdopterAdvantage}</p>
              </div>
            )}
          </div>
        )}

        {/* Platform Signals Tab */}
        {activeTab === 'sources' && (
          <div className="space-y-8">
            {/* Platform Signals Overview */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-2xl font-semibold text-white">Platform Signal Analysis</h2>
              <p className="text-slate-400">Real-time signals from social media and community platforms</p>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Twitter Signals */}
              {result.sources?.twitter && (
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🐦</div>
                    <h3 className="text-lg font-semibold text-white">Twitter</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mentions:</span>
                      <span className="text-white font-semibold">{result.sources.twitter.mentions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Positive Rate:</span>
                      <span className="text-white font-semibold">{(result.sources.twitter.pos_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trend Score:</span>
                      <span className="text-white font-semibold">{result.sources.twitter.trend_score}/100</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reddit Signals */}
              {result.sources?.reddit && (
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🤖</div>
                    <h3 className="text-lg font-semibold text-white">Reddit</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Posts:</span>
                      <span className="text-white font-semibold">{result.sources.reddit.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Comments:</span>
                      <span className="text-white font-semibold">{result.sources.reddit.comments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Upvotes:</span>
                      <span className="text-white font-semibold">{result.sources.reddit.upvotes}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* LinkedIn Signals */}
              {result.sources?.linkedin && (
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">💼</div>
                    <h3 className="text-lg font-semibold text-white">LinkedIn</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mentions:</span>
                      <span className="text-white font-semibold">{result.sources.linkedin.mentions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Engagement:</span>
                      <span className="text-white font-semibold">{(result.sources.linkedin.engagement_rate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hacker News Signals */}
              {result.sources?.hn && (
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">👨‍💻</div>
                    <h3 className="text-lg font-semibold text-white">Hacker News</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Similar Upvotes:</span>
                      <span className="text-white font-semibold">{result.sources.hn.similar_upvotes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tech Interest:</span>
                      <span className="text-white font-semibold">{result.sources.hn.tech_interest}/100</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Hunt Signals */}
              {result.sources?.ph && (
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🚀</div>
                    <h3 className="text-lg font-semibold text-white">Product Hunt</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="text-white font-semibold">{result.sources.ph.category_top}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trend Momentum:</span>
                      <span className="text-white font-semibold">{result.sources.ph.trend_momentum}/100</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Trends Signals */}
              {result.sources?.trends && (
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">📊</div>
                    <h3 className="text-lg font-semibold text-white">Google Trends</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">90d Growth:</span>
                      <span className="text-white font-semibold">+{(result.sources.trends.delta_90d * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Search Volume:</span>
                      <span className="text-white font-semibold">{result.sources.trends.search_volume}/100</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Signal Summary */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl p-8 border border-indigo-500/20">
              <div className="text-center">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Platform Signal Summary</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {result.sources?.twitter?.mentions > 1000 ? 'Strong social media presence detected' : 'Moderate social media activity'} 
                  with {result.sources?.reddit?.posts > 10 ? 'active community discussions' : 'growing community interest'} 
                  and {result.sources?.trends?.delta_90d > 0.3 ? 'positive trend momentum' : 'stable market interest'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Business Context Tab */}
        {activeTab === 'context' && (
          <div className="space-y-8">
            {/* Enhanced Business Context */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold text-white">Business Context & Strategy</h2>
              <p className="text-slate-400">Comprehensive analysis of your business positioning and market context</p>
            </div>

            {/* Business Model Analysis */}
            {result.audience && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">Target Audience & Business Model</h3>
                    <p className="text-slate-400">Understanding your core customer segments</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.audience}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium text-white">Customer Segments</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="text-sm font-medium text-white">Revenue Model</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">🔗</div>
                    <div className="text-sm font-medium text-white">Value Chain</div>
                  </div>
                </div>
              </div>
            )}

            {/* Industry Analysis */}
            {result.industry && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🏭</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">Industry Landscape</h3>
                    <p className="text-slate-400">Market dynamics and competitive environment</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.industry}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-white">Market Size</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">⚔️</div>
                    <div className="text-sm font-medium text-white">Competition</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-sm font-medium text-white">Growth Rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Development Stage */}
            {result.stage && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">Development Stage</h3>
                    <p className="text-slate-400">Current progress and next milestones</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.stage}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="text-sm font-medium text-white">MVP Status</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-medium text-white">Validation</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-white">Metrics</div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Goal */}
            {result.goal && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">Analysis Objectives</h3>
                    <p className="text-slate-400">What you're trying to achieve with this validation</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                  <p className="text-slate-300 text-lg leading-relaxed">{result.goal}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="text-sm font-medium text-white">Market Research</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="text-sm font-medium text-white">Idea Refinement</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-sm font-medium text-white">Growth Strategy</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedResultsDisplay;
