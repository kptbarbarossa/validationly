import React from 'react';

interface MultiPlatformSummaryProps {
  platformBreakdown: {
    reddit: number;
    hackernews: number;
    producthunt: number;
    googlenews: number;
    github: number;
    stackoverflow: number;
    youtube: number;
  };
  totalItems: number;
}

const MultiPlatformSummary: React.FC<MultiPlatformSummaryProps> = ({ 
  platformBreakdown, 
  totalItems 
}) => {
  const platforms = [
    { 
      name: 'Reddit', 
      key: 'reddit', 
      icon: '🤖', 
      color: 'from-orange-500 to-red-500',
      description: 'Community discussions'
    },
    { 
      name: 'Hacker News', 
      key: 'hackernews', 
      icon: '📰', 
      color: 'from-orange-600 to-yellow-500',
      description: 'Tech community'
    },
    { 
      name: 'Product Hunt', 
      key: 'producthunt', 
      icon: '🚀', 
      color: 'from-orange-500 to-pink-500',
      description: 'Product launches'
    },
    { 
      name: 'Google News', 
      key: 'googlenews', 
      icon: '📰', 
      color: 'from-blue-500 to-green-500',
      description: 'News coverage'
    },
    { 
      name: 'GitHub', 
      key: 'github', 
      icon: '💻', 
      color: 'from-gray-600 to-gray-800',
      description: 'Open source projects'
    },
    { 
      name: 'Stack Overflow', 
      key: 'stackoverflow', 
      icon: '❓', 
      color: 'from-orange-500 to-yellow-600',
      description: 'Developer questions'
    },
    { 
      name: 'YouTube', 
      key: 'youtube', 
      icon: '📺', 
      color: 'from-red-500 to-red-600',
      description: 'Video content'
    }
  ];

  const getActivityLevel = (count: number) => {
    if (count === 0) return { level: 'None', color: 'text-gray-500' };
    if (count <= 5) return { level: 'Low', color: 'text-yellow-400' };
    if (count <= 15) return { level: 'Medium', color: 'text-blue-400' };
    return { level: 'High', color: 'text-green-400' };
  };

  return (
    <div className="glass glass-border p-8 rounded-3xl mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        🌐 Multi-Platform Analysis Summary
      </h2>
      
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-white mb-2">{totalItems}</div>
        <p className="text-slate-400">Total items analyzed across all platforms</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {platforms.map((platform) => {
          const count = platformBreakdown[platform.key as keyof typeof platformBreakdown];
          const activity = getActivityLevel(count);
          
          return (
            <div 
              key={platform.key}
              className="glass glass-border p-4 rounded-xl text-center hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <h3 className="font-bold text-sm mb-1 text-white">{platform.name}</h3>
              <div className={`text-2xl font-bold mb-1 ${activity.color}`}>
                {count}
              </div>
              <div className={`text-xs ${activity.color}`}>
                {activity.level}
              </div>
              <p className="text-xs text-slate-500 mt-1">{platform.description}</p>
            </div>
          );
        })}
      </div>

      {/* Platform Insights */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl mb-2">🏆</div>
          <h3 className="font-bold text-lg mb-2">Top Platform</h3>
          <p className="text-slate-300">
            {platforms.find(p => 
              platformBreakdown[p.key as keyof typeof platformBreakdown] === 
              Math.max(...Object.values(platformBreakdown))
            )?.name || 'None'}
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-bold text-lg mb-2">Coverage</h3>
          <p className="text-slate-300">
            {Object.values(platformBreakdown).filter(count => count > 0).length}/7 platforms
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="font-bold text-lg mb-2">Engagement</h3>
          <p className="text-slate-300">
            {totalItems > 50 ? 'High' : totalItems > 20 ? 'Medium' : 'Low'} activity
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiPlatformSummary;