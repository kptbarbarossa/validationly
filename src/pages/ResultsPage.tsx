import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { ImprovedScoreSection } from '../components/results/ImprovedScoreSection';
import { ActionPlanSection } from '../components/results/ActionPlanSection';
import { MobileOptimizedLayout } from '../components/results/MobileOptimizedLayout';
import { InsightsSection } from '../components/results/InsightsSection';
import { PlatformAnalysisSection } from '../components/results/PlatformAnalysisSection';
import { SocialMediaSection } from '../components/results/SocialMediaSection';

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

  // Prepare sections for mobile layout
  const sections = [
    {
      id: 'score',
      title: 'Doğrulama Skoru',
      icon: '🎯',
      component: () => (
        <ImprovedScoreSection
          score={result.demandScore}
          classification={result.classification}
          justification={result.scoreJustification}
        />
      ),
      priority: 1
    },
    {
      id: 'action-plan',
      title: 'Eylem Planı',
      icon: '🚀',
      component: () => (
        <ActionPlanSection
          score={result.demandScore}
          category={result.classification?.primaryCategory || 'startup'}
        />
      ),
      priority: 2
    },
    {
      id: 'insights',
      title: 'AI Öngörüleri',
      icon: '🧠',
      component: () => <InsightsSection insights={result.insights} />,
      priority: 3
    },
    {
      id: 'platforms',
      title: 'Platform Analizi',
      icon: '🌐',
      component: () => <PlatformAnalysisSection result={result} />,
      priority: 4
    },
    {
      id: 'social',
      title: 'Sosyal Medya',
      icon: '📱',
      component: () => <SocialMediaSection result={result} />,
      priority: 5
    }
  ];

  return (
    <>
      <SEOHead
        title={`🎉 ${result.classification?.primaryCategory || 'Startup'} Doğrulama Sonuçları | Validationly`}
        description="Startup fikrinizin AI destekli doğrulama sonuçları ve eylem planı"
        keywords="startup doğrulama, fikir doğrulama, pazar araştırması, startup araçları"
      />
      
      <div className="min-h-screen text-white">
        {/* Modern gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-500/5 to-cyan-600/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8 animate-fade-in">
              {/* Back Button */}
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Yeni Analiz</span>
                </button>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition-all">
                    📤 Paylaş
                  </button>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl transition-all">
                    📄 PDF İndir
                  </button>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="glass glass-border p-6 rounded-3xl mb-8 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                      "{result.idea}"
                    </h1>
                    <p className="text-slate-400">
                      {result.classification?.primaryCategory} • {result.classification?.businessModel}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      <span className={getScoreColor(result.demandScore)}>
                        {result.demandScore}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">Doğrulama Skoru</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Optimized Layout */}
            <MobileOptimizedLayout sections={sections} data={result} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;