import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';

interface SocialArbitrageResult {
  idea: string;
  validationScore: number;
  arbitrageScore: number;
  trendAnalysis: {
    currentPhase: 'emerging' | 'growing' | 'peak' | 'declining' | 'stagnant';
    momentum: 'high' | 'medium' | 'low';
    opportunity: 'early' | 'mid' | 'late' | 'missed';
    socialSignals: {
      twitter: { trending: boolean; volume: string; sentiment: string };
      reddit: { discussionVolume: string; communityInterest: string };
      tiktok: { viralPotential: string; userReaction: string };
      googleTrends: { searchGrowth: string; trendDirection: string };
    };
  };
  arbitrageInsights: {
    timing: string;
    competitiveLandscape: string;
    marketGaps: string[];
    riskFactors: string[];
    recommendations: string[];
  };
  dataConfidence: string;
  lastAnalysis: string;
}

const SocialArbitragePage: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [useAI, setUseAI] = useState<'gemini' | 'openai' | 'groq'>('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SocialArbitrageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/social-arbitrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), useAI })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'emerging': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'growing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'peak': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'declining': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'stagnant': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'early': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'mid': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'missed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <>
      <SEOHead
        title="Social Arbitrage Analysis | Validationly"
        description="Analyze business ideas for social arbitrage opportunities using AI-powered trend analysis and market timing insights."
      />
      
      <div className="relative text-white overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -right-20 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative p-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              🚀 Social Arbitrage Analysis
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover early trend opportunities and market timing advantages using AI-powered social media trend analysis
            </p>
          </header>

          {/* Input Form */}
          <div className="max-w-4xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="mb-6">
                <label htmlFor="idea" className="block text-lg font-semibold text-white mb-3">
                  What business idea would you like to analyze?
                </label>
                <textarea
                  id="idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g., AI-powered personal diet coach app, sustainable fashion marketplace, remote team collaboration tool..."
                  className="w-full h-32 bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-3">
                  Choose AI Model
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'gemini', label: '🤖 Gemini Pro', desc: 'Google\'s latest AI model' },
                    { value: 'openai', label: '🧠 GPT-4', desc: 'OpenAI\'s advanced model' },
                    { value: 'groq', label: '⚡ Groq LLama', desc: 'Ultra-fast inference' }
                  ].map((model) => (
                    <label key={model.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="useAI"
                        value={model.value}
                        checked={useAI === model.value}
                        onChange={(e) => setUseAI(e.target.value as any)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-2xl border-2 transition-all ${
                        useAI === model.value 
                          ? 'border-purple-500/50 bg-purple-500/10' 
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}>
                        <div className="font-semibold text-white">{model.label}</div>
                        <div className="text-sm text-slate-400">{model.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !idea.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
              >
                {isLoading ? '🔍 Analyzing...' : '🚀 Analyze Social Arbitrage'}
              </button>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Score Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Validation Score */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Validation Score</h2>
                    <div className="text-4xl font-bold text-white">{result.validationScore}</div>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${result.validationScore}%` }} 
                    />
                  </div>
                  <p className="text-slate-300">
                    Current market interest and demand for your idea
                  </p>
                </div>

                {/* Arbitrage Score */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Arbitrage Score</h2>
                    <div className="text-4xl font-bold text-white">{result.arbitrageScore}</div>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${result.arbitrageScore}%` }} 
                    />
                  </div>
                  <p className="text-slate-300">
                    Early trend opportunity and timing advantage
                  </p>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">📈 Trend Analysis</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getPhaseColor(result.trendAnalysis.currentPhase)} mb-2`}>
                      {result.trendAnalysis.currentPhase.toUpperCase()}
                    </div>
                    <p className="text-slate-400 text-sm">Trend Phase</p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      result.trendAnalysis.momentum === 'high' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      result.trendAnalysis.momentum === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    } mb-2`}>
                      {result.trendAnalysis.momentum.toUpperCase()}
                    </div>
                    <p className="text-slate-400 text-sm">Momentum</p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getOpportunityColor(result.trendAnalysis.opportunity)} mb-2`}>
                      {result.trendAnalysis.opportunity.toUpperCase()}
                    </div>
                    <p className="text-slate-400 text-sm">Opportunity</p>
                  </div>
                </div>

                {/* Social Signals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">📱 Social Media Signals</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Twitter/X</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            result.trendAnalysis.socialSignals.twitter.trending ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {result.trendAnalysis.socialSignals.twitter.trending ? '🔥 Trending' : 'Normal'}
                          </span>
                          <span className="text-white text-sm">{result.trendAnalysis.socialSignals.twitter.volume}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Reddit</span>
                        <span className="text-white text-sm">{result.trendAnalysis.socialSignals.reddit.discussionVolume}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">TikTok</span>
                        <span className="text-white text-sm">{result.trendAnalysis.socialSignals.tiktok.viralPotential}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Google Trends</span>
                        <span className="text-white text-sm">{result.trendAnalysis.socialSignals.googleTrends.searchGrowth}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">🎯 Arbitrage Insights</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <div className="text-slate-400 text-sm mb-1">Timing</div>
                        <div className="text-white text-sm">{result.arbitrageInsights.timing}</div>
                      </div>
                      
                      <div className="p-3 bg-white/5 rounded-xl">
                        <div className="text-slate-400 text-sm mb-1">Competition</div>
                        <div className="text-white text-sm">{result.arbitrageInsights.competitiveLandscape}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Gaps & Risks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Gaps */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">💡 Market Gaps</h3>
                  <div className="space-y-3">
                    {result.arbitrageInsights.marketGaps.map((gap, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-white text-sm">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">⚠️ Risk Factors</h3>
                  <div className="space-y-3">
                    {result.arbitrageInsights.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-white text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold text-white mb-6">🚀 Strategic Recommendations</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {result.arbitrageInsights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-white text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Info */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10 text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                  <span>AI Model: {useAI.toUpperCase()}</span>
                  <span>•</span>
                  <span>Confidence: {result.dataConfidence}</span>
                  <span>•</span>
                  <span>Analyzed: {new Date(result.lastAnalysis).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="text-red-400 text-xl mb-2">❌</div>
                <h3 className="text-red-400 font-semibold mb-2">Analysis Failed</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SocialArbitragePage;
