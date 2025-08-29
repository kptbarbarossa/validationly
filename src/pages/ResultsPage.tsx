import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { PLATFORMS } from '../constants';
import { PremiumPlatformData, PremiumAnalysisResult, PremiumSocialPosts, PremiumValidationRequest } from '../types';
import { PremiumPlatformScannerService } from '../services/platformScannerService';
import { premiumAIAnalyzerService } from '../services/aiAnalyzerService';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [result, setResult] = useState<PremiumAnalysisResult | null>(null);
  const [socialPosts, setSocialPosts] = useState<PremiumSocialPosts | null>(null);
  const [activeTab, setActiveTab] = useState<'twitter' | 'reddit' | 'linkedin'>('twitter');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const idea = location.state?.idea || 'Your business idea';

  useEffect(() => {
    if (idea && idea !== 'Your business idea') {
      startPremiumAnalysis();
    } else {
      // Fallback to mock data if no idea provided
      simulatePlatformScanning();
    }
  }, [idea]);

  const startPremiumAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const scanner = new PremiumPlatformScannerService();
      
      // Create premium validation request
      const request: PremiumValidationRequest = {
        query: idea,
        max_items_per_platform: 100,
        tones_for_posts: ['professional', 'fun', 'analytical'],
        output_format: 'json'
      };

      // Scan all 7 platforms
      const platforms = await scanner.scanAllPlatforms(request);
      
      // Analyze with AI
      const analysis = await premiumAIAnalyzerService.analyzePlatforms(platforms, idea);
      
      // Generate social posts
      const posts = await premiumAIAnalyzerService.generateSocialPosts(analysis, idea);
      
      setResult(analysis);
      setSocialPosts(posts);
      
    } catch (err) {
      console.error('Error in premium analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze platforms');
      // Fallback to mock data
      simulatePlatformScanning();
    } finally {
      setIsLoading(false);
    }
  };

  const simulatePlatformScanning = async () => {
    const platforms = ['Reddit', 'Hacker News', 'Product Hunt', 'GitHub', 'Stack Overflow', 'Google News', 'YouTube'];
    
    for (let i = 0; i < platforms.length; i++) {
      setCurrentPlatform(platforms[i]);
      setScanProgress(((i + 1) / platforms.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate mock premium results
    const mockResult: PremiumAnalysisResult = {
      demand_index: 74,
      verdict: 'high',
      opportunities: [
        'High volume on GitHub indicates strong developer interest',
        'Growing Reddit discussions show community momentum',
        'Product Hunt launches suggest market readiness'
      ],
      risks: [
        'High competition on GitHub repositories',
        'Market saturation risk in some segments'
      ],
      mvp_suggestions: [
        'Provide clear API documentation and SDKs',
        'Start with core features addressing main pain points',
        'Build active community support channels'
      ],
      platforms: [
        {
          platform: 'reddit',
          summary: 'Reddit community shows strong interest in fitness apps',
          sentiment: { positive: 0.65, neutral: 0.25, negative: 0.10 },
          metrics: { volume: 45, engagement: 0.72, growth_rate: 0.28 },
          top_keywords: ['habit tracking', 'calorie counter', 'workout app'],
          representative_quotes: [
            { text: 'We need a simpler fitness API integration', sentiment: 'positive' },
            { text: 'Habit tracking is the key feature', sentiment: 'positive' }
          ]
        },
        {
          platform: 'github',
          summary: '45 fitness app repositories with 2,340 total stars',
          sentiment: { positive: 0.58, neutral: 0.32, negative: 0.10 },
          metrics: { volume: 45, engagement: 0.65, growth_rate: 0.22 },
          top_keywords: ['fitness', 'health', 'tracking', 'api', 'mobile'],
          representative_quotes: [
            { text: 'fitness-tracker-app', sentiment: 'positive' },
            { text: 'health-monitoring-tool', sentiment: 'positive' }
          ]
        },
        {
          platform: 'producthunt',
          summary: '12 fitness app-related products launched on Product Hunt',
          sentiment: { positive: 0.70, neutral: 0.20, negative: 0.10 },
          metrics: { volume: 12, engagement: 0.78, growth_rate: 0.35 },
          top_keywords: ['fitness', 'health', 'wellness', 'app'],
          representative_quotes: [
            { text: 'FitFlow - Smart Fitness Tracking', sentiment: 'positive' },
            { text: 'HealthSync - Wellness Platform', sentiment: 'positive' }
          ]
        },
        {
          platform: 'stackoverflow',
          summary: '67 fitness app questions on Stack Overflow',
          sentiment: { positive: 0.45, neutral: 0.45, negative: 0.10 },
          metrics: { volume: 67, engagement: 0.55, growth_rate: 0.18 },
          top_keywords: ['fitness', 'app', 'development', 'api', 'integration'],
          representative_quotes: [
            { text: 'How to implement fitness tracking in React Native?', sentiment: 'neutral' },
            { text: 'Best practices for fitness app data sync', sentiment: 'positive' }
          ]
        },
        {
          platform: 'hackernews',
          summary: 'HN developers discussing fitness apps with 23 relevant stories',
          sentiment: { positive: 0.52, neutral: 0.38, negative: 0.10 },
          metrics: { volume: 23, engagement: 0.62, growth_rate: 0.25 },
          top_keywords: ['fitness', 'health', 'technology', 'startup'],
          representative_quotes: [
            { text: 'Show HN: Fitness tracking app built with Flutter', sentiment: 'positive' },
            { text: 'The future of health technology', sentiment: 'neutral' }
          ]
        },
        {
          platform: 'googlenews',
          summary: '34 recent news articles about fitness apps',
          sentiment: { positive: 0.60, neutral: 0.30, negative: 0.10 },
          metrics: { volume: 34, engagement: 0.68, growth_rate: 0.30 },
          top_keywords: ['fitness', 'health', 'technology', 'startup', 'innovation'],
          representative_quotes: [
            { text: 'Fitness App Market Expected to Reach $120B by 2025', sentiment: 'positive' },
            { text: 'New AI-powered fitness tracking solutions', sentiment: 'positive' }
          ]
        },
        {
          platform: 'youtube',
          summary: '28 fitness app videos with 156,000 total views',
          sentiment: { positive: 0.68, neutral: 0.22, negative: 0.10 },
          metrics: { volume: 28, engagement: 0.75, growth_rate: 0.32 },
          top_keywords: ['fitness app', 'workout app', 'health app', 'review'],
          representative_quotes: [
            { text: 'Top 10 Fitness Apps 2024', sentiment: 'positive' },
            { text: 'Fitness App Development Tutorial', sentiment: 'positive' }
          ]
        }
      ]
    };

    setResult(mockResult);
    
    // Generate mock social posts
    const mockPosts: PremiumSocialPosts = {
      twitter: {
        tone: 'analytical',
        text: '🚀 Fitness app analysis: 74/100 demand index\n\nHigh volume on GitHub indicates strong developer interest\n\n#startup #validation #marketresearch'
      },
      reddit: {
        title: 'Market analysis for "fitness app" - 74/100 demand index',
        body: '**Demand Index:** 74/100 (high)\n\n**Top Opportunities:**\n• High volume on GitHub indicates strong developer interest\n• Growing Reddit discussions show community momentum\n• Product Hunt launches suggest market readiness\n\n**Key Risks:**\n• High competition on GitHub repositories\n• Market saturation risk in some segments\n\n**Platform Activity:**\n• GitHub: 45 repos, 65% engagement\n• Reddit: 45 discussions, 72% engagement\n• Product Hunt: 12 launches, 78% engagement\n• Stack Overflow: 67 questions, 55% engagement\n\nWhat do you think about this market opportunity?'
      },
      linkedin: {
        tone: 'professional',
        text: '📊 Market validation analysis for "fitness app"\n\n**Demand Index:** 74/100\n**Verdict:** High market demand\n\n**Key Insights:**\n• High volume on GitHub indicates strong developer interest\n• User needs are clearly identified\n\n**Platform Activity:** 7 platforms analyzed\n• GitHub: 45 repos\n• Reddit: 45 discussions\n• Product Hunt: 12 launches\n\nThis analysis shows strong market opportunity for fitness apps.',
        cta: 'What\'s your take on this market opportunity?'
      }
    };

    setSocialPosts(mockPosts);
    setIsLoading(false);
  };

  const getSentimentColor = (sentiment: { positive: number; neutral: number; negative: number }) => {
    const { positive, negative } = sentiment;
    if (positive > 0.6) return 'text-green-400';
    if (negative > 0.4) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentIcon = (sentiment: { positive: number; neutral: number; negative: number }) => {
    const { positive, negative } = sentiment;
    if (positive > 0.6) return '😊';
    if (negative > 0.4) return '😡';
    return '😐';
  };

  const getDemandColor = (verdict: string) => {
    switch (verdict) {
      case 'high': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDemandText = (verdict: string) => {
    switch (verdict) {
      case 'high': return '🔥 High';
      case 'medium': return '🌿 Medium';
      case 'low': return '❄️ Low';
      default: return '❓ Unknown';
    }
  };

  const handleShare = async (platform: string, content: string) => {
    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
      window.open(twitterUrl, '_blank');
    } else {
      try {
        await navigator.clipboard.writeText(content);
        alert('Content copied to clipboard!');
      } catch (err) {
        console.error('Copy error:', err);
      }
    }
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    alert(`${format.toUpperCase()} report downloading...`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">🔍</div>
            <h1 className="text-4xl font-bold mb-4">
              {idea && idea !== 'Your business idea' ? 'Premium Analysis Running' : 'Platforms Scanning'}
            </h1>
            <p className="text-xl text-gray-400">
              {idea && idea !== 'Your business idea' 
                ? 'Analyzing 7 premium platforms with AI...' 
                : 'Analyzing data across platforms...'
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-800 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">
                {currentPlatform ? `${currentPlatform} analyzing...` : 'Preparing...'}
              </span>
              <span className="ml-2 text-blue-400 font-semibold">{Math.round(scanProgress)}%</span>
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold mb-4">Analysis Not Found</h1>
          <p className="text-gray-400 mb-8">Please start a new analysis from the home page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const filteredPlatforms = filterPlatform === 'all' 
    ? result.platforms 
    : result.platforms.filter(p => p.platform === filterPlatform);

  return (
    <>
      <SEOHead
        title={`Premium Analysis Results | Validationly`}
        description="7-platform premium analysis with AI insights - startup validation"
        keywords="startup validation, platform analysis, market research, AI insights, premium"
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Premium Platform Analysis
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              "{idea}" - 7 Premium Platforms Analyzed with AI
            </p>
            {idea && idea !== 'Your business idea' && (
              <div className="mt-4 inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                ✅ Real Backend APIs Connected
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="text-red-400 text-xl mb-2">⚠️</div>
                <h3 className="text-red-400 font-semibold mb-2">Analysis Error</h3>
                <p className="text-red-300">{error}</p>
                <p className="text-sm text-red-400 mt-2">Using mock data for demonstration</p>
              </div>
            </div>
          )}

          {/* General Analysis */}
          <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">AI Analysis Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="text-sm text-gray-400">Demand Index</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDemandColor(result.verdict)}`}>
                        {getDemandText(result.verdict)} ({result.demand_index}/100)
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-300 leading-relaxed">
                    <strong>Verdict:</strong> {result.verdict.charAt(0).toUpperCase() + result.verdict.slice(1)} market demand detected across {result.platforms.length} platforms.
                  </div>
                </div>
              </div>
               
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">💡 Opportunities</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {result.opportunities.slice(0, 3).map((opp, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-medium mb-2">⚠️ Risks</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {result.risks.slice(0, 2).map((risk, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MVP Suggestions */}
          <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 MVP Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.mvp_suggestions.map((suggestion, i) => (
                <div key={i} className="bg-gray-700/50 rounded-xl p-4 border border-white/10">
                  <div className="text-blue-400 mb-2">💡</div>
                  <p className="text-gray-300 text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                aria-label="Filter platforms"
              >
                <option value="all">All 7 Platforms</option>
                {result.platforms.map(p => (
                  <option key={p.platform} value={p.platform}>
                    {PLATFORMS.find(pl => pl.name === p.platform)?.displayName || p.platform}
                  </option>
                ))}
              </select>
            </div>
             
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportReport('pdf')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
              >
                📄 PDF Export
              </button>
              <button
                onClick={() => exportReport('csv')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
              >
                📊 CSV Export
              </button>
            </div>
          </div>

          {/* Platform Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredPlatforms.map((platform, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                        {PLATFORMS.find(p => p.name === platform.platform)?.icon || '📱'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {PLATFORMS.find(p => p.name === platform.platform)?.displayName || platform.platform}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={getSentimentColor(platform.sentiment)}>
                            {getSentimentIcon(platform.sentiment)}
                          </span>
                          <span className="text-blue-400 font-medium">
                            {Math.round(platform.metrics.engagement * 100)}% engagement
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {platform.summary}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-green-400">{platform.metrics.volume}</div>
                      <div className="text-gray-400">Volume</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{Math.round(platform.metrics.engagement * 100)}%</div>
                      <div className="text-gray-400">Engagement</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">{Math.round(platform.metrics.growth_rate * 100)}%</div>
                      <div className="text-gray-400">Growth</div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {platform.top_keywords.slice(0, 4).map((keyword, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* Representative Quotes */}
                  {platform.representative_quotes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Top Content:</div>
                      <div className="space-y-2">
                        {platform.representative_quotes.slice(0, 2).map((quote, i) => (
                          <div key={i} className="text-xs text-gray-300 bg-gray-700/30 rounded p-2">
                            "{quote.text}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Post Suggestions */}
          {socialPosts && (
            <div className="bg-gray-800/50 backdrop-blur rounded-3xl border border-white/10 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">📌 AI-Generated Social Posts</h2>
                 
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-700/50 rounded-lg p-1">
                  {['twitter', 'reddit', 'linkedin'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                      }`}
                    >
                      {tab === 'twitter' ? '🐦 Twitter' : tab === 'reddit' ? '📱 Reddit' : '💼 LinkedIn'}
                    </button>
                  ))}
                </div>

                {/* Post Content */}
                <div className="space-y-4">
                  {activeTab === 'twitter' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Tweet</label>
                      <div className="bg-gray-900/50 border border-white/20 rounded-lg p-3 text-white">
                        {socialPosts.twitter.text}
                      </div>
                      <div className="text-right mt-2">
                        <span className="text-sm text-gray-400">
                          {socialPosts.twitter.text.length}/280 characters
                        </span>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleShare('twitter', socialPosts.twitter.text)}
                          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-all transform hover:scale-105"
                        >
                          🐦 Tweet
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reddit' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                      <div className="bg-gray-900/50 border border-white/20 rounded-lg p-3 text-white mb-3">
                        {socialPosts.reddit.title}
                      </div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Body</label>
                      <div className="bg-gray-900/50 border border-white/20 rounded-lg p-3 text-white whitespace-pre-wrap mb-3">
                        {socialPosts.reddit.body}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleShare('reddit', `${socialPosts.reddit.title}\n\n${socialPosts.reddit.body}`)}
                          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-all transform hover:scale-105"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'linkedin' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Post</label>
                      <div className="bg-gray-900/50 border border-white/20 rounded-lg p-3 text-white whitespace-pre-wrap mb-3">
                        {socialPosts.linkedin.text}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleShare('linkedin', `${socialPosts.linkedin.text}\n\n${socialPosts.linkedin.cta}`)}
                          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-all transform hover:scale-105"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Try Another Idea */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              🚀 Analyze Another Idea
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
