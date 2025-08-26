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

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Mükemmel', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Yeni Analiz</span>
            </button>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition-all text-blue-300">
                📤 Paylaş
              </button>
              <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl transition-all text-green-300">
                📄 PDF İndir
              </button>
            </div>
          </div>

          {/* Main Result Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                "{result.idea}"
              </h1>

              {result.classification && (
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <span className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm">
                    {result.classification.primaryCategory}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                    {result.classification.businessModel}
                  </span>
                  <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm">
                    {result.classification.targetMarket}
                  </span>
                </div>
              )}

              {/* Score Display */}
              <div className="flex flex-col items-center mb-6">
                <div className="text-8xl font-bold mb-4">
                  <span className={getScoreColor(result.demandScore)}>
                    {result.demandScore}%
                  </span>
                </div>
                <div className={`px-6 py-2 ${getScoreLabel(result.demandScore).bg} ${getScoreLabel(result.demandScore).border} border rounded-full`}>
                  <span className={`${getScoreLabel(result.demandScore).color} font-semibold`}>
                    {getScoreLabel(result.demandScore).label} Potansiyel
                  </span>
                </div>
              </div>

              {/* Score Justification */}
              <div className="bg-slate-800/50 rounded-2xl p-6 text-left">
                <h3 className="text-xl font-semibold mb-3 text-white">📊 Analiz Özeti</h3>
                <p className="text-slate-300 leading-relaxed">
                  {result.scoreJustification}
                </p>
              </div>
            </div>
          </div>

          {/* Dimension Scores */}
          {result.dimensionScores && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {result.dimensionScores.marketOpportunity && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">🎯 Pazar Fırsatı</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.dimensionScores.marketOpportunity.score)}`}>
                      {result.dimensionScores.marketOpportunity.score}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {result.dimensionScores.marketOpportunity.justification}
                  </p>
                </div>
              )}

              {result.dimensionScores.executionFeasibility && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">⚡ Uygulama Kolaylığı</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.dimensionScores.executionFeasibility.score)}`}>
                      {result.dimensionScores.executionFeasibility.score}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {result.dimensionScores.executionFeasibility.justification}
                  </p>
                </div>
              )}

              {result.dimensionScores.businessModelViability && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">💰 İş Modeli</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.dimensionScores.businessModelViability.score)}`}>
                      {result.dimensionScores.businessModelViability.score}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {result.dimensionScores.businessModelViability.justification}
                  </p>
                </div>
              )}

              {result.dimensionScores.goToMarketStrategy && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">🚀 Pazara Giriş</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.dimensionScores.goToMarketStrategy.score)}`}>
                      {result.dimensionScores.goToMarketStrategy.score}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {result.dimensionScores.goToMarketStrategy.justification}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Items */}
          {result.actionableRecommendations && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>✅</span> Eylem Planı
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.actionableRecommendations.immediateNextSteps && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-400">🎯 Hemen Yapılacaklar</h3>
                    <ul className="space-y-2">
                      {result.actionableRecommendations.immediateNextSteps.map((step, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.actionableRecommendations.validationMethods && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-400">🔍 Doğrulama Yöntemleri</h3>
                    <ul className="space-y-2">
                      {result.actionableRecommendations.validationMethods.map((method, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.actionableRecommendations.keyMetricsToTrack && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-purple-400">📊 Takip Edilecek Metrikler</h3>
                    <ul className="space-y-2">
                      {result.actionableRecommendations.keyMetricsToTrack.map((metric, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* YouTube Raw Data */}
          {result.youtubeData && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📺</span> YouTube Pazar Verisi
              </h2>

              {/* YouTube Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {result.youtubeData.searchResults.totalResults.toLocaleString()}
                  </div>
                  <p className="text-slate-300 text-sm">Toplam Video</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {(result.youtubeData.trendAnalysis.totalViews / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-slate-300 text-sm">Toplam İzlenme</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {(result.youtubeData.trendAnalysis.averageViews / 1000).toFixed(0)}K
                  </div>
                  <p className="text-slate-300 text-sm">Ortalama İzlenme</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {result.youtubeData.trendAnalysis.recentActivity ? '✅' : '❌'}
                  </div>
                  <p className="text-slate-300 text-sm">Son 30 Gün Aktivite</p>
                </div>
              </div>

              {/* Top Videos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">🔥 En Popüler Videolar</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.youtubeData.searchResults.videos.slice(0, 10).map((video, index) => (
                    <div key={video.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm mb-2 line-clamp-2">
                            {video.title}
                          </h4>

                          <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                            <span className="flex items-center gap-1">
                              👁️ {parseInt(video.viewCount).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              👍 {parseInt(video.likeCount).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              💬 {parseInt(video.commentCount).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              📅 {new Date(video.publishedAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs">
                              📺 {video.channelTitle}
                            </span>
                            <a
                              href={`https://youtube.com/watch?v=${video.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 text-xs transition-colors"
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
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">🏆 En Aktif Kanallar</h3>
                <div className="flex flex-wrap gap-2">
                  {result.youtubeData.trendAnalysis.topChannels.map((channel, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm"
                    >
                      #{index + 1} {channel}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              {result.youtubeData.aiAnalysis && (
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    🤖 AI Analizi
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-2">Pazar Talebi</h4>
                      <p className="text-slate-300 text-sm mb-4">
                        {result.youtubeData.aiAnalysis.youtubeAnalysis.marketDemand}
                      </p>

                      <h4 className="font-medium text-yellow-400 mb-2">İçerik Doygunluğu</h4>
                      <p className="text-slate-300 text-sm">
                        {result.youtubeData.aiAnalysis.youtubeAnalysis.contentSaturation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-400 mb-2">Pazar Fırsatı</h4>
                      <p className="text-slate-300 text-sm mb-4">
                        {result.youtubeData.aiAnalysis.youtubeAnalysis.marketOpportunity}
                      </p>

                      <h4 className="font-medium text-purple-400 mb-2">İçerik Boşlukları</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        {result.youtubeData.aiAnalysis.youtubeAnalysis.contentGaps.map((gap, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Media Suggestions */}
          {result.socialMediaSuggestions && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📱</span> Sosyal Medya Test İçerikleri
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.socialMediaSuggestions.tweetSuggestion && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-400 text-xl">🐦</span>
                      <h3 className="font-semibold text-blue-400">Twitter/X</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions.tweetSuggestion}
                    </p>
                  </div>
                )}

                {result.socialMediaSuggestions.linkedinSuggestion && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-600 text-xl">💼</span>
                      <h3 className="font-semibold text-blue-600">LinkedIn</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions.linkedinSuggestion}
                    </p>
                  </div>
                )}

                {result.socialMediaSuggestions.redditTitleSuggestion && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-orange-500 text-xl">🔴</span>
                      <h3 className="font-semibold text-orange-500">Reddit</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-300 text-sm font-medium">
                        {result.socialMediaSuggestions.redditTitleSuggestion}
                      </p>
                      {result.socialMediaSuggestions.redditBodySuggestion && (
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {result.socialMediaSuggestions.redditBodySuggestion}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultsPage;