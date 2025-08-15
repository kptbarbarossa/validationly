import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

interface SocialValidationResult {
  idea: string;
  validationScore: number;
  scoreJustification: string;
  socialMediaInsights: {
    overallEngagement: string;
    sentimentAnalysis: string;
    marketSignals: string;
    competitionInsights: string;
  };
  recommendations: string[];
  socialMetrics: {
    totalEngagement: number;
    avgEngagementPerPost: number;
    sentimentScore: string;
    platformBreakdown: {
      reddit: any;
      twitter: any;
      linkedin: any;
    };
  };
}

export default function SocialValidation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [idea, setIdea] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [result, setResult] = useState<SocialValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if idea was passed from results page
  React.useEffect(() => {
    if (location.state?.idea) {
      setIdea(location.state.idea);
      if (location.state.industry) setIndustry(location.state.industry);
      if (location.state.targetAudience) setTargetAudience(location.state.targetAudience);
    }
  }, [location.state]);

  const validateIdea = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/social-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, industry, targetAudience })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Validation failed');
      }
    } catch (error) {
      console.error('Error validating idea:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreStatus = (score: number, isTR: boolean) => {
    if (score >= 80) return { text: isTR ? 'Mükemmel!' : 'Excellent!', icon: '🚀', color: 'green' };
    if (score >= 60) return { text: isTR ? 'İyi!' : 'Good!', icon: '✅', color: 'yellow' };
    if (score >= 40) return { text: isTR ? 'Orta' : 'Fair', icon: '⚠️', color: 'orange' };
    return { text: isTR ? 'Zayıf' : 'Weak', icon: '❌', color: 'red' };
  };

  const isTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(idea + industry + targetAudience);

  return (
    <>
      <SEOHead 
        title="Social Media Validation | Validationly"
        description="Validate your startup idea using real social media data and engagement metrics"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Validationly" className="w-8 h-8" />
                <span className="text-lg font-semibold">Validationly</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  {isTurkish ? 'Ana Sayfa' : 'Home'}
                </button>
                <button
                  onClick={() => navigate('/tweet-generator')}
                  className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  {isTurkish ? 'Tweet Üretici' : 'Tweet Generator'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {isTurkish ? 'Sosyal Medya Validasyonu' : 'Social Media Validation'}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {isTurkish 
                ? 'Startup fikrin için gerçek sosyal medya verilerini kullanarak validasyon skoru üret. Reddit, Twitter ve LinkedIn\'deki gerçek engagement ve sentiment verilerini analiz et.'
                : 'Generate validation scores for your startup idea using real social media data. Analyze actual engagement and sentiment data from Reddit, Twitter, and LinkedIn.'
              }
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {isTurkish ? 'Startup Fikri' : 'Startup Idea'}
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={isTurkish ? 'Fikrinizi kısaca açıklayın...' : 'Briefly describe your idea...'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {isTurkish ? 'Sektör' : 'Industry'}
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder={isTurkish ? 'SaaS, E-commerce, Fintech...' : 'SaaS, E-commerce, Fintech...'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {isTurkish ? 'Hedef Kitle' : 'Target Audience'}
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder={isTurkish ? 'Girişimciler, geliştiriciler...' : 'Entrepreneurs, developers...'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={validateIdea}
                disabled={loading || !idea.trim()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isTurkish ? 'Sosyal medya aranıyor...' : 'Searching social media...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🔍 {isTurkish ? 'Sosyal Medyada Ara ve Validasyon Skoru Üret' : 'Search Social Media & Generate Validation Score'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 text-red-400">
                <span className="text-xl">⚠️</span>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-8">
              {/* Main Score */}
              <div className="text-center bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {isTurkish ? 'Validasyon Skoru' : 'Validation Score'}
                </h2>
                
                <div className="mb-6">
                  <div className={`text-8xl md:text-9xl font-bold mb-4 ${getScoreColor(result.validationScore)}`}>
                    {result.validationScore}
                  </div>
                  <div className="text-2xl text-slate-300 mb-2">
                    {isTurkish ? 'Sosyal Medya Verilerine Dayalı' : 'Based on Social Media Data'}
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-700/50 border border-slate-600">
                  <span className="text-2xl">{getScoreStatus(result.validationScore, isTurkish).icon}</span>
                  <div className="text-xl font-semibold text-white">
                    {getScoreStatus(result.validationScore, isTurkish).text}
                  </div>
                </div>
              </div>

              {/* Score Justification */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  📊 {isTurkish ? 'Skor Gerekçesi' : 'Score Justification'}
                </h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.scoreJustification}
                </p>
              </div>

              {/* Social Media Insights */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  📱 {isTurkish ? 'Sosyal Medya İçgörüleri' : 'Social Media Insights'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">
                        {isTurkish ? 'Genel Engagement' : 'Overall Engagement'}
                      </h4>
                      <p className="text-slate-300 text-sm">{result.socialMediaInsights.overallEngagement}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">
                        {isTurkish ? 'Sentiment Analizi' : 'Sentiment Analysis'}
                      </h4>
                      <p className="text-slate-300 text-sm">{result.socialMediaInsights.sentimentAnalysis}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">
                        {isTurkish ? 'Pazar Sinyalleri' : 'Market Signals'}
                      </h4>
                      <p className="text-slate-300 text-sm">{result.socialMediaInsights.marketSignals}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">
                        {isTurkish ? 'Rekabet İçgörüleri' : 'Competition Insights'}
                      </h4>
                      <p className="text-slate-300 text-sm">{result.socialMediaInsights.competitionInsights}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Metrics */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  📈 {isTurkish ? 'Sosyal Medya Metrikleri' : 'Social Media Metrics'}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-400 mb-2">
                      {result.socialMetrics.totalEngagement.toLocaleString()}
                    </div>
                    <div className="text-slate-300 text-sm">
                      {isTurkish ? 'Toplam Engagement' : 'Total Engagement'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {result.socialMetrics.avgEngagementPerPost}
                    </div>
                    <div className="text-slate-300 text-sm">
                      {isTurkish ? 'Ortalama Engagement/Post' : 'Avg Engagement/Post'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {result.socialMetrics.sentimentScore}%
                    </div>
                    <div className="text-slate-300 text-sm">
                      {isTurkish ? 'Sentiment Skoru' : 'Sentiment Score'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  🎯 {isTurkish ? 'Öneriler' : 'Recommendations'}
                </h3>
                <div className="space-y-4">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-slate-200">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  🔍 {isTurkish ? 'Platform Detayları' : 'Platform Breakdown'}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-700/30 rounded-xl">
                    <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-orange-400">🔴</span> Reddit
                    </h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>Posts: {result.socialMetrics.platformBreakdown.reddit.totalPosts}</div>
                      <div>Upvotes: {result.socialMetrics.platformBreakdown.reddit.totalUpvotes}</div>
                      <div>Comments: {result.socialMetrics.platformBreakdown.reddit.totalComments}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-xl">
                    <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-blue-400">🐦</span> Twitter
                    </h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>Tweets: {result.socialMetrics.platformBreakdown.twitter.totalTweets}</div>
                      <div>Likes: {result.socialMetrics.platformBreakdown.twitter.totalLikes}</div>
                      <div>Retweets: {result.socialMetrics.platformBreakdown.twitter.totalRetweets}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-xl">
                    <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">💼</span> LinkedIn
                    </h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>Posts: {result.socialMetrics.platformBreakdown.linkedin.totalPosts}</div>
                      <div>Reactions: {result.socialMetrics.platformBreakdown.linkedin.totalReactions}</div>
                      <div>Comments: {result.socialMetrics.platformBreakdown.linkedin.totalComments}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
