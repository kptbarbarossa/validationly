import React, { useState } from 'react';
import type { PlatformInsight } from '../types/platformScanner';
import { PLATFORMS } from '../constants';

interface SmartPlatformCardProps {
  platformInsight: PlatformInsight;
  className?: string;
}

const SmartPlatformCard: React.FC<SmartPlatformCardProps> = ({ 
  platformInsight, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const platformInfo = PLATFORMS.find(p => p.name === platformInsight.platform);
  
  if (!platformInfo) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'high': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'high': return '🚀';
      case 'medium': return '📈';
      case 'low': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className={`bg-gray-800/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 ${className}`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${platformInfo.bgColor}`}>
              {platformInfo.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{platformInfo.displayName}</h3>
              <p className="text-sm text-gray-400">AI-Powered Analysis</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStrengthColor(platformInsight.strength)}`}>
            <span className="mr-1">{getStrengthIcon(platformInsight.strength)}</span>
            {platformInsight.strength.toUpperCase()}
          </div>
        </div>

        {/* Market Fit Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Market Fit Score</span>
            <span className="text-lg font-bold text-blue-400">{platformInsight.marketFit}/100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${platformInsight.marketFit}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{platformInsight.opportunities.length}</div>
            <div className="text-xs text-gray-400">Opportunities</div>
          </div>
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{platformInsight.risks.length}</div>
            <div className="text-xs text-gray-400">Risks</div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className="border-t border-white/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <span className="text-sm font-medium text-gray-300">View AI Insights</span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="p-4 space-y-4 bg-gray-700/20">
            {/* Opportunities */}
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Opportunities
              </h4>
              <div className="space-y-2">
                {platformInsight.opportunities.map((opportunity, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                    {opportunity}
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center">
                <span className="mr-2">⚠️</span>
                Risks
              </h4>
              <div className="space-y-2">
                {platformInsight.risks.map((risk, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    {risk}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                <span className="mr-2">🎯</span>
                AI Recommendations
              </h4>
              <div className="space-y-2">
                {platformInsight.recommendations.map((recommendation, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPlatformCard;
