import React, { useState } from 'react';

interface PlatformCardProps {
  platform: {
    platform: string;
    items: any[];
    error?: string;
  };
}

const platformConfig = {
  reddit: {
    name: 'Reddit',
    icon: '🔴',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-300'
  },
  hackernews: {
    name: 'Hacker News',
    icon: '🟠',
    color: 'from-orange-400 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-300'
  },
  producthunt: {
    name: 'Product Hunt',
    icon: '🚀',
    color: 'from-orange-500 to-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    textColor: 'text-pink-300'
  },
  github: {
    name: 'GitHub',
    icon: '⚫',
    color: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    textColor: 'text-gray-300'
  },
  stackoverflow: {
    name: 'Stack Overflow',
    icon: '📚',
    color: 'from-orange-400 to-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    textColor: 'text-yellow-300'
  },
  youtube: {
    name: 'YouTube',
    icon: '📺',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-300'
  },
  googlenews: {
    name: 'Google News',
    icon: '📰',
    color: 'from-blue-500 to-green-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-300'
  }
};

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  const [showDetails, setShowDetails] = useState(false);
  const config = platformConfig[platform.platform as keyof typeof platformConfig];
  
  if (!config) return null;

  const hasData = platform.items && platform.items.length > 0;
  const itemCount = platform.items?.length || 0;

  return (
    <div className="glass glass-border rounded-2xl p-6 hover:shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${config.bgColor} ${config.borderColor} border rounded-xl flex items-center justify-center`}>
            <span className="text-2xl">{config.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{config.name}</h3>
            <p className={`text-sm ${config.textColor}`}>
              {hasData ? `${itemCount} sonuç bulundu` : 'Veri bulunamadı'}
            </p>
          </div>
        </div>
        
        {hasData && (
          <div className="text-right">
            <div className={`text-3xl font-bold ${config.textColor}`}>
              {itemCount}
            </div>
            <p className="text-slate-400 text-sm">İçerik</p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        {hasData ? (
          <div className={`inline-flex items-center gap-2 px-3 py-1 ${config.bgColor} ${config.borderColor} border rounded-full`}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm font-medium">Aktif</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-500/10 border border-gray-500/20 rounded-full">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-400 text-sm font-medium">Veri Yok</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {platform.error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-300 text-sm">⚠️ {platform.error}</p>
        </div>
      )}

      {/* Content Preview */}
      {hasData && (
        <>
          <div className="space-y-3 mb-4">
            {platform.items.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700">
                <h4 className="font-medium text-white text-sm mb-1 line-clamp-2">
                  {item.title || item.name || item.description || 'Başlık bulunamadı'}
                </h4>
                {item.description && item.title && (
                  <p className="text-slate-400 text-xs line-clamp-2 mb-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {item.score && <span>Skor: {item.score}</span>}
                  {item.engagement && <span>Etkileşim: {item.engagement}</span>}
                  {item.date && <span>Tarih: {new Date(item.date).toLocaleDateString('tr-TR')}</span>}
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Görüntüle →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {itemCount > 3 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full py-2 px-4 ${config.bgColor} ${config.borderColor} border rounded-lg ${config.textColor} hover:bg-opacity-20 transition-all text-sm font-medium`}
            >
              {showDetails ? 'Daha Az Göster' : `+${itemCount - 3} Daha Fazla Göster`}
            </button>
          )}

          {/* Detailed View */}
          {showDetails && itemCount > 3 && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {platform.items.slice(3).map((item: any, index: number) => (
                <div key={index + 3} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700">
                  <h4 className="font-medium text-white text-sm mb-1 line-clamp-2">
                    {item.title || item.name || item.description || 'Başlık bulunamadı'}
                  </h4>
                  {item.description && item.title && (
                    <p className="text-slate-400 text-xs line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.score && <span>Skor: {item.score}</span>}
                    {item.engagement && <span>Etkileşim: {item.engagement}</span>}
                    {item.date && <span>Tarih: {new Date(item.date).toLocaleDateString('tr-TR')}</span>}
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Görüntüle →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!hasData && !platform.error && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">{config.icon}</div>
          <h4 className="font-semibold text-slate-300 mb-2">Veri Bulunamadı</h4>
          <p className="text-slate-400 text-sm">
            Bu platform için henüz analiz verisi mevcut değil.
          </p>
        </div>
      )}
    </div>
  );
};