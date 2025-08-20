import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import EnhancedResultsDisplay from '../components/EnhancedResultsDisplay';

interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  platformAnalyses: Array<{
    platform: string;
    signalStrength: string;
    analysis: string;
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
}

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
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

    return (
        <>
            <SEOHead
        title="Social Arbitrage Analysis | Validationly"
        description="AI-powered social arbitrage analysis for your business idea with trend insights and cultural transfer potential"
        keywords="social arbitrage, trend analysis, cultural transfer, market timing, startup validation"
      />
      
      <div className="min-h-screen text-white">
        <div className="relative">
          <div className="container mx-auto px-6 py-12">
            
            {/* Back Button */}
            <div className="mb-8">
                                        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl transition-colors backdrop-blur-sm"
        >
          ← Back to Analysis
                                        </button>
                                    </div>

            {/* Enhanced Results Display */}
            <EnhancedResultsDisplay result={result} />

            {/* Action Buttons */}
            <div className="mt-16 text-center">
              <div className="flex flex-wrap justify-center gap-4">
                                        <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-2xl text-white font-semibold transition-all transform hover:scale-105"
                                        >
                  🔍 Analyze Another Idea
                                        </button>
                                        <button
                  onClick={() => window.print()}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-semibold transition-colors backdrop-blur-sm"
                                        >
                  🖨️ Print Report
                                        </button>
                                    </div>
                                </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;

