import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DynamicPromptResult } from '../types';
import SEOHead from '../components/SEOHead';

// Platform Icons
const XIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

function getScoreStatus(score: number, isTR: boolean) {
    if (score >= 85) return { text: isTR ? 'Mükemmel' : 'Excellent', color: 'emerald', icon: '🚀' };
    if (score >= 70) return { text: isTR ? 'Çok İyi' : 'Very Good', color: 'green', icon: '✅' };
    if (score >= 55) return { text: isTR ? 'İyi' : 'Good', color: 'blue', icon: '👍' };
    if (score >= 40) return { text: isTR ? 'Orta' : 'Moderate', color: 'yellow', icon: '⚡' };
    return { text: isTR ? 'Düşük' : 'Low', color: 'red', icon: '⚠️' };
}

function detectLanguage(text: string): boolean {
    return /[çğıöşüÇĞİÖŞÜ]/.test(text);
}

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState<DynamicPromptResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (location.state?.result) {
            setResult(location.state.result);
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    function getBulletPoints(input?: { keyFindings?: string[]; findings?: string[]; summary?: string }) {
        if (!input) return [] as string[];
        if (Array.isArray((input as any).keyFindings) && (input as any).keyFindings.length > 0) return (input as any).keyFindings as string[];
        if (Array.isArray((input as any).findings) && (input as any).findings.length > 0) return (input as any).findings as string[];
        if ((input as any).summary) {
            const parts = ((input as any).summary as string)
                .split(/[.;]\s+/)
                .map(s => s.trim())
                .filter(Boolean);
            return parts.slice(0, 5);
        }
        return [] as string[];
    }

    async function copyText(text: string, index: number) {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1200);
        } catch {}
    }

    function openInNewTab(url: string) {
        try { window.open(url, '_blank', 'noopener,noreferrer'); } catch {}
    }

    function postToTwitter(text: string) {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        openInNewTab(url);
    }

    function postToReddit(title: string, body: string) {
        const url = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(body)}`;
        openInNewTab(url);
    }

    async function postToLinkedIn(text: string) {
        // LinkedIn does not allow prefilled text reliably; copy and open composer
        await navigator.clipboard.writeText(text);
        openInNewTab('https://www.linkedin.com/feed/?shareActive=true');
    }

    if (loading || !result) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    const isTR = detectLanguage(result.idea);
    const status = getScoreStatus(result.demandScore, isTR);
    
    // animate score bar
    useEffect(() => {
        const timer = setTimeout(() => setProgress(result.demandScore || 0), 100);
        return () => clearTimeout(timer);
    }, [result.demandScore]);

    // no local prompts here; Prompt Gallery lives on HomePage

    return (
        <>
            <SEOHead
                title={`${result.idea} - Validation Results | Validationly`}
                description={`Market validation results for "${result.idea}". Score: ${result.demandScore}/100. ${result.scoreJustification}`}
            />
            
            <div className="min-h-screen bg-slate-900 text-white">
                {/* Top Header */}
                <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold">Validationly</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                {isTR ? 'Yeni Analiz' : 'New Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white mb-1">{result.idea}</h1>
                        <div className="text-slate-400 text-sm">{isTR ? 'Validasyon Özeti' : 'Validation Summary'}</div>
                    </div>

                    {/* Score Bar */}
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">{isTR ? 'Talep Skoru' : 'Demand Score'}</h3>
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">{status.icon} {status.text}</span>
                        </div>
                        <div className="flex items-end gap-4 mb-4">
                            <div className="text-5xl font-bold text-white">{result.demandScore}</div>
                            <div className="text-slate-400">/ 100</div>
                        </div>
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out" style={{ width: `${Math.max(2, progress)}%` }} />
                        </div>
                        <p className="mt-4 text-sm text-slate-300 leading-relaxed">{result.scoreJustification}</p>
                    </div>

                    {/* Signal Summary - Single block list */}
                    {result.platformAnalyses && (
                        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-6">{isTR ? 'Sinyal Özeti' : 'Signal Summary'}</h2>
                            {/* LinkedIn first */}
                            {result.platformAnalyses.linkedin && (
                                <div className="mb-6 last:mb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-white"><LinkedInIcon /> LinkedIn</div>
                                        <span className="text-sm text-indigo-400 font-semibold">{result.platformAnalyses.linkedin.score}/5</span>
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                        {getBulletPoints(result.platformAnalyses.linkedin).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* X (Twitter) */}
                            {result.platformAnalyses.twitter && (
                                <div className="mb-6 last:mb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-white"><XIcon /> X (Twitter)</div>
                                        <span className="text-sm text-blue-400 font-semibold">{result.platformAnalyses.twitter.score}/5</span>
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                        {getBulletPoints(result.platformAnalyses.twitter).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Reddit */}
                            {result.platformAnalyses.reddit && (
                                <div className="mb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-white"><RedditIcon /> Reddit</div>
                                        <span className="text-sm text-orange-400 font-semibold">{result.platformAnalyses.reddit.score}/5</span>
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                        {getBulletPoints(result.platformAnalyses.reddit).map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Post Suggestions Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
                            </svg>
                            {isTR ? 'Post Önerileri' : 'Post Suggestions'}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Twitter */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <XIcon />
                                    </div>
                                    <h3 className="font-semibold text-white">X (Twitter)</h3>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-slate-300 mb-4">
                                    {result.tweetSuggestion}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => postToTwitter(result.tweetSuggestion)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors">{isTR ? 'Post' : 'Post'}</button>
                                    <button onClick={() => copyText(result.tweetSuggestion, 0)} className={`flex-1 px-4 py-2 rounded-lg text-white text-sm transition-colors ${copiedIndex===0 ? 'bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'}`}>{copiedIndex===0 ? (isTR ? 'Kopyalandı' : 'Copied') : (isTR ? 'Kopyala' : 'Copy')}</button>
                                </div>
                            </div>

                            {/* Reddit */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <RedditIcon />
                                    </div>
                                    <h3 className="font-semibold text-white">Reddit</h3>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div>
                                        <div className="text-xs text-slate-400 mb-1">{isTR ? 'Başlık:' : 'Title:'}</div>
                                        <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">
                                            {result.redditTitleSuggestion}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 mb-1">{isTR ? 'İçerik:' : 'Body:'}</div>
                                        <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">
                                            {result.redditBodySuggestion}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => postToReddit(result.redditTitleSuggestion, result.redditBodySuggestion)} className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm transition-colors">{isTR ? 'Post' : 'Post'}</button>
                                    <button onClick={() => copyText(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 1)} className={`flex-1 px-4 py-2 rounded-lg text-white text-sm transition-colors ${copiedIndex===1 ? 'bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'}`}>{copiedIndex===1 ? (isTR ? 'Kopyalandı' : 'Copied') : (isTR ? 'Kopyala' : 'Copy')}</button>
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                        <LinkedInIcon />
                                    </div>
                                    <h3 className="font-semibold text-white">LinkedIn</h3>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-slate-300 mb-4">
                                    {result.linkedinSuggestion}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => postToLinkedIn(result.linkedinSuggestion)} className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors">{isTR ? 'Post' : 'Post'}</button>
                                    <button onClick={() => copyText(result.linkedinSuggestion, 2)} className={`flex-1 px-4 py-2 rounded-lg text-white text-sm transition-colors ${copiedIndex===2 ? 'bg-emerald-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}>{copiedIndex===2 ? (isTR ? 'Kopyalandı' : 'Copied') : (isTR ? 'Kopyala' : 'Copy')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
