import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
    idea: string;
    demandScore: number;
    originalDemandScore?: number; // Before momentum adjustment
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
        // Legacy support
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
        timingAnalysis: {
            isEarlyStage: boolean;
            marketReadiness: number;
            recommendedAction: 'wait' | 'move_now' | 'too_late';
            timeWindow: string;
        };
        earlyDetectionFactors: {
            realWorldSignals: string[];
            earlyAdopterBehavior: string[];
            marketMomentum: number;
            marketOpportunity: number;
        };
        enhancedValidationScore: number;
        recommendation: string;
    };
    earlySignal?: {
        earlySignalScore: number;
        signalStrength: 'weak' | 'moderate' | 'strong' | 'exceptional';
        timingIntelligence: {
            marketCycle: 'pre-trend' | 'early-trend' | 'mid-trend' | 'late-trend' | 'post-trend';
            optimalEntryWindow: string;
            competitorAwareness: 'none' | 'minimal' | 'emerging' | 'high';
            firstMoverAdvantage: number;
            windowOfOpportunity: string;
        };
        signalSources: {
            technicalIndicators: Array<{
                source: string;
                signal: string;
                strength: number;
                reliability: 'low' | 'medium' | 'high';
            }>;
            behavioralSignals: Array<{
                behavior: string;
                evidence: string;
                significance: number;
            }>;
            marketGaps: Array<{
                gap: string;
                size: 'small' | 'medium' | 'large';
                accessibility: 'easy' | 'moderate' | 'difficult';
            }>;
        };
        riskFactors: {
            timingRisk: number;
            competitionRisk: number;
            marketAcceptanceRisk: number;
            overallRisk: 'low' | 'medium' | 'high';
            mitigationStrategies: string[];
        };
        actionPlan: {
            immediateActions: string[];
            shortTermGoals: string[];
            longTermStrategy: string;
            keyMetrics: string[];
            successIndicators: string[];
        };
        enhancedScore: number;
        confidence: number;
        recommendation: string;
    };
}

const LinkedInIcon = () => (
    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const XIcon = () => (
    <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const RedditIcon = () => (
    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
);

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const result = (location.state as any)?.result as ValidationResult;
    const fromTrendHunter = (location.state as any)?.fromTrendHunter as boolean;
    const trendIdea = (location.state as any)?.trendIdea as string;
    const trendDescription = (location.state as any)?.trendDescription as string;
    const fromTrendToStartup = (location.state as any)?.fromTrendToStartup as boolean;
    const startupIdea = (location.state as any)?.startupIdea as string;
    const startupDescription = (location.state as any)?.startupDescription as string;

    // Handle trend hunter validation
    useEffect(() => {
        if (fromTrendHunter && trendIdea && !result) {
            setIsLoading(true);
            
            fetch('/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    idea: `${trendIdea}: ${trendDescription}`,
                    fast: true 
                })
            })
            .then(res => res.json())
            .then(data => {
                navigate('/results', { 
                    state: { result: data },
                    replace: true 
                });
            })
            .catch(err => {
                console.error('Trend validation error:', err);
                navigate('/');
            })
            .finally(() => {
                setIsLoading(false);
            });
            
            return;
        }

        // Handle trend-to-startup validation
        if (fromTrendToStartup && startupIdea && !result) {
            setIsLoading(true);
            
            fetch('/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    idea: `${startupIdea}: ${startupDescription}`,
                    fast: true 
                })
            })
            .then(res => res.json())
            .then(data => {
                navigate('/results', { 
                    state: { result: data },
                    replace: true 
                });
            })
            .catch(err => {
                console.error('Startup validation error:', err);
            navigate('/');
            })
            .finally(() => {
                setIsLoading(false);
            });
            
            return;
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

    const isTR = result.scoreJustification?.includes('Türk') || result.scoreJustification?.includes('pazar') || false;

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
        // Fallback to summary split by sentences
        return analysis.summary?.split('.').filter((s: string) => s.trim().length > 10).slice(0, 3) || [];
    };

    // Debug: Log the result data to see what we're getting
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

                <div className="relative" style={{minHeight: 'calc(100vh - 120px)'}}>
                    {/* Main Content */}
                    <main className="w-full">
                        {/* Center Content */}
                        <div className="p-8">
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

                            {/* Signal Summary */}
                            {result.platformAnalyses && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                                    <h2 className="text-xl font-semibold text-white mb-6">{isTR ? 'Platform Sinyalleri' : 'Platform Signals'}</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* LinkedIn */}
                                        {(result.platformAnalyses.LinkedIn || result.platformAnalyses.linkedin) && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                                        <LinkedInIcon />
                    </div>
                    <div>
                                                        <h3 className="font-semibold text-white">LinkedIn</h3>
                                                        <span className="text-blue-300 font-bold">
                                                            {(result.platformAnalyses.LinkedIn || result.platformAnalyses.linkedin)?.score}/5
                        </span>
                    </div>
                    </div>
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    {getBulletPoints(result.platformAnalyses.LinkedIn || result.platformAnalyses.linkedin).slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-blue-400 mt-1">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                    </div>
                                        )}

                                        {/* X (Twitter) */}
                                        {(result.platformAnalyses.X || result.platformAnalyses.twitter) && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center">
                                                        <XIcon />
                </div>
                <div>
                                                        <h3 className="font-semibold text-white">X (Twitter)</h3>
                                                        <span className="text-slate-300 font-bold">
                                                            {(result.platformAnalyses.X || result.platformAnalyses.twitter)?.score}/5
                                                        </span>
                </div>
            </div>
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    {getBulletPoints(result.platformAnalyses.X || result.platformAnalyses.twitter).slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-slate-400 mt-1">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                </div>
                                        )}

                                        {/* Reddit */}
                                        {(result.platformAnalyses.Reddit || result.platformAnalyses.reddit) && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                                        <RedditIcon />
                </div>
                <div>
                                                        <h3 className="font-semibold text-white">Reddit</h3>
                                                        <span className="text-orange-300 font-bold">
                                                            {(result.platformAnalyses.Reddit || result.platformAnalyses.reddit)?.score}/5
                                                        </span>
                </div>
            </div>
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    {getBulletPoints(result.platformAnalyses.Reddit || result.platformAnalyses.reddit).slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-orange-400 mt-1">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
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
                                                {/* Twitter */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-300">X (Twitter)</span>
                                                    <div className="flex items-center gap-2">
                                                        {result.realWorldData.socialMediaSignals.twitter.trending && (
                                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">🔥</span>
                                                        )}
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.socialMediaSignals.twitter.sentiment === 'positive' || result.realWorldData.socialMediaSignals.twitter.sentiment === 'olumlu' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.socialMediaSignals.twitter.sentiment === 'negative' || result.realWorldData.socialMediaSignals.twitter.sentiment === 'olumsuz' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.socialMediaSignals.twitter.sentiment}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.socialMediaSignals.twitter.volume === 'high' || result.realWorldData.socialMediaSignals.twitter.volume === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.socialMediaSignals.twitter.volume === 'medium' || result.realWorldData.socialMediaSignals.twitter.volume === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.socialMediaSignals.twitter.volume}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Facebook */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-300">Facebook</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.socialMediaSignals.facebook.groupActivity === 'high' || result.realWorldData.socialMediaSignals.facebook.groupActivity === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.socialMediaSignals.facebook.groupActivity === 'medium' || result.realWorldData.socialMediaSignals.facebook.groupActivity === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.socialMediaSignals.facebook.groupActivity}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.socialMediaSignals.facebook.engagement === 'high' || result.realWorldData.socialMediaSignals.facebook.engagement === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.socialMediaSignals.facebook.engagement === 'medium' || result.realWorldData.socialMediaSignals.facebook.engagement === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.socialMediaSignals.facebook.engagement}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* TikTok */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-300">TikTok</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.socialMediaSignals.tiktok.viralPotential === 'high' || result.realWorldData.socialMediaSignals.tiktok.viralPotential === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.socialMediaSignals.tiktok.viralPotential === 'medium' || result.realWorldData.socialMediaSignals.tiktok.viralPotential === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.socialMediaSignals.tiktok.viralPotential}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.socialMediaSignals.tiktok.userReaction === 'positive' || result.realWorldData.socialMediaSignals.tiktok.userReaction === 'olumlu' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.socialMediaSignals.tiktok.userReaction === 'negative' || result.realWorldData.socialMediaSignals.tiktok.userReaction === 'olumsuz' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.socialMediaSignals.tiktok.userReaction}
                                                        </span>
                                                    </div>
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
                                                {/* Reddit */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-slate-300">Reddit</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.forumInsights.reddit.discussionVolume === 'high' || result.realWorldData.forumInsights.reddit.discussionVolume === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.forumInsights.reddit.discussionVolume === 'medium' || result.realWorldData.forumInsights.reddit.discussionVolume === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.forumInsights.reddit.discussionVolume}
                                                        </span>
                                                    </div>
                                                    {result.realWorldData.forumInsights.reddit.painPoints.length > 0 && (
                                                        <div className="text-xs text-slate-400">
                                                            {isTR ? 'Ağrı noktaları:' : 'Pain points:'} {result.realWorldData.forumInsights.reddit.painPoints.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Quora */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-slate-300">Quora</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            result.realWorldData.forumInsights.quora.questionFrequency === 'high' || result.realWorldData.forumInsights.quora.questionFrequency === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.forumInsights.quora.questionFrequency === 'medium' || result.realWorldData.forumInsights.quora.questionFrequency === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.forumInsights.quora.questionFrequency}
                                                        </span>
                                                    </div>
                                                    {result.realWorldData.forumInsights.quora.topics.length > 0 && (
                                                        <div className="text-xs text-slate-400">
                                                            {isTR ? 'Konular:' : 'Topics:'} {result.realWorldData.forumInsights.quora.topics.join(', ')}
                                                        </div>
                                                    )}
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
                                                {/* Amazon */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-slate-300">Amazon</span>
                                                        <span className="text-sm text-slate-400">
                                                            {result.realWorldData.marketplaceData.amazon.similarProducts} benzer ürün
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                                        <span>⭐ {result.realWorldData.marketplaceData.amazon.avgRating}/5</span>
                                                        <span>📝 {result.realWorldData.marketplaceData.amazon.reviewCount} yorum</span>
                                                    </div>
                                                </div>
                                                
                                                {/* App Store */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-slate-300">App Store</span>
                                                        <span className="text-sm text-slate-400">
                                                            {result.realWorldData.marketplaceData.appStore.competitorApps} rakip uygulama
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                                        <span>⭐ {result.realWorldData.marketplaceData.appStore.avgRating}/5</span>
                                                        <span className={`px-2 py-1 rounded-full ${
                                                            result.realWorldData.marketplaceData.appStore.downloads === 'high' || result.realWorldData.marketplaceData.appStore.downloads === 'yüksek' ? 'bg-green-500/20 text-green-400' :
                                                            result.realWorldData.marketplaceData.appStore.downloads === 'medium' || result.realWorldData.marketplaceData.appStore.downloads === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {result.realWorldData.marketplaceData.appStore.downloads}
                                                        </span>
                                                    </div>
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
                                                    <span className="text-slate-300">{isTR ? 'Genel Duygu' : 'Overall Sentiment'}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        result.realWorldData.consumerSentiment.overallSentiment === 'positive' || result.realWorldData.consumerSentiment.overallSentiment === 'olumlu' ? 'bg-green-500/20 text-green-400' :
                                                        result.realWorldData.consumerSentiment.overallSentiment === 'negative' || result.realWorldData.consumerSentiment.overallSentiment === 'olumsuz' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                        {result.realWorldData.consumerSentiment.overallSentiment}
                                                    </span>
                                                </div>
                                                
                                                {result.realWorldData.consumerSentiment.keyComplaints.length > 0 && (
                                                    <div>
                                                        <span className="text-xs text-slate-400">{isTR ? 'Ana şikayetler:' : 'Key complaints:'}</span>
                                                        <div className="text-xs text-red-400 mt-1">
                                                            {result.realWorldData.consumerSentiment.keyComplaints.join(', ')}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {result.realWorldData.consumerSentiment.positiveFeedback.length > 0 && (
                                                    <div>
                                                        <span className="text-xs text-slate-400">{isTR ? 'Olumlu geri bildirimler:' : 'Positive feedback:'}</span>
                                                        <div className="text-xs text-green-400 mt-1">
                                                            {result.realWorldData.consumerSentiment.positiveFeedback.join(', ')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Social Momentum Analysis */}
                            {result.socialMomentum && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <span className="text-2xl">🎯</span>
                                        {isTR ? 'Sosyal Momentum Analizi' : 'Social Momentum Analysis'}
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        {/* Momentum Score */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-indigo-400">📊</span>
                    </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Momentum Skoru' : 'Momentum Score'}
                                                </h3>
                </div>
                                            <div className="text-2xl font-bold text-indigo-400 mb-1">
                                                {result.socialMomentum.momentumScore}/100
                    </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${result.socialMomentum.momentumScore}%` }}
                                                />
                </div>
            </div>

                                        {/* Trend Phase */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-400">📈</span>
                </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Trend Fazı' : 'Trend Phase'}
                                                </h3>
                </div>
                                            <div className="text-lg font-bold text-green-400 capitalize">
                                                {result.socialMomentum.trendPhase === 'emerging' ? (isTR ? 'Yeni Ortaya Çıkıyor' : 'Emerging') :
                                                 result.socialMomentum.trendPhase === 'growing' ? (isTR ? 'Büyüyor' : 'Growing') :
                                                 result.socialMomentum.trendPhase === 'peak' ? (isTR ? 'Zirve' : 'Peak') :
                                                 result.socialMomentum.trendPhase === 'declining' ? (isTR ? 'Azalıyor' : 'Declining') :
                                                 (isTR ? 'Durgun' : 'Stagnant')}
            </div>
                </div>

                                        {/* Market Readiness */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-yellow-400">🎯</span>
                </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Pazar Hazırlığı' : 'Market Readiness'}
                                                </h3>
                </div>
                                            <div className="text-2xl font-bold text-yellow-400 mb-1">
                                                {result.socialMomentum.timingAnalysis.marketReadiness}%
                </div>
                                            <div className="text-xs text-slate-400">
                                                {result.socialMomentum.timingAnalysis.timeWindow}
                </div>
            </div>

                                        {/* Market Opportunity */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-purple-400">💎</span>
                    </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Pazar Fırsatı' : 'Market Opportunity'}
                                                </h3>
                        </div>
                                            <div className="text-2xl font-bold text-purple-400 mb-1">
                                                {result.socialMomentum.earlyDetectionFactors.marketOpportunity}/100
                    </div>
                                            <div className="text-xs text-slate-400">
                                                {result.socialMomentum.timingAnalysis.recommendedAction === 'move_now' ? 
                                                    (isTR ? 'Şimdi Hareket Et' : 'Move Now') :
                                                 result.socialMomentum.timingAnalysis.recommendedAction === 'wait' ?
                                                    (isTR ? 'Bekle' : 'Wait') :
                                                    (isTR ? 'Çok Geç' : 'Too Late')
                                                }
                </div>
                                        </div>
                </div>

                                    {/* Early Detection Factors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-blue-400">🔍</span>
                                                {isTR ? 'Gerçek Dünya Sinyalleri' : 'Real World Signals'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {result.socialMomentum.earlyDetectionFactors.realWorldSignals.map((signal, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <span className="text-blue-400 mt-1">•</span>
                                                        <span>{signal}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-green-400">👥</span>
                                                {isTR ? 'Erken Kullanıcı Davranışı' : 'Early Adopter Behavior'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {result.socialMomentum.earlyDetectionFactors.earlyAdopterBehavior.map((behavior, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <span className="text-green-400 mt-1">•</span>
                                                        <span>{behavior}</span>
                                </li>
                            ))}
                        </ul>
                        </div>
                    </div>

                                    {/* Recommendation */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl">
                                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                            <span className="text-indigo-400">💡</span>
                                            {isTR ? 'Momentum Önerisi' : 'Momentum Recommendation'}
                                        </h3>
                                        <p className="text-slate-300 text-sm">
                                            {result.socialMomentum.recommendation}
                                        </p>
                        </div>
                    </div>
                    )}

                            {/* Early Signal Mode Analysis */}
                            {result.earlySignal && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <span className="text-2xl">⚡</span>
                                        {isTR ? 'Erken Sinyal Analizi' : 'Early Signal Analysis'}
                                    </h2>
                                    
                                    {/* Top Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        {/* Signal Score */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-purple-400">⚡</span>
                    </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Sinyal Skoru' : 'Signal Score'}
                                                </h3>
                    </div>
                                            <div className="text-2xl font-bold text-purple-400 mb-2">
                                                {result.earlySignal.earlySignalScore}/100
                    </div>
                                            <div className="text-xs text-slate-400 capitalize">
                                                {result.earlySignal.signalStrength === 'weak' ? (isTR ? 'Zayıf' : 'Weak') :
                                                 result.earlySignal.signalStrength === 'moderate' ? (isTR ? 'Orta' : 'Moderate') :
                                                 result.earlySignal.signalStrength === 'strong' ? (isTR ? 'Güçlü' : 'Strong') :
                                                 (isTR ? 'Olağanüstü' : 'Exceptional')}
                        </div>
                        </div>

                                        {/* Market Cycle */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-400">📊</span>
                                        </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Pazar Döngüsü' : 'Market Cycle'}
                                                </h3>
                                    </div>
                                            <div className="text-lg font-bold text-blue-400 capitalize">
                                                {result.earlySignal.timingIntelligence.marketCycle === 'pre-trend' ? (isTR ? 'Trend Öncesi' : 'Pre-trend') :
                                                 result.earlySignal.timingIntelligence.marketCycle === 'early-trend' ? (isTR ? 'Erken Trend' : 'Early-trend') :
                                                 result.earlySignal.timingIntelligence.marketCycle === 'mid-trend' ? (isTR ? 'Orta Trend' : 'Mid-trend') :
                                                 result.earlySignal.timingIntelligence.marketCycle === 'late-trend' ? (isTR ? 'Geç Trend' : 'Late-trend') :
                                                 (isTR ? 'Trend Sonrası' : 'Post-trend')}
                                    </div>
                                            <div className="text-xs text-slate-400">
                                                {result.earlySignal.timingIntelligence.optimalEntryWindow}
                                </div>
                            </div>

                                        {/* First Mover Advantage */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-400">🚀</span>
                                        </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'İlk Hareket Avantajı' : 'First Mover Advantage'}
                                                </h3>
                                    </div>
                                            <div className="text-2xl font-bold text-green-400 mb-1">
                                                {result.earlySignal.timingIntelligence.firstMoverAdvantage}%
                                    </div>
                                            <div className="text-xs text-slate-400">
                                                {result.earlySignal.timingIntelligence.windowOfOpportunity}
                                </div>
                            </div>

                                        {/* Confidence Level */}
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-yellow-400">🎯</span>
                                        </div>
                                                <h3 className="font-semibold text-white text-sm">
                                                    {isTR ? 'Güven Seviyesi' : 'Confidence Level'}
                                                </h3>
                                    </div>
                                            <div className="text-2xl font-bold text-yellow-400 mb-1">
                                                {result.earlySignal.confidence}%
                                </div>
                                            <div className="text-xs text-slate-400 capitalize">
                                                {result.earlySignal.timingIntelligence.competitorAwareness === 'none' ? (isTR ? 'Rakip Yok' : 'No Competition') :
                                                 result.earlySignal.timingIntelligence.competitorAwareness === 'minimal' ? (isTR ? 'Az Rakip' : 'Minimal Competition') :
                                                 result.earlySignal.timingIntelligence.competitorAwareness === 'emerging' ? (isTR ? 'Yeni Rakipler' : 'Emerging Competition') :
                                                 (isTR ? 'Yoğun Rekabet' : 'High Competition')}
                                </div>
                            </div>
                        </div>

                                    {/* Signal Sources & Action Plan */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Signal Sources */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <span className="text-blue-400">📡</span>
                                                {isTR ? 'Sinyal Kaynakları' : 'Signal Sources'}
                                            </h3>

                                            {/* Technical Indicators */}
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="text-green-400">📈</span>
                                                    {isTR ? 'Teknik Göstergeler' : 'Technical Indicators'}
                                                </h4>
                                                <div className="space-y-3">
                                                    {result.earlySignal.signalSources.technicalIndicators.map((indicator, i) => (
                                                        <div key={i} className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="text-sm font-medium text-white">{indicator.source}</div>
                                                                <div className="text-xs text-slate-300">{indicator.signal}</div>
                                </div>
                                                            <div className="text-right ml-4">
                                                                <div className="text-sm font-bold text-green-400">{indicator.strength}%</div>
                                                                <div className="text-xs text-slate-400 capitalize">{indicator.reliability}</div>
                                </div>
                            </div>
                                                    ))}
                        </div>
                    </div>

                                            {/* Market Gaps */}
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="text-orange-400">🎯</span>
                                                    {isTR ? 'Pazar Boşlukları' : 'Market Gaps'}
                                                </h4>
                                                <div className="space-y-3">
                                                    {result.earlySignal.signalSources.marketGaps.map((gap, i) => (
                                                        <div key={i} className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="text-sm text-slate-300">{gap.gap}</div>
                            </div>
                                                            <div className="text-right ml-4">
                                                                <div className="text-xs text-orange-400 capitalize">{gap.size}</div>
                                                                <div className="text-xs text-slate-400 capitalize">{gap.accessibility}</div>
                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            </div>
                                    </div>

                                        {/* Action Plan */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <span className="text-purple-400">🎯</span>
                                                {isTR ? 'Aksiyon Planı' : 'Action Plan'}
                                            </h3>

                                            {/* Immediate Actions */}
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="text-red-400">🚨</span>
                                                    {isTR ? 'Acil Aksiyonlar' : 'Immediate Actions'}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {result.earlySignal.actionPlan.immediateActions.map((action, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                            <span className="text-red-400 mt-1">•</span>
                                                            <span>{action}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                        </div>

                                            {/* Short Term Goals */}
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="text-yellow-400">⏰</span>
                                                    {isTR ? 'Kısa Vadeli Hedefler' : 'Short Term Goals'}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {result.earlySignal.actionPlan.shortTermGoals.map((goal, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                            <span className="text-yellow-400 mt-1">•</span>
                                                            <span>{goal}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Risk Factors */}
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="text-orange-400">⚠️</span>
                                                    {isTR ? 'Risk Faktörleri' : 'Risk Factors'}
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-slate-300">{isTR ? 'Zamanlama Riski' : 'Timing Risk'}</span>
                                                        <span className="text-sm font-bold text-orange-400">{result.earlySignal.riskFactors.timingRisk}%</span>
                                            </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-slate-300">{isTR ? 'Rekabet Riski' : 'Competition Risk'}</span>
                                                        <span className="text-sm font-bold text-orange-400">{result.earlySignal.riskFactors.competitionRisk}%</span>
                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-slate-300">{isTR ? 'Pazar Kabul Riski' : 'Market Acceptance Risk'}</span>
                                                        <span className="text-sm font-bold text-orange-400">{result.earlySignal.riskFactors.marketAcceptanceRisk}%</span>
                                        </div>
                                        </div>
                                            </div>
                                    </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <span className="text-purple-400">💡</span>
                                            {isTR ? 'Erken Sinyal Önerisi' : 'Early Signal Recommendation'}
                                        </h3>
                                        <p className="text-slate-300 text-sm mb-4">
                                            {result.earlySignal.recommendation}
                                        </p>
                                        <div className="text-xs text-slate-400">
                                            <strong>{isTR ? 'Uzun Vadeli Strateji:' : 'Long Term Strategy:'}</strong> {result.earlySignal.actionPlan.longTermStrategy}
                                        </div>
                                        </div>
                                            </div>
                                        )}

                            {/* Post Suggestions */}
                            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"/>
                                    </svg>
                                    {isTR ? 'Post Önerileri' : 'Post Suggestions'}
                                </h2>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Twitter */}
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                                <XIcon />
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
                                                <RedditIcon />
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
                                                <LinkedInIcon />
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
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;
