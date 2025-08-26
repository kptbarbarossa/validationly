import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  classification?: {
    primaryCategory: string;
    businessModel: string;
    targetMarket: string;
    complexity: string;
  };
  dimensionScores?: {
    marketOpportunity?: { score: number; justification: string; };
    executionFeasibility?: { score: number; justification: string; };
    businessModelViability?: { score: number; justification: string; };
    goToMarketStrategy?: { score: number; justification: string; };
  };
  actionableRecommendations?: {
    immediateNextSteps?: string[];
    validationMethods?: string[];
    keyMetricsToTrack?: string[];
  };
  socialMediaSuggestions?: {
    tweetSuggestion?: string;
    linkedinSuggestion?: string;
    redditTitleSuggestion?: string;
    redditBodySuggestion?: string;
  };
  youtubeData?: {
    searchResults: {
      videos: Array<{
        id: string;
        title: string;
        description: string;
        viewCount: string;
        likeCount: string;
        commentCount: string;
        publishedAt: string;
        channelTitle: string;
        tags?: string[];
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
  insights?: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    keyInsights: string[];
    painPoints: string[];
    opportunities: string[];
    popularSolutions: string[];
  };
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const result: ValidationResult = location.state?.result;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">Sonuç Bulunamadı</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Lütfen ana sayfadan yeni bir analiz başlatın ve fikirlerinizi doğrulayın.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Sonuçlarınız Hazırlanıyor...</h2>
          <p className="text-slate-400">AI analiziniz tamamlanıyor</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Mükemmel', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    if (score >= 60) return { label: 'İyi', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    if (score >= 40) return { label: 'Orta', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    return { label: 'Zayıf', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  return (
    <>
      <SEOHead
        title={`🎉 ${result.classification?.primaryCategory || 'Startup'} Doğrulama Sonuçları | Validationly`}
        description="Startup fikrinizin AI destekli doğrulama sonuçları ve eylem planı"
        keywords="startup doğrulama, fikir doğrulama, pazar araştırması, startup araçları"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-px h-96 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-px h-96 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>

        {/* Header */}
        <div className="relative z-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/60 hover:to-slate-600/60 border border-slate-600/30 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="font-medium">Yeni Analiz</span>
              </button>

              <div className="flex items-center gap-4">
                <button className="group px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                      <span className="text-xs">📤</span>
                    </div>
                    <span className="font-medium text-blue-300">Paylaş</span>
                  </div>
                </button>
                <button className="group px-6 py-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 border border-emerald-500/30 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 flex items-center justify-center">
                      <span className="text-xs">📄</span>
                    </div>
                    <span className="font-medium text-emerald-300">PDF İndir</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 max-w-6xl mx-auto">

                {/* Idea Title */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30 mb-6">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-indigo-300 font-medium text-sm">STARTUP DOĞRULAMA RAPORU</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                    "{result.idea}"
                  </h1>

                  {result.classification && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                      <div className="group px-6 py-3 bg-gradient-to-r from-indigo-600/20 to-indigo-500/20 border border-indigo-500/30 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                          <span className="text-indigo-300 font-medium">{result.classification.primaryCategory}</span>
                        </div>
                      </div>
                      <div className="group px-6 py-3 bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-purple-300 font-medium">{result.classification.businessModel}</span>
                        </div>
                      </div>
                      <div className="group px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span className="text-cyan-300 font-medium">{result.classification.targetMarket}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Score Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-center lg:text-left">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                      <div className="relative">
                        <div className="text-9xl font-black mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {result.demandScore}%
                        </div>
                        <div className={`inline-flex items-center gap-3 px-8 py-4 ${getScoreLabel(result.demandScore).bg} ${getScoreLabel(result.demandScore).border} border rounded-2xl backdrop-blur-sm`}>
                          <div className={`w-3 h-3 ${getScoreLabel(result.demandScore).color.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                          <span className={`${getScoreLabel(result.demandScore).color} font-bold text-lg`}>
                            {getScoreLabel(result.demandScore).label} Potansiyel
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <span className="text-xl">📊</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Analiz Özeti</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-lg">
                        {result.scoreJustification}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div className="text-5xl font-black text-indigo-400 mb-3">
                    {result.multiPlatformData?.platforms?.filter(p => p.items?.length > 0).length ||
                      (result.youtubeData ? 1 : 0) ||
                      (result.insights ? 1 : 0) || 1}
                  </div>
                  <p className="text-xl font-bold text-white mb-2">Aktif Platform</p>
                  <p className="text-slate-400">Analiz tamamlandı</p>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: `${((result.multiPlatformData?.platforms?.filter(p => p.items?.length > 0).length || 1) / 7) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-5xl font-black text-cyan-400 mb-3">
                    {result.multiPlatformData?.totalItems ||
                      (result.youtubeData?.searchResults?.totalResults ? Math.min(result.youtubeData.searchResults.totalResults, 999) : 0) ||
                      50}
                  </div>
                  <p className="text-xl font-bold text-white mb-2">Toplam Sonuç</p>
                  <p className="text-slate-400">Analiz edilen içerik</p>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" style={{ width: `${Math.min(((result.multiPlatformData?.totalItems || 50) / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div className="text-5xl font-black text-purple-400 mb-3">
                    {result.insights?.keyInsights?.length ||
                      (result.insights?.opportunities?.length || 0) + (result.insights?.painPoints?.length || 0) ||
                      3}
                  </div>
                  <p className="text-xl font-bold text-white mb-2">AI Öngörüler</p>
                  <p className="text-slate-400">
                    {result.insights?.sentiment === 'positive' ? 'Olumlu' :
                      result.insights?.sentiment === 'negative' ? 'Olumsuz' : 'Nötr'} sentiment
                  </p>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${result.insights?.sentiment === 'positive' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : result.insights?.sentiment === 'negative' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* AI Insights Premium Section */}
            {result.insights && (
              <div className="relative mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-300 font-medium text-sm">AI ÖNGÖRÜ ANALİZİ</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                      Yapay Zeka Öngörüleri
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {result.insights.keyInsights && result.insights.keyInsights.length > 0 && (
                      <div className="group">
                        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-xl">💡</span>
                          </div>
                          <h3 className="text-xl font-bold text-cyan-300 mb-4">Temel Öngörüler</h3>
                          <ul className="space-y-3">
                            {result.insights.keyInsights.map((insight, index) => (
                              <li key={index} className="text-slate-300 text-sm flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {result.insights.opportunities && result.insights.opportunities.length > 0 && (
                      <div className="group">
                        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-8 border border-emerald-500/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-xl">🚀</span>
                          </div>
                          <h3 className="text-xl font-bold text-emerald-300 mb-4">Fırsatlar</h3>
                          <ul className="space-y-3">
                            {result.insights.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-slate-300 text-sm flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {result.insights.painPoints && result.insights.painPoints.length > 0 && (
                      <div className="group">
                        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-2xl p-8 border border-red-500/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-xl">⚠️</span>
                          </div>
                          <h3 className="text-xl font-bold text-red-300 mb-4">Zorluklar</h3>
                          <ul className="space-y-3">
                            {result.insights.painPoints.map((painPoint, index) => (
                              <li key={index} className="text-slate-300 text-sm flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                {painPoint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {result.insights.trendingTopics && result.insights.trendingTopics.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-700/50">
                      <h3 className="text-2xl font-bold text-purple-300 mb-6 text-center">🔥 Trend Konular</h3>
                      <div className="flex flex-wrap justify-center gap-4">
                        {result.insights.trendingTopics.map((topic, index) => (
                          <div
                            key={index}
                            className="group px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300"
                          >
                            <span className="text-purple-300 font-medium">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* YouTube Raw Data */}
            {result.youtubeData && (
              <div className="relative mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-500/30 mb-6">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
                      <span className="text-red-300 font-medium text-sm">YOUTUBE PAZAR VERİSİ</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                      YouTube Analizi
                    </h2>
                  </div>

                  {/* YouTube Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-2xl p-6 text-center border border-red-500/30 backdrop-blur-sm">
                      <div className="text-3xl font-black text-red-400 mb-2">
                        {result.youtubeData.searchResults.totalResults.toLocaleString()}
                      </div>
                      <p className="text-slate-300 font-medium">Toplam Video</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-6 text-center border border-emerald-500/30 backdrop-blur-sm">
                      <div className="text-3xl font-black text-emerald-400 mb-2">
                        {(result.youtubeData.trendAnalysis.totalViews / 1000000).toFixed(1)}M
                      </div>
                      <p className="text-slate-300 font-medium">Toplam İzlenme</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 text-center border border-blue-500/30 backdrop-blur-sm">
                      <div className="text-3xl font-black text-blue-400 mb-2">
                        {(result.youtubeData.trendAnalysis.averageViews / 1000).toFixed(0)}K
                      </div>
                      <p className="text-slate-300 font-medium">Ortalama İzlenme</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl p-6 text-center border border-purple-500/30 backdrop-blur-sm">
                      <div className="text-3xl font-black text-purple-400 mb-2">
                        {result.youtubeData.trendAnalysis.recentActivity ? '✅' : '❌'}
                      </div>
                      <p className="text-slate-300 font-medium">Son 30 Gün</p>
                    </div>
                  </div>

                  {/* Top Videos */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                      <span className="text-2xl">🔥</span> En Popüler Videolar
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {result.youtubeData.searchResults.videos.slice(0, 10).map((video, index) => (
                        <div key={video.id} className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white text-lg mb-3 line-clamp-2">
                                {video.title}
                              </h4>

                              <div className="flex items-center gap-6 text-sm text-slate-400 mb-3">
                                <span className="flex items-center gap-2">
                                  <span className="text-red-400">👁️</span> {parseInt(video.viewCount).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="text-green-400">👍</span> {parseInt(video.likeCount).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="text-blue-400">💬</span> {parseInt(video.commentCount).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="text-purple-400">📅</span> {new Date(video.publishedAt).toLocaleDateString('tr-TR')}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-sm flex items-center gap-2">
                                  <span className="text-orange-400">📺</span> {video.channelTitle}
                                </span>
                                <a
                                  href={`https://youtube.com/watch?v=${video.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 text-sm font-medium transition-all duration-300"
                                >
                                  İzle →
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Channels */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                      <span className="text-2xl">🏆</span> En Aktif Kanallar
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {result.youtubeData.trendAnalysis.topChannels.map((channel, index) => (
                        <div
                          key={index}
                          className="group px-6 py-3 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300"
                        >
                          <span className="text-red-300 font-medium">#{index + 1} {channel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {result.youtubeData.aiAnalysis && (
                    <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <span className="text-2xl">🤖</span> AI Analizi
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-cyan-400 mb-3 text-lg">Pazar Talebi</h4>
                            <p className="text-slate-300 leading-relaxed">
                              {result.youtubeData.aiAnalysis.youtubeAnalysis.marketDemand}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-bold text-yellow-400 mb-3 text-lg">İçerik Doygunluğu</h4>
                            <p className="text-slate-300 leading-relaxed">
                              {result.youtubeData.aiAnalysis.youtubeAnalysis.contentSaturation}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-emerald-400 mb-3 text-lg">Pazar Fırsatı</h4>
                            <p className="text-slate-300 leading-relaxed mb-4">
                              {result.youtubeData.aiAnalysis.youtubeAnalysis.marketOpportunity}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-bold text-purple-400 mb-3 text-lg">İçerik Boşlukları</h4>
                            <ul className="space-y-2">
                              {result.youtubeData.aiAnalysis.youtubeAnalysis.contentGaps.map((gap, index) => (
                                <li key={index} className="text-slate-300 flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                  {gap}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multi-Platform Raw Data */}
            {result.multiPlatformData && result.multiPlatformData.platforms && (
              <div className="space-y-8 mb-16">
                {result.multiPlatformData.platforms.map((platform, index) => {
                  if (!platform.items || platform.items.length === 0) return null;

                  const platformConfig = {
                    reddit: { name: 'Reddit', icon: '🔴', color: 'red', description: 'Topluluk tartışmaları ve gönderiler' },
                    hackernews: { name: 'Hacker News', icon: '🟠', color: 'orange', description: 'Teknoloji haberleri ve tartışmaları' },
                    producthunt: { name: 'Product Hunt', icon: '🚀', color: 'pink', description: 'Yeni ürün lansmanları ve keşifler' },
                    github: { name: 'GitHub', icon: '⚫', color: 'gray', description: 'Açık kaynak projeler ve kod deposu' },
                    stackoverflow: { name: 'Stack Overflow', icon: '📚', color: 'yellow', description: 'Geliştirici soruları ve çözümleri' },
                    googlenews: { name: 'Google News', icon: '📰', color: 'blue', description: 'Haber makaleleri ve medya kapsamı' }
                  };

                  const config = platformConfig[platform.platform as keyof typeof platformConfig];
                  if (!config) return null;

                  return (
                    <div key={index} className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r from-${config.color}-500/10 via-${config.color}-400/10 to-${config.color}-600/10 rounded-3xl blur-xl`}></div>
                      <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
                        <div className="text-center mb-12">
                          <div className={`inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-${config.color}-500/20 to-${config.color}-400/20 rounded-full border border-${config.color}-500/30 mb-6`}>
                            <div className={`w-2 h-2 bg-gradient-to-r from-${config.color}-400 to-${config.color}-300 rounded-full animate-pulse`}></div>
                            <span className={`text-${config.color}-300 font-medium text-sm`}>{config.name.toUpperCase()} HAM VERİSİ</span>
                          </div>
                          <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-${config.color}-400 via-${config.color}-300 to-${config.color}-500 bg-clip-text text-transparent`}>
                            {config.name} Analizi
                          </h2>
                          <p className="text-slate-400 text-lg">{config.description}</p>
                        </div>

                        {/* Platform Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                          <div className={`bg-gradient-to-br from-${config.color}-600/20 to-${config.color}-500/20 rounded-2xl p-6 text-center border border-${config.color}-500/30 backdrop-blur-sm`}>
                            <div className={`text-3xl font-black text-${config.color}-400 mb-2`}>
                              {platform.items.length}
                            </div>
                            <p className="text-slate-300 font-medium">Toplam Sonuç</p>
                          </div>

                          <div className={`bg-gradient-to-br from-${config.color}-600/20 to-${config.color}-500/20 rounded-2xl p-6 text-center border border-${config.color}-500/30 backdrop-blur-sm`}>
                            <div className={`text-3xl font-black text-${config.color}-400 mb-2`}>
                              {platform.items.filter(item => item.score && item.score > 50).length}
                            </div>
                            <p className="text-slate-300 font-medium">Yüksek Skor</p>
                          </div>

                          <div className={`bg-gradient-to-br from-${config.color}-600/20 to-${config.color}-500/20 rounded-2xl p-6 text-center border border-${config.color}-500/30 backdrop-blur-sm`}>
                            <div className={`text-3xl font-black text-${config.color}-400 mb-2`}>
                              {platform.items.filter(item => {
                                const date = new Date(item.date || item.publishedAt || item.created_at);
                                const thirtyDaysAgo = new Date();
                                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                return date > thirtyDaysAgo;
                              }).length}
                            </div>
                            <p className="text-slate-300 font-medium">Son 30 Gün</p>
                          </div>
                        </div>

                        {/* Platform Items */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {platform.items.slice(0, 15).map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm">
                              <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r from-${config.color}-500 to-${config.color}-400 rounded-xl flex items-center justify-center text-white font-bold`}>
                                  {itemIndex + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-white text-lg mb-3 line-clamp-2">
                                    {item.title || item.name || item.description || 'Başlık bulunamadı'}
                                  </h4>

                                  {item.description && item.title && (
                                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-6 text-sm text-slate-400 mb-3">
                                    {item.score && (
                                      <span className="flex items-center gap-2">
                                        <span className="text-blue-400">📊</span> {item.score}
                                      </span>
                                    )}
                                    {item.upvotes && (
                                      <span className="flex items-center gap-2">
                                        <span className="text-green-400">⬆️</span> {item.upvotes}
                                      </span>
                                    )}
                                    {item.comments && (
                                      <span className="flex items-center gap-2">
                                        <span className="text-purple-400">💬</span> {item.comments}
                                      </span>
                                    )}
                                    {item.stars && (
                                      <span className="flex items-center gap-2">
                                        <span className="text-yellow-400">⭐</span> {item.stars}
                                      </span>
                                    )}
                                    {(item.date || item.publishedAt || item.created_at) && (
                                      <span className="flex items-center gap-2">
                                        <span className="text-cyan-400">📅</span> {new Date(item.date || item.publishedAt || item.created_at).toLocaleDateString('tr-TR')}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    {item.author && (
                                      <span className="text-slate-500 text-sm flex items-center gap-2">
                                        <span className="text-orange-400">👤</span> {item.author}
                                      </span>
                                    )}
                                    {item.url && (
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`px-4 py-2 bg-gradient-to-r from-${config.color}-600/20 to-${config.color}-500/20 hover:from-${config.color}-600/30 hover:to-${config.color}-500/30 border border-${config.color}-500/30 rounded-xl text-${config.color}-300 hover:text-${config.color}-200 text-sm font-medium transition-all duration-300`}
                                      >
                                        Görüntüle →
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {platform.items.length > 15 && (
                          <div className="mt-8 text-center">
                            <span className="text-slate-400 text-lg">
                              +{platform.items.length - 15} daha fazla sonuç mevcut
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Social Media Suggestions */}
            {result.socialMediaSuggestions && (
              <div className="relative mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-6">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-300 font-medium text-sm">SOSYAL MEDYA İÇERİKLERİ</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Test İçerikleri
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {result.socialMediaSuggestions.tweetSuggestion && (
                      <div className="group">
                        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                              <span className="text-xl">🐦</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-300">Twitter/X</h3>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-lg">
                            {result.socialMediaSuggestions.tweetSuggestion}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.socialMediaSuggestions.linkedinSuggestion && (
                      <div className="group">
                        <div className="bg-gradient-to-br from-blue-700/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-600/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                              <span className="text-xl">💼</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-400">LinkedIn</h3>
                          </div>
                          <p className="text-slate-300 leading-relaxed text-lg">
                            {result.socialMediaSuggestions.linkedinSuggestion}
                          </p>
                        </div>
                      </div>
                    )}

                    {result.socialMediaSuggestions.redditTitleSuggestion && (
                      <div className="group md:col-span-2">
                        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl p-8 border border-orange-500/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                              <span className="text-xl">🔴</span>
                            </div>
                            <h3 className="text-xl font-bold text-orange-300">Reddit</h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-orange-300 mb-2">Başlık:</h4>
                              <p className="text-slate-300 font-medium text-lg">
                                {result.socialMediaSuggestions.redditTitleSuggestion}
                              </p>
                            </div>
                            {result.socialMediaSuggestions.redditBodySuggestion && (
                              <div>
                                <h4 className="font-bold text-orange-300 mb-2">İçerik:</h4>
                                <p className="text-slate-400 leading-relaxed">
                                  {result.socialMediaSuggestions.redditBodySuggestion}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;