import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';

const SimpleAnalyzePage: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [useAI, setUseAI] = useState<'gemini' | 'openai' | 'groq'>('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/simple-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), useAI })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Raw AI Analysis | Validationly"
        description="Get raw, unfiltered AI analysis of your business ideas without schema constraints"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 blur-3xl"></div>
          <div className="relative container mx-auto px-6 py-12">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                🔥 Raw AI Analysis
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                No schemas, no constraints, just pure AI insights. Let's see what the AI really thinks about your idea!
              </p>
            </div>

            {/* Input Form */}
            <div className="max-w-4xl mx-auto mb-12">
              <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                
                <div className="mb-6">
                  <label htmlFor="idea" className="block text-lg font-semibold text-white mb-3">
                    What's your business idea?
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

                <div className="mb-6">
                  <label className="block text-lg font-semibold text-white mb-3">
                    Choose AI Model
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: 'gemini', label: '🤖 Gemini Pro', desc: 'Google\'s latest AI model' },
                      { value: 'openai', label: '🧠 GPT-4', desc: 'OpenAI\'s advanced model' },
                      { value: 'groq', label: '⚡ Groq LLama', desc: 'Ultra-fast inference' }
                    ].map((model) => (
                      <label key={model.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="useAI"
                          value={model.value}
                          checked={useAI === model.value}
                          onChange={(e) => setUseAI(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-2xl border-2 transition-all ${
                          useAI === model.value 
                            ? 'border-purple-500/50 bg-purple-500/10' 
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}>
                          <div className="font-semibold text-white">{model.label}</div>
                          <div className="text-sm text-slate-400">{model.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !idea.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
                >
                  {isLoading ? '🔍 AI Analyzing...' : '🚀 Get Raw Analysis'}
                </button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Raw Analysis */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">🔥 Raw AI Analysis</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                        {result.aiModel.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                        {result.rawAnalysis}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw Response Data */}
                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">🔍 Raw Response Data</h3>
                  <div className="bg-slate-800 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-xs text-slate-300">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Try Another Idea */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setIdea('');
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

export default SimpleAnalyzePage;
