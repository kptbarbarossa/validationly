import React from 'react';

interface PlatformAnalysis {
  platform: string;
  interestLevel: number;
}

interface PlatformInfo {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

interface PlatformCardProps {
  analysis: PlatformAnalysis;
  platformInfo: PlatformInfo;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ analysis, platformInfo }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/30';
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 4) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'High Interest';
    if (score >= 6) return 'Good Interest';
    if (score >= 4) return 'Moderate Interest';
    return 'Low Interest';
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${platformInfo.bgColor} ${platformInfo.borderColor} border rounded-xl flex items-center justify-center`}>
            <span className="text-2xl">{platformInfo.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{platformInfo.displayName}</h3>
            <p className={`text-sm ${platformInfo.textColor}`}>
              {getScoreLabel(analysis.interestLevel)}
            </p>
          </div>
        </div>
        
        {/* Score Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(analysis.interestLevel)} ${getScoreColor(analysis.interestLevel)}`}>
          {analysis.interestLevel}/10
        </div>
      </div>

      {/* Interest Level Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Interest Level</span>
          <span>{analysis.interestLevel * 10}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 bg-gradient-to-r ${platformInfo.color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${analysis.interestLevel * 10}%` }}
          />
        </div>
      </div>

      {/* Platform-specific insights */}
      <div className="space-y-2">
        <div className="text-sm text-gray-300">
          <span className="font-medium">Platform Type: </span>
          <span className="capitalize">{platformInfo.name}</span>
        </div>
        
        {analysis.interestLevel >= 7 && (
          <div className="text-sm text-green-400 bg-green-500/10 p-2 rounded-lg">
            🎯 High potential platform for this idea
          </div>
        )}
        
        {analysis.interestLevel >= 5 && analysis.interestLevel < 7 && (
          <div className="text-sm text-yellow-400 bg-yellow-500/10 p-2 rounded-lg">
            ⚡ Moderate potential, worth exploring
          </div>
        )}
        
        {analysis.interestLevel < 5 && (
          <div className="text-sm text-red-400 bg-red-500/10 p-2 rounded-lg">
            ⚠️ Lower interest, consider other platforms
          </div>
        )}
      </div>

      {/* Action suggestions */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Actions:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          {analysis.interestLevel >= 7 && (
            <>
              <li>• Prioritize content creation for this platform</li>
              <li>• Engage with existing community discussions</li>
              <li>• Consider platform-specific features</li>
            </>
          )}
          {analysis.interestLevel >= 5 && analysis.interestLevel < 7 && (
            <>
              <li>• Test content with smaller audience</li>
              <li>• Monitor engagement metrics</li>
              <li>• Optimize content for platform</li>
            </>
          )}
          {analysis.interestLevel < 5 && (
            <>
              <li>• Focus on higher-scoring platforms</li>
              <li>• Reconsider target audience fit</li>
              <li>• Test different content angles</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PlatformCard;
