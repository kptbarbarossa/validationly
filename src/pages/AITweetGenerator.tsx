import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

interface TweetSeries {
  id: number;
  tweet: string;
  hashtags: string[];
  engagement: number;
  purpose: string;
}

export default function AITweetGenerator() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tweetSeries, setTweetSeries] = useState<TweetSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const generateTweets = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, industry, targetAudience })
      });
      
      if (response.ok) {
        const data = await response.json();
        setTweetSeries(data.tweets);
      } else {
        // Fallback: generate sample tweets
        const sampleTweets: TweetSeries[] = [
          {
            id: 1,
            tweet: `🚀 Just had a breakthrough idea: "${idea}"\n\nAfter months of research, I'm convinced this could solve a real problem. Starting to build in public today!\n\nWhat do you think? Any founders facing this challenge?`,
            hashtags: ['#startup', '#buildinpublic', '#founder'],
            engagement: 89,
            purpose: 'Announcement & Community Building'
          },
          {
            id: 2,
            tweet: `💡 Day 1 of building "${idea}":\n\n- Problem: Users struggle with [specific issue]\n- Solution: [Your approach]\n- Why now: Market timing is perfect\n\nAlready got 3 people asking for early access!`,
            hashtags: ['#day1', '#startupjourney', '#validation'],
            engagement: 156,
            purpose: 'Problem-Solution Framework'
          },
          {
            id: 3,
            tweet: `🔥 The moment I realized "${idea}" was worth pursuing:\n\n- Customer interview #7: "I'd pay $50/month for this"\n- Market size: $2B+ opportunity\n- Competition: Surprisingly fragmented\n\nSometimes the best ideas are hiding in plain sight.`,
            hashtags: ['#customervalidation', '#marketresearch', '#opportunity'],
            engagement: 234,
            purpose: 'Social Proof & Market Validation'
          },
          {
            id: 4,
            tweet: `⚡ Quick update on "${idea}":\n\nBuilt a simple landing page in 2 hours\n- 47 email signups in 24h\n- 3 people offered to beta test\n- 1 investor asked for a pitch deck\n\nBuild in public works! 🎯`,
            hashtags: ['#progress', '#traction', '#buildinpublic'],
            engagement: 312,
            purpose: 'Progress Update & Traction'
          },
          {
            id: 5,
            tweet: `🎯 Final thoughts on "${idea}":\n\n- Validated with 15+ potential customers\n- MVP ready in 2 weeks\n- Clear path to $10K MRR\n\nReady to go all-in. Sometimes you just know.\n\nThanks for following the journey! 🙏`,
            hashtags: ['#mvp', '#validation', '#founderjourney'],
            engagement: 189,
            purpose: 'Conclusion & Call to Action'
          }
        ];
        setTweetSeries(sampleTweets);
      }
    } catch (error) {
      console.error('Error generating tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(idea + industry + targetAudience);

  return (
    <>
      <SEOHead 
        title="AI Tweet Generator for Founders | Validationly"
        description="Generate 5 tweet series for build-in-public content to validate your startup idea"
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
                  onClick={() => navigate('/smart-results')}
                  className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  {isTurkish ? 'Analiz' : 'Analysis'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {isTurkish ? 'AI Tweet Üretici' : 'AI Tweet Generator'}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {isTurkish 
                ? 'Startup fikrin için 5 tweet\'lik build-in-public serisi üret. Sosyal medyada fikrini test et ve topluluk geri bildirimi al.'
                : 'Generate a 5-tweet build-in-public series for your startup idea. Test your idea on social media and get community feedback.'
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
                onClick={generateTweets}
                disabled={loading || !idea.trim()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isTurkish ? 'Üretiliyor...' : 'Generating...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🚀 {isTurkish ? 'Tweet Serisi Üret' : 'Generate Tweet Series'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Generated Tweets */}
          {tweetSeries.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                {isTurkish ? 'Build-in-Public Tweet Serisi' : 'Build-in-Public Tweet Series'}
              </h2>
              
              {tweetSeries.map((tweet, index) => (
                <div key={tweet.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">
                          {isTurkish ? 'Tweet' : 'Tweet'} #{index + 1}
                        </h3>
                        <p className="text-sm text-slate-400">{tweet.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">
                        💬 {tweet.engagement}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tweet.tweet, tweet.id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition-colors"
                      >
                        {copied === tweet.id ? '✅' : '📋'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                    <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                      {tweet.tweet}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tweet.hashtags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Tips Section */}
              <div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/20">
                <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                  💡 {isTurkish ? 'Build-in-Public İpuçları' : 'Build-in-Public Tips'}
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• {isTurkish ? 'Her tweet\'i 24-48 saat arayla paylaş' : 'Share each tweet 24-48 hours apart'}</li>
                  <li>• {isTurkish ? 'Gerçek geri bildirimleri topla ve sonraki tweet\'lerde kullan' : 'Collect real feedback and use it in subsequent tweets'}</li>
                  <li>• {isTurkish ? 'Hashtag\'leri hedef kitlenin aradığı kelimelerle eşleştir' : 'Match hashtags with what your target audience searches for'}</li>
                  <li>• {isTurkish ? 'Engagement metriklerini takip et ve en iyi performans gösteren tweet\'leri analiz et' : 'Track engagement metrics and analyze your best-performing tweets'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
