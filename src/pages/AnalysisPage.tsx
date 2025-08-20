import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface AnalysisResult {
  idea_summary: string;
  assumptions: Array<{ text: string; confidence: number }>;
  target_audience: string[];
  jobs_to_be_done: string[];
  value_hypotheses: string[];
  demand_signals: Array<{ signal: string; evidence: string; confidence: number }>;
  competitive_landscape: {
    substitutes: string[];
    adjacent_tools: string[];
    moat_likelihood: number;
  };
  risks: Array<{ type: string; likelihood: number; impact: number; note: string }>;
  validation_plan: Array<{ name: string; cost: string; metric: string; success_criteria: string }>;
  gtm: {
    ICP: string[];
    channels: string[];
    positioning: string;
    pricing_hypothesis: { plan_free: string; plan_pro: string; price_range: string };
  };
  score_breakdown: {
    novelty: number;
    demand_plausibility: number;
    monetization_clarity: number;
    feasibility: number;
    gtm_fit: number;
  };
  final_score: number;
  uncertainty_note: string;
}

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [constraints, setConstraints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    markdown_summary: string;
    analysis: AnalysisResult;
    ai_model: string;
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: idea.trim(),
          audience: audience.trim() || undefined,
          goal: goal.trim() || undefined,
          constraints: constraints.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    if (confidence >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <>
      <SEOHead
        title="AI-Only Analysis | Validationly"
        description="Get deep AI analysis of your business ideas using only the AI's knowledge base - no external data, pure insights"
        keywords="AI analysis, business validation, startup analysis, market research, AI insights"
      />
      
      <div className="min-h-screen text-white">
        <div className="relative">
          <div className="container mx-auto px-6 py-12">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                🤖 AI-Only Analysis
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Deep analysis using only the AI's comprehensive knowledge base. No external data, pure strategic insights.
              </p>
            </div>

            {/* Input Form */}
            <div className="max-w-4xl mx-auto mb-12">
              <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                
                <div className="mb-6">
                  <label htmlFor="idea" className="block text-lg font-semibold text-white mb-3">
                    What's your business idea? *
                  </label>
                  <textarea
                    id="idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your idea in detail... e.g., An AI-powered app that helps people find the perfect coffee based on their mood, weather, and time of day..."
                    className="w-full h-32 bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="audience" className="block text-lg font-semibold text-white mb-3">
                      Target Audience
                    </label>
                    <input
                      id="audience"
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="e.g., Small business owners"
                      className="w-full bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="goal" className="block text-lg font-semibold text-white mb-3">
                      Analysis Goal
                    </label>
                    <input
                      id="goal"
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g., Investor pitch"
                      className="w-full bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="constraints" className="block text-lg font-semibold text-white mb-3">
                      Constraints
                    </label>
                    <input
                      id="constraints"
                      type="text"
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      placeholder="e.g., Budget $10k"
                      className="w-full bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !idea.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
                >
                  {isLoading ? '🔍 AI Analyzing...' : '🚀 Get Deep Analysis'}
                </button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Score Card */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-4">
                      <span className={getScoreColor(result.analysis.final_score)}>
                        {result.analysis.final_score}
                      </span>
                      <span className="text-slate-400 text-4xl">/100</span>
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getScoreBgColor(result.analysis.final_score)}`}>
                      {result.analysis.final_score >= 80 ? 'High Potential' :
                       result.analysis.final_score >= 60 ? 'Medium Potential' :
                       result.analysis.final_score >= 40 ? 'Low Potential' :
                       'Very Low Potential'}
                    </div>
                  </div>
                  
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {Math.round(result.analysis.score_breakdown.novelty * 100)}
                      </div>
                      <div className="text-sm text-slate-400">Novelty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {Math.round(result.analysis.score_breakdown.demand_plausibility * 100)}
                      </div>
                      <div className="text-sm text-slate-400">Demand</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">
                        {Math.round(result.analysis.score_breakdown.monetization_clarity * 100)}
                      </div>
                      <div className="text-sm text-slate-400">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400 mb-2">
                        {Math.round(result.analysis.score_breakdown.feasibility * 100)}
                      </div>
                      <div className="text-sm text-slate-400">Feasibility</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {Math.round(result.analysis.score_breakdown.gtm_fit * 100)}
                      </div>
                      <div className="text-sm text-slate-400">GTM Fit</div>
                    </div>
                  </div>
                </div>

                {/* Markdown Summary */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">📊 Analysis Summary</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                        {result.ai_model.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                        {result.markdown_summary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Target Audience */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Target Audience
                    </h3>
                    <div className="space-y-2">
                      {result.analysis.target_audience.map((audience, index) => (
                        <div key={index} className="text-slate-300 text-sm bg-slate-900/50 rounded-lg p-3">
                          {audience}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jobs to be Done */}
                  <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">💼</span>
                      Jobs to be Done
                    </h3>
                    <div className="space-y-2">
                      {result.analysis.jobs_to_be_done.map((job, index) => (
                        <div key={index} className="text-slate-300 text-sm bg-slate-900/50 rounded-lg p-3">
                          {job}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assumptions */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">🤔</span>
                    Key Assumptions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.analysis.assumptions.map((assumption, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                        <p className="text-slate-300 text-sm mb-3">{assumption.text}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Confidence</span>
                          <span className={`text-sm font-semibold ${getConfidenceColor(assumption.confidence)}`}>
                            {Math.round(assumption.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validation Plan */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">🧪</span>
                    Validation Plan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.analysis.validation_plan.map((plan, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{plan.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Cost:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              plan.cost === 'low' ? 'bg-green-500/20 text-green-400' :
                              plan.cost === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {plan.cost}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Metric:</span>
                            <p className="text-slate-300">{plan.metric}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Success:</span>
                            <p className="text-slate-300">{plan.success_criteria}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Risk Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.analysis.risks.map((risk, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white capitalize">{risk.type}</span>
                          <div className="flex gap-2">
                            <span className="text-xs text-slate-400">L: {Math.round(risk.likelihood * 100)}%</span>
                            <span className="text-xs text-slate-400">I: {Math.round(risk.impact * 100)}%</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{risk.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uncertainty Note */}
                {result.analysis.uncertainty_note && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">
                    <h3 className="text-yellow-400 font-semibold mb-4 flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      Uncertainty Areas
                    </h3>
                    <p className="text-yellow-300">{result.analysis.uncertainty_note}</p>
                  </div>
                )}

                {/* Try Another Idea */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setIdea('');
                      setAudience('');
                      setGoal('');
                      setConstraints('');
                      setResult(null);
                      setError(null);
                    }}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-medium transition-colors"
                  >
                    🚀 Try Another Idea
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                  <div className="text-red-400 text-xl mb-2">❌</div>
                  <h3 className="text-red-400 font-semibold mb-2">Analysis Failed</h3>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalysisPage;
