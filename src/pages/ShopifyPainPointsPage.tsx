import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface PainPoint {
  category: string;
  topic: string;
  frequency: number;
  sentiment: 'negative' | 'neutral' | 'positive';
  commonIssues: string[];
  solutions: string[];
  impact: 'high' | 'medium' | 'low';
}

interface ShopifyCommunityData {
  categories: {
    name: string;
    topicCount: number;
    url: string;
  }[];
  painPoints: PainPoint[];
  insights: {
    totalIssues: number;
    topCategories: string[];
    commonThemes: string[];
    recommendations: string[];
  };
}

const ShopifyPainPointsPage: React.FC = () => {
  const [data, setData] = useState<ShopifyCommunityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'frequency' | 'impact' | 'category'>('frequency');

  useEffect(() => {
    analyzeShopifyCommunity();
  }, []);

  const analyzeShopifyCommunity = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pain-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'shopify', analysisType: 'comprehensive' }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze Shopify Community');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'negative': return 'text-red-400';
      case 'positive': return 'text-green-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'negative': return '🔴';
      case 'positive': return '🟢';
      default: return '🟡';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const filteredPainPoints = data?.painPoints.filter(point => 
    selectedCategory === 'all' || point.category === selectedCategory
  ).sort((a, b) => {
    switch (sortBy) {
      case 'frequency':
        return b.frequency - a.frequency;
      case 'impact':
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Analyzing Shopify Community pain points...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Analysis Failed</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={analyzeShopifyCommunity}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🛍️ Shopify Pain Points Analyzer
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
            Discover the most common challenges and pain points faced by Shopify store owners 
            based on community discussions and forum analysis
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              ← Back to Validationly
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        {data && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
              <div className="text-3xl font-bold text-white mb-2">{data.insights.totalIssues}</div>
              <div className="text-slate-300">Total Issues Analyzed</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
              <div className="text-3xl font-bold text-white mb-2">{data.categories.length}</div>
              <div className="text-slate-300">Community Categories</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <div className="text-3xl font-bold text-white mb-2">{data.painPoints.length}</div>
              <div className="text-slate-300">Pain Points Identified</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
              <div className="text-3xl font-bold text-white mb-2">
                {data.painPoints.filter(p => p.impact === 'high').length}
              </div>
              <div className="text-slate-300">High Impact Issues</div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-slate-300 mb-2">Filter by Category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter pain points by category"
              >
                <option value="all">All Categories</option>
                {data?.categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.topicCount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-slate-300 mb-2">Sort by</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Sort pain points by different criteria"
              >
                <option value="frequency">Frequency</option>
                <option value="impact">Impact Level</option>
                <option value="category">Category</option>
              </select>
            </div>
            <button
              onClick={analyzeShopifyCommunity}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh Analysis
            </button>
          </div>
        </div>

        {/* Pain Points Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Pain Points List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Pain Points Analysis</h2>
            {filteredPainPoints.map((point, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(point.impact)} border`}>
                        {point.impact.toUpperCase()} Impact
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(point.sentiment)} bg-slate-700/50 border border-slate-600`}>
                        {getSentimentIcon(point.sentiment)} {point.sentiment}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{point.topic}</h3>
                    <p className="text-slate-400 text-sm mb-3">{point.category}</p>
                    <div className="text-2xl font-bold text-indigo-400">{point.frequency}</div>
                    <div className="text-xs text-slate-500">mentions in community</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Common Issues:</h4>
                    <ul className="space-y-1">
                      {point.commonIssues.map((issue, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Solutions:</h4>
                    <ul className="space-y-1">
                      {point.solutions.map((solution, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights and Recommendations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Insights & Recommendations</h2>
            
            {/* Top Categories */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Top Problem Categories</h3>
              <div className="space-y-3">
                {data?.insights.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-300">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${100 - (index * 20)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">{100 - (index * 20)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Themes */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Common Themes</h3>
              <div className="flex flex-wrap gap-2">
                {data?.insights.commonThemes.map((theme, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs text-indigo-300"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Strategic Recommendations</h3>
              <div className="space-y-3">
                {data?.insights.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-indigo-400 text-sm mt-1">💡</span>
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Categories */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Community Categories</h3>
              <div className="space-y-2">
                {data?.categories.slice(0, 6).map((category) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{category.name}</span>
                    <span className="text-slate-400">{category.topicCount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Data Source</h3>
          <p className="text-slate-300 mb-4">
            Analysis based on Shopify Community discussions and forum data from{' '}
            <a 
              href="https://community.shopify.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              community.shopify.com
            </a>
          </p>
          <p className="text-xs text-slate-500">
            This tool analyzes community discussions to identify common pain points, 
            helping store owners understand challenges and find solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopifyPainPointsPage;
