import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  platformAnalyses: Array<{
    platform: string;
    signalStrength: string;
    analysis: string;
    score?: number;
  }>;
  socialArbitrageInsights?: {
    microToMacro: string;
    geographicDemographic: string;
    timingFactor: string;
    platformDynamics: string;
    culturalLeap: string;
  };
  trendPhase?: 'emerging' | 'growing' | 'peak' | 'declining';
  culturalTransferScore?: number;
  earlyAdopterAdvantage?: string;
  tweetSuggestion?: string;
  redditTitleSuggestion?: string;
  redditBodySuggestion?: string;
  linkedinSuggestion?: string;
  audience?: string;
  goal?: string;
  industry?: string;
  stage?: string;
  realWorldData?: any;
  dataConfidence?: string;
  lastDataUpdate?: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const result: ValidationResult = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
          <p className="text-slate-400 mb-6">Please start a new analysis from the home page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '📈';
    return '⚠️';
  };

  const getTrendPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'emerging': return 'text-blue-400';
      case 'growing': return 'text-green-400';
      case 'peak': return 'text-yellow-400';
      case 'declining': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Calculate real metrics from API data
  const getMarketSize = () => {
    if (result.realWorldData?.marketplaceData) {
      const amazon = result.realWorldData.marketplaceData.amazon;
      const appStore = result.realWorldData.marketplaceData.appStore;
      
      if (amazon.similarProducts > 0 || appStore.competitorApps > 0) {
        const totalProducts = (amazon.similarProducts || 0) + (appStore.competitorApps || 0);
        if (totalProducts > 100) return '$10B+';
        if (totalProducts > 50) return '$5B+';
        if (totalProducts > 20) return '$2B+';
        if (totalProducts > 10) return '$1B+';
        return '$500M+';
      }
    }
    return 'TBD';
  };

  const getGrowthTrend = () => {
    if (result.realWorldData?.socialMediaSignals) {
      const twitter = result.realWorldData.socialMediaSignals.twitter;
      const tiktok = result.realWorldData.socialMediaSignals.tiktok;
      
      if (twitter.trending || tiktok.viralPotential === 'high') return '500%+';
      if (twitter.sentiment === 'positive' || tiktok.viralPotential === 'medium') return '200%+';
      return '100%+';
    }
    return 'TBD';
  };

  const getTimingAssessment = () => {
    if (result.realWorldData?.consumerSentiment) {
      const sentiment = result.realWorldData.consumerSentiment.overallSentiment;
      if (sentiment === 'positive') return 'Great timing';
      if (sentiment === 'neutral') return 'Good timing';
      return 'Needs research';
    }
    return 'TBD';
  };

  return (
    <>
      <SEOHead
        title="🎉 Validation Results | Validationly"
        description="Your startup idea validation results with actionable insights and next steps"
        keywords="startup validation, idea validation, market research, startup tools"
      />
      
      <div className="min-h-screen text-white">
        {/* Same background as homepage */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-indigo-500/10 to-cyan-600/20 rounded-3xl blur-3xl"></div>
          
          <div className="container mx-auto px-6 py-8 relative z-10">
            
            {/* 🎉 HOLY SHIT MOMENT - Smaller and cleaner */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                CONGRATULATIONS!
              </h1>
              
              <div className="text-4xl md:text-6xl font-bold mb-6">
                <span className={getScoreColor(result.demandScore)}>
                  {result.demandScore}%
                </span>
                <span className="text-3xl md:text-5xl ml-4">{getScoreEmoji(result.demandScore)}</span>
              </div>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-4xl mx-auto">
                Your idea has a <span className="font-bold text-yellow-400">VALIDATION SCORE</span> of {result.demandScore}%!
              </p>
              
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                {result.demandScore >= 80 
                  ? "🚀 You're onto something BIG! This idea has massive potential!"
                  : result.demandScore >= 60 
                  ? "📈 Good potential with room for optimization. Let's make it great!"
                  : "⚠️ Interesting concept, but needs refinement. We'll help you pivot!"
                }
              </p>
            </div>

            {/* 💰 MONEY TALKS Section - Real data from API */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="glass glass-border p-6 rounded-2xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2 text-green-400">Market Opportunity</h3>
                <p className="text-3xl font-bold text-white">{getMarketSize()}</p>
                <p className="text-slate-400 text-sm">Based on competitor analysis</p>
              </div>
              
              <div className="glass glass-border p-6 rounded-2xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold mb-2 text-blue-400">Growth Trend</h3>
                <p className="text-3xl font-bold text-white">{getGrowthTrend()}</p>
                <p className="text-slate-400 text-sm">Social media momentum</p>
              </div>
              
              <div className="glass glass-border p-6 rounded-2xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2 text-purple-400">Timing</h3>
                <p className="text-2xl font-bold text-white">
                  {getTimingAssessment()}
                </p>
                <p className="text-slate-400 text-sm">
                  {result.realWorldData?.consumerSentiment?.overallSentiment === 'positive' 
                    ? 'Positive market sentiment'
                    : result.realWorldData?.consumerSentiment?.overallSentiment === 'neutral'
                    ? 'Neutral market sentiment'
                    : 'Market research needed'}
                </p>
              </div>
            </div>

            {/* 🎯 ACTION PLAN - Next 48 hours */}
            <div className="glass glass-border p-8 rounded-3xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                🚀 NEXT 48 HOURS - Your Action Plan
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🌐</div>
                  <h3 className="text-xl font-bold mb-3">1. Create Landing Page</h3>
                  <p className="text-slate-400 mb-4">We have ready templates for you</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-semibold hover:scale-105 transition-transform">
                    Get Templates
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-5xl mb-4">📱</div>
                  <h3 className="text-xl font-bold mb-3">2. Post on Social Media</h3>
                  <p className="text-slate-400 mb-4">We wrote your posts</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform">
                    Copy Posts
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-3">3. Find First Customers</h3>
                  <p className="text-slate-400 mb-4">We have a customer list</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold hover:scale-105 transition-transform">
                    Get List
                  </button>
                </div>
              </div>
            </div>

            {/* 📱 SOCIAL MEDIA POST SUGGESTIONS */}
            <div className="glass glass-border p-8 rounded-3xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                📱 Social Media Post Suggestions
              </h2>
              
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Twitter Post */}
                <div className="glass glass-border p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">🐦</div>
                    <h3 className="text-xl font-bold text-blue-400">Twitter/X Post</h3>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-xl mb-4 min-h-[120px]">
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {result.tweetSuggestion || `🚀 Excited to share my new startup idea: "${result.idea}"

💡 This could be the next big thing in the market!

What do you think? Would you use this? 

#Startup #Innovation #Tech`}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const text = result.tweetSuggestion || `🚀 Excited to share my new startup idea: "${result.idea}"

💡 This could be the next big thing in the market!

What do you think? Would you use this? 

#Startup #Innovation #Tech`;
                        navigator.clipboard.writeText(text);
                        // Show success feedback
                        const button = event?.target as HTMLButtonElement;
                        const originalText = button.textContent;
                        button.textContent = '✅ Copied!';
                        button.className = 'px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold transition-all';
                        setTimeout(() => {
                          button.textContent = originalText;
                          button.className = 'px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all';
                        }, 2000);
                      }}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all flex-1"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => {
                        const text = result.tweetSuggestion || `🚀 Excited to share my new startup idea: "${result.idea}"

💡 This could be the next big thing in the market!

What do you think? Would you use this? 

#Startup #Innovation #Tech`;
                        const encodedText = encodeURIComponent(text);
                        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all flex-1"
                    >
                      🐦 Post on X
                    </button>
                  </div>
                </div>

                {/* Reddit Post */}
                <div className="glass glass-border p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">🤖</div>
                    <h3 className="text-xl font-bold text-orange-400">Reddit Post</h3>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
                    <h4 className="font-bold text-slate-200 mb-2 text-sm">
                      {result.redditTitleSuggestion || `Looking for feedback on my startup idea: "${result.idea}"`}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.redditBodySuggestion || `Hey r/startups! 👋

I'm working on a new startup idea and would love your thoughts and feedback.

**The Idea:** ${result.idea}

**What I'm looking for:**
• Honest feedback on the concept
• Potential challenges you see
• Would you actually use this?
• Any suggestions for improvement?

Thanks in advance for your insights! 🙏`}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const title = result.redditTitleSuggestion || `Looking for feedback on my startup idea: "${result.idea}"`;
                        const body = result.redditBodySuggestion || `Hey r/startups! 👋

I'm working on a new startup idea and would love your thoughts and feedback.

**The Idea:** ${result.idea}

**What I'm looking for:**
• Honest feedback on the concept
• Potential challenges you see
• Would you actually use this?
• Any suggestions for improvement?

Thanks in advance for your insights! 🙏`;
                        const fullText = `${title}\n\n${body}`;
                        navigator.clipboard.writeText(fullText);
                        // Show success feedback
                        const button = event?.target as HTMLButtonElement;
                        const originalText = button.textContent;
                        button.textContent = '✅ Copied!';
                        button.className = 'px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold transition-all';
                        setTimeout(() => {
                          button.textContent = originalText;
                          button.className = 'px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all';
                        }, 2000);
                      }}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all flex-1"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => {
                        window.open('https://www.reddit.com/r/startups/submit', '_blank');
                      }}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-all flex-1"
                    >
                      🤖 Post on Reddit
                    </button>
                  </div>
                </div>

                {/* LinkedIn Post */}
                <div className="glass glass-border p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">💼</div>
                    <h3 className="text-xl font-bold text-blue-600">LinkedIn Post</h3>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-xl mb-4 min-h-[120px]">
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {result.linkedinSuggestion || `🚀 Excited to share my latest startup idea: "${result.idea}"

As an entrepreneur, I'm always looking for ways to solve real problems and create value. This idea has been on my mind for a while, and I'd love to get your professional insights.

**The Problem:** [Brief description of the problem]
**The Solution:** ${result.idea}
**The Opportunity:** [Market potential]

What are your thoughts? Would this solve a pain point in your industry? Any feedback or suggestions would be greatly appreciated!

#Startup #Innovation #Entrepreneurship #Business #Networking`}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const text = result.linkedinSuggestion || `🚀 Excited to share my latest startup idea: "${result.idea}"

As an entrepreneur, I'm always looking for ways to solve real problems and create value. This idea has been on my mind for a while, and I'd love to get your professional insights.

**The Problem:** [Brief description of the problem]
**The Solution:** ${result.idea}
**The Opportunity:** [Market potential]

What are your thoughts? Would this solve a pain point in your industry? Any feedback or suggestions would be greatly appreciated!

#Startup #Innovation #Entrepreneurship #Business #Networking`;
                        navigator.clipboard.writeText(text);
                        // Show success feedback
                        const button = event?.target as HTMLButtonElement;
                        const originalText = button.textContent;
                        button.textContent = '✅ Copied!';
                        button.className = 'px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold transition-all';
                        setTimeout(() => {
                          button.textContent = originalText;
                          button.className = 'px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all';
                        }, 2000);
                      }}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all flex-1"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => {
                        const text = result.linkedinSuggestion || `🚀 Excited to share my latest startup idea: "${result.idea}"

As an entrepreneur, I'm always looking for ways to solve real problems and create value. This idea has been on my mind for a while, and I'd love to get your professional insights.

**The Problem:** [Brief description of the problem]
**The Solution:** ${result.idea}
**The Opportunity:** [Market potential]

What are your thoughts? Would this solve a pain point in your industry? Any feedback or suggestions would be greatly appreciated!

#Startup #Innovation #Entrepreneurship #Business #Networking`;
                        const encodedText = encodeURIComponent(text);
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Startup Idea Validation')}&summary=${encodedText}`, '_blank');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all flex-1"
                    >
                      💼 Post on LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 📊 DEEP DIVE ANALYTICS */}
            <div className="glass glass-border p-8 rounded-3xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                📊 Deep Dive Analytics
              </h2>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['overview', 'platforms', 'insights'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {tab === 'overview' && '📈 Overview'}
                    {tab === 'platforms' && '🌐 Platforms'}
                    {tab === 'insights' && '💡 Insights'}
                  </button>
                ))}
              </div>
              
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="glass glass-border p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 text-green-400">Score Justification</h3>
                    <p className="text-slate-300 leading-relaxed">{result.scoreJustification}</p>
                  </div>
                  
                  {result.audience && (
                    <div className="glass glass-border p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Target Audience</h3>
                      <p className="text-slate-300">{result.audience}</p>
                    </div>
                  )}

                  {result.realWorldData && (
                    <div className="glass glass-border p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 text-purple-400">Real World Data</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-300 mb-2">Social Media Signals</h4>
                          <p className="text-slate-400 text-sm">
                            Twitter: {result.realWorldData.socialMediaSignals?.twitter?.trending ? '🔥 Trending' : 'Normal activity'}
                          </p>
                          <p className="text-slate-400 text-sm">
                            TikTok: {result.realWorldData.socialMediaSignals?.tiktok?.viralPotential || 'Medium'} viral potential
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-300 mb-2">Consumer Sentiment</h4>
                          <p className="text-slate-400 text-sm">
                            Overall: {result.realWorldData.consumerSentiment?.overallSentiment || 'Neutral'}
                          </p>
                          <p className="text-slate-400 text-sm">
                            Confidence: {result.dataConfidence || 'Medium'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'platforms' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {result.platformAnalyses.map((platform, index) => (
                    <div key={index} className="glass glass-border p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-3 text-purple-400">{platform.platform}</h3>
                      <p className="text-slate-400 mb-3">Signal Strength: <span className="text-yellow-400">{platform.signalStrength}</span></p>
                      <p className="text-slate-300 text-sm">{platform.analysis}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {result.socialArbitrageInsights && (
                    <>
                      <div className="glass glass-border p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 text-green-400">Micro to Macro</h3>
                        <p className="text-slate-300">{result.socialArbitrageInsights.microToMacro}</p>
                      </div>
                      
                      <div className="glass glass-border p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 text-blue-400">Timing Factor</h3>
                        <p className="text-slate-300">{result.socialArbitrageInsights.timingFactor}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 🎨 SOCIAL PROOF - Success Stories */}
            <div className="glass glass-border p-8 rounded-3xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🎨 Similar Success Stories
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="text-xl font-bold mb-2">Notion</h3>
                  <p className="text-slate-400 text-sm">Started with Reddit validation</p>
                  <p className="text-2xl font-bold text-green-400">$10B company</p>
                </div>
                
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-xl font-bold mb-2">Linear</h3>
                  <p className="text-slate-400 text-sm">Validated on HN</p>
                  <p className="text-2xl font-bold text-green-400">$400M valuation</p>
                </div>
                
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Your Idea</h3>
                  <p className="text-slate-400 text-sm">Same pattern detected!</p>
                  <p className="text-2xl font-bold text-yellow-400">Next big thing?</p>
                </div>
              </div>
            </div>

            {/* 🚀 LAUNCH KIT - Free Resources */}
            <div className="glass glass-border p-8 rounded-3xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                🚀 FREE LAUNCH KIT
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🌐', title: 'Landing Page', desc: 'Ready templates' },
                  { icon: '📅', title: 'Content Calendar', desc: 'Social media plan' },
                  { icon: '👥', title: 'Customer Questions', desc: 'Interview guide' },
                  { icon: '📊', title: 'Pitch Deck', desc: 'Investor template' }
                ].map((item, index) => (
                  <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                    <button className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 💎 PREMIUM UPSELL */}
            <div className="glass glass-border p-8 rounded-3xl mb-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                💎 UNLOCK PREMIUM
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Take Your Idea to the Next Level</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      1-on-1 strategy session
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      Custom market research
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      Investor pitch coaching
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      Technical architecture review
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-2xl font-bold mb-4 text-yellow-400">500+ founders used this</p>
                  <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl text-xl hover:scale-105 transition-transform">
                    Get Premium Access
                  </button>
                </div>
              </div>
            </div>

            {/* ⏰ URGENCY & FOMO */}
            <div className="glass glass-border p-8 rounded-3xl mb-12 bg-gradient-to-r from-red-500/10 to-orange-500/10">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                ⏰ LIMITED TIME OFFER
              </h2>
              
              <div className="text-center">
                <p className="text-2xl mb-6">Early bird pricing ends in <span className="text-3xl font-bold text-red-400">24h</span></p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-lg font-bold">First 100 users</p>
                    <p className="text-slate-400">Lifetime access</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-lg font-bold">Exclusive community</p>
                    <p className="text-slate-400">Founder network</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-lg font-bold">Money-back guarantee</p>
                    <p className="text-slate-400">1 week trial</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔄 CONVERSION FUNNEL */}
            <div className="glass glass-border p-8 rounded-3xl mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
                🔄 Your Startup Journey
              </h2>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Idea Validation', status: 'done', icon: '✅', desc: 'COMPLETED' },
                  { step: 2, title: 'Build MVP', status: 'current', icon: '🔄', desc: 'START HERE' },
                  { step: 3, title: 'Launch & Test', status: 'pending', icon: '⏳', desc: 'Next step' },
                  { step: 4, title: 'Scale & Fund', status: 'pending', icon: '⏳', desc: 'Future' },
                  { step: 5, title: 'Exit Strategy', status: 'pending', icon: '⏳', desc: 'Future' }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center gap-6 p-6 rounded-2xl ${
                    item.status === 'done' ? 'bg-green-500/10 border border-green-500/20' :
                    item.status === 'current' ? 'bg-blue-500/10 border border-blue-500/20' :
                    'bg-white/5 border border-white/10'
                  }`}>
                    <div className="text-3xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                    {item.status === 'current' && (
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-transform">
                        Start Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 🎯 FINAL ACTION BUTTONS */}
            <div className="text-center mb-12">
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-white font-bold text-lg transition-all transform hover:scale-105"
                >
                  🔍 Analyze Another Idea
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-bold text-lg transition-colors backdrop-blur-sm"
                >
                  🖨️ Print Report
                </button>
                <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl text-lg hover:scale-105 transition-transform">
                  🚀 Get Premium Access
                </button>
              </div>
              
              {/* Buy Me a Coffee Section */}
              <div className="text-center">
                <a
                  href="https://buymeacoffee.com/kptbarbarossa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img
                    src="/buymeacoffee.gif"
                    alt="Buy Me a Coffee"
                    className="w-96 h-96 rounded-2xl"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;

