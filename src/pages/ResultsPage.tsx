import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
    idea: string;
    demandScore: number;
    scoreJustification: string;
    tweetSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
    linkedinSuggestion: string;
    platformAnalyses?: {
        linkedin?: {
            score: number;
            summary: string;
            keyFindings?: string[];
        };
        twitter?: {
            score: number;
            summary: string;
            keyFindings?: string[];
        };
        reddit?: {
            score: number;
            summary: string;
            keyFindings?: string[];
        };
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
    
    const result = location.state as ValidationResult;
    
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
        if (analysis.keyFindings && analysis.keyFindings.length > 0) {
            return analysis.keyFindings.slice(0, 3);
        }
        // Fallback to summary split by sentences
        return analysis.summary?.split('.').filter((s: string) => s.trim().length > 10).slice(0, 3) || [];
    };

    return (
        <>
            <SEOHead
                title={`${result.idea} - Validation Results | Validationly`}
                description={`Market validation results for "${result.idea}". Score: ${result.demandScore}/100. ${result.scoreJustification}`}
            />
            
            <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                {/* Decorative Background Shapes */}
                <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="pointer-events-none absolute top-20 -right-20 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative flex min-h-screen">
                    {/* Left Sidebar */}
                    <aside className="w-20 flex-shrink-0 flex flex-col items-center py-6 bg-white/5 backdrop-blur border-r border-white/10">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-8">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        
                        <nav className="flex flex-col gap-4">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                                </svg>
                            </div>
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45.75a2.5 2.5 0 00-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd"/>
                                </svg>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 flex">
                        {/* Center Content */}
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

                            {/* Signal Summary */}
                            {result.platformAnalyses && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                                    <h2 className="text-xl font-semibold text-white mb-6">{isTR ? 'Platform Sinyalleri' : 'Platform Signals'}</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* LinkedIn */}
                                        {result.platformAnalyses.linkedin && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                                        <LinkedInIcon />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-white">LinkedIn</h3>
                                                        <span className="text-blue-300 font-bold">{result.platformAnalyses.linkedin.score}/5</span>
                                                    </div>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    {getBulletPoints(result.platformAnalyses.linkedin).slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-blue-400 mt-1">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* X (Twitter) */}
                                        {result.platformAnalyses.twitter && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center">
                                                        <XIcon />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-white">X (Twitter)</h3>
                                                        <span className="text-slate-300 font-bold">{result.platformAnalyses.twitter.score}/5</span>
                                                    </div>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    {getBulletPoints(result.platformAnalyses.twitter).slice(0, 3).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-slate-400 mt-1">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Reddit */}
                                        {result.platformAnalyses.reddit && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                                        <RedditIcon />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-white">Reddit</h3>
                                                        <span className="text-orange-300 font-bold">{result.platformAnalyses.reddit.score}/5</span>
                                                    </div>
                                                </div>
                                                <ul className="space-y-2 text-sm text-slate-300">
                                                    {getBulletPoints(result.platformAnalyses.reddit).slice(0, 3).map((item, i) => (
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

                        {/* Right Sidebar */}
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
                    </main>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;