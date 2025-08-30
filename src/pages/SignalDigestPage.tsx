import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { 
  WeeklyDigest, 
  WeeklyDigestRequest, 
  Signal, 
  ActionablePlay,
  UserPlan 
} from '../types';
import { signalDigestService } from '../services/signalDigestService';

const SignalDigestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [category, setCategory] = useState('AI agents');
  const [timeRange, setTimeRange] = useState('1week');
  const [selectedPlay, setSelectedPlay] = useState<ActionablePlay | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const userPlan: UserPlan = user?.plan || 'free';

  const categories = [
    'AI agents', 'DevTools', 'Fintech Infra', 'SaaS Tools', 'Web3/Crypto',
    'HealthTech', 'EdTech', 'E-commerce', 'Enterprise Software', 'Consumer Apps'
  ];

  const timeRanges = [
    { value: '1week', label: 'Last 7 days' },
    { value: '2weeks', label: 'Last 14 days' },
    { value: '1month', label: 'Last 30 days' }
  ];

  useEffect(() => {
    // Auto-generate digest for demo
    if (category && !digest && !isLoading) {
      generateDigest();
    }
  }, [category]);

  const generateDigest = async () => {
    if (!category) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (timeRange === '1week') startDate.setDate(endDate.getDate() - 7);
      else if (timeRange === '2weeks') startDate.setDate(endDate.getDate() - 14);
      else startDate.setDate(endDate.getDate() - 30);

      const request: WeeklyDigestRequest = {
        category,
        time_range: {
          from: startDate.toISOString(),
          to: endDate.toISOString()
        },
        language: 'en',
        user_plan: userPlan
      };

      console.log('🔍 Generating Signal Digest...', request);
      const result = await signalDigestService.generateWeeklyDigest(request);
      setDigest(result);
      
    } catch (err) {
      console.error('Error generating digest:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate digest');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTemplate = async (templateType: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTemplate(templateType);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getSARColor = (sar: number) => {
    if (sar >= 80) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (sar >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (sar >= 40) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-green-400 bg-green-500/20 border-green-500/30';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getEdgeTypeIcon = (edgeType: string) => {
    switch (edgeType) {
      case 'content': return '📝';
      case 'distribution': return '📢';
      case 'product': return '⚡';
      default: return '💭';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">📊</div>
            <h1 className="text-4xl font-bold mb-4">Generating Signal Digest</h1>
            <p className="text-xl text-gray-400">
              Analyzing {category} across 7 premium platforms...
            </p>
            <div className="mt-6 inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              🔍 Scanning for investor signals
            </div>
          </div>
          
          {/* Loading skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Signal Digest for Investors | Validationly"
        description="Weekly investment signals with arbitrage insights - early opportunity detection"
        keywords="investment signals, startup signals, social arbitrage, investor digest, early opportunities"
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Signal Digest for Investors
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Weekly category digest with Top 5 Signals + 3 Actionable Plays
            </p>
            
            {/* Form Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                aria-label="Select category"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                aria-label="Select time range"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              <button
                onClick={generateDigest}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                Generate Digest
              </button>
            </div>

            {/* Plan Badge */}
            <div className={`inline-block px-4 py-2 rounded-full border ${
              userPlan === 'premium' 
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                : userPlan === 'pro'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}>
              {userPlan === 'premium' && '💎 Premium Plan'}
              {userPlan === 'pro' && '⚡ Pro Plan'}
              {userPlan === 'free' && '🆓 Free Plan - Limited Features'}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="text-red-400 text-xl mb-2">⚠️</div>
                <h3 className="text-red-400 font-semibold mb-2">Generation Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Digest Results */}
          {digest && (
            <div className="space-y-8">
              
              {/* Summary Header */}
              <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{digest.category}</div>
                    <div className="text-gray-400">Category</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 inline-block px-4 py-2 rounded-full border ${getSARColor(digest.sar)}`}>
                      {digest.sar}
                    </div>
                    <div className="text-gray-400">Social Arbitrage Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{digest.horizon_days}d</div>
                    <div className="text-gray-400">Opportunity Window</div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-lg text-gray-300 mb-4">{digest.summary.one_liner}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {digest.summary.top_takeaways.map((takeaway, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                        {takeaway}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top 5 Signals */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  📊 Top 5 Signals
                  <span className="ml-3 text-sm bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">
                    Ranked by Signal Score
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {digest.top_signals.map((signal, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                            <h3 className="text-xl font-bold text-white">{signal.title}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Signal Score: <strong className="text-white">{signal.signal_score}</strong></span>
                            <span>Demand: <strong className="text-blue-400">{signal.demand_index}</strong></span>
                            <span>Platforms: <strong className="text-green-400">{signal.platforms_covered.length}</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl mb-1">{getEdgeTypeIcon(signal.arbitrage.edge_type)}</div>
                          <div className="text-xs text-gray-400">{signal.arbitrage.edge_type}</div>
                        </div>
                      </div>

                      {/* Arbitrage Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-700/30 rounded p-3 text-center">
                          <div className="text-lg font-bold text-orange-400">
                            {Math.round(signal.arbitrage.mispricing_gap * 100)}%
                          </div>
                          <div className="text-xs text-gray-400">Mispricing Gap</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-3 text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {signal.arbitrage.lag_minutes}m
                          </div>
                          <div className="text-xs text-gray-400">Cross-Platform Lag</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-3 text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {Math.round(signal.arbitrage.influencer_momentum * 100)}%
                          </div>
                          <div className="text-xs text-gray-400">Influencer Momentum</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-3 text-center">
                          <div className="text-lg font-bold text-green-400">
                            {Math.round(signal.arbitrage.confidence * 100)}%
                          </div>
                          <div className="text-xs text-gray-400">Confidence</div>
                        </div>
                      </div>

                      {/* Platform Coverage */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {signal.platforms_covered.map(platform => (
                          <span key={platform} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                            {platform}
                          </span>
                        ))}
                      </div>

                      {/* Risk Flags */}
                      {signal.risk_flags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {signal.risk_flags.map(flag => (
                            <span key={flag} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                              ⚠️ {flag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {signal.notes.length > 0 && (
                        <div className="text-sm text-gray-400">
                          <strong>Notes:</strong> {signal.notes.join('; ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Plays */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  🎯 3 Actionable Plays
                  <span className="ml-3 text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                    Investor-Focused
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {digest.plays.map((play, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">
                            {play.type === 'diligence' && '🔍'}
                            {play.type === 'sourcing' && '🎯'}
                            {play.type === 'market_making' && '📈'}
                          </span>
                          <h3 className="text-lg font-bold text-white capitalize">{play.type}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(play.urgency)}`}>
                          {play.urgency.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <span className="text-sm text-gray-400">Where:</span>
                          <p className="text-white">{play.where}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Why:</span>
                          <p className="text-gray-300">{play.why}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Action:</span>
                          <p className="text-orange-300 font-medium">{play.cta}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Window:</span>
                          <p className="text-blue-400">{play.estimated_window_hours}h</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPlay(play)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        View Templates
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="text-center pt-6">
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    📄 Export PDF
                  </button>
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    📝 Export Markdown
                  </button>
                  {userPlan === 'premium' && (
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                      📋 Export to Notion
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Play Template Modal */}
          {selectedPlay && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedPlay.type.charAt(0).toUpperCase() + selectedPlay.type.slice(1)} Templates
                  </h3>
                  <button
                    onClick={() => setSelectedPlay(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Subject</label>
                    <div className="bg-gray-900 rounded-lg p-3 text-white border border-gray-700">
                      {selectedPlay.templates.email_subject}
                    </div>
                    <button
                      onClick={() => copyTemplate('email_subject', selectedPlay.templates.email_subject)}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      {copiedTemplate === 'email_subject' ? 'Copied!' : 'Copy Subject'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Body</label>
                    <div className="bg-gray-900 rounded-lg p-3 text-white border border-gray-700 whitespace-pre-wrap">
                      {selectedPlay.templates.email_body}
                    </div>
                    <button
                      onClick={() => copyTemplate('email_body', selectedPlay.templates.email_body)}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      {copiedTemplate === 'email_body' ? 'Copied!' : 'Copy Body'}
                    </button>
                  </div>

                  {selectedPlay.templates.linkedin_message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn Message</label>
                      <div className="bg-gray-900 rounded-lg p-3 text-white border border-gray-700">
                        {selectedPlay.templates.linkedin_message}
                      </div>
                      <button
                        onClick={() => copyTemplate('linkedin', selectedPlay.templates.linkedin_message!)}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        {copiedTemplate === 'linkedin' ? 'Copied!' : 'Copy LinkedIn'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignalDigestPage;
