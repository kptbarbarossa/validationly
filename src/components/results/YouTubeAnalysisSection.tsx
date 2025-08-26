import React, { useState } from 'react';

interface YouTubeAnalysisSectionProps {
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
}

export const YouTubeAnalysisSection: React.FC<YouTubeAnalysisSectionProps> = ({ youtubeData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'strategy'>('overview');

  if (!youtubeData) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📺</div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">YouTube Verisi Yok</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Bu analiz için YouTube verisi mevcut değil.
        </p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* YouTube Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500">📺</span>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Toplam Video</span>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {youtubeData.trendAnalysis.totalVideos}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500">👁️</span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Toplam İzlenme</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(youtubeData.trendAnalysis.totalViews)}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">📊</span>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Ort. İzlenme</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatNumber(youtubeData.trendAnalysis.averageViews)}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-500">🔥</span>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Aktivite</span>
          </div>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {youtubeData.trendAnalysis.recentActivity ? 'Yüksek' : 'Düşük'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {[
          { id: 'overview', label: '📊 Genel Bakış', icon: '📊' },
          { id: 'videos', label: '📺 Videolar', icon: '📺' },
          { id: 'strategy', label: '🎯 Strateji', icon: '🎯' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Analysis */}
            {youtubeData.aiAnalysis && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🎯</span> Pazar Analizi
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">Pazar Talebi</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {youtubeData.aiAnalysis.youtubeAnalysis.marketDemand}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">İçerik Doygunluğu</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {youtubeData.aiAnalysis.youtubeAnalysis.contentSaturation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🚀</span> Fırsatlar
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">İçerik Boşlukları</h5>
                      <ul className="space-y-1">
                        {youtubeData.aiAnalysis.youtubeAnalysis.contentGaps.slice(0, 3).map((gap, index) => (
                          <li key={index} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Channels */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span>🏆</span> Popüler Kanallar
              </h4>
              <div className="flex flex-wrap gap-2">
                {youtubeData.trendAnalysis.topChannels.slice(0, 5).map((channel, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-full text-red-700 dark:text-red-300 text-sm"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📺</span> Popüler Videolar ({youtubeData.searchResults.videos.length})
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {youtubeData.searchResults.videos.slice(0, 8).map((video, index) => (
                <div key={video.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-slate-900 dark:text-white mb-1 line-clamp-2">
                        {video.title}
                      </h5>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <span>📺</span>
                          {video.channelTitle}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👁️</span>
                          {formatNumber(parseInt(video.viewCount))}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          {formatDate(video.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'strategy' && youtubeData.aiAnalysis && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🎯</span> İçerik Stratejisi
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    {youtubeData.aiAnalysis.contentStrategy.recommendedApproach}
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-900 dark:text-white text-sm">Hedef Kitle:</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {youtubeData.aiAnalysis.contentStrategy.targetAudience}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📝</span> İçerik Formatları
                </h4>
                <div className="space-y-2">
                  {youtubeData.aiAnalysis.contentStrategy.contentFormats.map((format, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{format}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Topics */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span>🔑</span> Anahtar Konular
              </h4>
              <div className="flex flex-wrap gap-2">
                {youtubeData.aiAnalysis.contentStrategy.keyTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Validation Insights */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span>✅</span> Doğrulama Öngörüleri
              </h4>
              <ul className="space-y-2">
                {youtubeData.aiAnalysis.validationInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1 text-sm">•</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};