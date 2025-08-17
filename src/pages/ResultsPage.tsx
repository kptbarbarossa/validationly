import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
    idea: string;
    demandScore: number;
    originalDemandScore?: number;
    momentumAdjusted?: boolean;
    earlySignalAdjusted?: boolean;
    scoreJustification: string;
    tweetSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
    linkedinSuggestion: string;
    realWorldData?: {
        socialMediaSignals: {
            twitter: { trending: boolean; sentiment: string; volume: string };
            facebook: { groupActivity: string; engagement: string };
            tiktok: { viralPotential: string; userReaction: string };
        };
        forumInsights: {
            reddit: { discussionVolume: string; painPoints: string[] };
            quora: { questionFrequency: string; topics: string[] };
        };
        marketplaceData: {
            amazon: { similarProducts: number; avgRating: number; reviewCount: number };
            appStore: { competitorApps: number; avgRating: number; downloads: string };
        };
        consumerSentiment: {
            overallSentiment: string;
            keyComplaints: string[];
            positiveFeedback: string[];
        };
    };
    dataConfidence?: string;
    lastDataUpdate?: string;
    platformAnalyses?: any;
}

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Extract result from location state
    const result = (location.state as any)?.result as ValidationResult;

    if (!result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">No Analysis Results</h1>
                    <p className="text-slate-400 mb-6">Please start a new analysis from the home page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white font-medium transition-colors"
                    >
                        Start New Analysis
                    </button>
                </div>
            </div>
        );
    }

    // Language detection
    const isTR = (() => {
        const turkishWords = ['ve', 'bir', 'bu', 'ile', 'için', 'olarak', 'gibi', 'kadar', 'sonra', 'önce', 'üzerinde', 'altında', 'yanında', 'karşısında'];
        const englishWords = ['and', 'the', 'a', 'an', 'for', 'with', 'in', 'on', 'at', 'to', 'of', 'by', 'from', 'about'];
        
        const ideaText = result.idea?.toLowerCase() || '';
        const justificationText = result.scoreJustification?.toLowerCase() || '';
        
        let turkishCount = 0;
        let englishCount = 0;
        
        turkishWords.forEach(word => {
            if (ideaText.includes(word) || justificationText.includes(word)) turkishCount++;
        });
        
        englishWords.forEach(word => {
            if (ideaText.includes(word) || justificationText.includes(word)) englishCount++;
        });
        
        if (turkishCount > englishCount) return true;
        return false;
    })();

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(result.demandScore);
        }, 500);
        return () => clearTimeout(timer);
    }, [result.demandScore]);

    const copyText = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const postToTwitter = (text: string) => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const postToLinkedIn = (text: string) => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const postToReddit = (title: string, body: string) => {
        const url = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(body)}`;
        window.open(url, '_blank');
    };

    // Debug logging
    console.log('ResultsPage data:', result);
    console.log('realWorldData:', result.realWorldData);
    console.log('tweetSuggestion:', result.tweetSuggestion);
    console.log('redditTitleSuggestion:', result.redditTitleSuggestion);
    console.log('redditBodySuggestion:', result.redditBodySuggestion);
    console.log('linkedinSuggestion:', result.linkedinSuggestion);

    return (
        <>
            <SEOHead
                title={`${result.idea} - Validation Results | Validationly`}
                description={`Market validation results for "${result.idea}". Score: ${result.demandScore}/100. ${result.scoreJustification}`}
            />
            
            <div className="relative text-white overflow-hidden">
                {/* Decorative Background Shapes */}
                <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="pointer-events-none absolute top-20 -right-20 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative flex" style={{minHeight: 'calc(100vh - 120px)'}}>
                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {/* Header */}
                        <header className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-3">
                                    {isTR ? 'Analiz Sonuçları' : 'Analysis Results'} 
                                    <span className="text-2xl">🚀</span>
                                </h1>
                                <p className="text-slate-400 mt-1">{isTR ? 'Fikrinizin pazar potansiyeli' : 'Market potential of your idea'}</p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white font-medium transition-colors"
                            >
                                {isTR ? 'Yeni Analiz' : 'New Analysis'}
                            </button>
                        </header>

                        {/* Score Card */}
                        <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-2">{isTR ? 'Talep Skoru' : 'Demand Score'}</h2>
                                    <p className="text-slate-400 text-sm">{isTR ? 'Pazardaki potansiyel' : 'Market potential'}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-white mb-1">{result.demandScore}</div>
                                    <div className="text-slate-400 text-sm">/ 100</div>
                                </div>
                            </div>
                            
                            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                                <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out rounded-full" 
                                    style={{ width: `${Math.max(2, progress)}%` }} 
                                />
                            </div>
                            
                            <p className="text-sm text-slate-300 leading-relaxed">{result.scoreJustification}</p>
                        </div>

                        {/* Real-World Data Analysis - ALWAYS SHOW */}
                        <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <span className="text-2xl">🌍</span>
                                    {isTR ? 'Gerçek Dünya Veri Analizi' : 'Real-World Data Analysis'}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        result.dataConfidence === 'high' || result.dataConfidence === 'yüksek' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        result.dataConfidence === 'medium' || result.dataConfidence === 'orta' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                        {isTR ?
                                            (result.dataConfidence === 'high' || result.dataConfidence === 'yüksek' ? 'Yüksek Güven' :
                                             result.dataConfidence === 'medium' || result.dataConfidence === 'orta' ? 'Orta Güven' : 'Düşük Güven') :
                                            (result.dataConfidence === 'high' || result.dataConfidence === 'yüksek' ? 'High Confidence' :
                                             result.dataConfidence === 'medium' || result.dataConfidence === 'orta' ? 'Medium Confidence' : 'Low Confidence')
                                        }
                                    </div>
                                    {result.lastDataUpdate && (
                                        <div className="text-xs text-slate-400">
                                            📅 {new Date(result.lastDataUpdate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* DEBUG SECTION */}
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <h3 className="text-red-400 font-semibold mb-2">🔍 DEBUG INFO:</h3>
                                <div className="text-xs text-red-300 space-y-1">
                                    <p>result.realWorldData exists: {result.realWorldData ? 'YES' : 'NO'}</p>
                                    <p>result.realWorldData type: {typeof result.realWorldData}</p>
                                    <p>result.tweetSuggestion: {result.tweetSuggestion || 'undefined'}</p>
                                    <p>result.redditTitleSuggestion: {result.redditTitleSuggestion || 'undefined'}</p>
                                    <p>result.linkedinSuggestion: {result.linkedinSuggestion || 'undefined'}</p>
                                    <p>Full result keys: {Object.keys(result).join(', ')}</p>
                                </div>
                            </div>
                            
                            {result.realWorldData ? (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Social Media Signals */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-lg">📱</span>
                                                {isTR ? 'Sosyal Medya Sinyalleri' : 'Social Media Signals'}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Twitter:</span>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        result.realWorldData.socialMediaSignals?.twitter?.trending ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                        {result.realWorldData.socialMediaSignals?.twitter?.trending ? '🔥 Trending' : 'Normal'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Facebook:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.socialMediaSignals?.facebook?.groupActivity || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">TikTok:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.socialMediaSignals?.tiktok?.viralPotential || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Forum Insights */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-lg">💬</span>
                                                {isTR ? 'Forum İçgörüleri' : 'Forum Insights'}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Reddit:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.forumInsights?.reddit?.discussionVolume || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Quora:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.forumInsights?.quora?.questionFrequency || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Marketplace Data & Consumer Sentiment */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                        {/* Marketplace Data */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-lg">🛒</span>
                                                {isTR ? 'Pazar Yeri Verileri' : 'Marketplace Data'}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Amazon:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.marketplaceData?.amazon?.similarProducts || 0} ürün</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">App Store:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.marketplaceData?.appStore?.competitorApps || 0} uygulama</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Consumer Sentiment */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-lg">😊</span>
                                                {isTR ? 'Tüketici Duyguları' : 'Consumer Sentiment'}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-400">Genel:</span>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        result.realWorldData.consumerSentiment?.overallSentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                                        result.realWorldData.consumerSentiment?.overallSentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {result.realWorldData.consumerSentiment?.overallSentiment || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-slate-400 mb-4">⚠️</div>
                                    <p className="text-slate-400">
                                        {isTR ? 'Real-World Data henüz yüklenmedi veya mevcut değil.' : 'Real-World Data not yet loaded or not available.'}
                                    </p>
                                    <p className="text-slate-500 text-sm mt-2">
                                        {isTR ? 'API yanıtı bekleniyor...' : 'Waiting for API response...'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Social Media Post Suggestions */}
                        <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-6">{isTR ? 'Sosyal Medya Post Önerileri' : 'Social Media Post Suggestions'}</h2>
                            
                            <div className="space-y-6">
                                {/* X (Twitter) */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-slate-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-white">X (Twitter)</h3>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm text-slate-300 mb-4 min-h-[100px]">
                                        {result.tweetSuggestion || (isTR ? 'Tweet önerisi yükleniyor...' : 'Loading tweet suggestion...')}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => postToTwitter(result.tweetSuggestion)} 
                                            className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-xl text-white text-sm font-medium transition-colors"
                                        >
                                            {isTR ? 'Post' : 'Post'}
                                        </button>
                                        <button
                                            onClick={() => copyText(result.tweetSuggestion, 0)} 
                                            className={`flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors ${copiedIndex===0 ? 'bg-emerald-600' : 'bg-white/10 hover:bg-white/20'}`}
                                        >
                                            {copiedIndex===0 ? (isTR ? 'Kopyalandı' : 'Copied') : (isTR ? 'Kopyala' : 'Copy')}
                                        </button>
                                    </div>
                                </div>

                                {/* Reddit */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.208-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.491 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .31 0c.1.047.18.096.25.146l2.594.547c.712-.19 1.25-.8 1.25-1.496 0-.688-.561-1.25-1.249-1.25a1.25 1.25 0 0 0-1.249 1.25l-.747.365a.75.75 0 0 1-.23-.565.75.75 0 0 1 .75-.75zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.5 1.5c.275 0 .5.224.5.5s-.225.5-.5.5-.5-.224-.5-.5.225-.5.5-.5zm5.5 0c.275 0 .5.224.5.5s-.225.5-.5.5-.5-.224-.5-.5.225-.5.5-.5z"/>
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-white">Reddit</h3>
                                    </div>
                                    <div className="space-y-3 mb-4">
                                        <div>
                                            <div className="text-xs text-slate-400 mb-2">{isTR ? 'Başlık:' : 'Title:'}</div>
                                            <div className="bg-slate-900/50 rounded-xl p-3 font-mono text-sm text-slate-300">
                                                {result.redditTitleSuggestion || (isTR ? 'Reddit başlık önerisi yükleniyor...' : 'Loading Reddit title suggestion...')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 mb-2">{isTR ? 'İçerik:' : 'Body:'}</div>
                                            <div className="bg-slate-900/50 rounded-xl p-3 font-mono text-sm text-slate-300 max-h-20 overflow-y-auto">
                                                {result.redditBodySuggestion || (isTR ? 'Reddit içerik önerisi yükleniyor...' : 'Loading Reddit body suggestion...')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => postToReddit(result.redditTitleSuggestion, result.redditBodySuggestion)} 
                                            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-white text-sm font-medium transition-colors"
                                        >
                                            {isTR ? 'Post' : 'Post'}
                                        </button>
                                        <button
                                            onClick={() => copyText(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 1)} 
                                            className={`flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors ${copiedIndex===1 ? 'bg-emerald-600' : 'bg-white/10 hover:bg-white/20'}`}
                                        >
                                            {copiedIndex===1 ? (isTR ? 'Kopyalandı' : 'Copied') : (isTR ? 'Kopyala' : 'Copy')}
                                        </button>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-white">LinkedIn</h3>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm text-slate-300 mb-4 min-h-[100px] overflow-y-auto">
                                        {result.linkedinSuggestion || (isTR ? 'LinkedIn önerisi yükleniyor...' : 'Loading LinkedIn suggestion...')}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => postToLinkedIn(result.linkedinSuggestion)} 
                                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-medium transition-colors"
                                        >
                                            {isTR ? 'Post' : 'Post'}
                                        </button>
                                        <button
                                            onClick={() => copyText(result.linkedinSuggestion, 2)} 
                                            className={`flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors ${copiedIndex===2 ? 'bg-emerald-600' : 'bg-white/10 hover:bg-white/20'}`}
                                        >
                                            {copiedIndex===2 ? (isTR ? 'Kopyalandı' : 'Copied') : (isTR ? 'Kopyala' : 'Copy')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;
