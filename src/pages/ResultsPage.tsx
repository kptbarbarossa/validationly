import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

import { PLATFORMS } from '../constants';
import { 
  PremiumPlatformData, 
  PremiumAnalysisResult, 
  PremiumSocialPosts, 
  PremiumValidationRequest,
  PremiumPlatformDataWithArbitrage,
  UserPlan,
  SocialArbitrageMetrics,
  AdvancedValidationAnalysis
} from '../types';
import { PremiumPlatformScannerService } from '../services/platformScannerService';
import { premiumAIAnalyzerService } from '../services/aiAnalyzerService';
import { advancedValidationService } from '../services/advancedValidationService';
import { useAuth } from '../contexts/AuthContext';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [result, setResult] = useState<PremiumAnalysisResult | null>(null);
  const [socialPosts, setSocialPosts] = useState<PremiumSocialPosts | null>(null);
  const [platformsWithArbitrage, setPlatformsWithArbitrage] = useState<PremiumPlatformDataWithArbitrage[]>([]);
  const [activeTab, setActiveTab] = useState<'twitter' | 'reddit' | 'linkedin'>('twitter');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'arbitrage' | 'engagement'>('impact');
  const [error, setError] = useState<string | null>(null);
  const [advancedAnalysis, setAdvancedAnalysis] = useState<AdvancedValidationAnalysis | null>(null);
  const [advancedAnalysisLoading, setAdvancedAnalysisLoading] = useState(true);

  // Get query from URL search params or state
  const searchParams = new URLSearchParams(location.search);
  const queryFromUrl = searchParams.get('query') || searchParams.get('q');
  const idea = location.state?.idea || queryFromUrl || 'manevi günlük mobil uygulaması';
  const userPlan: UserPlan = user?.plan || 'free';

  // Debug logging
  console.log('🔍 ResultsPage Debug:', {
    locationState: location.state,
    queryFromUrl,
    finalIdea: idea,
    locationSearch: location.search
  });

  useEffect(() => {
    // Always use real API analysis
    startPremiumAnalysis();
    // Start advanced analysis in parallel
    startAdvancedAnalysis();
  }, [idea]);

  const startAdvancedAnalysis = async () => {
    try {
      setAdvancedAnalysisLoading(true);
      console.log('🚀 Starting advanced validation analysis...');
      
      const validQuery = (idea && idea !== 'Your business idea') ? idea : 'manevi günlük mobil uygulaması';
      const analysis = await advancedValidationService.analyzeIdea(validQuery);
      
      setAdvancedAnalysis(analysis);
      console.log('✅ Advanced analysis completed successfully');
      
    } catch (error) {
      console.error('❌ Advanced analysis failed:', error);
      // Don't set error state, just log it - advanced analysis is supplementary
    } finally {
      setAdvancedAnalysisLoading(false);
    }
  };

  const startPremiumAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate progress for better UX
      const platforms = ['Reddit', 'Hacker News', 'Product Hunt', 'GitHub', 'Stack Overflow', 'Google News', 'YouTube'];
      
      for (let i = 0; i < platforms.length; i++) {
        setCurrentPlatform(platforms[i]);
        setScanProgress(((i + 1) / platforms.length) * 80); // 80% for platform scanning
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setCurrentPlatform('AI Analysis');
      setScanProgress(90);
      
      const scanner = new PremiumPlatformScannerService();
      
      // Ensure we have a valid query
      const validQuery = (idea && idea !== 'Your business idea') ? idea : 'manevi günlük mobil uygulaması';
      const request: PremiumValidationRequest = {
        query: validQuery,
        platforms: ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'],
        time_range: '3months',
        max_items_per_platform: 100,
        language: 'en',
        tones_for_posts: ['professional', 'analytical', 'casual'],
        output_format: 'detailed'
      };

      console.log(`🚀 Starting real API analysis for: "${request.query}"`);
      console.log('📋 Full request object:', request);

      // Scan all 7 platforms with real API calls + arbitrage metrics
      console.log('🔄 Calling scanner.scanAllPlatforms with request:', request);
      const platforms_data = await scanner.scanAllPlatforms(request, userPlan);
      console.log('📊 Scanner returned platforms_data:', platforms_data.length, 'platforms');
      
      setCurrentPlatform('Generating Insights');
      setScanProgress(95);
      
      // Store platforms with arbitrage data
      setPlatformsWithArbitrage(platforms_data);
      
      // Analyze with AI (convert to basic format for compatibility)
      const basicPlatforms: PremiumPlatformData[] = platforms_data.map(p => ({
        platform: p.platform,
        summary: p.summary,
        sentiment: p.sentiment,
        metrics: p.metrics,
        top_keywords: p.top_keywords,
        representative_quotes: p.representative_quotes,
        additional_insights: p.additional_insights
      }));
      
      const analysis = await premiumAIAnalyzerService.analyzePlatforms(basicPlatforms, request.query);
      
      // Generate social posts
      const posts = await premiumAIAnalyzerService.generateSocialPosts(analysis, request.query);
      
      setScanProgress(100);
      
      setResult(analysis);
      setSocialPosts(posts);
      
      console.log('✅ Real API analysis completed successfully');
      
    } catch (err) {
      console.error('❌ Error in premium analysis:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        idea,
        userPlan,
        locationState: location.state
      });
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze platforms';
      setError(`Analysis Error: ${errorMessage}`);
      
      // Create fallback result instead of using mock function
      const fallbackResult: PremiumAnalysisResult = {
        demand_index: 50,
        verdict: 'medium',
        opportunities: ['API connection temporarily unavailable', 'Please try again later'],
        risks: ['Limited data available'],
        mvp_suggestions: ['Check internet connection and try again'],
        platforms: []
      };
      
      setResult(fallbackResult);
      setSocialPosts({
        twitter: { tone: 'analytical', text: `Analysis temporarily unavailable for "${idea}". Please try again later.` },
        reddit: { title: `Analysis for "${idea}" - Please retry`, body: 'API connection temporarily unavailable. Please try again later.' },
        linkedin: { tone: 'professional', text: `Analysis for "${idea}" temporarily unavailable.`, cta: 'Retry analysis?' }
      });
    } finally {
      setIsLoading(false);
    }
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
      case 'high': return 'High Demand';
      case 'medium': return 'Medium Demand';
      case 'low': return 'Low Demand';
      default: return 'Unknown';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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

  // Arbitrage helper functions
  const getArbitrageColor = (mispricing_gap: number) => {
    if (mispricing_gap >= 0.7) return 'text-red-400 bg-red-500/20 border-red-500/30'; // High opportunity
    if (mispricing_gap >= 0.5) return 'text-orange-400 bg-orange-500/20 border-orange-500/30'; // Medium
    if (mispricing_gap >= 0.3) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'; // Low
    return 'text-gray-400 bg-gray-500/20 border-gray-500/30'; // None
  };

  const getArbitrageText = (mispricing_gap: number) => {
    if (mispricing_gap >= 0.7) return 'High Arbitrage';
    if (mispricing_gap >= 0.5) return 'Med Arbitrage';
    if (mispricing_gap >= 0.3) return 'Low Arbitrage';
    return 'No Arbitrage';
  };

  const getEdgeTypeIcon = (edge_type: string) => {
    switch (edge_type) {
      case 'content': return '📝';
      case 'distribution': return '📢';
      case 'product': return '⚡';
      default: return '💭';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Sort platforms based on selected criteria
  const getSortedPlatforms = () => {
    const platforms = platformsWithArbitrage.length > 0 ? platformsWithArbitrage : result?.platforms || [];
    
    switch (sortBy) {
      case 'arbitrage':
        return [...platforms].sort((a, b) => {
          const aGap = a.arbitrage?.mispricing_gap || 0;
          const bGap = b.arbitrage?.mispricing_gap || 0;
          return bGap - aGap;
        });
      case 'engagement':
        return [...platforms].sort((a, b) => b.metrics.engagement - a.metrics.engagement);
      default: // impact
        return [...platforms].sort((a, b) => {
          const aScore = a.metrics.engagement * a.metrics.volume;
          const bScore = b.metrics.engagement * b.metrics.volume;
          return bScore - aScore;
        });
    }
  };

  const filteredAndSortedPlatforms = getSortedPlatforms().filter(p => 
    filterPlatform === 'all' || p.platform === filterPlatform
  );

  if (isLoading) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">🔍</div>
            <h1 className="text-4xl font-bold mb-4">
              Real-Time Platform Analysis
            </h1>
            <p className="text-xl text-gray-400">
              Connecting to 7 premium APIs and analyzing with AI...
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

  // This line is now replaced by filteredAndSortedPlatforms above

  return (
    <>
      <SEOHead
        title={`Premium Analysis Results | Validationly`}
        description="7-platform premium analysis with AI insights - startup validation"
        keywords="startup validation, platform analysis, market research, AI insights, premium"
      />

      <div className="min-h-screen text-white">
        <div className="container mx-auto px-6 py-12">
          
        {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Premium Platform Analysis
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              "{idea}" - 7 Premium Platforms Analyzed with AI
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                ✅ Real Backend APIs Connected
              </div>
              <div className={`inline-block px-4 py-2 rounded-full border ${
                userPlan === 'premium' 
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                  : userPlan === 'pro'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}>
                {userPlan === 'premium' && '💎 Premium Plan'}
                {userPlan === 'pro' && '⚡ Pro Plan'}
                {userPlan === 'free' && '🆓 Free Plan'}
              </div>
            </div>
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

          {/* Advanced Validation Analysis */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur rounded-3xl p-8 border border-purple-500/20 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                  🧠
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Advanced Strategic Analysis</h2>
                  <p className="text-purple-300 text-sm">Comprehensive 10-step validation framework</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                  AI-Powered
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                  Strategic Framework
                </div>
              </div>
            </div>

            {advancedAnalysisLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-purple-300">Conducting deep strategic analysis...</p>
                <p className="text-sm text-gray-400 mt-2">Analyzing market dynamics, competitive landscape, and validation framework</p>
              </div>
            ) : advancedAnalysis ? (
              <div className="space-y-6">
                {/* Validation Scorecard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold border ${advancedValidationService.getValidationScoreColor(advancedAnalysis.validationScorecard.validationScore)}`}>
                      {advancedAnalysis.validationScorecard.validationScore}/100
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Validation Score</p>
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${advancedValidationService.getValidationResultColor(advancedAnalysis.validationScorecard.validationResult)}`}>
                      {advancedAnalysis.validationScorecard.validationResult}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Validation Result</p>
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${advancedValidationService.getDemandResultColor(advancedAnalysis.validationScorecard.demandResult)}`}>
                      {advancedAnalysis.validationScorecard.demandResult} Demand
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Market Demand</p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    📋 Executive Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {advancedAnalysis.validationScorecard.executiveSummary}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">🎯 Biggest Opportunity</h4>
                      <p className="text-sm text-gray-300">{advancedAnalysis.validationScorecard.biggestOpportunity}</p>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-medium mb-2">⚠️ Biggest Risk</h4>
                      <p className="text-sm text-gray-300">{advancedAnalysis.validationScorecard.biggestRisk}</p>
                    </div>
                  </div>
                </div>

                {/* 10-Step Framework Cards - Exact Match with Prompt */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* 1. Problem Analysis & Deconstruction */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-blue-500/20 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Problem Analysis & Deconstruction
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-blue-400 font-medium">Core Problem:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.problemAnalysis.coreProblem}</p>
                      </div>
                      <div>
                        <span className="text-purple-400 font-medium">Job-to-be-Done:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.problemAnalysis.jobToBeDone}</p>
                      </div>
                      <div>
                        <span className="text-green-400 font-medium">Problem Severity:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.problemAnalysis.problemSeverity}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Target Audience Segmentation & Sizing */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Target Audience & Sizing
                    </h3>
                    <div className="space-y-3 text-sm">
                      {advancedAnalysis.targetAudience.primaryArchetypes.slice(0, 1).map((archetype, i) => (
                        <div key={i}>
                          <span className="text-green-400 font-medium">{archetype.name}:</span>
                          <p className="text-gray-300 mt-1">{archetype.demographics}</p>
                          <p className="text-gray-400 mt-1 text-xs">{archetype.motivations}</p>
                        </div>
                      ))}
                      <div>
                        <span className="text-yellow-400 font-medium">TAM:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.targetAudience.marketSizing.tam}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Demand Analysis & Signals */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Demand Analysis & Signals
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-yellow-400 font-medium">Demand Verdict:</span>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ml-2 ${advancedValidationService.getDemandResultColor(advancedAnalysis.demandAnalysis.demandVerdict)}`}>
                          {advancedAnalysis.demandAnalysis.demandVerdict}
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-400 font-medium">Willingness to Pay:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.demandAnalysis.willingnessToPay}</p>
                      </div>
                      <div>
                        <span className="text-purple-400 font-medium">Proxy Products:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.demandAnalysis.proxyProducts}</p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Competitive Landscape & Alternatives */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-red-500/20 text-red-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                      Competitive Landscape
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-red-400 font-medium">Direct Competitors:</span>
                        <ul className="text-gray-300 mt-1 space-y-1">
                          {advancedAnalysis.competitiveLandscape.directCompetitors.slice(0, 3).map((comp, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="text-red-400">•</span>
                              <span>{comp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-orange-400 font-medium">Non-Market Alternatives:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.competitiveLandscape.nonMarketAlternatives}</p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Differentiation Strategy & UVP */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-purple-500/20 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                      Differentiation & UVP
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-purple-400 font-medium">Core Differentiator:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.differentiation.coreDifferentiator}</p>
                      </div>
                      <div>
                        <span className="text-blue-400 font-medium">Value Proposition:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.differentiation.valueProposition}</p>
                      </div>
                      <div>
                        <span className="text-green-400 font-medium">Defensible Moat:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.differentiation.defensibleMoat}</p>
                      </div>
                    </div>
                  </div>

                  {/* 6. Foreseeable Risks & Obstacles */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-orange-500/20 text-orange-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                      Risks & Obstacles
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-red-400 font-medium">Market Risk:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.risks.marketRisk}</p>
                      </div>
                      <div>
                        <span className="text-orange-400 font-medium">Execution Risk:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.risks.executionRisk}</p>
                      </div>
                      <div>
                        <span className="text-yellow-400 font-medium">Adoption Risk:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.risks.adoptionRisk}</p>
                      </div>
                    </div>
                  </div>

                  {/* 7. Monetization & Business Model */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                      Monetization & Business Model
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-green-400 font-medium">Revenue Streams:</span>
                        <ul className="text-gray-300 mt-1 space-y-1">
                          {advancedAnalysis.monetization.revenueStreams.slice(0, 3).map((stream, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="text-green-400">•</span>
                              <span>{stream}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-yellow-400 font-medium">Pricing Hypothesis:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.monetization.pricingHypothesis}</p>
                      </div>
                    </div>
                  </div>

                  {/* 8. MVP Recommendation */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-blue-500/20 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                      MVP Recommendation
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-blue-400 font-medium">Core Features:</span>
                        <ul className="text-gray-300 mt-1 space-y-1">
                          {advancedAnalysis.mvpRecommendation.coreFeatures.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="text-blue-400">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-green-400 font-medium">User Journey:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.mvpRecommendation.userJourney}</p>
                      </div>
                    </div>
                  </div>

                  {/* 9. Scaling & Growth Strategy */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="bg-cyan-500/20 text-cyan-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                      Growth Strategy
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-cyan-400 font-medium">Early Adopter Acquisition:</span>
                        <p className="text-gray-300 mt-1">{advancedAnalysis.growthStrategy.earlyAdopterAcquisition}</p>
                      </div>
                      <div>
                        <span className="text-blue-400 font-medium">Scalable Channels:</span>
                        <ul className="text-gray-300 mt-1 space-y-1">
                          {advancedAnalysis.growthStrategy.scalableChannels.slice(0, 3).map((channel, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="text-blue-400">•</span>
                              <span>{channel}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 10th Step - Overall Validation Scorecard (Already shown above) */}
                <div className="mt-8 bg-gray-800/30 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                    <h3 className="text-xl font-semibold text-white">Overall Validation Scorecard & Executive Summary</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold border ${advancedValidationService.getValidationScoreColor(advancedAnalysis.validationScorecard.validationScore)}`}>
                        {advancedAnalysis.validationScorecard.validationScore}/100
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Validation Score</p>
                    </div>
                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${advancedValidationService.getValidationResultColor(advancedAnalysis.validationScorecard.validationResult)}`}>
                        {advancedAnalysis.validationScorecard.validationResult}
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Validation Result</p>
                    </div>
                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${advancedValidationService.getDemandResultColor(advancedAnalysis.validationScorecard.demandResult)}`}>
                        {advancedAnalysis.validationScorecard.demandResult} Demand
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Demand Analysis Result</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-2">📋 Concluding Justification</h4>
                    <p className="text-gray-300 leading-relaxed">{advancedAnalysis.validationScorecard.executiveSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h4 className="text-green-400 font-medium mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        Biggest Opportunity
                      </h4>
                      <p className="text-gray-300 text-sm">{advancedAnalysis.validationScorecard.biggestOpportunity}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="text-red-400 font-medium mb-2 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Biggest Risk
                      </h4>
                      <p className="text-gray-300 text-sm">{advancedAnalysis.validationScorecard.biggestRisk}</p>
                    </div>
                  </div>

                  {/* Additional Framework Details */}
                  <details className="mt-6">
                    <summary className="cursor-pointer text-white font-medium hover:text-purple-300 transition-colors">
                      📊 View Additional Framework Details
                    </summary>
                    <div className="mt-4 space-y-4">
                      {/* Search & Social Signals */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h5 className="text-blue-400 font-medium mb-2">🔍 Search & Social Signals (Pre-2024)</h5>
                        <p className="text-gray-300 text-sm">{advancedAnalysis.demandAnalysis.searchAndSocialSignals}</p>
                      </div>

                      {/* SWOT Analysis */}
                      {advancedAnalysis.competitiveLandscape.swotAnalysis.length > 0 && (
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h5 className="text-purple-400 font-medium mb-2">📊 SWOT Analysis</h5>
                          {advancedAnalysis.competitiveLandscape.swotAnalysis.slice(0, 1).map((swot, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-green-400 font-medium">Strengths:</span>
                                <ul className="text-gray-300 mt-1">
                                  {swot.strengths.slice(0, 2).map((strength, j) => (
                                    <li key={j} className="flex items-start space-x-2">
                                      <span className="text-green-400 mt-1">•</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <span className="text-red-400 font-medium">Weaknesses:</span>
                                <ul className="text-gray-300 mt-1">
                                  {swot.weaknesses.slice(0, 2).map((weakness, j) => (
                                    <li key={j} className="flex items-start space-x-2">
                                      <span className="text-red-400 mt-1">•</span>
                                      <span>{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Validation Metrics */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h5 className="text-cyan-400 font-medium mb-2">📈 Key Validation Metrics</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {advancedAnalysis.mvpRecommendation.validationMetrics.slice(0, 3).map((metric, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="text-cyan-400">•</span>
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Long-term Vision */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h5 className="text-purple-400 font-medium mb-2">🔮 Long-Term Vision</h5>
                        <p className="text-gray-300 text-sm">{advancedAnalysis.growthStrategy.longTermVision}</p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-xl mb-2">⚠️</div>
                <p className="text-gray-400">Advanced analysis temporarily unavailable</p>
                <p className="text-sm text-gray-500 mt-2">Platform analysis continues below</p>
              </div>
            )}
          </div>

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
                  
                  {/* Premium Arbitrage Overview */}
                  {userPlan === 'premium' && platformsWithArbitrage.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💎</span>
                      <div>
                        <div className="text-sm text-gray-400">Social Arbitrage Rating</div>
                        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium border bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {Math.round(platformsWithArbitrage.reduce((acc, p) => acc + (p.arbitrage?.mispricing_gap || 0), 0) / platformsWithArbitrage.length * 100)}/100 
                          <span className="ml-1 text-xs">avg gap</span>
              </div>
              </div>
                </div>
                  )}
                  
                  <div className="text-gray-300 leading-relaxed">
                    <strong>Verdict:</strong> {result.verdict.charAt(0).toUpperCase() + result.verdict.slice(1)} market demand detected across {result.platforms.length} platforms.
                    {userPlan === 'premium' && platformsWithArbitrage.some(p => p.arbitrage && p.arbitrage.mispricing_gap > 0.5) && (
                      <span className="block mt-2 text-purple-300">
                        <strong>Arbitrage Opportunity:</strong> High-value arbitrage gaps detected on {platformsWithArbitrage.filter(p => p.arbitrage && p.arbitrage.mispricing_gap > 0.5).length} platforms.
                      </span>
                    )}
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



          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                aria-label="Filter platforms"
              >
                <option value="all">All Platforms</option>
                {(result?.platforms || platformsWithArbitrage).map(p => (
                  <option key={p.platform} value={p.platform}>
                    {PLATFORMS.find(pl => pl.name === p.platform)?.displayName || p.platform}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'impact' | 'arbitrage' | 'engagement')}
                className="bg-gray-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                aria-label="Sort platforms"
              >
                <option value="impact">Sort by Impact</option>
                <option value="engagement">Sort by Engagement</option>
                {userPlan === 'premium' && (
                  <option value="arbitrage">Sort by Arbitrage 💎</option>
                )}
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
            {filteredAndSortedPlatforms.map((platform, index) => (
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
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDemandColor(platform.demand_verdict)}`}>
                        {getDemandText(platform.demand_verdict)}
                      </div>
                      {/* Premium Arbitrage Badge */}
                      {userPlan === 'premium' && platform.arbitrage && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getArbitrageColor(platform.arbitrage.mispricing_gap)}`}>
                          {getEdgeTypeIcon(platform.arbitrage.edge_type)} {getArbitrageText(platform.arbitrage.mispricing_gap)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {platform.summary}
                  </p>

                  {/* AI Analysis Insights */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                      🤖 AI Analysis Insights
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        Enhanced
                      </span>
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      {/* Market Opportunity */}
                      <div>
                        <div className="text-green-400 font-medium mb-1">💡 Market Opportunity</div>
                        <p className="text-gray-300 leading-relaxed">
                          {platform.platform === 'reddit' && 
                            `Strong community engagement indicates ${Math.round(platform.metrics.engagement * 100)}% active discussion rate. Users are actively seeking solutions in this space, with ${formatNumber(platform.metrics.volume)} posts showing consistent demand patterns.`
                          }
                          {platform.platform === 'github' && 
                            `Developer interest is high with ${formatNumber(platform.metrics.total_stars || 0)} stars across related projects. The ${Math.round(platform.metrics.growth_rate * 100)}% growth rate suggests emerging technical demand.`
                          }
                          {platform.platform === 'producthunt' && 
                            `Product launch momentum shows ${Math.round(platform.metrics.engagement * 100)}% community engagement. Early adopters are actively validating similar concepts with ${formatNumber(platform.metrics.volume)} launches.`
                          }
                          {platform.platform === 'hackernews' && 
                            `Tech community validation with ${Math.round(platform.metrics.avg_score || 0 * 100)}% positive sentiment. Discussion quality indicates serious consideration from technical decision-makers.`
                          }
                          {platform.platform === 'stackoverflow' && 
                            `Developer pain points are evident with ${formatNumber(platform.metrics.total_answers || 0)} solution attempts. High question volume indicates unmet technical needs.`
                          }
                          {platform.platform === 'googlenews' && 
                            `Media coverage trends show ${Math.round(platform.metrics.growth_rate * 100)}% increase in mentions. Market timing appears favorable based on news cycle analysis.`
                          }
                          {platform.platform === 'youtube' && 
                            `Content creator interest with ${formatNumber(platform.metrics.total_views || 0)} views indicates audience demand. Educational content performance suggests market readiness.`
                          }
                          {!['reddit', 'github', 'producthunt', 'hackernews', 'stackoverflow', 'googlenews', 'youtube'].includes(platform.platform) &&
                            `Platform analysis shows ${Math.round(platform.metrics.engagement * 100)}% engagement rate with ${formatNumber(platform.metrics.volume)} relevant discussions, indicating active market interest.`
                          }
                        </p>
                      </div>

                      {/* Competitive Landscape */}
                      <div>
                        <div className="text-orange-400 font-medium mb-1">⚔️ Competitive Landscape</div>
                        <p className="text-gray-300 leading-relaxed">
                          {platform.sentiment.positive > 0.6 ? 
                            `High positive sentiment (${Math.round(platform.sentiment.positive * 100)}%) suggests market satisfaction with existing solutions, indicating need for differentiation through superior UX or pricing.` :
                            platform.sentiment.negative > 0.4 ?
                            `Significant negative sentiment (${Math.round(platform.sentiment.negative * 100)}%) reveals market gaps and user frustration with current solutions - prime opportunity for disruption.` :
                            `Mixed sentiment indicates competitive but unsaturated market. Focus on unique value proposition and targeted positioning.`
                          }
                        </p>
                      </div>

                      {/* Strategic Recommendations */}
                      <div>
                        <div className="text-purple-400 font-medium mb-1">🎯 Strategic Recommendations</div>
                        <div className="text-gray-300 leading-relaxed">
                          {platform.metrics.growth_rate > 0.5 ? 
                            `🚀 High growth momentum detected. Consider rapid market entry to capitalize on trending interest.` :
                            platform.metrics.growth_rate < -0.2 ?
                            `📉 Declining interest suggests market maturity. Focus on innovation or pivot to adjacent opportunities.` :
                            `📊 Stable market conditions. Ideal for methodical validation and gradual market penetration.`
                          }
                          {platform.metrics.engagement > 0.7 && ` Strong engagement rates suggest community-driven growth strategies will be effective.`}
                          {platform.metrics.volume > 1000 && ` High discussion volume indicates sufficient market size for sustainable business.`}
                        </div>
                      </div>

                      {/* Key Success Factors */}
                      <div>
                        <div className="text-cyan-400 font-medium mb-1">🔑 Key Success Factors</div>
                        <div className="flex flex-wrap gap-1">
                          {platform.top_keywords.slice(0, 4).map((keyword, i) => (
                            <span key={i} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-300 text-xs mt-1">
                          Focus on these trending topics for maximum market resonance and organic discovery.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Arbitrage Metrics Panel */}
                  {userPlan === 'premium' && platform.arbitrage && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-purple-400 flex items-center">
                          💎 Social Arbitrage Metrics
                          <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            {Math.round(platform.arbitrage.confidence * 100)}% confidence
                          </span>
                        </h4>
                      </div>
                      
                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="font-bold text-orange-400">{Math.round(platform.arbitrage.mispricing_gap * 100)}%</div>
                          <div className="text-gray-400">Mispricing Gap</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="font-bold text-blue-400">{Math.round(platform.arbitrage.attention_imbalance * 100)}%</div>
                          <div className="text-gray-400">Attention Imbalance</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="font-bold text-green-400">{platform.arbitrage.lag_minutes}m</div>
                          <div className="text-gray-400">Cross-Platform Lag</div>
                        </div>
                        <div className="bg-gray-700/30 rounded p-2 text-center">
                          <div className="font-bold text-purple-400">{Math.round(platform.arbitrage.influencer_momentum * 100)}%</div>
                          <div className="text-gray-400">Influencer Momentum</div>
                        </div>
                      </div>

                      {/* Edge Type & Sentiment Velocity */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Edge Type:</span>
                          <span className="text-white font-medium">
                            {getEdgeTypeIcon(platform.arbitrage.edge_type)} {platform.arbitrage.edge_type}
                          </span>
                  </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Sentiment Velocity:</span>
                          <span className={`font-medium ${platform.arbitrage.sentiment_velocity > 0 ? 'text-green-400' : platform.arbitrage.sentiment_velocity < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {platform.arbitrage.sentiment_velocity > 0 ? '↗️' : platform.arbitrage.sentiment_velocity < 0 ? '↘️' : '→'} 
                            {Math.abs(platform.arbitrage.sentiment_velocity * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-green-400">{formatNumber(platform.metrics.volume)}</div>
                      <div className="text-gray-400">Posts</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{Math.round(platform.metrics.engagement * 100)}%</div>
                      <div className="text-gray-400">Engagement</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">{Math.round(platform.metrics.growth_rate * 100)}%</div>
                      <div className="text-gray-400">Growth</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700/50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400">{platform.metrics.avg_score?.toFixed(1) || 'N/A'}</div>
                      <div className="text-gray-400">Avg Score</div>
                    </div>
                  </div>

                  {/* Platform-Specific Metrics */}
                  {platform.platform === 'github' && (
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-green-400">{formatNumber(platform.metrics.total_stars || 0)}</div>
                        <div className="text-gray-400">Stars</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-blue-400">{formatNumber(platform.metrics.total_forks || 0)}</div>
                        <div className="text-gray-400">Forks</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-purple-400">{formatNumber(platform.metrics.total_views || 0)}</div>
                        <div className="text-gray-400">Views</div>
                      </div>
                    </div>
                  )}

                  {platform.platform === 'reddit' && (
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-orange-400">{formatNumber(platform.metrics.total_votes || 0)}</div>
                        <div className="text-gray-400">Votes</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-blue-400">{formatNumber(platform.metrics.total_comments || 0)}</div>
                        <div className="text-gray-400">Comments</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-green-400">{Math.round((platform.metrics.avg_points || 0) * 100)}%</div>
                        <div className="text-gray-400">Upvote Rate</div>
                </div>
              </div>
            )}

                  {platform.platform === 'stackoverflow' && (
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-blue-400">{formatNumber(platform.metrics.total_answers || 0)}</div>
                        <div className="text-gray-400">Answers</div>
                  </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-green-400">{formatNumber(platform.metrics.total_votes || 0)}</div>
                        <div className="text-gray-400">Votes</div>
                  </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded">
                        <div className="font-bold text-yellow-400">{Math.round((platform.metrics.avg_score || 0) * 100)}%</div>
                        <div className="text-gray-400">Acceptance</div>
                </div>
              </div>
            )}

                  {/* Keywords */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Trending Keywords:</div>
                    <div className="flex flex-wrap gap-2">
                      {platform.top_keywords.slice(0, 5).map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Representative Quotes */}
                  {platform.representative_quotes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Top Content:</div>
                      <div className="space-y-2">
                        {platform.representative_quotes.slice(0, 2).map((quote, i) => (
                          <div key={i} className="text-xs text-gray-300 bg-gray-700/30 rounded p-3 border-l-2 border-blue-500/50">
                            <div className="flex items-start space-x-2">
                              <span className="text-blue-400 mt-1">💬</span>
                  <div>
                                <p className="italic">"{quote.text}"</p>
                                {quote.author && (
                                  <p className="text-gray-500 mt-1">— {quote.author}</p>
                                )}
                  </div>
                </div>
                  </div>
                        ))}
                </div>
              </div>
            )}

                  {/* Additional Insights */}
                  {platform.additional_insights && platform.additional_insights.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Key Insights:</div>
                      <div className="space-y-1">
                        {platform.additional_insights.slice(0, 2).map((insight, i) => (
                          <div key={i} className="text-xs text-gray-300 bg-gray-700/20 rounded p-2">
                            <span className="text-green-400 mr-2">💡</span>
                            {insight}
                  </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Premium Catalysts & Plays */}
                  {userPlan === 'premium' && platform.arbitrage && (
                    <>
                      {/* Catalysts Section */}
                      {platform.catalysts && platform.catalysts.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-purple-400 font-medium mb-2 flex items-center">
                            ⚡ Upcoming Catalysts
                            <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                              {Math.round(platform.arbitrage.catalyst_proximity * 100)}% proximity
                            </span>
                          </div>
                          <div className="space-y-2">
                            {platform.catalysts.slice(0, 2).map((catalyst, i) => (
                              <div key={i} className="bg-purple-500/10 border border-purple-500/20 rounded p-3 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-purple-300 font-medium">
                                    {catalyst.type === 'ph_launch' && '🚀 Product Hunt Launch'}
                                    {catalyst.type === 'gh_release' && '📦 GitHub Release'}
                                    {catalyst.type === 'conf' && '🎤 Conference'}
                                    {catalyst.type === 'video' && '📺 Video Content'}
                                    {catalyst.type === 'news' && '📰 News Event'}
                                  </span>
                                  <span className="text-green-400 font-bold">
                                    {Math.round(catalyst.likelihood * 100)}% likely
                                  </span>
                                </div>
                                <div className="text-gray-300 mb-1">
                                  ETA: {new Date(catalyst.eta).toLocaleDateString()}
                                </div>
                                {catalyst.description && (
                                  <div className="text-gray-400 italic">
                                    {catalyst.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Arbitrage Plays Section */}
                      {platform.plays && platform.plays.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-orange-400 font-medium mb-2">
                            🎯 Recommended Plays
                          </div>
                          <div className="space-y-2">
                            {platform.plays.slice(0, 2).map((play, i) => (
                              <div key={i} className="bg-orange-500/10 border border-orange-500/20 rounded p-3 text-xs">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-orange-300 font-medium flex items-center">
                                    {play.type === 'content' && '📝 Content Play'}
                                    {play.type === 'distribution' && '📢 Distribution Play'}
                                    {play.type === 'product' && '⚡ Product Play'}
                                    <span className="ml-2 text-xs bg-orange-500/20 px-2 py-1 rounded">
                                      {play.where}
                                    </span>
                                  </span>
                                  <span className={`text-xs font-bold ${getUrgencyColor(play.urgency)}`}>
                                    {play.urgency.toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-gray-300 mb-1">
                                  <strong>Why:</strong> {play.why}
                                </div>
                                <div className="text-orange-200 font-medium mb-1">
                                  <strong>Action:</strong> {play.cta}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  Window: ~{play.estimated_window_hours}h
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Platform Status */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Live Data</span>
                      {userPlan === 'premium' && platform.arbitrage && (
                        <>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-purple-400">💎 Arbitrage Enabled</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Tools Section */}
          <div className="bg-gray-800/50 backdrop-blur rounded-3xl border border-white/10 mb-8">
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  🛠️ Recommended Tools for Startups
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Curated tools and services to help you build, launch, and grow your startup efficiently
                </p>
              </div>

              {/* Affiliate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Capacity.so Affiliate Card */}
                <div className="bg-gray-700/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                        <img
                          src="https://capacity.so/favicon.ico"
                          alt="Capacity Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to text logo if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.className = "w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center";
                              parent.innerHTML = '<span class="text-white font-bold text-sm">C</span>';
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-bold text-white">Capacity</h3>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          AI Assistant
                        </span>
                      </div>

                      <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                        AI-powered knowledge management and team collaboration platform.
                        Perfect for startups to organize ideas and automate workflows.
                      </p>

                      {/* Key Features */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>AI automation</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Team collaboration</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Knowledge base</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Workflow optimization</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <a
                        href="https://capacity.so/?via=barbaros"
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                      >
                        <span>🚀</span>
                        <span>Try Free</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* StoryShort.ai Affiliate Card */}
                <div className="bg-gray-700/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                        <img
                          src="https://storyshort.ai/favicon.ico"
                          alt="StoryShort Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to text logo if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.className = "w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center";
                              parent.innerHTML = '<span class="text-white font-bold text-sm">S</span>';
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-bold text-white">StoryShort</h3>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          AI Video Creator
                        </span>
                      </div>

                      <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                        Transform your ideas into engaging short videos with AI.
                        Perfect for content marketing and social media.
                      </p>

                      {/* Key Features */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>AI video generation</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Social media ready</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Multiple formats</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Quick creation</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <a
                        href="https://storyshort.ai/?via=barbaros"
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                      >
                        <span>🎬</span>
                        <span>Create Videos</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Login to See Price Affiliate Card */}
                <div className="bg-gray-700/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                        <img
                          src="/logo-b2b.png"
                          alt="B2B Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to text logo if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.className = "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center";
                              parent.innerHTML = '<span class="text-white font-bold text-xs">B2B</span>';
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-bold text-white">Login to See Price</h3>
                        <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          Shopify App
                        </span>
                      </div>

                      <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                        Hide product prices from guests to drive account signups and grow your email list.
                        Perfect for B2B stores, wholesale, and exclusive pricing strategies.
                      </p>

                      {/* Key Features */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Easy installation</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>B2B & wholesale ready</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Mobile optimized</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span className="text-green-400">✓</span>
                          <span>Zero maintenance</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <a
                        href="https://apps.shopify.com/shhhh-pricing"
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                      >
                        <span>🛍️</span>
                        <span>View on Shopify App Store</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
