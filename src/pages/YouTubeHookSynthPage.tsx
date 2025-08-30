import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { 
  HookSynthResult, 
  HookSynthRequest, 
  Hook, 
  VideoTone,
  VideoGoal,
  HookType,
  UserPlan 
} from '../types';
import { youtubeHookSynthService } from '../services/youtubeHookSynthService';
import { youtubeAnalysisService } from '../services/youtubeAnalysisService';

const YouTubeHookSynthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HookSynthResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'analyze'>('create');
  
  // Hook Creation state
  const [category, setCategory] = useState('fitness app');
  const [persona, setPersona] = useState('beginner');
  const [tone, setTone] = useState<VideoTone>('energetic');
  const [goal, setGoal] = useState<VideoGoal>('free_trial_signups');
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [copiedHook, setCopiedHook] = useState<string | null>(null);
  
  // Video Analysis state
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const userPlan: UserPlan = user?.plan || 'free';

  const tones = [
    { value: 'energetic', label: '⚡ Energetic', description: 'High energy, exciting, motivational' },
    { value: 'analytical', label: '📊 Analytical', description: 'Data-driven, logical, informative' },
    { value: 'casual', label: '😊 Casual', description: 'Friendly, conversational, relatable' },
    { value: 'authoritative', label: '👔 Authoritative', description: 'Expert, professional, credible' },
    { value: 'friendly', label: '🤝 Friendly', description: 'Warm, approachable, helpful' }
  ];

  const goals = [
    { value: 'free_trial_signups', label: '🚀 Free Trial Signups' },
    { value: 'engagement', label: '❤️ Engagement' },
    { value: 'subscriber_growth', label: '📈 Subscriber Growth' },
    { value: 'product_sales', label: '💰 Product Sales' },
    { value: 'brand_awareness', label: '🌟 Brand Awareness' }
  ];

  const hookTypeIcons = {
    question: '❓',
    bold_claim: '💥',
    curiosity_gap: '🔍',
    pattern_interrupt: '⚡',
    fomo: '⏰',
    challenge: '🎯',
    authority: '👑',
    contrarian: '🔄'
  };

  // Removed auto-generation - user must click Generate Hooks button

  const generateHooks = async () => {
    if (!category.trim() || !persona.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Detect language from category input
      const detectLanguage = (text: string): string => {
        const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/;
        const turkishWords = /\b(ve|ile|için|olan|bir|bu|şu|o|uygulama|sistem|program|yazılım|platform|site|web|mobil|app|fitness|sağlık|eğitim|oyun|müzik|video|fotoğraf|sosyal|medya|iş|finans|alışveriş|yemek|seyahat|haber|spor|teknoloji)\b/i;
        
        if (turkishChars.test(text) || turkishWords.test(text)) {
          return 'tr';
        }
        return 'en';
      };

      const detectedLanguage = detectLanguage(category.trim());

      const request: HookSynthRequest = {
        category: category.trim(),
        persona: persona.trim(),
        tone,
        goal,
        language: detectedLanguage,
        user_plan: userPlan
      };

      console.log('🎬 Generating YouTube hooks...', request);
      const hookResult = await youtubeHookSynthService.generateHooks(request);
      setResult(hookResult);
      
    } catch (err) {
      console.error('Error generating hooks:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate hooks');
    } finally {
      setIsLoading(false);
    }
  };

  const copyHook = async (content: string, hookId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedHook(hookId);
      setTimeout(() => setCopiedHook(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const analyzeVideo = async () => {
    if (!videoUrl.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      console.log('🔍 Analyzing YouTube video...', videoUrl);
      const analysis = await youtubeAnalysisService.analyzeVideo(videoUrl);
      setAnalysisResult(analysis);
      
      // Auto-populate hook creation form with insights
      if (analysis.title_analysis.key_words.length > 0) {
        setCategory(analysis.title_analysis.key_words[0]);
      }
      
    } catch (err) {
      console.error('Error analyzing video:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze video');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCompetitive = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const request: HookSynthRequest = {
        category: category.trim(),
        persona: persona.trim(),
        tone,
        goal,
        user_plan: userPlan
      };
      
      console.log('🔍 Analyzing competitive videos...', request);
      const analyses = await youtubeAnalysisService.analyzeCompetitiveVideos(request);
      setAnalysisResult({ competitive_videos: analyses });
      
    } catch (err) {
      console.error('Error analyzing competitive videos:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze competitive videos');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getHookScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getHookTypeColor = (hookType: HookType) => {
    const colors = {
      question: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      bold_claim: 'bg-red-500/20 text-red-400 border-red-500/30',
      curiosity_gap: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      pattern_interrupt: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      fomo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      challenge: 'bg-green-500/20 text-green-400 border-green-500/30',
      authority: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      contrarian: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[hookType] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">🎬</div>
            <h1 className="text-4xl font-bold mb-4">Generating YouTube Hooks</h1>
            <p className="text-xl text-gray-400">
              Creating {userPlan === 'premium' ? '20' : userPlan === 'pro' ? '15' : '10'} optimized hooks for {category}...
            </p>
            <div className="mt-6 inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              🎯 {tone} tone • {goal.replace('_', ' ')}
            </div>
          </div>
          
          {/* Loading skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
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
        title="YouTube Hook Synth | Validationly"
        description="Generate high-converting YouTube video hooks with visual planning and A/B test optimization"
        keywords="YouTube hooks, video retention, CTR optimization, visual planning, A/B testing, video marketing"
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
              YouTube Hook Synth
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Create hooks & analyze videos - Your complete YouTube optimization suite
            </p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 rounded-2xl p-2 border border-white/10">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'create'
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🎬 Create Hooks
                </button>
                <button
                  onClick={() => setActiveTab('analyze')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'analyze'
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🔍 Analyze Videos
                </button>
              </div>
            </div>
            
            {/* Create Hooks Tab Content */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
                  <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (e.g. fitness app)"
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
              />
              
              <input
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="Persona (e.g. beginner)"
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
              />
              
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as VideoTone)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
                aria-label="Select tone"
              >
                {tones.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as VideoGoal)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/50"
                aria-label="Select goal"
              >
                {goals.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
                </div>

                <div className="text-center">
                  <button
                    onClick={generateHooks}
                    disabled={isLoading || !category.trim() || !persona.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    🎬 Generate Hooks
                  </button>

                  {/* Plan Info */}
                  <div className="mt-4 text-sm text-gray-400">
                    {userPlan === 'premium' && '💎 Premium: 20 hooks + visual planning + A/B tests'}
                    {userPlan === 'pro' && '⚡ Pro: 15 hooks + visual planning'}
                    {userPlan === 'free' && '🆓 Free: 10 hooks'}
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Videos Tab Content */}
            {activeTab === 'analyze' && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Video URL Input */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    🔍 Analyze Single Video
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 bg-gray-700/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
                    />
                    <button
                      onClick={analyzeVideo}
                      disabled={isAnalyzing || !videoUrl.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze'}
                    </button>
                  </div>
                </div>

                {/* Competitive Analysis */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    📊 Competitive Analysis
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Analyze top-performing videos in your category to discover successful patterns
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Category (e.g. fitness app)"
                      className="bg-gray-700/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <input
                      type="text"
                      value={persona}
                      onChange={(e) => setPersona(e.target.value)}
                      placeholder="Target persona"
                      className="bg-gray-700/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={analyzeCompetitive}
                      disabled={isAnalyzing || !category.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? '🔄 Analyzing...' : '📊 Analyze Category'}
                    </button>
                  </div>
                </div>

                {/* Analysis Results */}
                {analysisResult && (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      📈 Analysis Results
                    </h3>
                    
                    {/* Single Video Analysis */}
                    {analysisResult.video && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <img 
                            src={analysisResult.video.thumbnail} 
                            alt="Video thumbnail"
                            className="w-32 h-18 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-2">{analysisResult.video.title}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Performance:</span>
                                <div className="text-lg font-bold text-green-400">{analysisResult.performance_score}/100</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Engagement:</span>
                                <div className="text-lg font-bold text-blue-400">{analysisResult.engagement_rate}%</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Views:</span>
                                <div className="text-lg font-bold text-purple-400">
                                  {analysisResult.video.statistics.viewCount.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Hook Type:</span>
                                <div className="text-lg font-bold text-yellow-400">{analysisResult.title_analysis.hook_type}</div>
                              </div>
                            </div>
                            
                            {/* Extracted Hooks */}
                            <div className="mt-4">
                              <span className="text-gray-400 text-sm">Extracted Hooks:</span>
                              <div className="mt-2 space-y-2">
                                {analysisResult.hooks.map((hook: string, i: number) => (
                                  <div key={i} className="bg-gray-700/30 rounded p-2 text-sm text-gray-300">
                                    "{hook}"
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Competitive Analysis Results */}
                    {analysisResult.competitive_videos && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-white">Top Performing Videos:</h4>
                        {analysisResult.competitive_videos.slice(0, 5).map((analysis: any, i: number) => (
                          <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <img 
                                src={analysis.video.thumbnail} 
                                alt="Video thumbnail"
                                className="w-24 h-14 rounded object-cover"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-white text-sm mb-1">{analysis.video.title}</h5>
                                <div className="flex gap-4 text-xs text-gray-400">
                                  <span>Score: {analysis.performance_score}/100</span>
                                  <span>Views: {analysis.video.statistics.viewCount.toLocaleString()}</span>
                                  <span>Type: {analysis.title_analysis.hook_type}</span>
                                </div>
                                <div className="mt-2">
                                  <button
                                    onClick={() => copyHook(analysis.video.title, `competitive-${i}`)}
                                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                  >
                                    {copiedHook === `competitive-${i}` ? '✓ Copied' : 'Copy Title'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Analysis Error */}
                {analysisError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                    <div className="text-red-400 text-xl mb-2">⚠️</div>
                    <h3 className="text-red-400 font-semibold mb-2">Analysis Error</h3>
                    <p className="text-red-300">{analysisError}</p>
                  </div>
                )}
              </div>
            )}
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

          {/* Hook Results */}
          {result && (
            <div className="space-y-8">
              
              {/* Summary Header */}
              <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">{result.brief.category}</div>
                    <div className="text-gray-400">Category</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{result.brief.persona}</div>
                    <div className="text-gray-400">Persona</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {tones.find(t => t.value === result.brief.tone)?.label.split(' ')[0]}
                    </div>
                    <div className="text-gray-400">Tone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">{result.hooks.length}</div>
                    <div className="text-gray-400">Generated Hooks</div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-400 mb-2">
                    Avg Score: {Math.round(result.hooks.reduce((acc, h) => acc + h.hook_score, 0) / result.hooks.length)}
                  </div>
                  <div className="text-xs text-gray-500">
                    All hooks optimized for ≤9s duration with visual planning
                  </div>
                </div>
              </div>

              {/* Generated Hooks */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  🎬 Generated Hooks
                  <span className="ml-3 text-sm bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">
                    Ranked by HookScore
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {result.hooks.map((hook, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getHookTypeColor(hook.type)}`}>
                              {hookTypeIcons[hook.type]} {hook.type.replace('_', ' ')}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getHookScoreColor(hook.hook_score)}`}>
                              {hook.hook_score} Score
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Duration: <strong className="text-white">{hook.duration_sec}s</strong></span>
                            <span>Variants: <strong className="text-blue-400">{hook.variants.length}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Hook Text */}
                      <div className="mb-4">
                        <div className="text-lg font-bold text-white mb-2 p-4 bg-gray-700/30 rounded-lg border-l-4 border-purple-500">
                          "{hook.text}"
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            Reading time: ~{hook.duration_sec} seconds
                          </div>
                          <button
                            onClick={() => copyHook(hook.text, `hook-${index}`)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                          >
                            {copiedHook === `hook-${index}` ? 'Copied!' : 'Copy Hook'}
                          </button>
                        </div>
                      </div>

                      {/* Visual Plan */}
                      <div className="mb-4">
                        <div className="text-sm text-blue-400 font-medium mb-2">🎥 Visual Plan</div>
                        <div className="space-y-2">
                          {hook.visual_plan.map((plan, i) => (
                            <div key={i} className="bg-gray-700/30 rounded p-3 text-sm">
                              <div className="flex items-start space-x-3">
                                <span className="text-blue-400 font-mono text-xs bg-blue-500/20 px-2 py-1 rounded">
                                  {plan.t}s
                                </span>
                                <div className="flex-1">
                                  <div className="text-gray-300 mb-1">{plan.shot}</div>
                                  {plan.overlay && (
                                    <div className="text-yellow-400 text-xs">
                                      Overlay: "{plan.overlay}"
                                    </div>
                                  )}
                                  {plan.sfx && (
                                    <div className="text-green-400 text-xs">
                                      SFX: {plan.sfx}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hook Variants */}
                      {hook.variants.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-2">🔄 Variants</div>
                          <div className="space-y-2">
                            {hook.variants.map((variant, i) => (
                              <div key={i} className="bg-gray-700/20 rounded p-2 text-sm text-gray-300">
                                <div className="flex items-center justify-between">
                                  <span>"{variant}"</span>
                                  <button
                                    onClick={() => copyHook(variant, `variant-${index}-${i}`)}
                                    className="ml-2 px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium transition-colors"
                                  >
                                    {copiedHook === `variant-${index}-${i}` ? '✓' : 'Copy'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Score Reasons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-green-400 font-medium mb-2">✅ Score Reasons</div>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {hook.reasons.map((reason, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedHook(hook)}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                          >
                            📋 View Full Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* A/B Test Pack */}
              {result.ab_test_pack && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">🧪 A/B Test Pack</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        📝 Test Titles
                      </h3>
                      <div className="space-y-3">
                        {result.ab_test_pack.titles.map((title, i) => (
                          <div key={i} className="bg-gray-700/30 rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 flex-1">"{title}"</span>
                              <button
                                onClick={() => copyHook(title, `title-${i}`)}
                                className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                              >
                                {copiedHook === `title-${i}` ? '✓' : 'Copy'}
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {title.length}/100 characters
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        🎨 AI Thumbnail Designs
                      </h3>
                      <div className="space-y-4">
                        {result.ab_test_pack.thumbnail_designs.map((design, i) => (
                          <div key={i} className="bg-gray-700/30 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-purple-600 rounded text-xs font-bold">
                                  {design.style.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className="text-gray-400 text-sm">#{design.id}</span>
                              </div>
                              <button
                                onClick={() => copyHook(design.prompt, `design-${i}`)}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
                              >
                                {copiedHook === `design-${i}` ? '✓' : 'Copy Prompt'}
                              </button>
                            </div>
                            
                            {/* Design Elements */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Main Text</span>
                                <div className="text-white font-bold">{design.elements.main_text}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 uppercase">Expression</span>
                                <div className="text-gray-300 text-sm">{design.elements.face_expression}</div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-xs text-gray-500 uppercase">Color Scheme</span>
                              <div className="text-gray-300 text-sm">{design.elements.color_scheme}</div>
                            </div>
                            
                            {/* Performance Predictions */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-400">{design.performance_prediction.ctr_score}%</div>
                                <div className="text-xs text-gray-500">CTR Score</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-400">{design.performance_prediction.retention_score}%</div>
                                <div className="text-xs text-gray-500">Retention</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-yellow-400">{design.performance_prediction.brand_safety}%</div>
                                <div className="text-xs text-gray-500">Brand Safe</div>
                              </div>
                            </div>
                            
                            {/* Generated Image */}
                            {design.generated_url && (
                              <div className="mb-3">
                                <span className="text-xs text-gray-500 uppercase block mb-2">Generated Thumbnail</span>
                                <div className="relative bg-gray-800/50 rounded-lg overflow-hidden">
                                  <img 
                                    src={design.generated_url} 
                                    alt={`AI generated thumbnail for ${design.elements.main_text}`}
                                    className="w-full h-auto max-h-48 object-cover rounded-lg"
                                    loading="lazy"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-bold">
                                      AI Generated
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* AI Prompt */}
                            <div className="bg-gray-800/50 rounded p-3">
                              <span className="text-xs text-gray-500 uppercase block mb-1">AI Generation Prompt</span>
                              <div className="text-gray-300 text-sm">{design.prompt}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="text-center pt-6">
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    📄 Export Hooks
                  </button>
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                    🎬 Export Shotlist
                  </button>
                  {userPlan === 'premium' && (
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                      📊 A/B Test Setup
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hook Detail Modal */}
          {selectedHook && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Hook Details: {hookTypeIcons[selectedHook.type]} {selectedHook.type}
                  </h3>
                  <button
                    onClick={() => setSelectedHook(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="text-lg font-bold text-white p-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
                    "{selectedHook.text}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">🎥 Complete Visual Plan</h4>
                      <div className="space-y-3">
                        {selectedHook.visual_plan.map((plan, i) => (
                          <div key={i} className="bg-gray-700/30 rounded p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-blue-400 font-mono text-sm bg-blue-500/20 px-3 py-1 rounded">
                                {plan.t}s
                              </span>
                              <span className="text-gray-300 font-medium">Shot {i + 1}</span>
                            </div>
                            <div className="text-gray-300 mb-2">{plan.shot}</div>
                            {plan.overlay && (
                              <div className="text-yellow-400 text-sm mb-1">
                                <strong>Overlay:</strong> "{plan.overlay}"
                              </div>
                            )}
                            {plan.sfx && (
                              <div className="text-green-400 text-sm">
                                <strong>SFX:</strong> {plan.sfx}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">📊 Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-700/30 rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Hook Score</span>
                            <span className="text-white font-bold">{selectedHook.hook_score}/100</span>
                          </div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Duration</span>
                            <span className="text-white font-bold">{selectedHook.duration_sec}s</span>
                          </div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Hook Type</span>
                            <span className="text-white font-bold">{selectedHook.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-white mb-3 mt-6">✅ Success Factors</h4>
                      <div className="space-y-2">
                        {selectedHook.reasons.map((reason, i) => (
                          <div key={i} className="flex items-start space-x-2 text-sm">
                            <span className="text-green-400 mt-1">•</span>
                            <span className="text-gray-300">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back to Tools */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/tools')}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              🔧 Back to Tools
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default YouTubeHookSynthPage;
