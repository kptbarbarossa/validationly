import React, { useState, useEffect } from 'react';
import { ToolRecommendation, ToolCategory, PremiumPlatformData, UserPlan } from '../types';

interface ToolRecommendationsProps {
  idea: string;
  platformData: PremiumPlatformData[];
  userPlan: UserPlan;
}

// Tool database - gerçek affiliate linkleri eklenecek
const AVAILABLE_TOOLS: ToolRecommendation[] = [
  // Buraya gerçek affiliate linkli toollar eklenecek
];

const CATEGORY_ICONS: Record<ToolCategory, string> = {
  analytics: '📊',
  marketing: '📈',
  development: '⚡',
  design: '🎨',
  productivity: '📝',
  hosting: '☁️',
  database: '🗄️',
  payment: '💳',
  communication: '💬',
  automation: '🤖',
  security: '🔒',
  testing: '🧪'
};

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  analytics: 'from-blue-500 to-cyan-500',
  marketing: 'from-green-500 to-emerald-500',
  development: 'from-purple-500 to-violet-500',
  design: 'from-pink-500 to-rose-500',
  productivity: 'from-orange-500 to-amber-500',
  hosting: 'from-indigo-500 to-blue-500',
  database: 'from-gray-500 to-slate-500',
  payment: 'from-yellow-500 to-orange-500',
  communication: 'from-teal-500 to-cyan-500',
  automation: 'from-red-500 to-pink-500',
  security: 'from-emerald-500 to-teal-500',
  testing: 'from-violet-500 to-purple-500'
};

export const ToolRecommendations: React.FC<ToolRecommendationsProps> = ({
  idea,
  platformData,
  userPlan
}) => {
  const [recommendations, setRecommendations] = useState<ToolRecommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  useEffect(() => {
    generateRecommendations();
  }, [idea, platformData]);

  const generateRecommendations = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Şu anda hiç tool yok - affiliate linkler eklenene kadar boş
    setRecommendations(AVAILABLE_TOOLS);
    setIsLoading(false);
  };

  const handleAffiliateClick = (tool: ToolRecommendation) => {
    // Track click for analytics
    console.log(`Affiliate click tracked: ${tool.name}`);

    // In production, this would open the actual affiliate link
    alert(`Redirecting to ${tool.name}... (Demo mode - affiliate link: ${tool.affiliateLink})`);
  };

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(tool => tool.category === selectedCategory);

  const categories = Array.from(new Set(recommendations.map(tool => tool.category)));
  const totalEstimatedCost = recommendations
    .filter(tool => tool.pricing.startingPrice)
    .reduce((acc, tool) => {
      const price = parseFloat(tool.pricing.startingPrice?.replace(/[^0-9.]/g, '') || '0');
      return acc + price;
    }, 0);

  // Eğer hiç tool yoksa, boş state göster
  if (!isLoading && recommendations.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10 mb-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Tool Recommendations Coming Soon
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're curating the best tools for your startup journey.
            Affiliate partnerships will be added soon to help you build your "{idea}" with the right stack.
          </p>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 This section will show personalized tool recommendations based on your platform analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10 mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-700/50 rounded-xl p-6">
                <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            🛠️ Recommended Tools for Your Startup
          </h2>
          <p className="text-gray-400">
            Curated tools to help you build "{idea}" based on your platform analysis
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Estimated Monthly Cost</div>
          <div className="text-2xl font-bold text-green-400">
            ${totalEstimatedCost.toFixed(0)}/mo
          </div>
          <div className="text-xs text-gray-500">
            {recommendations.filter(t => t.pricing.free).length} free tools included
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
            ? 'bg-white text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          All ({recommendations.length})
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${selectedCategory === category
              ? 'bg-white text-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <span>{CATEGORY_ICONS[category]}</span>
            <span className="capitalize">{category}</span>
            <span className="text-xs opacity-75">
              ({recommendations.filter(t => t.category === category).length})
            </span>
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecommendations.map((tool) => (
          <div
            key={tool.id}
            className="bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 overflow-hidden"
          >
            {/* Tool Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[tool.category]} flex items-center justify-center text-2xl`}>
                    {CATEGORY_ICONS[tool.category]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400 capitalize">{tool.category}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-blue-400">{tool.relevanceScore}% match</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {tool.pricing.free && (
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium mb-1">
                      FREE
                    </div>
                  )}
                  {tool.pricing.startingPrice && (
                    <div className="text-white font-semibold">
                      {tool.pricing.startingPrice}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    {tool.commission}% commission
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {tool.description}
              </p>

              {/* Use Case */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <div className="text-blue-400 text-xs font-medium mb-1">Why this tool?</div>
                <p className="text-blue-300 text-sm">{tool.reason}</p>
              </div>

              {/* Key Features */}
              <div className="mb-4">
                <div className="text-gray-400 text-xs font-medium mb-2">Key Features</div>
                <div className="flex flex-wrap gap-2">
                  {tool.features.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                  {tool.features.length > 3 && (
                    <span className="text-gray-400 text-xs">
                      +{tool.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAffiliateClick(tool)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all bg-gradient-to-r ${CATEGORY_COLORS[tool.category]} text-white hover:shadow-lg hover:scale-105`}
                >
                  Get Started
                </button>
                <button
                  onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  {expandedTool === tool.id ? '▼' : '▶'}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedTool === tool.id && (
              <div className="border-t border-white/10 p-6 bg-gray-800/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pros & Cons */}
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">✅ Pros</h4>
                    <ul className="space-y-1 text-sm text-gray-300 mb-4">
                      {tool.pros.map((pro, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-red-400 font-medium mb-2">❌ Cons</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {tool.cons.map((con, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alternatives & Use Case */}
                  <div>
                    <h4 className="text-purple-400 font-medium mb-2">🔄 Alternatives</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.alternatives?.map((alt, i) => (
                        <span
                          key={i}
                          className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-blue-400 font-medium mb-2">💡 Use Case</h4>
                    <p className="text-sm text-gray-300">{tool.useCase}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            💡 These recommendations are based on your idea analysis and platform data
          </div>
          <div>
            🤝 Affiliate partnerships help keep Validationly free
          </div>
        </div>
      </div>
    </div>
  );
};