import React, { useState } from 'react';

interface PlatformDetailsProps {
  platformData: Array<{
    platform: string;
    items: any[];
    error?: string;
  }>;
}

const PlatformDetails: React.FC<PlatformDetailsProps> = ({ platformData }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const platformConfig = {
    reddit: { icon: '🤖', color: 'text-orange-400', name: 'Reddit' },
    hackernews: { icon: '📰', color: 'text-orange-500', name: 'Hacker News' },
    producthunt: { icon: '🚀', color: 'text-pink-400', name: 'Product Hunt' },
    googlenews: { icon: '📰', color: 'text-blue-400', name: 'Google News' },
    github: { icon: '💻', color: 'text-gray-400', name: 'GitHub' },
    stackoverflow: { icon: '❓', color: 'text-yellow-400', name: 'Stack Overflow' },
    youtube: { icon: '📺', color: 'text-red-400', name: 'YouTube' }
  };

  const filteredData = selectedPlatform === 'all' 
    ? platformData 
    : platformData.filter(p => p.platform === selectedPlatform);

  const formatItemData = (item: any, platform: string) => {
    switch (platform) {
      case 'reddit':
        return {
          title: item.title,
          description: item.content || item.description,
          engagement: `${item.score || 0} upvotes, ${item.comments || 0} comments`,
          url: item.url,
          source: `r/${item.subreddit || 'unknown'} • by ${item.author || 'unknown'}`
        };
      case 'hackernews':
        return {
          title: item.title,
          description: item.url ? 'External link' : 'Discussion',
          engagement: `${item.score || 0} points, ${item.comments || 0} comments`,
          url: item.source_url || item.url,
          source: `by ${item.author || 'unknown'}`
        };
      case 'github':
        return {
          title: item.name || item.title,
          description: item.description,
          engagement: `⭐ ${item.stars || 0} stars, 🍴 ${item.forks || 0} forks`,
          url: item.url || item.html_url,
          source: item.owner || item.full_name
        };
      case 'stackoverflow':
        return {
          title: item.title,
          description: item.body ? item.body.substring(0, 200) + '...' : '',
          engagement: `${item.score || 0} score, ${item.answers || 0} answers, ${item.views || 0} views`,
          url: item.url,
          source: `by ${item.author || 'unknown'}`
        };
      case 'youtube':
        return {
          title: item.title,
          description: item.description ? item.description.substring(0, 200) + '...' : '',
          engagement: 'Video content',
          url: item.url,
          source: item.channel || 'YouTube'
        };
      case 'producthunt':
      case 'googlenews':
        return {
          title: item.title,
          description: item.description ? item.description.substring(0, 200) + '...' : '',
          engagement: platform === 'googlenews' ? 'News article' : 'Product launch',
          url: item.link || item.url,
          source: item.source || platform
        };
      default:
        return {
          title: item.title || item.name || 'No title',
          description: item.description || item.content || 'No description',
          engagement: 'N/A',
          url: item.url || item.link || '#',
          source: platform
        };
    }
  };

  return (
    <div className="glass glass-border p-8 rounded-3xl mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        📋 Platform Details
      </h2>

      {/* Platform Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedPlatform === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          🌐 All Platforms
        </button>
        {platformData.map((platform) => {
          const config = platformConfig[platform.platform as keyof typeof platformConfig];
          if (!config || platform.items.length === 0) return null;
          
          return (
            <button
              key={platform.platform}
              onClick={() => setSelectedPlatform(platform.platform)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedPlatform === platform.platform
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {config.icon} {config.name} ({platform.items.length})
            </button>
          );
        })}
      </div>

      {/* Platform Items */}
      <div className="space-y-6">
        {filteredData.map((platform) => {
          const config = platformConfig[platform.platform as keyof typeof platformConfig];
          if (!config) return null;

          return (
            <div key={platform.platform}>
              {selectedPlatform === 'all' && (
                <h3 className={`text-xl font-bold mb-4 ${config.color} flex items-center gap-2`}>
                  <span className="text-2xl">{config.icon}</span>
                  {config.name} ({platform.items.length} items)
                </h3>
              )}

              {platform.error ? (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-400">❌ Error loading {config.name}: {platform.error}</p>
                </div>
              ) : platform.items.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-400">No items found on {config.name}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {platform.items.slice(0, 5).map((item, index) => {
                    const formattedItem = formatItemData(item, platform.platform);
                    
                    return (
                      <div key={index} className="bg-slate-800/30 border border-slate-600/20 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white text-sm leading-tight flex-1 mr-4">
                            {formattedItem.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full bg-slate-700 ${config.color}`}>
                            {config.name}
                          </span>
                        </div>
                        
                        {formattedItem.description && (
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                            {formattedItem.description}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">
                            {formattedItem.engagement} • {formattedItem.source}
                          </span>
                          {formattedItem.url && formattedItem.url !== '#' && (
                            <a
                              href={formattedItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              View →
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {platform.items.length > 5 && (
                    <div className="text-center">
                      <p className="text-slate-500 text-sm">
                        ... and {platform.items.length - 5} more items
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No data available for the selected platform.</p>
        </div>
      )}
    </div>
  );
};

export default PlatformDetails;