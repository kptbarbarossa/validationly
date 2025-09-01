import React, { useState, useEffect } from 'react';
import { ToolRecommendation, ToolCategory, PremiumPlatformData } from '../types';

interface ToolRecommendationsProps {
  idea: string;
  platformData: PremiumPlatformData[];
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
  platformData
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

  // Ana içerik olarak Login to See Price bloğunu göster
  if (!isLoading) {
    return (
      <div className="space-y-8 mb-12">
        {/* Recommended Tools Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
            🛠️ Recommended Tools
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Curated tools and services to help you build and grow your startup
          </p>
        </div>
        {/* Login to See Price Block - Premium Design */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md mx-auto hover:border-white/30 transition-all duration-300 group">
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                <span className="text-white font-bold text-sm">B2B</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-white truncate">Login to See Price</h3>
                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/30">
                  Shopify App
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                Hide product prices from guests to drive account signups and grow your email list. Perfect for B2B stores and wholesale strategies.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Easy installation</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">B2B ready</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Mobile optimized</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Zero maintenance</span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://apps.shopify.com/shhhh-pricing"
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105 text-sm font-semibold w-full justify-center"
              >
                <span>🛍️</span>
                <span>View on Shopify</span>
              </a>
            </div>
          </div>
        </div>

        {/* Capacity.so Affiliate Card - Premium Design */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md mx-auto hover:border-white/30 transition-all duration-300 group">
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <img 
                  src="https://capacity.so/favicon.ico" 
                  alt="Capacity Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = "w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300";
                      parent.innerHTML = '<span class="text-white font-bold text-lg">C</span>';
                    }
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-white truncate">Capacity</h3>
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/30">
                  AI Assistant
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                AI-powered knowledge management and team collaboration platform. Perfect for startups to organize ideas and automate workflows.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">AI automation</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Team collaboration</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Knowledge base</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Workflow optimization</span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://capacity.so/?via=barbaros"
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105 text-sm font-semibold w-full justify-center"
              >
                <span>🚀</span>
                <span>Try Capacity Free</span>
              </a>
            </div>
          </div>
        </div>

        {/* StoryShort.ai Affiliate Card - Premium Design */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md mx-auto hover:border-white/30 transition-all duration-300 group">
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <img 
                  src="https://storyshort.ai/favicon.ico" 
                  alt="StoryShort Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = "w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300";
                      parent.innerHTML = '<span class="text-white font-bold text-lg">S</span>';
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-white truncate">StoryShort</h3>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/30">
                  AI Video Creator
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                Transform your ideas into engaging short videos with AI. Perfect for content marketing, social media, and startup storytelling.
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">AI video generation</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Social media ready</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Multiple formats</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Quick creation</span>
                </div>
              </div>
              
              {/* CTA */}
              <a
                href="https://storyshort.ai/?via=barbaros"
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 text-sm font-semibold w-full justify-center"
              >
                <span>🎬</span>
                <span>Create Videos with AI</span>
              </a>
            </div>
          </div>
        </div>

        {/* NextUpKit Affiliate Card - Premium Design */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md mx-auto hover:border-white/30 transition-all duration-300 group">
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <img 
                  src="https://www.nextupkit.com/favicon.ico" 
                  alt="NextUpKit Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = "w-14 h-14 bg-gradient-to-br from-orange-500 via-red-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300";
                      parent.innerHTML = '<span class="text-white font-bold text-lg">N</span>';
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-white truncate">NextUpKit</h3>
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold border border-orange-500/30">
                  Startup Toolkit
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                Complete startup toolkit with templates, resources, and tools to launch your next project faster. Perfect for founders and developers.
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Ready templates</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Launch resources</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Time-saving tools</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Proven frameworks</span>
                </div>
              </div>
              
              {/* CTA */}
              <a
                href="https://nextupkit.lemonsqueezy.com?aff=rYX8Vm"
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105 text-sm font-semibold w-full justify-center"
              >
                <span>🚀</span>
                <span>Get NextUpKit</span>
              </a>
            </div>
          </div>
        </div>

        {/* TapRefer Affiliate Card - Premium Design */}
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md mx-auto hover:border-white/30 transition-all duration-300 group">
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <img 
                  src="https://taprefer.com/favicon.ico" 
                  alt="TapRefer Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = "w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-300";
                      parent.innerHTML = '<span class="text-white font-bold text-lg">T</span>';
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-white truncate">TapRefer</h3>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                  Referral Platform
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                Build a powerful referral program to grow your business. Track referrals, reward customers, and boost sales with automated marketing.
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Automated tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Custom rewards</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="truncate">Easy integration</span>
                </div>
              </div>
              
              {/* CTA */}
              <a
                href="https://taprefer.com?aff=rYX8Vm"
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all transform hover:scale-105 text-sm font-semibold w-full justify-center"
              >
                <span>🎯</span>
                <span>Start Referral Program</span>
              </a>
            </div>
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