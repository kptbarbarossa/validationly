import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import AffiliateCardsSection from '../components/AffiliateCardsSection';

// API'den gelen veri yapısına göre type definitions
interface ProblemAnalysis {
  coreProblem: string;
  jobToBeDone: string;
  problemSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  problemFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely';
  costOfInaction: string;
}

interface AudienceArchetype {
  name: string;
  demographics: string;
  psychographics: string;
  motivations: string[];
  painPoints: string[];
  wateringHoles: string[];
}

interface TargetAudience {
  primaryArchetypes: AudienceArchetype[];
  marketSizing: {
    tam: string;
    sam: string;
    som: string;
    disclaimer: string;
  };
}

interface CompetitiveLandscape {
  directCompetitors: string[];
  indirectCompetitors: string[];
  nonMarketAlternatives: string;
}

interface RiskAnalysis {
  marketRisk: string;
  executionRisk: string;
  adoptionRisk: string;
  regulatoryRisk: string;
}

interface ValidationScorecard {
  overallScore: number;
  demandScore: number;
  competitionScore: number;
  executionScore: number;
  monetizationScore: number;
  riskScore: number;
  finalVerdict: 'Proceed' | 'Proceed with caution' | 'Pivot' | 'Abandon';
  confidenceLevel: 'High' | 'Medium' | 'Low';
  keyRecommendations: string[];
}

interface PlatformSpecificStrategy {
  platform: string;
  launchStrategy: string;
  messagingFocus: string;
  kpiSuggestions: string[];
  communityEngagementPlan: string;
}

interface SocialMediaSuggestions {
  tweetSuggestion: string;
  linkedinSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
}

interface MentalSandbox {
  preMortem: {
    scenario: string;
    keyFailurePoints: string[];
  };
  preCelebration: {
    scenario: string;
    keySuccessFactors: string[];
  };
}

interface RedTeamChallenge {
  strongestPositiveAssumption: string;
  counterArgument: string;
}

interface ValidationResult {
  knowledgeCutoffNotice: string;
  problemAnalysis: ProblemAnalysis;
  targetAudience: TargetAudience;
  demandAnalysis: any;
  competitiveLandscape: CompetitiveLandscape;
  differentiation: any;
  risks: RiskAnalysis;
  monetization: any;
  mvpRecommendation: any;
  scalingStrategy: any;
  validationScorecard: ValidationScorecard;
  platformSpecificStrategy: PlatformSpecificStrategy;
  socialMediaSuggestions: SocialMediaSuggestions;
  mentalSandbox: MentalSandbox;
  redTeamChallenge: RedTeamChallenge;
  idea: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'strategy' | 'social'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const result = location.state?.result as ValidationResult;
  const idea = location.state?.idea || result?.idea || 'Unknown Idea';

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVerdictColor = (verdict: string) => {
    if (!verdict) return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    
    switch (verdict.toLowerCase()) {
      case 'proceed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'proceed with caution': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'pivot': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'abandon': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    if (!confidence) return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    
    switch (confidence.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">🔍</div>
            <h1 className="text-4xl font-bold mb-4">AI-Powered Strategic Analysis</h1>
            <p className="text-xl text-gray-400">Analyzing your idea with our comprehensive validation framework...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold mb-4">Analysis Not Found</h1>
          <p className="text-gray-400 mb-8">Please start a new analysis from the home page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`Strategic Analysis Results | Validationly`}
        description="AI-powered strategic analysis with comprehensive validation framework"
        keywords="startup validation, strategic analysis, market research, AI insights, business validation"
      />

      <div className="min-h-screen text-white">
        <div className="container mx-auto px-6 py-12">
        {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Strategic Analysis Results</h1>
            <p className="text-xl text-gray-400 mb-6">"{idea}"</p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-2 mb-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'analysis', label: 'Deep Analysis', icon: '🔍' },
                { id: 'strategy', label: 'Strategy', icon: '🎯' },
                { id: 'social', label: 'Social Media', icon: '📱' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              </div>
            </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Validation Scorecard */}
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur rounded-3xl p-8 border border-purple-500/20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Validation Scorecard</h2>
                  <p className="text-purple-300">Comprehensive assessment across all validation criteria</p>
            </div>

                {/* Main Scores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className={`inline-block px-6 py-3 rounded-full text-2xl font-bold border ${getScoreColor(result.validationScorecard?.overallScore || 0)}`}>
                      {result.validationScorecard?.overallScore || 0}/100
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium border ${getVerdictColor(result.validationScorecard?.finalVerdict || '')}`}>
                      {result.validationScorecard?.finalVerdict || 'Pending'}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Final Verdict</p>
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium border ${getConfidenceColor(result.validationScorecard?.confidenceLevel || '')}`}>
                      {result.validationScorecard?.confidenceLevel || 'Pending'} Confidence
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Confidence Level</p>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard?.demandScore || 0)}`}>
                      {result.validationScorecard?.demandScore || 0}
                    </div>
                    <p className="text-sm text-gray-400">Demand Score</p>
                    </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard?.competitionScore || 0)}`}>
                      {result.validationScorecard?.competitionScore || 0}
                  </div>
                    <p className="text-sm text-gray-400">Competition Score</p>
                </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard?.executionScore || 0)}`}>
                      {result.validationScorecard?.executionScore || 0}
                      </div>
                    <p className="text-sm text-gray-400">Execution Score</p>
                      </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard?.monetizationScore || 0)}`}>
                      {result.validationScorecard?.monetizationScore || 0}
                      </div>
                    <p className="text-sm text-gray-400">Monetization Score</p>
                    </div>
                  </div>

                {/* Key Recommendations */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(result.validationScorecard?.keyRecommendations || []).map((rec, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-gray-300">{rec}</span>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>

              {/* Problem Analysis */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Problem Analysis</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">🎯 Core Problem</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {result.problemAnalysis?.coreProblem || 'Problem analysis not available'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Severity:</span>
                        <span className="text-white">{result.problemAnalysis?.problemSeverity || 'Unknown'}</span>
                        </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency:</span>
                        <span className="text-white">{result.problemAnalysis?.problemFrequency || 'Unknown'}</span>
                      </div>
                      </div>
                      </div>
                      <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">💼 Job to be Done</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {result.problemAnalysis?.jobToBeDone || 'Job analysis not available'}
                    </p>
                      </div>
                    </div>
                  </div>

              {/* Target Audience */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Target Audience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.targetAudience?.primaryArchetypes?.map((archetype, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-400 mb-3">{archetype.name}</h3>
                      <div className="space-y-3">
                      <div>
                          <span className="text-gray-400 text-sm">Demographics:</span>
                          <p className="text-gray-300 text-sm">{archetype.demographics}</p>
                      </div>
                      <div>
                          <span className="text-gray-400 text-sm">Motivations:</span>
                          <ul className="text-gray-300 text-sm">
                            {archetype.motivations?.map((motivation, j) => (
                              <li key={j}>• {motivation}</li>
                            ))}
                          </ul>
                      </div>
                      </div>
                    </div>
                  ))}
                      </div>
                      </div>
                    </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8">
              {/* Competitive Landscape */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Competitive Landscape</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Direct Competitors</h3>
                    <ul className="space-y-2">
                      {result.competitiveLandscape?.directCompetitors?.map((competitor, i) => (
                        <li key={i} className="text-gray-300">• {competitor}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Indirect Competitors</h3>
                    <ul className="space-y-2">
                      {result.competitiveLandscape?.indirectCompetitors?.map((competitor, i) => (
                        <li key={i} className="text-gray-300">• {competitor}</li>
                          ))}
                        </ul>
                    </div>
                  </div>
                </div>

              {/* Risk Analysis */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Risk Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Market Risk</h3>
                    <p className="text-gray-300">{result.risks?.marketRisk || 'Not available'}</p>
                              </div>
                              <div>
                    <h3 className="text-lg font-semibold text-orange-400 mb-3">Execution Risk</h3>
                    <p className="text-gray-300">{result.risks?.executionRisk || 'Not available'}</p>
                              </div>
              <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Adoption Risk</h3>
                    <p className="text-gray-300">{result.risks?.adoptionRisk || 'Not available'}</p>
                      </div>
                      <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">Regulatory Risk</h3>
                    <p className="text-gray-300">{result.risks?.regulatoryRisk || 'Not available'}</p>
              </div>
              </div>
                </div>

              {/* Mental Sandbox */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Mental Sandbox</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Pre-Mortem Analysis</h3>
                    <p className="text-gray-300 mb-4">{result.mentalSandbox?.preMortem?.scenario || 'Not available'}</p>
                    <ul className="space-y-2">
                      {result.mentalSandbox?.preMortem?.keyFailurePoints?.map((point, i) => (
                        <li key={i} className="text-gray-300 text-sm">• {point}</li>
                      ))}
                    </ul>
            </div>
                <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">Pre-Celebration Analysis</h3>
                    <p className="text-gray-300 mb-4">{result.mentalSandbox?.preCelebration?.scenario || 'Not available'}</p>
                    <ul className="space-y-2">
                      {result.mentalSandbox?.preCelebration?.keySuccessFactors?.map((factor, i) => (
                        <li key={i} className="text-gray-300 text-sm">• {factor}</li>
                      ))}
                    </ul>
              </div>
            </div>
          </div>

              {/* Red Team Challenge */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Red Team Challenge</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Strongest Positive Assumption</h3>
                    <p className="text-gray-300">{result.redTeamChallenge?.strongestPositiveAssumption || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Counter Argument</h3>
                    <p className="text-gray-300">{result.redTeamChallenge?.counterArgument || 'Not available'}</p>
                        </div>
                  </div>
                </div>
                        </div>
                      )}

          {activeTab === 'strategy' && (
            <div className="space-y-8">
              {/* Platform Specific Strategy */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Platform Strategy</h2>
                <div className="space-y-6">
                      <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Launch Strategy</h3>
                    <p className="text-gray-300">{result.platformSpecificStrategy?.launchStrategy || 'Not available'}</p>
                      </div>
                      <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">Messaging Focus</h3>
                    <p className="text-gray-300">{result.platformSpecificStrategy?.messagingFocus || 'Not available'}</p>
                      </div>
                      <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">KPI Suggestions</h3>
                    <ul className="space-y-2">
                      {result.platformSpecificStrategy?.kpiSuggestions?.map((kpi, i) => (
                        <li key={i} className="text-gray-300">• {kpi}</li>
                      ))}
                    </ul>
                        </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Community Engagement Plan</h3>
                    <p className="text-gray-300">{result.platformSpecificStrategy?.communityEngagementPlan || 'Not available'}</p>
                  </div>
                </div>
                </div>
              </div>
            )}

          {activeTab === 'social' && (
            <div className="space-y-8">
              {/* Social Media Suggestions */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Social Media Strategy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">🐦 Twitter/X Post</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions?.tweetSuggestion || 'Tweet suggestion not available'}
                </p>
              </div>
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">💼 LinkedIn Post</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions?.linkedinSuggestion || 'LinkedIn suggestion not available'}
                    </p>
                        </div>
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-600 mb-3">📝 Reddit Title</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions?.redditTitleSuggestion || 'Reddit title not available'}
                    </p>
                        </div>
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-600 mb-3">📝 Reddit Body</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.socialMediaSuggestions?.redditBodySuggestion || 'Reddit body not available'}
                    </p>
                        </div>
                        </div>
              </div>
            </div>
          )}

          {/* Recommended Tools Section */}
          <AffiliateCardsSection 
            className="mb-12"
            title="🛠️ Recommended Tools for Your Startup"
            subtitle="Essential tools and services to help you build, launch, and grow your validated idea"
            maxCards={8}
          />

          {/* Try Another Idea */}
          <div className="text-center mb-16">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              🚀 Analyze Another Idea
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
