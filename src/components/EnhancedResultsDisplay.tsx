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
    { id: 'overview', label: '🚀 Social Arbitrage Analysis', icon: '🚀' },
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
            🔮 Social Arbitrage Analysis
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
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
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
        
        {/* Overview Tab - Social Arbitrage Analysis */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Social Arbitrage Insights */}
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
          <div className="space-y-6">
            {[
              { title: 'Tweet Suggestion', content: result.tweetSuggestion, icon: '🐦' },
              { title: 'Reddit Title', content: result.redditTitleSuggestion, icon: '🤖' },
              { title: 'Reddit Body', content: result.redditBodySuggestion, icon: '📝' },
              { title: 'LinkedIn Post', content: result.linkedinSuggestion, icon: '💼' }
            ].map((item, index) => (
              item.content && (
                <div key={index} className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{item.icon}</div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    </div>
                    <button
                      onClick={() => copyText(item.content!, index)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-sm transition-colors"
                    >
                      {copiedIndex === index ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{item.content}</p>
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
          <div className="space-y-6">
            {[
              { label: 'Business Model', value: result.audience, icon: '🎯' },
              { label: 'Industry', value: result.industry, icon: '🏭' },
              { label: 'Development Stage', value: result.stage, icon: '📈' },
              { label: 'Analysis Goal', value: result.goal, icon: '🎯' }
            ].map((item, index) => (
              item.value && (
                <div key={index} className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.label}</h3>
                      <p className="text-slate-300">{item.value}</p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedResultsDisplay;
