import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  platformAnalyses: Array<{
    platform: string;
    signalStrength: string;
    analysis: string;
  }>;
  tweetSuggestion?: string;
  redditTitleSuggestion?: string;
  redditBodySuggestion?: string;
  linkedinSuggestion?: string;
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
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const result: ValidationResult = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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

  const tabs = [
    { id: 'overview', label: '🚀 Social Arbitrage Analysis', icon: '🚀' },
    { id: 'content', label: '📝 Content Suggestions', icon: '📝' },
    { id: 'trends', label: '📊 Trend Analysis', icon: '📊' }
  ];

  return (
    <>
      <SEOHead
        title="Social Arbitrage Analysis | Validationly"
        description="AI-powered social arbitrage analysis for your business idea with trend insights and cultural transfer potential"
        keywords="social arbitrage, trend analysis, cultural transfer, market timing, startup validation"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 blur-3xl"></div>
          
          <div className="relative container mx-auto px-6 py-12">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                🔮 Social Arbitrage Analysis
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Discover hidden opportunities through cultural gaps, timing advantages, and platform dynamics
              </p>
            </div>

            {/* Main Score Card */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold mb-4">
                    <span className={getScoreColor(result.demandScore)}>
                      {result.demandScore}
                    </span>
                    <span className="text-slate-400 text-4xl">/100</span>
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getScoreBgColor(result.demandScore)}`}>
                    {result.demandScore >= 80 ? 'High Arbitrage Potential' :
                     result.demandScore >= 60 ? 'Medium Arbitrage Potential' :
                     result.demandScore >= 40 ? 'Low Arbitrage Potential' :
                     'Very Low Arbitrage Potential'}
                  </div>
                </div>

                {/* Trend Phase Indicator */}
                {result.trendPhase && (
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getTrendPhaseColor(result.trendPhase)}`}>
                      <span className="text-lg">{getTrendPhaseIcon(result.trendPhase)}</span>
                      <span className="capitalize">{result.trendPhase} Phase</span>
                    </div>
                  </div>
                )}

                {/* Cultural Transfer Score */}
                {result.culturalTransferScore && (
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      Cultural Transfer Score: {Math.round(result.culturalTransferScore * 100)}%
                    </div>
                    <p className="text-slate-400 text-sm">
                      Likelihood of cross-cultural adoption
                    </p>
                  </div>
                )}

                {/* Early Adopter Advantage */}
                {result.earlyAdopterAdvantage && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                    <h3 className="text-blue-400 font-semibold mb-2">🎯 Early Adopter Advantage</h3>
                    <p className="text-blue-300 text-sm">{result.earlyAdopterAdvantage}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-wrap justify-center gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto">
              
              {/* Overview Tab - Social Arbitrage Analysis */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  
                  {/* AI Analysis */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">🤖</span>
                      AI Social Arbitrage Analysis
                    </h2>
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                      <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                        {result.scoreJustification}
                      </div>
                    </div>
                  </div>

                  {/* Social Arbitrage Insights */}
                  {result.socialArbitrageInsights && (
                    <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🔍</span>
                        Social Arbitrage Insights
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Micro to Macro */}
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                            <span className="text-xl">🌱</span>
                            Micro → Macro Transfer
                          </h3>
                          <p className="text-slate-300 text-sm">{result.socialArbitrageInsights.microToMacro}</p>
                        </div>

                        {/* Geographic & Demographic */}
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                            <span className="text-xl">🌍</span>
                            Geographic & Demographic
                          </h3>
                          <p className="text-slate-300 text-sm">{result.socialArbitrageInsights.geographicDemographic}</p>
                        </div>

                        {/* Timing Factor */}
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                            <span className="text-xl">⏰</span>
                            Timing Factor
                          </h3>
                          <p className="text-slate-300 text-sm">{result.socialArbitrageInsights.timingFactor}</p>
                        </div>

                        {/* Platform Dynamics */}
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                            <span className="text-xl">📱</span>
                            Platform Dynamics
                          </h3>
                          <p className="text-slate-300 text-sm">{result.socialArbitrageInsights.platformDynamics}</p>
                        </div>

                        {/* Cultural Leap */}
                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 lg:col-span-2">
                          <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center gap-2">
                            <span className="text-xl">🚀</span>
                            Cultural Leap Potential
                          </h3>
                          <p className="text-slate-300 text-sm">{result.socialArbitrageInsights.culturalLeap}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Platform Analysis */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      Platform Signal Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.isArray(result.platformAnalyses) ? result.platformAnalyses.map((platform, index) => (
                        <div key={index} className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">{platform.platform}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              platform.signalStrength === 'strong' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              platform.signalStrength === 'moderate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {platform.signalStrength}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{platform.analysis}</p>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center py-8">
                          <p className="text-slate-400">Platform analysis data not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Suggestions Tab */}
              {activeTab === 'content' && (
                <div className="space-y-8">
                  
                  {/* Tweet Suggestions */}
                  {result.tweetSuggestion && (
                    <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">𝕏</span>
                        X/Twitter Content
                      </h2>
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                        <p className="text-slate-300 leading-relaxed mb-4">{result.tweetSuggestion}</p>
                        <button
                          onClick={() => copyText(result.tweetSuggestion!, 0)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                        >
                          {copiedIndex === 0 ? 'Copied!' : 'Copy Tweet'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reddit Suggestions */}
                  {(result.redditTitleSuggestion || result.redditBodySuggestion) && (
                    <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">📱</span>
                        Reddit Content
                      </h2>
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 space-y-4">
                        {result.redditTitleSuggestion && (
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
                            <p className="text-slate-300 text-sm mb-3">{result.redditTitleSuggestion}</p>
                            <button
                              onClick={() => copyText(result.redditTitleSuggestion!, 1)}
                              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm transition-colors mr-2"
                            >
                              {copiedIndex === 1 ? 'Copied!' : 'Copy Title'}
                            </button>
                          </div>
                        )}
                        {result.redditBodySuggestion && (
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Body</h3>
                            <p className="text-slate-300 text-sm mb-3">{result.redditBodySuggestion}</p>
                            <button
                              onClick={() => copyText(result.redditBodySuggestion!, 2)}
                              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm transition-colors"
                            >
                              {copiedIndex === 2 ? 'Copied!' : 'Copy Body'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Suggestions */}
                  {result.linkedinSuggestion && (
                    <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">💼</span>
                        LinkedIn Content
                      </h2>
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                        <p className="text-slate-300 leading-relaxed mb-4">{result.linkedinSuggestion}</p>
                        <button
                          onClick={() => copyText(result.linkedinSuggestion!, 3)}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white text-sm transition-colors"
                        >
                          {copiedIndex === 3 ? 'Copied!' : 'Copy Post'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trend Analysis Tab */}
              {activeTab === 'trends' && (
                <div className="space-y-8">
                  
                  {/* Trend Phase Analysis */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">📈</span>
                      Trend Phase Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { phase: 'emerging', label: 'Emerging', desc: 'Early signals, low competition' },
                        { phase: 'growing', label: 'Growing', desc: 'Rising momentum, moderate competition' },
                        { phase: 'peak', label: 'Peak', desc: 'High awareness, saturated market' },
                        { phase: 'declining', label: 'Declining', desc: 'Fading interest, oversaturation' }
                      ].map((item) => (
                        <div key={item.phase} className={`text-center p-4 rounded-2xl border ${
                          result.trendPhase === item.phase 
                            ? getTrendPhaseColor(item.phase)
                            : 'bg-slate-900/50 border-white/10'
                        }`}>
                          <div className="text-3xl mb-2">{getTrendPhaseIcon(item.phase)}</div>
                          <h3 className="font-semibold text-white mb-1">{item.label}</h3>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cultural Transfer Analysis */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">🌍</span>
                      Cultural Transfer Analysis
                    </h2>
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-purple-400 mb-2">
                          {result.culturalTransferScore ? Math.round(result.culturalTransferScore * 100) : 'N/A'}%
                        </div>
                        <p className="text-slate-400">Cultural Transfer Potential</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-400 mb-1">🌱</div>
                          <div className="text-sm text-slate-400">Micro Communities</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400 mb-1">📱</div>
                          <div className="text-sm text-slate-400">Platform Adoption</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-400 mb-1">⏰</div>
                          <div className="text-sm text-slate-400">Timing Window</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Recommendations */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Strategic Recommendations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Do's</h3>
                        <ul className="text-slate-300 text-sm space-y-2">
                          <li>• Focus on early adopter communities</li>
                          <li>• Leverage platform-specific features</li>
                          <li>• Build cultural bridge narratives</li>
                          <li>• Monitor micro-trends closely</li>
                        </ul>
                      </div>
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Don'ts</h3>
                        <ul className="text-slate-300 text-sm space-y-2">
                          <li>• Ignore cultural nuances</li>
                          <li>• Rush to mainstream too early</li>
                          <li>• Copy without adaptation</li>
                          <li>• Miss timing windows</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Try Another Idea */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-medium transition-colors"
              >
                🚀 Analyze Another Idea
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
