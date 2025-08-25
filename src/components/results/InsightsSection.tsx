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
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold mb-2">AI Analizi Hazırlanıyor</h3>
        <p className="text-slate-400">Daha detaylı öngörüler için lütfen bekleyin...</p>
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
    <div className="space-y-8">
      {/* Sentiment Overview */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600">
          <span className="text-3xl">{getSentimentEmoji(insights.sentiment)}</span>
          <div>
            <p className="text-sm text-slate-400">Genel Duygu</p>
            <p className={`font-semibold bg-gradient-to-r ${getSentimentColor(insights.sentiment)} bg-clip-text text-transparent`}>
              {insights.sentiment === 'positive' ? 'Olumlu' : 
               insights.sentiment === 'negative' ? 'Olumsuz' : 'Nötr'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="glass glass-border p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
            <span>💡</span> Temel Öngörüler
          </h3>
          <ul className="space-y-3">
            {insights.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-400 mt-1 text-sm">•</span>
                <span className="text-slate-300 text-sm leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="glass glass-border p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
            <span>🚀</span> Fırsatlar
          </h3>
          <ul className="space-y-3">
            {insights.opportunities.map((opportunity, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-400 mt-1 text-sm">•</span>
                <span className="text-slate-300 text-sm leading-relaxed">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pain Points */}
        <div className="glass glass-border p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
            <span>⚠️</span> Zorluklar
          </h3>
          <ul className="space-y-3">
            {insights.painPoints.map((pain, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-red-400 mt-1 text-sm">•</span>
                <span className="text-slate-300 text-sm leading-relaxed">{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Solutions */}
        <div className="glass glass-border p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
            <span>🛠️</span> Mevcut Çözümler
          </h3>
          <ul className="space-y-3">
            {insights.popularSolutions.map((solution, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-purple-400 mt-1 text-sm">•</span>
                <span className="text-slate-300 text-sm leading-relaxed">{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trending Topics */}
      {insights.trendingTopics.length > 0 && (
        <div className="glass glass-border p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
            <span>🔥</span> Trend Konular
          </h3>
          <div className="flex flex-wrap gap-2">
            {insights.trendingTopics.map((topic, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm"
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