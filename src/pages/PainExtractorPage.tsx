import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { 
  PainExtractionResult, 
  PainExtractionRequest, 
  PainCluster, 
  PersonaType,
  PainCategory,
  UserPlan 
} from '../types';
import { painExtractorService } from '../services/painExtractorService';

const PainExtractorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PainExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [query, setQuery] = useState('fitness app');
  const [persona, setPersona] = useState<PersonaType>('founder');
  const [timeRange, setTimeRange] = useState('1month');
  const [selectedCluster, setSelectedCluster] = useState<PainCluster | null>(null);
  const [copiedHook, setCopiedHook] = useState<string | null>(null);

  const userPlan: UserPlan = user?.plan || 'free';

  const personas = [
    { value: 'founder', label: '👨‍💼 Founder', description: 'Focus on pricing, onboarding, market fit' },
    { value: 'pm', label: '📊 Product Manager', description: 'Focus on features, UX, user feedback' },
    { value: 'dev', label: '👩‍💻 Developer', description: 'Focus on integration, performance, docs' },
    { value: 'vc', label: '💰 Investor', description: 'Focus on market signals, scalability' }
  ];

  const timeRanges = [
    { value: '1week', label: 'Last 7 days' },
    { value: '2weeks', label: 'Last 14 days' },
    { value: '1month', label: 'Last 30 days' },
    { value: '3months', label: 'Last 90 days' }
  ];

  useEffect(() => {
    // Auto-extract for demo
    if (query && persona && !result && !isLoading) {
      extractPains();
    }
  }, [query, persona]);

  const extractPains = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (timeRange === '1week') startDate.setDate(endDate.getDate() - 7);
      else if (timeRange === '2weeks') startDate.setDate(endDate.getDate() - 14);
      else if (timeRange === '1month') startDate.setDate(endDate.getDate() - 30);
      else startDate.setDate(endDate.getDate() - 90);

      const request: PainExtractionRequest = {
        query: query.trim(),
        persona,
        time_range: {
          from: startDate.toISOString(),
          to: endDate.toISOString()
        },
        language: 'en',
        user_plan: userPlan
      };

      console.log('🔍 Extracting pain patterns...', request);
      const painResult = await painExtractorService.extractPainPatterns(request);
      setResult(painResult);
      
    } catch (err) {
      console.error('Error extracting pains:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract pain patterns');
    } finally {
      setIsLoading(false);
    }
  };

  const copyHook = async (hook: string, hookId: string) => {
    try {
      await navigator.clipboard.writeText(hook);
      setCopiedHook(hookId);
      setTimeout(() => setCopiedHook(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPainScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (score >= 60) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-green-400 bg-green-500/20 border-green-500/30';
  };

  const getOppScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (score >= 40) return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  const getCategoryIcon = (category: PainCategory) => {
    const icons = {
      Functional: '⚙️',
      Integration: '🔗',
      Performance: '⚡',
      UX: '🎨',
      Onboarding: '🚀',
      Pricing: '💰',
      Docs: '📚',
      Security: '🔒'
    };
    return icons[category] || '❓';
  };

  const getPersonaIcon = (personaType: PersonaType) => {
    const icons = {
      founder: '👨‍💼',
      pm: '📊',
      dev: '👩‍💻',
      vc: '💰'
    };
    return icons[personaType];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">🔍</div>
            <h1 className="text-4xl font-bold mb-4">Extracting Pain Patterns</h1>
            <p className="text-xl text-gray-400">
              Analyzing {query} pain points for {persona}s across 7 platforms...
            </p>
            <div className="mt-6 inline-block px-4 py-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
              🎯 Persona-focused analysis
            </div>
          </div>
          
          {/* Loading skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
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
        title="ICP Pain Extractor | Validationly"
        description="Extract and analyze customer pain points by persona - optimize for your ideal customer profile"
        keywords="customer pain points, ICP analysis, persona insights, pain extraction, customer research"
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              ICP Pain Extractor
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Extract persona-specific pain patterns and generate actionable copy hooks
            </p>
            
            {/* Form Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your product/service..."
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50 min-w-[200px]"
              />
              
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value as PersonaType)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
                aria-label="Select persona"
              >
                {personas.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
                aria-label="Select time range"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              <button
                onClick={extractPains}
                disabled={isLoading || !query.trim()}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                Extract Pains
              </button>
            </div>

            {/* Persona Info */}
            <div className="inline-block px-4 py-2 bg-gray-800/50 rounded-full border border-white/10 text-sm text-gray-300">
              {getPersonaIcon(persona)} {personas.find(p => p.value === persona)?.description}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="text-red-400 text-xl mb-2">⚠️</div>
                <h3 className="text-red-400 font-semibold mb-2">Extraction Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Pain Results */}
          {result && (
            <div className="space-y-8">
              
              {/* Summary Header */}
              <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{result.query}</div>
                    <div className="text-gray-400">Target Product</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{getPersonaIcon(result.persona)}</div>
                    <div className="text-gray-400">Persona: {result.persona.toUpperCase()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{result.pain_clusters.length}</div>
                    <div className="text-gray-400">Pain Clusters Found</div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-400 mb-2">Confidence: {Math.round(result.summary.confidence * 100)}%</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {result.filters?.taxonomy.map((tax, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                        {getCategoryIcon(tax)} {tax}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Pain Summary */}
              {result.summary.top_pains.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    🎯 Top Pain Points
                    <span className="ml-3 text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                      {result.persona.toUpperCase()} Weighted
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {result.summary.top_pains.map((pain, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-red-400">#{index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium border ${getPainScoreColor(pain.pain_score)}`}>
                              {Math.round(pain.pain_score)} Pain
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium border ${getOppScoreColor(pain.opp_score)}`}>
                              {Math.round(pain.opp_score)} Opp
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-3">{pain.label}</h3>

                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Why it matters:</div>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {pain.why.map((reason, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-red-400 mt-1">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="text-sm text-gray-400 mb-1">Quick wins:</div>
                            <ul className="text-sm text-green-300 space-y-1">
                              {pain.quick_wins.map((win, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-green-400 mt-1">✓</span>
                                  <span>{win}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Copy hooks:</div>
                          <div className="space-y-2">
                            {pain.copy_hooks.map((hook, i) => (
                              <div key={i} className="bg-gray-700/30 rounded p-2 text-sm">
                                <div className="flex items-start justify-between">
                                  <span className="text-orange-300 italic">"{hook}"</span>
                                  <button
                                    onClick={() => copyHook(hook, `${index}-${i}`)}
                                    className="ml-2 px-2 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs font-medium transition-colors"
                                  >
                                    {copiedHook === `${index}-${i}` ? 'Copied!' : 'Copy'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Pain Clusters */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🔍 Detailed Pain Analysis</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {result.pain_clusters.map((cluster, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{getCategoryIcon(cluster.taxonomy[0])}</span>
                            <h3 className="text-xl font-bold text-white">{cluster.label}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Category: <strong className="text-white">{cluster.taxonomy[0]}</strong></span>
                            <span>Pain Score: <strong className="text-red-400">{cluster.metrics.pain_score}</strong></span>
                            <span>Opp Score: <strong className="text-green-400">{cluster.metrics.opp_score}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Pain Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="text-sm font-bold text-blue-400">{Math.round(cluster.metrics.freq * 100)}%</div>
                          <div className="text-xs text-gray-400">Frequency</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="text-sm font-bold text-red-400">{Math.round(cluster.metrics.sev * 100)}%</div>
                          <div className="text-xs text-gray-400">Severity</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="text-sm font-bold text-orange-400">{Math.round(cluster.metrics.urg * 100)}%</div>
                          <div className="text-xs text-gray-400">Urgency</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="text-sm font-bold text-purple-400">{Math.round(cluster.metrics.imp * 100)}%</div>
                          <div className="text-xs text-gray-400">Impact</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="text-sm font-bold text-green-400">{Math.round(cluster.metrics.addr * 100)}%</div>
                          <div className="text-xs text-gray-400">Addressable</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="text-sm font-bold text-yellow-400">{Math.round(cluster.metrics.comp_gap * 100)}%</div>
                          <div className="text-xs text-gray-400">Comp Gap</div>
                        </div>
                      </div>

                      {/* Intent Breakdown */}
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">Intent Breakdown:</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                            {Math.round(cluster.intent_breakdown.complaint * 100)}% Complaints
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                            {Math.round(cluster.intent_breakdown.feature_request * 100)}% Feature Requests
                          </span>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                            {Math.round(cluster.intent_breakdown.question * 100)}% Questions
                          </span>
                        </div>
                      </div>

                      {/* Representative Quotes */}
                      {cluster.representative_quotes.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-2">Representative Quotes:</div>
                          <div className="space-y-2">
                            {cluster.representative_quotes.slice(0, 2).map((quote, i) => (
                              <div key={i} className="bg-gray-700/30 rounded p-3 text-sm">
                                <div className="flex items-start space-x-2">
                                  <span className="text-blue-400 mt-1">💬</span>
                                  <div className="flex-1">
                                    <p className="text-gray-300 italic">"{quote.text}"</p>
                                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                      <span>{quote.platform}</span>
                                      <span>•</span>
                                      <span className={quote.sentiment === 'negative' ? 'text-red-400' : quote.sentiment === 'positive' ? 'text-green-400' : 'text-gray-400'}>
                                        {quote.sentiment}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actionable Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-green-400 font-medium mb-2">💡 MVP Features</div>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {cluster.actions.mvp_features.slice(0, 2).map((feature, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm text-blue-400 font-medium mb-2">📈 GTM Strategy</div>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {cluster.actions.gtm.slice(0, 2).map((strategy, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>{strategy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm text-purple-400 font-medium mb-2">📊 Success Metrics</div>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {cluster.actions.success_metrics.slice(0, 2).map((metric, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Posts */}
              {result.social_posts && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">📱 Social Post Suggestions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">🐦</span>
                        <h3 className="text-lg font-bold text-white">Twitter</h3>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-300 mb-3">
                        {result.social_posts.twitter.text}
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        {result.social_posts.twitter.text.length}/280 characters
                      </div>
                      <button
                        onClick={() => copyHook(result.social_posts.twitter.text, 'twitter')}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                      >
                        {copiedHook === 'twitter' ? 'Copied!' : 'Copy Tweet'}
                      </button>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">📱</span>
                        <h3 className="text-lg font-bold text-white">Reddit</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Title:</div>
                          <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-300">
                            {result.social_posts.reddit.title}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Body:</div>
                          <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap">
                            {result.social_posts.reddit.body}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => copyHook(`${result.social_posts.reddit.title}\n\n${result.social_posts.reddit.body}`, 'reddit')}
                        className="w-full mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
                      >
                        {copiedHook === 'reddit' ? 'Copied!' : 'Copy Reddit Post'}
                      </button>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">💼</span>
                        <h3 className="text-lg font-bold text-white">LinkedIn</h3>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-300 mb-3 whitespace-pre-wrap">
                        {result.social_posts.linkedin.text}
                        {result.social_posts.linkedin.cta && (
                          <div className="mt-2 text-blue-400">{result.social_posts.linkedin.cta}</div>
                        )}
                      </div>
                      <button
                        onClick={() => copyHook(`${result.social_posts.linkedin.text}\n\n${result.social_posts.linkedin.cta}`, 'linkedin')}
                        className="w-full px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg font-medium transition-colors"
                      >
                        {copiedHook === 'linkedin' ? 'Copied!' : 'Copy LinkedIn Post'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="text-center pt-6">
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    📄 Export PDF
                  </button>
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    📊 Export CSV
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

export default PainExtractorPage;
