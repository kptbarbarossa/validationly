import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { ImprovedScoreSection } from '../components/results/ImprovedScoreSection';
import { InsightsSection } from '../components/results/InsightsSection';
import { PlatformAnalysisSection } from '../components/results/PlatformAnalysisSection';
import { SocialMediaSection } from '../components/results/SocialMediaSection';
import { YouTubeAnalysisSection } from '../components/results/YouTubeAnalysisSection';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;

  // YouTube analysis data
  youtubeData?: {
    searchResults: {
      videos: Array<{
        id: string;
        title: string;
        viewCount: string;
        channelTitle: string;
        publishedAt: string;
      }>;
      totalResults: number;
    };
    trendAnalysis: {
      totalViews: number;
      averageViews: number;
      totalVideos: number;
      recentActivity: boolean;
      topChannels: string[];
    };
    aiAnalysis?: {
      youtubeAnalysis: {
        marketDemand: string;
        contentSaturation: string;
        audienceEngagement: string;
        contentGaps: string[];
        competitorChannels: string[];
        marketOpportunity: string;
      };
      contentStrategy: {
        recommendedApproach: string;
        keyTopics: string[];
        targetAudience: string;
        contentFormats: string[];
      };
      validationInsights: string[];
    };
  };

  // Multi-platform validation results
  multiPlatformData?: {
    platforms: Array<{
      platform: string;
      items: any[];
      error?: string;
    }>;
    summary: {
      reddit: number;
      hackernews: number;
      producthunt: number;
      googlenews: number;
      github: number;
      stackoverflow: number;
      youtube: number;
    };
    totalItems: number;
  };

  // Enhanced insights from multi-platform analysis
  insights?: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    keyInsights: string[];
    painPoints: string[];
    opportunities: string[];
    popularSolutions: string[];
    platformBreakdown?: {
      reddit: number;
      hackernews: number;
      producthunt: number;
      googlenews: number;
      github: number;
      stackoverflow: number;
      youtube: number;
    };
  };

  // Enhanced classification
  classification?: {
    primaryCategory: string;
    businessModel: string;
    targetMarket: string;
    complexity: string;
    confidence?: number;
  };

  // Enhanced dimension scores
  dimensionScores?: {
    marketOpportunity?: {
      score: number;
      justification: string;
      keyInsights?: string[];
      risks?: string[];
      opportunities?: string[];
    };
    executionFeasibility?: {
      score: number;
      justification: string;
      technicalComplexity?: string;
      timeToMarket?: string;
      resourceRequirements?: string[];
      keyRisks?: string[];
    };
    businessModelViability?: {
      score: number;
      justification: string;
      revenueModel?: string;
      unitEconomics?: string;
      monetizationTimeline?: string;
      scalabilityFactors?: string[];
    };
    goToMarketStrategy?: {
      score: number;
      justification: string;
      primaryChannels?: string[];
      customerAcquisitionStrategy?: string;
      competitiveDifferentiation?: string;
      launchStrategy?: string;
    };
  };

  // Industry-specific insights
  industrySpecificInsights?: {
    regulatoryConsiderations?: string[];
    industryTrends?: string[];
    competitiveLandscape?: string;
    successFactors?: string[];
    commonFailureReasons?: string[];
  };

  // Actionable recommendations
  actionableRecommendations?: {
    immediateNextSteps?: string[];
    validationMethods?: string[];
    pivotOpportunities?: string[];
    riskMitigation?: string[];
    keyMetricsToTrack?: string[];
  };

  platformAnalyses: Array<{
    platform: string;
    signalStrength: string;
    analysis: string;
    score?: number;
  }>;

  // Enhanced social media suggestions
  socialMediaSuggestions?: {
    tweetSuggestion?: string;
    linkedinSuggestion?: string;
    redditTitleSuggestion?: string;
    redditBodySuggestion?: string;
  };

  // Market data
  marketData?: {
    estimatedMarketSize?: string;
    growthRate?: string;
    competitorCount?: string;
    marketMaturity?: string;
    keyTrends?: string[];
  };

  // Legacy fields for backward compatibility
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
  tweetSuggestion?: string;
  redditTitleSuggestion?: string;
  redditBodySuggestion?: string;
  linkedinSuggestion?: string;
  audience?: string;
  goal?: string;
  industry?: string;
  stage?: string;
  realWorldData?: any;
  dataConfidence?: string;
  lastDataUpdate?: string;

  // Analysis metadata
  analysisMetadata?: {
    analysisDate?: string;
    aiModel?: string;
    industryExpertise?: string;
    analysisDepth?: string;
    confidence?: number;
  };

  // Enhanced analysis for premium users
  enhancedAnalysis?: any;
  isPremiumAnalysis?: boolean;
  premiumTier?: 'pro' | 'business' | 'enterprise';
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const result: ValidationResult = location.state?.result;

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">Sonuç Bulunamadı</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Lütfen ana sayfadan yeni bir analiz başlatın ve fikirlerinizi doğrulayın.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Sonuçlarınız Hazırlanıyor...</h2>
          <p className="text-slate-400">AI analiziniz tamamlanıyor</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Dashboard layout - no sections array needed

  return (
    <>
      <SEOHead
        title={`🎉 ${result.classification?.primaryCategory || 'Startup'} Doğrulama Sonuçları | Validationly`}
        description="Startup fikrinizin AI destekli doğrulama sonuçları ve eylem planı"
        keywords="startup doğrulama, fikir doğrulama, pazar araştırması, startup araçları"
      />

      {/* Modern Dashboard Layout - Figma Inspired */}
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Navigation */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Yeni Analiz</span>
                </button>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Doğrulama Dashboard</h1>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Paylaş
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF İndir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    "{result.idea}"
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {result.classification?.primaryCategory}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {result.classification?.businessModel}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(result.demandScore)}`}>
                    {result.demandScore}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Doğrulama Skoru</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400">🌐</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Platform</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {result.multiPlatformData?.platforms?.filter(p => p.items?.length > 0).length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Sonuç</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {result.multiPlatformData?.totalItems || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400">🧠</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Öngörüler</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {result.insights?.keyInsights?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400">📺</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">YouTube Videoları</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {result.youtubeData?.trendAnalysis?.totalVideos || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Score & Insights */}
            <div className="lg:col-span-4 space-y-6">
              {/* Score Section */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">🎯</span>
                  Doğrulama Skoru
                </h3>
                <ImprovedScoreSection
                  score={result.demandScore}
                  classification={result.classification}
                  justification={result.scoreJustification}
                />
              </div>

              {/* AI Insights */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">🧠</span>
                  AI Öngörüleri
                </h3>
                <InsightsSection insights={result.insights} />
              </div>
            </div>

            {/* Right Column - Platform Analysis & YouTube */}
            <div className="lg:col-span-8 space-y-6">
              {/* Platform Analysis */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">🌐</span>
                  Platform Analizi
                </h3>
                <PlatformAnalysisSection result={result} />
              </div>

              {/* YouTube Analysis */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">📺</span>
                  YouTube Analizi
                </h3>
                <YouTubeAnalysisSection youtubeData={result.youtubeData} />
              </div>

              {/* Social Media Content */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">📱</span>
                  Sosyal Medya İçerikleri
                </h3>
                <SocialMediaSection result={result} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;