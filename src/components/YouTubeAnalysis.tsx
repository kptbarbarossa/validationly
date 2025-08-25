import React, { useState } from 'react';
import { youtubeService } from '../services/youtubeService';

interface YouTubeAnalysisProps {
  idea: string;
}

export const YouTubeAnalysis: React.FC<YouTubeAnalysisProps> = ({ idea }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeYouTube = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await youtubeService.searchVideos(idea);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          YouTube Analizi
        </h3>
        <button
          onClick={analyzeYouTube}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Analiz Ediliyor...' : 'YouTube\'da Ara'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.totalVideos}
              </div>
              <div className="text-sm text-gray-600">Video Sayısı</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.averageViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Ortalama İzlenme</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Toplam İzlenme</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${analysis.recentActivity ? 'text-green-600' : 'text-red-600'}`}>
                {analysis.recentActivity ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Son Aktivite</div>
            </div>
          </div>

          {analysis.topChannels.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Popüler Kanallar</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.topChannels.map((channel: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.videos && analysis.videos.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Son Videolar</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {analysis.videos.slice(0, 5).map((video: any) => (
                  <div key={video.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {video.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {video.channelTitle} • {parseInt(video.viewCount).toLocaleString()} izlenme
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};