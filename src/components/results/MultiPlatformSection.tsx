import React, { useState } from 'react';

interface PlatformResult {
  platform: string;
  items: any[];
  totalResults: number;
  error?: string;
  metadata?: any;
}

interface MultiPlatformData {
  platforms: PlatformResult[];
  summary: {
    reddit: number;
    hackernews: number;
    producthunt: number;
    googlenews: number;
    github: number;
    stackoverflow: number;
    youtube: number;
  };
  totalItems: number;
  insights: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    keyInsights: string[];
    painPoints: string[];
    opportunities: string[];
    popularSolutions: string[];
  };
}

interface MultiPlatformSectionProps {
  multiPlatformData: MultiPlatformData;
}

const MultiPlatformSection: React.FC<MultiPlatformSectionProps> = ({ multiPlatformData }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  const { platforms, summary, totalItems, insights } = multiPlatformData;
  
  // Debug: Log platform data
  console.log('🔍 Multi-platform data:', { platforms, summary, totalItems });

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      reddit: '🔴',
      hackernews: '🟠', 
      producthunt: '🚀',
      googlenews: '📰',
      github: '⚫',
      stackoverflow: '📚',
      youtube: '🔴'
    };
    return icons[platform] || '🌐';
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      reddit: 'Reddit',
      hackernews: 'Hacker News',
      producthunt: 'Product Hunt',
      googlenews: 'Google News',
      github: 'GitHub',
      stackoverflow: 'Stack Overflow',
      youtube: 'YouTube'
    };
    return names[platform] || platform;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getValidationScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const selectedPlatformData = platforms.find(p => p.platform === selectedPlatform);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Multi-Platform Validation</h3>
          <p className="text-gray-600 text-sm">Real-time market signals across {platforms.length} platforms</p>
        </div>
      </div>

      {/* Validation Score & Sentiment */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getValidationScoreColor(insights.validationScore)}`}>
            {insights.validationScore}%
          </div>
          <div className="text-sm text-gray-600">Validation Score</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900">
            {totalItems.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Data Points</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(insights.sentiment)}`}>
            {insights.sentiment.charAt(0).toUpperCase() + insights.sentiment.slice(1)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Market Sentiment</div>
        </div>
      </div>

      {/* Platform Summary */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Platform Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(summary).map(([platform, count]) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(selectedPlatform === platform ? null : platform)}
              className={`p-3 rounded-lg border transition-all ${
                selectedPlatform === platform 
                  ? 'border-blue-500 bg-blue-50' 
                  : count > 0 
                    ? 'border-gray-200 hover:border-gray-300 bg-white' 
                    : 'border-gray-100 bg-gray-50 opacity-50'
              }`}
              disabled={count === 0}
            >
              <div className="text-lg mb-1">{getPlatformIcon(platform)}</div>
              <div className="text-sm font-medium text-gray-900">{count}</div>
              <div className="text-xs text-gray-600">{getPlatformName(platform)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Platform Details */}
      {selectedPlatformData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">
            {getPlatformIcon(selectedPlatformData.platform)} {getPlatformName(selectedPlatformData.platform)} Results
          </h4>
          
          {selectedPlatformData.error ? (
            <p className="text-red-600 text-sm">{selectedPlatformData.error}</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedPlatformData.items.slice(0, 5).map((item, index) => (
                <div key={index} className="p-3 bg-white rounded border">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {item.title || item.name || 'Untitled'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {selectedPlatformData.platform === 'reddit' && (
                      <>r/{item.subreddit} • {item.score} points • {item.comments} comments</>
                    )}
                    {selectedPlatformData.platform === 'hackernews' && (
                      <>{item.score} points • {item.comments} comments</>
                    )}
                    {selectedPlatformData.platform === 'github' && (
                      <>{item.stargazers_count} stars • {item.language}</>
                    )}
                    {selectedPlatformData.platform === 'stackoverflow' && (
                      <>{item.score} score • {item.answer_count} answers</>
                    )}
                    {selectedPlatformData.platform === 'producthunt' && (
                      <>Product Hunt • {new Date(item.pubDate).toLocaleDateString()}</>
                    )}
                    {selectedPlatformData.platform === 'googlenews' && (
                      <>{item.source} • {new Date(item.pubDate).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Key Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
          <div className="space-y-2">
            {insights.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Opportunities</h4>
          <div className="space-y-2">
            {insights.opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      {insights.trendingTopics.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Trending Topics</h4>
          <div className="flex flex-wrap gap-2">
            {insights.trendingTopics.map((topic, index) => (
              <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Popular Solutions */}
      {insights.popularSolutions.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Popular Solutions</h4>
          <div className="flex flex-wrap gap-2">
            {insights.popularSolutions.map((solution, index) => (
              <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                {solution}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points */}
      {insights.painPoints.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Challenges & Pain Points</h4>
          <div className="space-y-2">
            {insights.painPoints.map((painPoint, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">{painPoint}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiPlatformSection;