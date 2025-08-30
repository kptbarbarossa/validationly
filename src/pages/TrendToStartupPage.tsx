import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface StartupIdea {
  title: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  marketSize: string;
  competitionLevel: 'low' | 'medium' | 'high';
  implementationDifficulty: number; // 1-10
  timeToMarket: string;
  keyFeatures: string[];
  potentialChallenges: string[];
  successProbability: number; // 0-100
}

interface TrendAnalysisResult {
  trendName: string;
  trendPhase: 'emerging' | 'growing' | 'peak' | 'declining';
  marketOpportunity: number; // 0-100
  startupIdeas: StartupIdea[];
  marketInsights: {
    totalMarketSize: string;
    growthRate: string;
    keyDrivers: string[];
    targetDemographics: string[];
  };
  recommendedApproach: string;
  timingAdvice: string;
}

const TrendToStartupPage: React.FC = () => {
  const [trendInput, setTrendInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<TrendAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isTR = false; // English by default

  const generateIdeas = async () => {
    if (!trendInput.trim()) {
      setError(isTR ? 'Lütfen bir trend girin' : 'Please enter a trend');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/trend-to-startup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          trend: trendInput.trim(),
          language: 'tr'
        })
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      setResults(data.analysis);
    } catch (err) {
      setError(isTR ? 'Fikir üretimi sırasında hata oluştu. Lütfen tekrar deneyin.' : 'Error during idea generation. Please try again.');
      console.error('Trend-to-startup generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const validateIdea = (idea: StartupIdea) => {
    navigate('/results', { 
      state: { 
        idea: idea.title,
        fromTrendToStartup: true,
        startupIdea: idea.title,
        startupDescription: idea.description 
      } 
    });
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getCompetitionText = (level: string) => {
    switch (level) {
      case 'low': return isTR ? 'Düşük' : 'Low';
      case 'medium': return isTR ? 'Orta' : 'Medium';
      case 'high': return isTR ? 'Yüksek' : 'High';
      default: return level;
    }
  };

  const getTrendPhaseColor = (phase: string) => {
    switch (phase) {
      case 'emerging': return 'text-green-400';
      case 'growing': return 'text-blue-400';
      case 'peak': return 'text-yellow-400';
      case 'declining': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendPhaseText = (phase: string) => {
    switch (phase) {
      case 'emerging': return isTR ? 'Yeni Ortaya Çıkıyor' : 'Emerging';
      case 'growing': return isTR ? 'Büyüyor' : 'Growing';
      case 'peak': return isTR ? 'Zirve' : 'Peak';
      case 'declining': return isTR ? 'Azalıyor' : 'Declining';
      default: return phase;
    }
  };

  return (
    <>
      <SEOHead 
        title={isTR ? "Trend'den Startup Fikri Üret - Viral Trendleri Fırsata Çevir | Validationly" : "Trend to Startup Generator - Turn Viral Trends into Opportunities | Validationly"}
        description={isTR ? "Viral trendleri analiz edin ve bunlardan karlı startup fikirleri üretin. AI destekli pazar analizi ve rekabet değerlendirmesi." : "Analyze viral trends and generate profitable startup ideas. AI-powered market analysis and competition assessment."}
      />
      
      <div>

        
        <div className="relative container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-6 py-3 mb-6 border border-white/20">
              <span className="text-2xl">🚀</span>
              <span className="text-white font-medium">
                {isTR ? 'Trend → Startup' : 'Trend → Startup'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isTR ? 'Trendleri' : 'Turn Trends Into'}<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {isTR ? 'Startup Fırsatlarına Çevir' : 'Startup Opportunities'}
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {isTR 
                ? 'Viral trendleri girip AI ile analiz edin. Pazar boyutu, rekabet seviyesi ve uygulama zorluğu ile birlikte detaylı startup fikirleri alın.'
                : 'Enter viral trends and analyze them with AI. Get detailed startup ideas with market size, competition level, and implementation difficulty.'
              }
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
              <div className="mb-6">
                <label htmlFor="trend" className="block text-lg font-medium text-white mb-3">
                  {isTR ? 'Hangi trendi startup fırsatına çevirmek istiyorsunuz?' : 'Which trend would you like to turn into a startup opportunity?'}
                </label>
                <input
                  type="text"
                  id="trend"
                  value={trendInput}
                  onChange={(e) => setTrendInput(e.target.value)}
                  placeholder={isTR ? 'Örn: Yapay zeka avatarları, sürdürülebilir moda, uzaktan çalışma araçları...' : 'e.g: AI avatars, sustainable fashion, remote work tools...'}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && generateIdeas()}
                  disabled={isGenerating}
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={generateIdeas}
                disabled={isGenerating || !trendInput.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {isGenerating 
                  ? (isTR ? '🔄 Startup Fikirleri Üretiliyor...' : '🔄 Generating Startup Ideas...') 
                  : (isTR ? '🚀 Startup Fikirleri Üret' : '🚀 Generate Startup Ideas')
                }
              </button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Trend Overview */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📊 {results.trendName} {isTR ? 'Trend Analizi' : 'Trend Analysis'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/5 rounded-2xl p-6 text-center">
                    <h3 className="font-semibold text-white mb-2">{isTR ? 'Trend Fazı' : 'Trend Phase'}</h3>
                    <div className={`text-lg font-bold ${getTrendPhaseColor(results.trendPhase)}`}>
                      {getTrendPhaseText(results.trendPhase)}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 text-center">
                    <h3 className="font-semibold text-white mb-2">{isTR ? 'Pazar Fırsatı' : 'Market Opportunity'}</h3>
                    <div className="text-lg font-bold text-purple-400">
                      {results.marketOpportunity}/100
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 text-center">
                    <h3 className="font-semibold text-white mb-2">{isTR ? 'Pazar Boyutu' : 'Market Size'}</h3>
                    <div className="text-lg font-bold text-blue-400">
                      {results.marketInsights.totalMarketSize}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 text-center">
                    <h3 className="font-semibold text-white mb-2">{isTR ? 'Büyüme Oranı' : 'Growth Rate'}</h3>
                    <div className="text-lg font-bold text-green-400">
                      {results.marketInsights.growthRate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-4">{isTR ? 'Önerilen Yaklaşım' : 'Recommended Approach'}</h3>
                    <p className="text-slate-300 text-sm">{results.recommendedApproach}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-4">{isTR ? 'Zamanlama Önerisi' : 'Timing Advice'}</h3>
                    <p className="text-slate-300 text-sm">{results.timingAdvice}</p>
                  </div>
                </div>
              </div>

              {/* Startup Ideas */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  💡 {isTR ? 'Üretilen Startup Fikirleri' : 'Generated Startup Ideas'}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {results.startupIdeas.map((idea, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-3">{idea.title}</h3>
                        <p className="text-slate-300 text-sm mb-4">{idea.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-xs text-slate-400">{isTR ? 'Hedef Pazar:' : 'Target Market:'}</span>
                            <div className="text-sm text-white">{idea.targetMarket}</div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">{isTR ? 'Gelir Modeli:' : 'Revenue Model:'}</span>
                            <div className="text-sm text-white">{idea.revenueModel}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        {/* Success Probability */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">{isTR ? 'Başarı Olasılığı' : 'Success Probability'}</span>
                            <span className="text-green-400 font-semibold">{idea.successProbability}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${idea.successProbability}%` }}
                            />
                          </div>
                        </div>

                        {/* Implementation Difficulty */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">{isTR ? 'Uygulama Zorluğu' : 'Implementation Difficulty'}</span>
                            <span className="text-orange-400 font-semibold">{idea.implementationDifficulty}/10</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${idea.implementationDifficulty * 10}%` }}
                            />
                          </div>
                        </div>

                        {/* Competition Level & Time to Market */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-slate-400 text-xs">{isTR ? 'Rekabet:' : 'Competition:'}</span>
                            <div className={`text-sm font-semibold ${getCompetitionColor(idea.competitionLevel)}`}>
                              {getCompetitionText(idea.competitionLevel)}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 text-xs">{isTR ? 'Pazara Çıkış:' : 'Time to Market:'}</span>
                            <div className="text-sm font-semibold text-blue-400">{idea.timeToMarket}</div>
                          </div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-white mb-3">{isTR ? 'Ana Özellikler' : 'Key Features'}</h4>
                        <ul className="space-y-1">
                          {idea.keyFeatures.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => validateIdea(idea)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all duration-200"
                      >
                        {isTR ? '🔍 Bu Fikri Detaylı Analiz Et' : '🔍 Analyze This Idea in Detail'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Insights */}
              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">
                  🎯 {isTR ? 'Pazar İçgörüleri' : 'Market Insights'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-4">{isTR ? 'Ana Büyüme Faktörleri' : 'Key Growth Drivers'}</h3>
                    <ul className="space-y-2">
                      {results.marketInsights.keyDrivers.map((driver, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-white mb-4">{isTR ? 'Hedef Demografik' : 'Target Demographics'}</h3>
                    <ul className="space-y-2">
                      {results.marketInsights.targetDemographics.map((demo, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{demo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrendToStartupPage;
