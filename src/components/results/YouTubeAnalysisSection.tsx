import React from 'react';

interface YouTubeData {
  searchResults: {
    videos: Array<{
      id: string;
      title: string;
      viewCount: string;
      channelTitle: string;
      publishedAt: string;
    }>;
    totalResults: number;
  };
  trendAnalysis: {
    totalViews: number;
    averageViews: number;
    totalVideos: number;
    recentActivity: boolean;
    topChannels: string[];
  };
  aiAnalysis?: {
    youtubeAnalysis: {
      marketDemand: string;
      contentSaturation: string;
      audienceEngagement: string;
      contentGaps: string[];
      competitorChannels: string[];
      marketOpportunity: string;
    };
    contentStrategy: {
      recommendedApproach: string;
      keyTopics: string[];
      targetAudience: string;
      contentFormats: string[];
    };
    validationInsights: string[];
  };
}

interface YouTubeAnalysisSectionProps {
  youtubeData: YouTubeData;
}

const YouTubeAnalysisSection: React.FC<YouTubeAnalysisSectionProps> = ({ youtubeData }) => {
  const { searchResults, trendAnalysis, aiAnalysis } = youtubeData;
  
  // Debug: Log YouTube data
  console.log('📺 YouTube data received:', youtubeData);

  const getDemandColor = (demand: string) => {
    switch (demand?.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSaturationColor = (saturation: string) => {
    switch (saturation?.toLowerCase()) {
      case 'untapped': return 'text-green-600 bg-green-50';
      case 'emerging': return 'text-blue-600 bg-blue-50';
      case 'competitive': return 'text-yellow-600 bg-yellow-50';
      case 'oversaturated': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">YouTube Market Analysis</h3>
          <p className="text-gray-600 text-sm">Content landscape and audience insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {trendAnalysis.totalVideos.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Videos Found</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {trendAnalysis.averageViews.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Avg Views</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {(trendAnalysis.totalViews / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-2xl font-bold ${trendAnalysis.recentActivity ? 'text-green-600' : 'text-red-600'}`}>
            {trendAnalysis.recentActivity ? '✓' : '✗'}
          </div>
          <div className="text-sm text-gray-600">Recent Activity</div>
        </div>
      </div>

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="space-y-6">
          {/* Market Assessment */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Market Assessment</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Demand:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(aiAnalysis.youtubeAnalysis.marketDemand)}`}>
                    {aiAnalysis.youtubeAnalysis.marketDemand}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Content Saturation:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSaturationColor(aiAnalysis.youtubeAnalysis.contentSaturation)}`}>
                    {aiAnalysis.youtubeAnalysis.contentSaturation}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Content Strategy</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Target Audience:</span>
                  <p className="text-gray-900">{aiAnalysis.contentStrategy.targetAudience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Gaps */}
          {aiAnalysis.youtubeAnalysis.contentGaps.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Content Opportunities</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Content Gaps</h5>
                  <div className="space-y-1">
                    {aiAnalysis.youtubeAnalysis.contentGaps.map((gap, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">
                        {gap}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Topics</h5>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.contentStrategy.keyTopics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Channels */}
          {trendAnalysis.topChannels.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Leading Channels</h4>
              <div className="flex flex-wrap gap-2">
                {trendAnalysis.topChannels.map((channel, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Validation Insights */}
          {aiAnalysis.validationInsights.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
              <div className="space-y-2">
                {aiAnalysis.validationInsights.map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Opportunity */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Market Opportunity</h4>
            <p className="text-blue-800 text-sm">{aiAnalysis.youtubeAnalysis.marketOpportunity}</p>
          </div>
        </div>
      )}

      {/* Recent Videos Preview */}
      {searchResults.videos.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Recent Content</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {searchResults.videos.slice(0, 5).map((video) => (
              <div key={video.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm text-gray-900 truncate mb-1">
                  {video.title}
                </div>
                <div className="text-xs text-gray-600">
                  {video.channelTitle} • {parseInt(video.viewCount).toLocaleString()} views
                  {video.publishedAt && (
                    <span> • {new Date(video.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalysisSection;