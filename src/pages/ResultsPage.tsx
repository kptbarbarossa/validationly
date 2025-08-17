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
    platformAnalyses?: {
        LinkedIn?: {
            score: number;
            summary: string;
            keyFindings?: string[];
            dataSource?: string;
        };
        X?: {
            score: number;
            summary: string;
            keyFindings?: string[];
            dataSource?: string;
        };
        Reddit?: {
            score: number;
            summary: string;
            keyFindings?: string[];
            dataSource?: string;
        };
        linkedin?: {
            score: number;
            summary: string;
            keyFindings?: string[];
            dataSource?: string;
        };
        twitter?: {
            score: number;
            summary: string;
            keyFindings?: string[];
            dataSource?: string;
        };
        reddit?: {
            score: number;
            summary: string;
            keyFindings?: string[];
            dataSource?: string;
        };
    };
    socialMomentum?: {
        momentumScore: number;
        trendPhase: 'emerging' | 'growing' | 'peak' | 'declining' | 'stagnant';
        socialSignals: {
            searchVolume: {
                trend: 'increasing' | 'stable' | 'decreasing';
                score: number;
                keywords: string[];
            };
            socialMentions: {
                platforms: Array<{
                    name: string;
                    activity: 'high' | 'medium' | 'low';
                    sentiment: 'positive' | 'neutral' | 'negative';
                    score: number;
                }>;
                overallScore: number;
            };
            competitorGaps: {
                hasGaps: boolean;
                opportunities: string[];
                score: number;
            };
        };
    };
    earlySignal?: {
        timingScore: number;
        marketPhase: 'emerging' | 'growing' | 'mature' | 'declining';
        opportunityWindow: string;
        keyFactors: string[];
        recommendations: string[];
    };
}

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const result = (location.state as any)?.result as ValidationResult;
    const fromTrendHunter = (location.state as any)?.fromTrendHunter;
    const trendIdea = (location.state as any)?.trendIdea;
    const trendDescription = (location.state as any)?.trendDescription;
    const fromTrendToStartup = (location.state as any)?.fromTrendToStartup;
    const startupIdea = (location.state as any)?.startupIdea;
    const startupDescription = (location.state as any)?.startupDescription;

    useEffect(() => {
        if (!result && !fromTrendHunter && !fromTrendToStartup) {
            navigate('/');
            return;
        }

        if (fromTrendHunter && trendIdea && trendDescription) {
            setIsLoading(true);
            // Handle trend hunter flow
            setTimeout(() => setIsLoading(false), 2000);
        } else if (fromTrendToStartup && startupIdea && startupDescription) {
            setIsLoading(true);
            // Handle trend to startup flow
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [fromTrendHunter, trendIdea, trendDescription, fromTrendToStartup, startupIdea, startupDescription, result, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{minHeight: 'calc(100vh - 120px)'}}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">
                        {fromTrendHunter ? 'Trend fikri analiz ediliyor...' : 
                         fromTrendToStartup ? 'Startup fikri analiz ediliyor...' : 
                         'Analiz ediliyor...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!result) {
        navigate('/');
        return null;
    }

    // Smart language detection based on input language
    const isTR = (() => {
        // Check if the original idea input was in Turkish
        const turkishWords = ['ve', 'bir', 'bu', 'ile', 'için', 'olarak', 'gibi', 'kadar', 'sonra', 'önce', 'üzerinde', 'altında', 'yanında', 'karşısında'];
        const englishWords = ['and', 'the', 'a', 'an', 'for', 'with', 'in', 'on', 'at', 'to', 'of', 'by', 'from', 'about'];
        
        const ideaText = result.idea?.toLowerCase() || '';
        const justificationText = result.scoreJustification?.toLowerCase() || '';
        
        // Count Turkish vs English words
        let turkishCount = 0;
        let englishCount = 0;
        
        turkishWords.forEach(word => {
            if (ideaText.includes(word) || justificationText.includes(word)) turkishCount++;
        });
        
        englishWords.forEach(word => {
            if (ideaText.includes(word) || justificationText.includes(word)) englishCount++;
        });
        
        // If more Turkish words found, return true
        if (turkishCount > englishCount) return true;
        
        // Default to English for better international experience
        return false;
    })();

    const getScoreStatus = (score: number) => {
        if (score >= 80) return { text: isTR ? 'Yüksek' : 'High', icon: '🟢', color: 'text-green-400' };
        if (score >= 60) return { text: isTR ? 'Orta' : 'Medium', icon: '🟡', color: 'text-yellow-400' };
        return { text: isTR ? 'Düşük' : 'Low', icon: '🔴', color: 'text-red-400' };
    };

    const status = getScoreStatus(result.demandScore);

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

    const getBulletPoints = (analysis: any) => {
        if (!analysis) return [];
        if (analysis.keyFindings && analysis.keyFindings.length > 0) {
            return analysis.keyFindings.slice(0, 3);
        }
        return analysis.summary?.split('.').filter((s: string) => s.trim().length > 10).slice(0, 3) || [];
    };

    console.log('ResultsPage data:', result);

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
                            
                            {/* Score Adjustment Indicators */}
                            {((result.momentumAdjusted || result.earlySignalAdjusted) && result.originalDemandScore) && (
                                <div className="mt-4 space-y-2">
                                    {result.momentumAdjusted && (
                                        <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-indigo-400">🎯</span>
                                                <span className="text-sm font-medium text-indigo-300">
                                                    {isTR ? 'Sosyal Momentum Ayarlaması' : 'Social Momentum Adjustment'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-indigo-200">
                                                {isTR ? 'Sosyal sinyaller temel alınarak skor güncellendi' : 'Score updated based on social signals'}
                                            </p>
                                        </div>
                                    )}
                                    {result.earlySignalAdjusted && (
                                        <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-purple-400">⚡</span>
                                                <span className="text-sm font-medium text-purple-300">
                                                    {isTR ? 'Erken Sinyal Bonusu' : 'Early Signal Bonus'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-purple-200">
                                                {isTR ? 'Optimal zamanlama fırsatı tespit edildi' : 'Optimal timing opportunity detected'}
                                            </p>
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-400 text-center">
                                        {isTR ? 
                                            `Orijinal skor: ${result.originalDemandScore} → Güncel skor: ${result.demandScore}` :
                                            `Original score: ${result.originalDemandScore} → Current score: ${result.demandScore}`
                                        }
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Platform Signals */}
                        {result.platformAnalyses && (
                            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                                <h2 className="text-xl font-semibold text-white mb-6">{isTR ? 'Platform Sinyalleri' : 'Platform Signals'}</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* LinkedIn */}
                                    {(result.platformAnalyses.LinkedIn || result.platformAnalyses.linkedin) && (
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </div>
                                                <h3 className="font-semibold text-white">LinkedIn</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">📊</span>
                                                    <span className="text-sm text-slate-300">
                                                        {isTR ? 'Skor:' : 'Score:'} {(result.platformAnalyses.LinkedIn || result.platformAnalyses.linkedin)?.score}/5
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300">
                                                    {(result.platformAnalyses.LinkedIn || result.platformAnalyses.linkedin)?.summary}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* X (Twitter) */}
                                    {(result.platformAnalyses.X || result.platformAnalyses.twitter) && (
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-slate-500/20 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                    </svg>
                                                </div>
                                                <h3 className="font-semibold text-white">X (Twitter)</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">📊</span>
                                                    <span className="text-sm text-slate-300">
                                                        {isTR ? 'Skor:' : 'Score:'} {(result.platformAnalyses.X || result.platformAnalyses.twitter)?.score}/5
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300">
                                                    {(result.platformAnalyses.X || result.platformAnalyses.twitter)?.summary}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reddit */}
                                    {(result.platformAnalyses.Reddit || result.platformAnalyses.reddit) && (
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.208-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.491 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .31 0c.1.047.18.096.25.146l2.594.547c.712-.19 1.25-.8 1.25-1.496 0-.688-.561-1.25-1.249-1.25a1.25 1.25 0 0 0-1.249 1.25l-.747.365a.75.75 0 0 1-.23-.565.75.75 0 0 1 .75-.75zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.5 1.5c.275 0 .5.224.5.5s-.225.5-.5.5-.5-.224-.5-.5.225-.5.5-.5zm5.5 0c.275 0 .5.224.5.5s-.225.5-.5.5-.5-.224-.5-.5.225-.5.5-.5z"/>
                                                    </svg>
                                                </div>
                                                <h3 className="font-semibold text-white">Reddit</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">📊</span>
                                                    <span className="text-sm text-slate-300">
                                                        {isTR ? 'Skor:' : 'Score:'} {(result.platformAnalyses.Reddit || result.platformAnalyses.reddit)?.score}/5
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300">
                                                    {(result.platformAnalyses.Reddit || result.platformAnalyses.reddit)?.summary}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Real-World Data Analysis */}
                        {result.realWorldData && (
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
                                                    result.realWorldData.socialMediaSignals.twitter.trending ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                    {result.realWorldData.socialMediaSignals.twitter.trending ? '🔥 Trending' : 'Normal'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Facebook:</span>
                                                <span className="text-white text-sm">{result.realWorldData.socialMediaSignals.facebook.groupActivity}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">TikTok:</span>
                                                <span className="text-white text-sm">{result.realWorldData.socialMediaSignals.tiktok.viralPotential}</span>
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
                                                <span className="text-white text-sm">{result.realWorldData.forumInsights.reddit.discussionVolume}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Quora:</span>
                                                <span className="text-white text-sm">{result.realWorldData.forumInsights.quora.questionFrequency}</span>
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
                                                <span className="text-white text-sm">{result.realWorldData.marketplaceData.amazon.similarProducts} ürün</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">App Store:</span>
                                                <span className="text-white text-sm">{result.realWorldData.marketplaceData.appStore.competitorApps} uygulama</span>
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
                                                    result.realWorldData.consumerSentiment.overallSentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                                    result.realWorldData.consumerSentiment.overallSentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {result.realWorldData.consumerSentiment.overallSentiment}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                        {result.tweetSuggestion}
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
                                                {result.redditTitleSuggestion}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 mb-2">{isTR ? 'İçerik:' : 'Body:'}</div>
                                            <div className="bg-slate-900/50 rounded-xl p-3 font-mono text-sm text-slate-300 max-h-20 overflow-y-auto">
                                                {result.redditBodySuggestion}
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
                                        {result.linkedinSuggestion}
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

                    {/* Right Sidebar - Tools */}
                    <aside className="w-80 p-8 bg-white/5 backdrop-blur border-l border-white/10">
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-semibold text-white mb-4">{isTR ? 'Hızlı İstatistikler' : 'Quick Stats'}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">{isTR ? 'Analiz Süresi' : 'Analysis Time'}</span>
                                        <span className="text-white font-medium">~30s</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">{isTR ? 'Platform Sayısı' : 'Platforms'}</span>
                                        <span className="text-white font-medium">3</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">{isTR ? 'Güvenilirlik' : 'Confidence'}</span>
                                        <span className="text-green-400 font-medium">{status.text}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tools Section */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-lg">🛠️</span>
                                    {isTR ? 'Araçlar' : 'Tools'}
                                </h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => navigate('/tools')}
                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                                    >
                                        <div className="text-sm font-medium text-white">{isTR ? 'Tüm Araçlar' : 'All Tools'}</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'Trend Hunter, X Generator ve daha fazlası' : 'Trend Hunter, X Generator and more'}</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => navigate('/trend-hunter')}
                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                                    >
                                        <div className="text-sm font-medium text-white">🔍 Trend Hunter</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'Viral trendlerden startup fikirleri' : 'Startup ideas from viral trends'}</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => navigate('/ai-tweet-generator')}
                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                                    >
                                        <div className="text-sm font-medium text-white">📱 X Content Generator</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'AI ile tweet serileri oluştur' : 'Generate tweet series with AI'}</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => navigate('/trend-to-startup')}
                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                                    >
                                        <div className="text-sm font-medium text-white">🚀 Trend → Startup</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'Detaylı startup planları' : 'Detailed startup plans'}</div>
                                    </button>
                                </div>
                            </div>

                            {/* Action Items */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-semibold text-white mb-4">{isTR ? 'Önerilen Adımlar' : 'Next Steps'}</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
                                        <div className="text-sm font-medium text-white">{isTR ? 'MVP Geliştir' : 'Build MVP'}</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'Minimum ürün geliştir' : 'Create minimum viable product'}</div>
                                    </button>
                                    <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
                                        <div className="text-sm font-medium text-white">{isTR ? 'Pazar Araştırması' : 'Market Research'}</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'Derinlemesine analiz yap' : 'Conduct deeper analysis'}</div>
                                    </button>
                                    <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
                                        <div className="text-sm font-medium text-white">{isTR ? 'Sosyal Medyada Test' : 'Social Media Test'}</div>
                                        <div className="text-xs text-slate-400 mt-1">{isTR ? 'Postları paylaş ve geri bildirim al' : 'Share posts and get feedback'}</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;
