import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface StartupIdea {
  idea: string;
  description: string;
  marketPotential: number;
  implementationDifficulty: number;
  timeToMarket: string;
}

interface TrendAnalysis {
  trendName: string;
  startupIdeas: StartupIdea[];
  socialMomentum: {
    currentPhase: 'emerging' | 'growing' | 'peak' | 'declining';
    momentumScore: number;
    platforms: string[];
  };
  marketGap: {
    existingSolutions: string[];
    gapAnalysis: string;
    opportunityWindow: string;
  };
  recommendation: string;
}

const TrendHunterPage: React.FC = () => {
  const [trend, setTrend] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isTR = false; // English by default

  const handleAnalyze = async () => {
    if (!trend.trim()) {
      setError(isTR ? 'Lütfen bir trend girin' : 'Please enter a trend');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/trend-hunter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          trend: trend.trim(),
          language: 'tr'
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(isTR ? 'Analiz sırasında hata oluştu. Lütfen tekrar deneyin.' : 'Error during analysis. Please try again.');
      console.error('Trend analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'emerging': return 'text-green-400';
      case 'growing': return 'text-blue-400';
      case 'peak': return 'text-yellow-400';
      case 'declining': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'emerging': return isTR ? 'Yeni Ortaya Çıkıyor' : 'Emerging';
      case 'growing': return isTR ? 'Büyüyor' : 'Growing';
      case 'peak': return isTR ? 'Zirve' : 'Peak';
      case 'declining': return isTR ? 'Azalıyor' : 'Declining';
      default: return phase;
    }
  };

  const validateIdea = (idea: StartupIdea) => {
    navigate('/results', { 
      state: { 
        idea: idea.idea,
        fromTrendHunter: true,
        trendIdea: idea.idea,
        trendDescription: idea.description 
      } 
    });
  };

  return (
    <>
      <SEOHead 
        title={isTR ? "Trend Avcısı - Viral Trendlerden Startup Fikirleri | Validationly" : "Trend Hunter - Startup Ideas from Viral Trends | Validationly"}
        description={isTR ? "Viral trendleri analiz edin ve bunlardan startup fikirleri üretin. Sosyal momentum ve pazar boşluklarını keşfedin." : "Analyze viral trends and generate startup ideas from them. Discover social momentum and market gaps."}
      />
      
      <div>
        
        <div className="relative container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-6 py-3 mb-6 border border-white/20">
              <span className="text-2xl">🎯</span>
              <span className="text-white font-medium">
                {isTR ? 'Trend Avcısı' : 'Trend Hunter'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isTR ? 'Viral Trendlerden' : 'From Viral Trends'}<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {isTR ? 'Startup Fikirleri Üret' : 'Generate Startup Ideas'}
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {isTR 
                ? 'Sosyal medyada viral olan trendleri analiz edin ve bunlardan karlı startup fikirleri üretin. Pazar boşluklarını keşfedin ve doğru zamanlama yapın.'
                : 'Analyze viral social media trends and generate profitable startup ideas from them. Discover market gaps and perfect your timing.'
              }
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="mb-6">
                <label htmlFor="trend" className="block text-lg font-medium text-white mb-3">
                  {isTR ? 'Hangi trendi analiz etmek istiyorsunuz?' : 'Which trend would you like to analyze?'}
                </label>
                <input
                  type="text"
                  id="trend"
                  value={trend}
                  onChange={(e) => setTrend(e.target.value)}
                  placeholder={isTR ? 'Örn: AI avatarları, NFT oyunları, micro-influencer pazarlaması...' : 'e.g: AI avatars, NFT games, micro-influencer marketing...'}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  disabled={isAnalyzing}
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !trend.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {isAnalyzing 
                  ? (isTR ? '🔍 Trend Analiz Ediliyor...' : '🔍 Analyzing Trend...') 
                  : (isTR ? '🎯 Trendi Analiz Et' : '🎯 Analyze Trend')
                }
              </button>
            </div>
          </div>

          {/* Results */}
          {analysis && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Trend Overview */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  📊 {analysis.trendName} {isTR ? 'Analizi' : 'Analysis'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Momentum */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-3">
                      {isTR ? 'Sosyal Momentum' : 'Social Momentum'}
                    </h3>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">
                          {isTR ? 'Momentum Skoru' : 'Momentum Score'}
                        </span>
                        <span className="text-white font-bold">
                          {analysis.socialMomentum.momentumScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${analysis.socialMomentum.momentumScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-slate-300">
                        {isTR ? 'Mevcut Faz:' : 'Current Phase:'}
                      </span>
                      <span className={`ml-2 font-semibold ${getPhaseColor(analysis.socialMomentum.currentPhase)}`}>
                        {getPhaseText(analysis.socialMomentum.currentPhase)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-300">
                        {isTR ? 'Aktif Platformlar:' : 'Active Platforms:'}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.socialMomentum.platforms.map((platform, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Market Gap */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-3">
                      {isTR ? 'Pazar Boşluğu' : 'Market Gap'}
                    </h3>
                    <p className="text-slate-300 text-sm mb-3">
                      {analysis.marketGap.gapAnalysis}
                    </p>
                    <div>
                      <span className="text-slate-300 text-sm">
                        {isTR ? 'Fırsat Penceresi:' : 'Opportunity Window:'}
                      </span>
                      <span className="ml-2 text-yellow-400 font-semibold">
                        {analysis.marketGap.opportunityWindow}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-3">
                      💡 {isTR ? 'Strateji Önerisi' : 'Strategy Recommendation'}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {analysis.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Startup Ideas */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  💡 {isTR ? 'Üretilen Startup Fikirleri' : 'Generated Startup Ideas'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.startupIdeas.map((idea, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {idea.idea}
                        </h3>
                        <p className="text-slate-300 text-sm">
                          {idea.description}
                        </p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400 text-sm">
                              {isTR ? 'Pazar Potansiyeli' : 'Market Potential'}
                            </span>
                            <span className="text-green-400 font-semibold">
                              {idea.marketPotential}/100
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${idea.marketPotential}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400 text-sm">
                              {isTR ? 'Uygulama Zorluğu' : 'Implementation Difficulty'}
                            </span>
                            <span className="text-orange-400 font-semibold">
                              {idea.implementationDifficulty}/100
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                              style={{ width: `${idea.implementationDifficulty}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">
                            {isTR ? 'Pazara Çıkış Süresi:' : 'Time to Market:'}
                          </span>
                          <span className="text-blue-400 font-semibold">
                            {idea.timeToMarket}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => validateIdea(idea)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-200"
                      >
                        {isTR ? '🔍 Bu Fikri Detaylı Analiz Et' : '🔍 Analyze This Idea in Detail'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrendHunterPage;
