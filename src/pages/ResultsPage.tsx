import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { ImprovedScoreSection } from '../components/results/ImprovedScoreSection';
import { InsightsSection } from '../components/results/InsightsSection';
import { PlatformAnalysisSection } from '../components/results/PlatformAnalysisSection';
import { SocialMediaSection } from '../components/results/SocialMediaSection';
import { YouTubeAnalysisSection } from '../components/results/YouTubeAnalysisSection';
import { PlatformCard } from '../components/results/PlatformCard';

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

      {/* Global Background Style */}
      <div className="relative min-h-screen font-sans antialiased text-slate-100 bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-3xl animate-aurora"></div>
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-3xl animate-aurora-slow"></div>
        
        {/* Main Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-slate-200 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Yeni Analiz</span>
              </button>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition-all text-blue-300 hover:text-blue-200">
                  📤 Paylaş
                </button>
                <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl transition-all text-green-300 hover:text-green-200">
                  📄 PDF İndir
                </button>
              </div>
            </div>

            {/* Welcome Card */}
            <div className="glass glass-border p-8 rounded-3xl mb-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    "{result.idea}"
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    <span className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm">
                      {result.classification?.primaryCategory}
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                      {result.classification?.businessModel}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-bold mb-2">
                    <span className={getScoreColor(result.demandScore)}>
                      {result.demandScore}%
                    </span>
                  </div>
                  <p className="text-slate-400 text-lg">Doğrulama Skoru</p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass glass-border p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-indigo-400 mb-2">
                  {result.multiPlatformData?.platforms?.filter(p => p.items?.length > 0).length || 0}
                </div>
                <p className="text-slate-300 font-medium">Aktif Platform</p>
                <p className="text-slate-400 text-sm mt-1">7 platformdan</p>
              </div>

              <div className="glass glass-border p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {result.multiPlatformData?.totalItems || 0}
                </div>
                <p className="text-slate-300 font-medium">Toplam Sonuç</p>
                <p className="text-slate-400 text-sm mt-1">Analiz edilen içerik</p>
              </div>

              <div className="glass glass-border p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {result.insights?.keyInsights?.length || 0}
                </div>
                <p className="text-slate-300 font-medium">AI Öngörüler</p>
                <p className="text-slate-400 text-sm mt-1">
                  {result.insights?.sentiment === 'positive' ? 'Olumlu' : result.insights?.sentiment === 'negative' ? 'Olumsuz' : 'Nötr'} sentiment
                </p>
              </div>
            </div>

            {/* Score Section */}
            <div className="glass glass-border p-8 rounded-3xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-3">
                <span>🎯</span> Doğrulama Skoru
              </h2>
              <ImprovedScoreSection
                score={result.demandScore}
                classification={result.classification}
                justification={result.scoreJustification}
              />
            </div>

            {/* Platform Cards Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-3">
                <span>🌐</span> Platform Analizi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.multiPlatformData?.platforms?.map((platform, index) => (
                  <PlatformCard key={index} platform={platform} />
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="glass glass-border p-8 rounded-3xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-3">
                <span>🧠</span> AI Öngörüleri
              </h2>
              <InsightsSection insights={result.insights} />
            </div>

            {/* YouTube Analysis */}
            {result.youtubeData && (
              <div className="glass glass-border p-8 rounded-3xl mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-3">
                  <span>📺</span> YouTube Analizi
                </h2>
                <YouTubeAnalysisSection youtubeData={result.youtubeData} />
              </div>
            )}

            {/* Social Media Content */}
            <div className="glass glass-border p-8 rounded-3xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-3">
                <span>📱</span> Sosyal Medya İçerikleri
              </h2>
              <SocialMediaSection result={result} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;