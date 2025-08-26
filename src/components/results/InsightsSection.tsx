import React from 'react';

interface InsightsSectionProps {
  insights?: {
    validationScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingTopics: string[];
    keyInsights: string[];
    painPoints: string[];
    opportunities: string[];
    popularSolutions: string[];
  };
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
  if (!insights) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🤖</div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Analizi Hazırlanıyor</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Daha detaylı öngörüler için lütfen bekleyin...</p>
      </div>
    );
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'from-green-400 to-emerald-500';
      case 'negative': return 'from-red-400 to-red-500';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Sentiment Overview - Compact */}
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
          <span className="text-xl">{getSentimentEmoji(insights.sentiment)}</span>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Genel Duygu</p>
            <p className={`font-medium text-sm ${
              insights.sentiment === 'positive' ? 'text-green-600 dark:text-green-400' : 
              insights.sentiment === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {insights.sentiment === 'positive' ? 'Olumlu' : 
               insights.sentiment === 'negative' ? 'Olumsuz' : 'Nötr'}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Insights Grid */}
      <div className="space-y-4">
        {/* Key Insights */}
        {insights.keyInsights.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
              <span>💡</span> Temel Öngörüler
            </h4>
            <ul className="space-y-2">
              {insights.keyInsights.slice(0, 3).map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Opportunities */}
        {insights.opportunities.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
              <span>🚀</span> Fırsatlar
            </h4>
            <ul className="space-y-2">
              {insights.opportunities.slice(0, 2).map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-xs">•</span>
                  <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pain Points */}
        {insights.painPoints.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
              <span>⚠️</span> Zorluklar
            </h4>
            <ul className="space-y-2">
              {insights.painPoints.slice(0, 2).map((pain, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1 text-xs">•</span>
                  <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{pain}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Trending Topics - Compact */}
      {insights.trendingTopics.length > 0 && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
          <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
            <span>🔥</span> Trend Konular
          </h4>
          <div className="flex flex-wrap gap-1">
            {insights.trendingTopics.slice(0, 4).map((topic, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-700 dark:text-yellow-300 text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};