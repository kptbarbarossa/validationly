import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import ExportShare from '../components/ExportShare';

// API'den gelen ValidationResult interface'ini kullan
interface ValidationResult {
  knowledgeCutoffNotice: string;
  problemAnalysis: {
    coreProblem: string;
    jobToBeDone: string;
    problemSeverity: string;
  };
  targetAudience: {
    primaryArchetypes: Array<{
      name: string;
      demographics: string;
      motivations: string;
    }>;
    marketSizing: {
      tam: string;
      sam: string;
      som: string;
    };
  };
  demandAnalysis: {
    demandVerdict: string;
    willingnessToPay: string;
    proxyProducts: string;
    searchAndSocialSignals: string;
  };
  competitiveLandscape: {
    directCompetitors: string[];
    nonMarketAlternatives: string;
    swotAnalysis: Array<{
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    }>;
  };
  differentiation: {
    coreDifferentiator: string;
    valueProposition: string;
    defensibleMoat: string;
  };
  risks: {
    marketRisk: string;
    executionRisk: string;
    adoptionRisk: string;
  };
  monetization: {
    revenueStreams: string[];
    pricingHypothesis: string;
  };
  mvpRecommendation: {
    coreFeatures: string[];
    userJourney: string;
    validationMetrics: string[];
  };
  scalingStrategy: {
    earlyAdopterAcquisition: string;
    scalableChannels: string[];
    longTermVision: string;
  };
  validationScorecard: {
    overallScore: number;
    demandScore: number;
    competitionScore: number;
    executionScore: number;
    monetizationScore: number;
    riskScore: number;
    finalVerdict: string;
    confidenceLevel: string;
    keyRecommendations: string[];
  };
  platformSpecificStrategy: {
    platform: string;
    launchStrategy: string;
    messagingFocus: string;
    kpiSuggestions: string[];
    communityEngagementPlan: string;
  };
  socialMediaSuggestions: any;
  idea: string;
  userId?: string;
  modelUsed?: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'strategy' | 'social'>('overview');

  // Get idea from URL search params or state
  const searchParams = new URLSearchParams(location.search);
  const queryFromUrl = searchParams.get('query') || searchParams.get('q');
  const idea = location.state?.idea || queryFromUrl || 'manevi günlük mobil uygulaması';

  useEffect(() => {
    startAnalysis();
  }, [idea]);

  const startAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/v1/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea,
          platform: 'general',
          optimize: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }

    } catch (err) {
      console.error('❌ Error in analysis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze idea';
      setError(`Analysis Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getVerdictColor = (verdict: string) => {
    if (!verdict) return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    
    switch (verdict.toLowerCase()) {
      case 'proceed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pivot': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 're-evaluate': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
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
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6 animate-pulse">🔍</div>
            <h1 className="text-4xl font-bold mb-4">
              AI-Powered Strategic Analysis
            </h1>
            <p className="text-xl text-gray-400">
              Analyzing your idea with our comprehensive 10-step validation framework...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-800 rounded-full h-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full animate-pulse"></div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-400">
                Running comprehensive analysis...
              </span>
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
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
        description="AI-powered strategic analysis with comprehensive 10-step validation framework"
        keywords="startup validation, strategic analysis, market research, AI insights, business validation"
      />

      <div className="min-h-screen text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Strategic Analysis Results
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              "{result.idea}" - Comprehensive 10-Step Validation Framework
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                ✅ AI-Powered Analysis
              </div>
              <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                🧠 Strategic Framework
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <div className="text-red-400 text-xl mb-2">⚠️</div>
                <h3 className="text-red-400 font-semibold mb-2">Analysis Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Knowledge Cutoff Notice */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-blue-400 text-2xl">ℹ️</div>
              <div>
                <h3 className="text-blue-400 font-semibold mb-1">Knowledge Cutoff Notice</h3>
                <p className="text-blue-300 text-sm">{result.knowledgeCutoffNotice}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-800/50 rounded-lg p-1">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'analysis', label: '🔍 Analysis', icon: '🔍' },
              { id: 'strategy', label: '🎯 Strategy', icon: '🎯' },
              { id: 'social', label: '📱 Social', icon: '📱' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard.demandScore)}`}>
                      {result.validationScorecard.demandScore}
                    </div>
                    <p className="text-sm text-gray-400">Demand Score</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard.competitionScore)}`}>
                      {result.validationScorecard.competitionScore}
                    </div>
                    <p className="text-sm text-gray-400">Competition Score</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard.executionScore)}`}>
                      {result.validationScorecard.executionScore}
                    </div>
                    <p className="text-sm text-gray-400">Execution Score</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${getScoreColor(result.validationScorecard.monetizationScore)}`}>
                      {result.validationScorecard.monetizationScore}
                    </div>
                    <p className="text-sm text-gray-400">Monetization Score</p>
                  </div>
                </div>

                {/* Key Recommendations */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.validationScorecard.keyRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-gray-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Executive Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">🎯 Biggest Opportunity</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {result.validationScorecard.keyRecommendations[0] || 'Opportunity analysis pending'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ Biggest Risk</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {result.risks.marketRisk || 'Risk assessment pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8">
              {/* 10-Step Framework Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Problem Analysis */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-blue-500/20 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Problem Analysis
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-blue-400 font-medium">Core Problem:</span>
                      <p className="text-gray-300 mt-1">{result.problemAnalysis.coreProblem}</p>
                    </div>
                    <div>
                      <span className="text-purple-400 font-medium">Job-to-be-Done:</span>
                      <p className="text-gray-300 mt-1">{result.problemAnalysis.jobToBeDone}</p>
                    </div>
                    <div>
                      <span className="text-green-400 font-medium">Problem Severity:</span>
                      <p className="text-gray-300 mt-1">{result.problemAnalysis.problemSeverity}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Target Audience */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Target Audience
                  </h3>
                  <div className="space-y-3 text-sm">
                    {result.targetAudience.primaryArchetypes.slice(0, 1).map((archetype, i) => (
                      <div key={i}>
                        <span className="text-green-400 font-medium">{archetype.name}:</span>
                        <p className="text-gray-300 mt-1">{archetype.demographics}</p>
                        <p className="text-gray-400 mt-1 text-xs">{archetype.motivations}</p>
                      </div>
                    ))}
                    <div>
                      <span className="text-yellow-400 font-medium">TAM:</span>
                      <p className="text-gray-300 mt-1">{result.targetAudience.marketSizing.tam}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Demand Analysis */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Demand Analysis
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-yellow-400 font-medium">Demand Verdict:</span>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ml-2 ${getVerdictColor(result.demandAnalysis.demandVerdict)}`}>
                        {result.demandAnalysis.demandVerdict}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-400 font-medium">Willingness to Pay:</span>
                      <p className="text-gray-300 mt-1">{result.demandAnalysis.willingnessToPay}</p>
                    </div>
                    <div>
                      <span className="text-purple-400 font-medium">Proxy Products:</span>
                      <p className="text-gray-300 mt-1">{result.demandAnalysis.proxyProducts}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Competitive Landscape */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-red-500/20 text-red-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Competitive Landscape
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-red-400 font-medium">Direct Competitors:</span>
                      <ul className="text-gray-300 mt-1 space-y-1">
                        {result.competitiveLandscape.directCompetitors.slice(0, 3).map((comp, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <span className="text-red-400">•</span>
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-orange-400 font-medium">Non-Market Alternatives:</span>
                      <p className="text-gray-300 mt-1">{result.competitiveLandscape.nonMarketAlternatives}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Differentiation */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-purple-500/20 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Differentiation
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-purple-400 font-medium">Core Differentiator:</span>
                      <p className="text-gray-300 mt-1">{result.differentiation.coreDifferentiator}</p>
                    </div>
                    <div>
                      <span className="text-blue-400 font-medium">Value Proposition:</span>
                      <p className="text-gray-300 mt-1">{result.differentiation.valueProposition}</p>
                    </div>
                    <div>
                      <span className="text-green-400 font-medium">Defensible Moat:</span>
                      <p className="text-gray-300 mt-1">{result.differentiation.defensibleMoat}</p>
                    </div>
                  </div>
                </div>

                {/* 6. Risks */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-orange-500/20 text-orange-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Risks & Obstacles
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-red-400 font-medium">Market Risk:</span>
                      <p className="text-gray-300 mt-1">{result.risks.marketRisk}</p>
                    </div>
                    <div>
                      <span className="text-orange-400 font-medium">Execution Risk:</span>
                      <p className="text-gray-300 mt-1">{result.risks.executionRisk}</p>
                    </div>
                    <div>
                      <span className="text-yellow-400 font-medium">Adoption Risk:</span>
                      <p className="text-gray-300 mt-1">{result.risks.adoptionRisk}</p>
                    </div>
                  </div>
                </div>

                {/* 7. Monetization */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Monetization
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-green-400 font-medium">Revenue Streams:</span>
                      <ul className="text-gray-300 mt-1 space-y-1">
                        {result.monetization.revenueStreams.slice(0, 3).map((stream, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <span className="text-green-400">•</span>
                            <span>{stream}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-yellow-400 font-medium">Pricing Hypothesis:</span>
                      <p className="text-gray-300 mt-1">{result.monetization.pricingHypothesis}</p>
                    </div>
                  </div>
                </div>

                {/* 8. MVP Recommendation */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-blue-500/20 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                    MVP Recommendation
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-blue-400 font-medium">Core Features:</span>
                      <ul className="text-gray-300 mt-1 space-y-1">
                        {result.mvpRecommendation.coreFeatures.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <span className="text-blue-400">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-green-400 font-medium">User Journey:</span>
                      <p className="text-gray-300 mt-1">{result.mvpRecommendation.userJourney}</p>
                    </div>
                  </div>
                </div>

                {/* 9. Scaling Strategy */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="bg-cyan-500/20 text-cyan-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                    Growth Strategy
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-cyan-400 font-medium">Early Adopter Acquisition:</span>
                      <p className="text-gray-300 mt-1">{result.scalingStrategy.earlyAdopterAcquisition}</p>
                    </div>
                    <div>
                      <span className="text-blue-400 font-medium">Scalable Channels:</span>
                      <ul className="text-gray-300 mt-1 space-y-1">
                        {result.scalingStrategy.scalableChannels.slice(0, 3).map((channel, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <span className="text-blue-400">•</span>
                            <span>{channel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-8">
              {/* Platform-Specific Strategy */}
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur rounded-3xl p-8 border border-blue-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Platform-Specific Strategy</h2>
                      <p className="text-blue-300 text-sm">Tailored approach for {result.platformSpecificStrategy.platform}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">🚀 Launch Strategy</h3>
                    <p className="text-gray-300 leading-relaxed">{result.platformSpecificStrategy.launchStrategy}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">💬 Messaging Focus</h3>
                    <p className="text-gray-300 leading-relaxed">{result.platformSpecificStrategy.messagingFocus}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">📊 KPI Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.platformSpecificStrategy.kpiSuggestions.map((kpi, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <span className="text-green-400">•</span>
                        <span className="text-gray-300">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">🤝 Community Engagement Plan</h3>
                  <p className="text-gray-300 leading-relaxed">{result.platformSpecificStrategy.communityEngagementPlan}</p>
                </div>
              </div>

              {/* SWOT Analysis */}
              {result.competitiveLandscape.swotAnalysis.length > 0 && (
                <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">📊 SWOT Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.competitiveLandscape.swotAnalysis.slice(0, 1).map((swot, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Strengths</h3>
                          <ul className="space-y-2">
                            {swot.strengths.slice(0, 3).map((strength, j) => (
                              <li key={j} className="flex items-start space-x-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span className="text-gray-300">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Weaknesses</h3>
                          <ul className="space-y-2">
                            {swot.weaknesses.slice(0, 3).map((weakness, j) => (
                              <li key={j} className="flex items-start space-x-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span className="text-gray-300">{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-400 mb-3">🎯 Opportunities</h3>
                          <ul className="space-y-2">
                            {swot.opportunities.slice(0, 3).map((opportunity, j) => (
                              <li key={j} className="flex items-start space-x-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span className="text-gray-300">{opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-orange-400 mb-3">⚠️ Threats</h3>
                          <ul className="space-y-2">
                            {swot.threats.slice(0, 3).map((threat, j) => (
                              <li key={j} className="flex items-start space-x-2">
                                <span className="text-orange-400 mt-1">•</span>
                                <span className="text-gray-300">{threat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-8">
              {/* Social Media Suggestions */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">📱 Social Media Strategy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">🐦 Twitter Strategy</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Focus on trending topics and community engagement. Use hashtags strategically and engage with relevant conversations.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-400 mb-3">📱 Reddit Strategy</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Participate in relevant subreddits, provide value through helpful comments, and build genuine community relationships.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">💼 LinkedIn Strategy</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Share professional insights, connect with industry leaders, and position yourself as a thought leader in your space.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Calendar Suggestions */}
              <div className="bg-gray-800/50 rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">📅 Content Calendar Suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">🎯 Weekly Themes</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="text-green-400">•</span>
                        <span className="text-gray-300">Monday: Problem awareness</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-400">•</span>
                        <span className="text-gray-300">Wednesday: Solution showcase</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-green-400">•</span>
                        <span className="text-gray-300">Friday: Community engagement</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">📊 Content Types</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-gray-300">Educational posts (40%)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-gray-300">Behind-the-scenes (30%)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-gray-300">User-generated content (20%)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="text-purple-400">•</span>
                        <span className="text-gray-300">Promotional content (10%)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export & Share Section */}
          <ExportShare
            validation={{
              idea: result.idea,
              demandScore: result.validationScorecard.overallScore,
              scoreJustification: result.validationScorecard.keyRecommendations.join(' '),
              classification: result.validationScorecard.finalVerdict,
              insights: {
                keyInsights: result.validationScorecard.keyRecommendations,
                opportunities: [result.differentiation.coreDifferentiator],
                painPoints: [result.problemAnalysis.coreProblem],
                trendingTopics: result.platformSpecificStrategy.kpiSuggestions
              },
              socialMediaSuggestions: {
                tweetSuggestion: `Just analyzed "${result.idea}" with Validationly's AI framework. Score: ${result.validationScorecard.overallScore}/100. Verdict: ${result.validationScorecard.finalVerdict}`,
                linkedinSuggestion: `Strategic analysis of "${result.idea}" reveals ${result.validationScorecard.confidenceLevel} confidence level with key opportunities in ${result.differentiation.coreDifferentiator}`,
                redditTitleSuggestion: `AI Analysis: "${result.idea}" - ${result.validationScorecard.overallScore}/100 Score`,
                redditBodySuggestion: `Used Validationly's comprehensive framework to analyze this idea. Key findings: ${result.validationScorecard.keyRecommendations.slice(0, 2).join(', ')}`
              }
            }}
            className="mb-8"
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
