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
  };
  multiPlatformData?: {
    platforms: Array<{
      platform: string;
      items: any[];
      error?: string;
    }>;
    totalItems: number;
  };
  insights?: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keyInsights: string[];
    opportunities: string[];
    painPoints: string[];
    trendingTopics: string[];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">Sonuç Bulunamadı</h1>
          <p className="text-slate-400 mb-8">Lütfen ana sayfadan yeni bir analiz başlatın.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold transition-all hover:scale-105"
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
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Mükemmel Potansiyel';
    if (score >= 60) return 'İyi Potansiyel';
    if (score >= 40) return 'Orta Potansiyel';
    return 'Düşük Potansiyel';
  };

  // Gerçek veri hesaplamaları
  const activePlatforms = result.multiPlatformData?.platforms?.filter(p => p.items?.length > 0).length || 0;
  const totalResults = result.multiPlatformData?.totalItems || 0;
  const aiInsights = result.insights?.keyInsights?.length || 0;

  return (
    <>
      <SEOHead
        title={`🎉 ${result.classification?.primaryCategory || 'Startup'} Doğrulama Sonuçları | Validationly`}
        description="Startup fikrinizin AI destekli doğrulama sonuçları ve eylem planı"
        keywords="startup doğrulama, fikir doğrulama, pazar araştırması, startup araçları"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
            <div className="text-center mb-8">
              {/* Category Badge */}
              {result.classification && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-6">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>STARTUP DOĞRULAMA RAPORU</span>
                </div>
              )}

              {/* Idea Title */}
              <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">
                "{result.idea}"
              </h1>

              {/* Score Display */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className={`text-8xl font-bold mb-4 ${getScoreColor(result.demandScore)}`}>
                    {result.demandScore}%
                  </div>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 ${getScoreBg(result.demandScore)} border rounded-full`}>
                    <div className={`w-2 h-2 ${getScoreColor(result.demandScore).replace('text-', 'bg-')} rounded-full`}></div>
                    <span className={`${getScoreColor(result.demandScore)} font-semibold`}>
                      {getScoreLabel(result.demandScore)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 max-w-md">
                  <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                    <span>📊</span> Analiz Özeti
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {result.scoreJustification}
                  </p>
                </div>
              </div>

              {/* Classification Tags */}
              {result.classification && (
                <div className="flex flex-wrap justify-center gap-3">
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
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🌐</span>
              </div>
              <div className="text-4xl font-bold text-indigo-400 mb-2">{activePlatforms}</div>
              <p className="text-slate-300 font-medium">Aktif Platform</p>
              <p className="text-slate-400 text-sm mt-1">Analiz tamamlandı</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📊</span>
              </div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">{totalResults}</div>
              <p className="text-slate-300 font-medium">Toplam Sonuç</p>
              <p className="text-slate-400 text-sm mt-1">Analiz edilen içerik</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🧠</span>
              </div>
              <div className="text-4xl font-bold text-purple-400 mb-2">{aiInsights}</div>
              <p className="text-slate-300 font-medium">AI Öngörüler</p>
              <p className="text-slate-400 text-sm mt-1">
                {result.insights?.sentiment === 'positive' ? 'Olumlu' : 
                 result.insights?.sentiment === 'negative' ? 'Olumsuz' : 'Nötr'} sentiment
              </p>
            </div>
          </div>

          {/* AI Insights */}
          {result.insights && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>🧠</span> AI Öngörüleri
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.insights.keyInsights && result.insights.keyInsights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-cyan-400">💡 Temel Öngörüler</h3>
                    <ul className="space-y-2">
                      {result.insights.keyInsights.map((insight, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.insights.opportunities && result.insights.opportunities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-400">🚀 Fırsatlar</h3>
                    <ul className="space-y-2">
                      {result.insights.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.insights.painPoints && result.insights.painPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-400">⚠️ Zorluklar</h3>
                    <ul className="space-y-2">
                      {result.insights.painPoints.map((painPoint, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          {painPoint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {result.insights.trendingTopics && result.insights.trendingTopics.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">🔥 Trend Konular</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.insights.trendingTopics.map((topic, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* YouTube Data */}
          {result.youtubeData && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📺</span> YouTube Pazar Verisi
              </h2>
              
              {/* YouTube Stats */}
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
                  <p className="text-slate-300 text-sm">Son 30 Gün</p>
                </div>
              </div>

              {/* Top Videos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">🔥 En Popüler Videolar</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {result.youtubeData.searchResults.videos.slice(0, 5).map((video, index) => (
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
                            <span>👁️ {parseInt(video.viewCount).toLocaleString()}</span>
                            <span>👍 {parseInt(video.likeCount).toLocaleString()}</span>
                            <span>💬 {parseInt(video.commentCount).toLocaleString()}</span>
                            <span>📅 {new Date(video.publishedAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs">📺 {video.channelTitle}</span>
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
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">🏆 En Aktif Kanallar</h3>
                <div className="flex flex-wrap gap-2">
                  {result.youtubeData.trendAnalysis.topChannels.slice(0, 5).map((channel, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm"
                    >
                      #{index + 1} {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Platform Data */}
          {result.multiPlatformData && result.multiPlatformData.platforms && (
            <div className="space-y-6 mb-8">
              {result.multiPlatformData.platforms.map((platform, index) => {
                if (!platform.items || platform.items.length === 0) return null;
                
                const platformConfig = {
                  reddit: { name: 'Reddit', icon: '🔴', color: 'red' },
                  hackernews: { name: 'Hacker News', icon: '🟠', color: 'orange' },
                  producthunt: { name: 'Product Hunt', icon: '🚀', color: 'pink' },
                  github: { name: 'GitHub', icon: '⚫', color: 'gray' },
                  stackoverflow: { name: 'Stack Overflow', icon: '📚', color: 'yellow' },
                  googlenews: { name: 'Google News', icon: '📰', color: 'blue' }
                };

                const config = platformConfig[platform.platform as keyof typeof platformConfig];
                if (!config) return null;

                return (
                  <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                      <span>{config.icon}</span> {config.name} Verisi
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className={`bg-${config.color}-500/10 border border-${config.color}-500/20 rounded-xl p-4 text-center`}>
                        <div className={`text-2xl font-bold text-${config.color}-400 mb-1`}>
                          {platform.items.length}
                        </div>
                        <p className="text-slate-300 text-sm">Toplam Sonuç</p>
                      </div>
                      
                      <div className={`bg-${config.color}-500/10 border border-${config.color}-500/20 rounded-xl p-4 text-center`}>
                        <div className={`text-2xl font-bold text-${config.color}-400 mb-1`}>
                          {platform.items.filter(item => item.score && item.score > 50).length}
                        </div>
                        <p className="text-slate-300 text-sm">Yüksek Skor</p>
                      </div>
                      
                      <div className={`bg-${config.color}-500/10 border border-${config.color}-500/20 rounded-xl p-4 text-center`}>
                        <div className={`text-2xl font-bold text-${config.color}-400 mb-1`}>
                          {platform.items.filter(item => {
                            const date = new Date(item.date || item.publishedAt || item.created_at);
                            const thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                            return date > thirtyDaysAgo;
                          }).length}
                        </div>
                        <p className="text-slate-300 text-sm">Son 30 Gün</p>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {platform.items.slice(0, 10).map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-8 h-8 bg-${config.color}-500 rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                              {itemIndex + 1}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white text-sm mb-2 line-clamp-2">
                                {item.title || item.name || item.description || 'Başlık bulunamadı'}
                              </h4>
                              
                              {item.description && item.title && (
                                <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                                {item.score && <span>📊 {item.score}</span>}
                                {item.upvotes && <span>⬆️ {item.upvotes}</span>}
                                {item.comments && <span>💬 {item.comments}</span>}
                                {item.stars && <span>⭐ {item.stars}</span>}
                                {(item.date || item.publishedAt || item.created_at) && (
                                  <span>📅 {new Date(item.date || item.publishedAt || item.created_at).toLocaleDateString('tr-TR')}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                {item.author && (
                                  <span className="text-slate-500 text-xs">👤 {item.author}</span>
                                )}
                                {item.url && (
                                  <a 
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-${config.color}-400 hover:text-${config.color}-300 text-xs transition-colors`}
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

                    {platform.items.length > 10 && (
                      <div className="mt-4 text-center">
                        <span className="text-slate-400 text-sm">
                          +{platform.items.length - 10} daha fazla sonuç mevcut
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
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
                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-blue-400 text-xl">🐦</span>
                      <h3 className="font-semibold text-blue-400">Twitter/X</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions.tweetSuggestion}
                    </p>
                  </div>
                )}

                {result.socialMediaSuggestions.linkedinSuggestion && (
                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-blue-600 text-xl">💼</span>
                      <h3 className="font-semibold text-blue-600">LinkedIn</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions.linkedinSuggestion}
                    </p>
                  </div>
                )}

                {result.socialMediaSuggestions.redditTitleSuggestion && (
                  <div className="bg-slate-800/50 rounded-xl p-6 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-orange-500 text-xl">🔴</span>
                      <h3 className="font-semibold text-orange-500">Reddit</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-orange-300 mb-2">Başlık:</h4>
                        <p className="text-slate-300 text-sm font-medium">
                          {result.socialMediaSuggestions.redditTitleSuggestion}
                        </p>
                      </div>
                      {result.socialMediaSuggestions.redditBodySuggestion && (
                        <div>
                          <h4 className="font-medium text-orange-300 mb-2">İçerik:</h4>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {result.socialMediaSuggestions.redditBodySuggestion}
                          </p>
                        </div>
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