import React, { useState } from 'react';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
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
  trendPhase?: 'emerging' | 'growing' | 'peak' | 'declining';
  culturalTransferScore?: number;
  earlyAdopterAdvantage?: string;
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
    { id: 'overview', label: '🚀 Social Trend Analysis', icon: '🚀' },
    { id: 'content', label: '📝 Content Suggestions', icon: '📝' },
    { id: 'trends', label: '📊 Trend Analysis', icon: '📊' },
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

        {/* Content Suggestions Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Enhanced Content Suggestions */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-2xl font-semibold text-white">Multi-Platform Content Strategy</h2>
              <p className="text-slate-400">Optimized content for each platform's unique audience and format</p>
            </div>

            {[
              { 
                title: 'X (Twitter) Post', 
                content: result.tweetSuggestion, 
                icon: '🐦',
                platform: 'X',
                description: 'Engaging tweet with hashtags and call-to-action',
                tips: ['Keep under 280 characters', 'Use relevant hashtags', 'Include call-to-action']
              },
              { 
                title: 'Reddit Strategy', 
                content: result.redditTitleSuggestion, 
                body: result.redditBodySuggestion,
                icon: '🤖', 
                platform: 'Reddit',
                description: 'Community-focused content for relevant subreddits',
                tips: ['Research subreddit rules', 'Be authentic and helpful', 'Engage with comments']
              },
              { 
                title: 'LinkedIn Professional Post', 
                content: result.linkedinSuggestion, 
                icon: '💼',
                platform: 'LinkedIn',
                description: 'Professional content for B2B audience',
                tips: ['Professional tone', 'Include industry insights', 'Network engagement']
              }
            ].map((item, index) => (
              item.content && (
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
                      <button
                        onClick={() => copyText(item.content!, index)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm transition-colors"
                      >
                        {copiedIndex === index ? '✅ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Content Display */}
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
                </div>
              )
            ))}
          </div>
        )}

        {/* Trend Analysis Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            {/* Trend Phase */}
            {result.trendPhase && (
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{getTrendPhaseIcon(result.trendPhase)}</div>
                  <h3 className="text-2xl font-semibold text-white">Trend Phase</h3>
                </div>
                <div className="text-center">
                  <span className={`inline-block px-6 py-3 rounded-full text-lg font-medium border ${getTrendPhaseColor(result.trendPhase)}`}>
                    {result.trendPhase.charAt(0).toUpperCase() + result.trendPhase.slice(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Cultural Transfer Score */}
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

            {/* Early Adopter Advantage */}
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
