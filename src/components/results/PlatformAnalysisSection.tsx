import React, { useState } from 'react';

interface PlatformAnalysisSectionProps {
  result: any;
}

export const PlatformAnalysisSection: React.FC<PlatformAnalysisSectionProps> = ({ result }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const platforms = [
    { id: 'reddit', name: 'Reddit', icon: '🔴', color: 'from-orange-500 to-red-500' },
    { id: 'hackernews', name: 'Hacker News', icon: '🟠', color: 'from-orange-400 to-yellow-500' },
    { id: 'producthunt', name: 'Product Hunt', icon: '🚀', color: 'from-orange-500 to-pink-500' },
    { id: 'github', name: 'GitHub', icon: '⚫', color: 'from-gray-600 to-gray-800' },
    { id: 'stackoverflow', name: 'Stack Overflow', icon: '📚', color: 'from-orange-400 to-yellow-600' },
    { id: 'youtube', name: 'YouTube', icon: '🔴', color: 'from-red-500 to-red-600' },
    { id: 'googlenews', name: 'Google News', icon: '/google.png', color: 'from-blue-500 to-green-500' }
  ];

  const getPlatformScore = (platformId: string) => {
    if (result.insights?.platformBreakdown) {
      return result.insights.platformBreakdown[platformId] || 0;
    }
    return Math.floor(Math.random() * 100); // Fallback for demo
  };

  const getPlatformData = (platformId: string) => {
    if (result.multiPlatformData?.platforms) {
      return result.multiPlatformData.platforms.find(p => p.platform === platformId);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Platform Overview Grid - Dashboard Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const score = getPlatformScore(platform.id);
          const data = getPlatformData(platform.id);
          const hasData = data && data.items && data.items.length > 0;
          
          return (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
              className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                selectedPlatform === platform.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              } ${hasData ? '' : 'opacity-50'}`}
            >
              <div className="text-xl mb-1">
                {platform.icon.startsWith('/') ? (
                  <img src={platform.icon} alt={platform.name} className="w-6 h-6 mx-auto" />
                ) : (
                  platform.icon
                )}
              </div>
              <h3 className="font-medium text-slate-900 dark:text-white text-xs mb-1">{platform.name}</h3>
              <div className="text-lg font-bold mb-1">
                <span className={`${
                  score >= 70 ? 'text-green-600 dark:text-green-400' :
                  score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                  score > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'
                }`}>
                  {score}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hasData ? `${data.items.length} sonuç` : 'Veri yok'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Platform Details - Dashboard Style */}
      {selectedPlatform && (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 p-4">
          {(() => {
            const platform = platforms.find(p => p.id === selectedPlatform);
            const data = getPlatformData(selectedPlatform);
            
            if (!platform) return null;

            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">
                    {platform.icon.startsWith('/') ? (
                      <img src={platform.icon} alt={platform.name} className="w-8 h-8" />
                    ) : (
                      platform.icon
                    )}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{platform.name} Detayları</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Skor: <span className="font-medium">{getPlatformScore(selectedPlatform)}/100</span>
                    </p>
                  </div>
                </div>

                {data && data.items && data.items.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                      Bulunan İçerikler ({data.items.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {data.items.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                          <h5 className="font-medium text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">
                            {item.title || item.name || 'Başlık bulunamadı'}
                          </h5>
                          {item.description && (
                            <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {item.score && <span>Skor: {item.score}</span>}
                            {item.engagement && <span>Etkileşim: {item.engagement}</span>}
                            {item.date && <span>Tarih: {item.date}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {data.items.length > 3 && (
                      <p className="text-center text-slate-500 dark:text-slate-400 text-xs">
                        +{data.items.length - 3} daha fazla sonuç
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">📭</div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Veri Bulunamadı</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Bu platform için henüz analiz verisi mevcut değil.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Platform Summary - Compact Dashboard Style */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="text-center">
          <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
            {result.multiPlatformData?.totalItems || 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Toplam Sonuç</p>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {platforms.filter(p => getPlatformScore(p.id) > 0).length}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Aktif Platform</p>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {Math.round(platforms.reduce((acc, p) => acc + getPlatformScore(p.id), 0) / platforms.length)}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Ortalama Skor</p>
        </div>
      </div>
    </div>
  );
};