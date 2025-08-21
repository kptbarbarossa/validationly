import React, { useState } from 'react';

interface EnhancedAnalysisProps {
  enhancedAnalysis: {
    basicAnalysis: any;
    deepDiveAnalysis?: any;
    competitorAnalysis?: any;
    marketTimingAnalysis?: any;
    overallEnhancement: {
      confidenceBoost: number;
      additionalInsights: string[];
      premiumValue: string[];
    };
  };
  premiumTier: 'pro' | 'business' | 'enterprise';
}

const EnhancedAnalysisDisplay: React.FC<EnhancedAnalysisProps> = ({ 
  enhancedAnalysis, 
  premiumTier 
}) => {
  const [activeSection, setActiveSection] = useState('overview');

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'from-blue-500 to-purple-600';
      case 'business': return 'from-purple-500 to-pink-600';
      case 'enterprise': return 'from-pink-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'pro': return '💎 PRO';
      case 'business': return '🚀 BUSINESS';
      case 'enterprise': return '👑 ENTERPRISE';
      default: return '⭐ PREMIUM';
    }
  };

  return (
    <div className="glass glass-border p-8 rounded-3xl mb-12">
      {/* Premium Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${getTierColor(premiumTier)} text-white font-bold text-lg mb-4`}>
          <span>{getTierBadge(premiumTier)} ENHANCED ANALYSIS</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          🔬 Deep Dive Intelligence Report
        </h2>
        
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">+{enhancedAnalysis.overallEnhancement.confidenceBoost}%</div>
            <div className="text-sm text-slate-400">Confidence Boost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{enhancedAnalysis.overallEnhancement.premiumValue.length}</div>
            <div className="text-sm text-slate-400">Premium Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{enhancedAnalysis.overallEnhancement.additionalInsights.length}</div>
            <div className="text-sm text-slate-400">Additional Insights</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeSection === 'overview'
              ? `bg-gradient-to-r ${getTierColor(premiumTier)} text-white`
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          📊 Overview
        </button>
        
        {enhancedAnalysis.deepDiveAnalysis && (
          <button
            onClick={() => setActiveSection('deepdive')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'deepdive'
                ? `bg-gradient-to-r ${getTierColor(premiumTier)} text-white`
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            🔍 Deep Dive
          </button>
        )}
        
        {enhancedAnalysis.competitorAnalysis && (
          <button
            onClick={() => setActiveSection('competitors')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'competitors'
                ? `bg-gradient-to-r ${getTierColor(premiumTier)} text-white`
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            🕵️ Competitors
          </button>
        )}
        
        {enhancedAnalysis.marketTimingAnalysis && (
          <button
            onClick={() => setActiveSection('timing')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'timing'
                ? `bg-gradient-to-r ${getTierColor(premiumTier)} text-white`
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            ⏰ Market Timing
          </button>
        )}
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="glass glass-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-green-400">✨ Premium Value Delivered</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Enhanced Features:</h4>
                <ul className="space-y-1">
                  {enhancedAnalysis.overallEnhancement.premiumValue.map((value, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-slate-300 text-sm">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Additional Insights:</h4>
                <ul className="space-y-1">
                  {enhancedAnalysis.overallEnhancement.additionalInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">→</span>
                      <span className="text-slate-300 text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'deepdive' && enhancedAnalysis.deepDiveAnalysis && (
        <div className="space-y-6">
          <div className="glass glass-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-blue-400">🔍 Deep Dive Analysis</h3>
            
            {enhancedAnalysis.deepDiveAnalysis.deepDiveInsights && (
              <div className="space-y-6">
                {Object.entries(enhancedAnalysis.deepDiveAnalysis.deepDiveInsights).map(([area, insights]: [string, any]) => (
                  <div key={area} className="glass glass-border p-4 rounded-xl">
                    <h4 className="text-lg font-semibold mb-3 text-yellow-400 capitalize">
                      {area.replace('-', ' ')} Enhancement
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-slate-300 mb-2">Key Improvements:</h5>
                        <ul className="space-y-1">
                          {insights.keyImprovements?.map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">▲</span>
                              <span className="text-slate-300 text-sm">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-slate-300 mb-2">Action Steps:</h5>
                        <ul className="space-y-1">
                          {insights.actionableSteps?.map((step: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">→</span>
                              <span className="text-slate-300 text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Improved Score Potential:</span>
                        <span className="text-green-400 font-semibold">{insights.improvedScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-400 text-sm">Timeline:</span>
                        <span className="text-slate-300 text-sm">{insights.timeframe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {enhancedAnalysis.deepDiveAnalysis.premiumRecommendations && (
              <div className="glass glass-border p-4 rounded-xl mt-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-400">🎯 Priority Recommendations</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-2">Priority Actions:</h5>
                    <ul className="space-y-1">
                      {enhancedAnalysis.deepDiveAnalysis.premiumRecommendations.priorityActions?.map((action: string, index: number) => (
                        <li key={index} className="text-slate-300 text-sm">• {action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-2">Quick Wins:</h5>
                    <ul className="space-y-1">
                      {enhancedAnalysis.deepDiveAnalysis.premiumRecommendations.quickWins?.map((win: string, index: number) => (
                        <li key={index} className="text-slate-300 text-sm">• {win}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-2">Long-term Strategy:</h5>
                    <ul className="space-y-1">
                      {enhancedAnalysis.deepDiveAnalysis.premiumRecommendations.longTermStrategy?.map((strategy: string, index: number) => (
                        <li key={index} className="text-slate-300 text-sm">• {strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'competitors' && enhancedAnalysis.competitorAnalysis && (
        <div className="space-y-6">
          <div className="glass glass-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-red-400">🕵️ Competitive Intelligence</h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-300">Competitive Score</h4>
                <span className="text-2xl font-bold text-yellow-400">
                  {enhancedAnalysis.competitorAnalysis.competitiveScore}/100
                </span>
              </div>
            </div>

            {enhancedAnalysis.competitorAnalysis.competitorAnalysis?.directCompetitors && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-red-400">Direct Competitors</h4>
                <div className="grid gap-4">
                  {enhancedAnalysis.competitorAnalysis.competitorAnalysis.directCompetitors.map((competitor: any, index: number) => (
                    <div key={index} className="glass glass-border p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{competitor.name}</h5>
                        <span className="text-sm text-slate-400">{competitor.marketShare} market share</span>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">{competitor.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-sm font-semibold text-green-400 mb-1">Strengths:</h6>
                          <ul className="text-xs text-slate-400">
                            {competitor.strengths?.map((strength: string, i: number) => (
                              <li key={i}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h6 className="text-sm font-semibold text-red-400 mb-1">Weaknesses:</h6>
                          <ul className="text-xs text-slate-400">
                            {competitor.weaknesses?.map((weakness: string, i: number) => (
                              <li key={i}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <span className="text-xs text-slate-500">Funding: {competitor.fundingLevel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enhancedAnalysis.competitorAnalysis.competitiveStrategy && (
              <div className="glass glass-border p-4 rounded-xl">
                <h4 className="text-lg font-semibold mb-3 text-purple-400">🎯 Strategic Recommendations</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1">Differentiation Strategy:</h5>
                    <p className="text-slate-400 text-sm">{enhancedAnalysis.competitorAnalysis.competitiveStrategy.differentiationStrategy}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1">Market Positioning:</h5>
                    <p className="text-slate-400 text-sm">{enhancedAnalysis.competitorAnalysis.competitiveStrategy.marketPositioning}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1">Competitive Advantages:</h5>
                    <ul className="text-slate-400 text-sm">
                      {enhancedAnalysis.competitorAnalysis.competitiveStrategy.competitiveAdvantages?.map((advantage: string, index: number) => (
                        <li key={index}>• {advantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'timing' && enhancedAnalysis.marketTimingAnalysis && (
        <div className="space-y-6">
          <div className="glass glass-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">⏰ Market Timing Analysis</h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-300">Timing Score</h4>
                <span className="text-2xl font-bold text-cyan-400">
                  {enhancedAnalysis.marketTimingAnalysis.marketTiming?.overallTimingScore}/100
                </span>
              </div>
              <div className="text-center">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  enhancedAnalysis.marketTimingAnalysis.marketTiming?.timingAssessment === 'Perfect' ? 'bg-green-500/20 text-green-400' :
                  enhancedAnalysis.marketTimingAnalysis.marketTiming?.timingAssessment === 'Good' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {enhancedAnalysis.marketTimingAnalysis.marketTiming?.timingAssessment} Timing
                </span>
              </div>
            </div>

            {enhancedAnalysis.marketTimingAnalysis.timingRecommendations && (
              <div className="glass glass-border p-4 rounded-xl mb-6">
                <h4 className="text-lg font-semibold mb-3 text-green-400">🚀 Launch Recommendations</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1">Recommended Launch Timing:</h5>
                    <p className="text-green-400 font-semibold">{enhancedAnalysis.marketTimingAnalysis.timingRecommendations.launchTiming}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1">Reasoning:</h5>
                    <p className="text-slate-400 text-sm">{enhancedAnalysis.marketTimingAnalysis.timingRecommendations.reasoningForTiming}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-300 mb-1">Preparation Steps:</h5>
                    <ul className="text-slate-400 text-sm">
                      {enhancedAnalysis.marketTimingAnalysis.timingRecommendations.preparationSteps?.map((step: string, index: number) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {enhancedAnalysis.marketTimingAnalysis.trendAnalysis && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass glass-border p-4 rounded-xl">
                  <h4 className="text-lg font-semibold mb-3 text-green-400">📈 Supporting Trends</h4>
                  <ul className="space-y-1">
                    {enhancedAnalysis.marketTimingAnalysis.trendAnalysis.supportingTrends?.map((trend: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">↗</span>
                        <span className="text-slate-300 text-sm">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="glass glass-border p-4 rounded-xl">
                  <h4 className="text-lg font-semibold mb-3 text-red-400">⚠️ Challenging Trends</h4>
                  <ul className="space-y-1">
                    {enhancedAnalysis.marketTimingAnalysis.trendAnalysis.challengingTrends?.map((trend: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">↘</span>
                        <span className="text-slate-300 text-sm">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalysisDisplay;