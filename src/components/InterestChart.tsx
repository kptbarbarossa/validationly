import React from 'react';

interface PlatformAnalysis {
  platform: string;
  interestLevel: number;
}

interface InterestChartProps {
  data: PlatformAnalysis[];
}

const InterestChart: React.FC<InterestChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.interestLevel - a.interestLevel);
  const maxScore = Math.max(...data.map(d => d.interestLevel));

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'from-green-400 to-green-600';
    if (score >= 6) return 'from-yellow-400 to-yellow-600';
    if (score >= 4) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 8) return 'text-green-300';
    if (score >= 6) return 'text-yellow-300';
    if (score >= 4) return 'text-orange-300';
    return 'text-red-300';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      twitter: '🐦',
      reddit: '🔴',
      linkedin: '💼',
      instagram: '📸',
      tiktok: '🎵',
      youtube: '📺',
      facebook: '📘',
      producthunt: '🚀',
      github: '⚫',
      stackoverflow: '📚'
    };
    return icons[platform] || '📊';
  };

  const getPlatformDisplayName = (platform: string) => {
    const names: { [key: string]: string } = {
      twitter: 'Twitter',
      reddit: 'Reddit',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      facebook: 'Facebook',
      producthunt: 'Product Hunt',
      github: 'GitHub',
      stackoverflow: 'Stack Overflow'
    };
    return names[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        {sortedData.map((item, index) => (
          <div key={item.platform} className="flex items-center space-x-4">
            {/* Platform icon and name */}
            <div className="flex items-center space-x-3 min-w-[120px]">
              <span className="text-2xl">{getPlatformIcon(item.platform)}</span>
              <span className="text-sm font-medium text-gray-300">
                {getPlatformDisplayName(item.platform)}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getScoreColor(item.interestLevel)} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${(item.interestLevel / maxScore) * 100}%` }}
              />
            </div>
            
            {/* Score */}
            <div className={`text-lg font-bold ${getScoreTextColor(item.interestLevel)} min-w-[40px] text-right`}>
              {item.interestLevel}/10
            </div>
          </div>
        ))}
      </div>
      
      {/* Chart legend */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
            <span>Low (1-3)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded"></div>
            <span>Medium (4-5)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
            <span>Good (6-7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
            <span>High (8-10)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestChart;
