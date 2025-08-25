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
    { id: 'googlenews', name: 'Google News', icon: '📰', color: 'from-blue-500 to-green-500' }
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
      {/* Platform Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const score = getPlatformScore(platform.id);
          const data = getPlatformData(platform.id);
          const hasData = data && data.items && data.items.length > 0;
          
          return (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
              className={`glass glass-border p-4 rounded-2xl text-center transition-all hover:scale-105 ${
                selectedPlatform === platform.id ? 'ring-2 ring-blue-500' : ''
              } ${hasData ? '' : 'opacity-50'}`}
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{platform.name}</h3>
              <div className="text-2xl font-bold mb-1">
                <span className={`bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>
                  {score}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {hasData ? `${data.items.length} sonuç` : 'Veri yok'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Platform Details */}
      {selectedPlatform && (
        <div className="glass glass-border p-6 rounded-2xl animate-slideDown">
          {(() => {
            const platform = platforms.find(p => p.id === selectedPlatform);
            const data = getPlatformData(selectedPlatform);
            
            if (!platform) return null;

            return (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{platform.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{platform.name} Analizi</h3>
                    <p className="text-slate-400">
                      Skor: <span className={`font-semibold bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>
                        {getPlatformScore(selectedPlatform)}/100
                      </span>
                    </p>
                  </div>
                </div>

                {data && data.items && data.items.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      Bulunan İçerikler ({data.items.length})
                    </h4>
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {data.items.slice(0, 5).map((item: any, index: number) => (
                        <div key={index} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                          <h5 className="font-medium text-white mb-2 line-clamp-2">
                            {item.title || item.name || 'Başlık bulunamadı'}
                          </h5>
                          {item.description && (
                            <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {item.score && <span>Skor: {item.score}</span>}
                            {item.engagement && <span>Etkileşim: {item.engagement}</span>}
                            {item.date && <span>Tarih: {item.date}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {data.items.length > 5 && (
                      <p className="text-center text-slate-400 text-sm">
                        +{data.items.length - 5} daha fazla sonuç
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📭</div>
                    <h4 className="font-semibold text-slate-300 mb-2">Veri Bulunamadı</h4>
                    <p className="text-slate-400 text-sm">
                      Bu platform için henüz analiz verisi mevcut değil.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Platform Summary */}
      <div className="glass glass-border p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-center text-blue-400">
          📊 Platform Özeti
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {result.multiPlatformData?.totalItems || 0}
            </div>
            <p className="text-slate-400">Toplam Sonuç</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {platforms.filter(p => getPlatformScore(p.id) > 0).length}
            </div>
            <p className="text-slate-400">Aktif Platform</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {Math.round(platforms.reduce((acc, p) => acc + getPlatformScore(p.id), 0) / platforms.length)}
            </div>
            <p className="text-slate-400">Ortalama Skor</p>
          </div>
        </div>
      </div>
    </div>
  );
};