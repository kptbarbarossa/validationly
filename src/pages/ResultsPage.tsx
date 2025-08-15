import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (location.state?.result) {
            setResult(location.state.result);
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    if (loading || !result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    const isTR = detectLanguage(result.idea || result.content || '');
    const status = getScoreStatus(result.demandScore, isTR);

    // Platform analizlerini basit şekilde göster
    const platforms = [
        { key: 'twitter', name: 'X (Twitter)', icon: <XIcon />, data: result.platformAnalyses?.twitter },
        { key: 'reddit', name: 'Reddit', icon: <RedditIcon />, data: result.platformAnalyses?.reddit },
        { key: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, data: result.platformAnalyses?.linkedin }
    ].filter(p => p.data); // Sadece veri olan platformları göster

    return (
        <>
            <SEOHead 
                title={`${result.idea || result.content} - Validation Results | Validationly`}
                description={`Market validation results for "${result.idea || result.content}". Score: ${result.demandScore}/100. ${result.scoreJustification}`}
            />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Validationly" className="w-6 h-6" />
                            <span className="text-sm text-slate-300">Validationly</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-100">
                            "{result.idea || result.content}"
                        </h1>
                    </div>

                    {/* Demand Score */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-semibold text-slate-200">
                                    {isTR ? 'Talep Skoru' : 'Demand Score'}
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`}>
                                    <span>{status.icon}</span>
                                    {status.text}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white">
                                {result.demandScore}
                            </div>
                        </div>
                        
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.max(2, result.demandScore)}%` }}
                            />
                        </div>
                        
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {result.scoreJustification}
                        </p>
                    </div>

                    {/* Platform Analysis */}
                    {platforms.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                {isTR ? 'Platform Analizi' : 'Platform Analysis'}
                            </h2>
                            
                            <div className="grid gap-4">
                                {platforms.map((platform) => (
                                    <div key={platform.key} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {platform.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-medium text-slate-200">{platform.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                                                            {platform.data?.score || 0}/5
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-700 rounded-full mb-3">
                                                    <div 
                                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${((platform.data?.score || 0) / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-slate-300 mb-3">
                                                    {platform.data?.summary || (isTR ? 'Veri yok' : 'No data')}
                                                </p>
                                                <ul className="space-y-1 text-sm text-slate-300">
                                                    {platform.data?.keyFindings?.length ? 
                                                        platform.data.keyFindings.map((finding: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <span className="text-indigo-400 mt-0.5">•</span>
                                                                <span>{finding}</span>
                                                            </li>
                                                        )) : (
                                                            <li className="text-slate-400">{isTR ? 'Bulgu yok' : 'No findings'}</li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Post Suggestions */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            {isTR ? 'Post Önerileri' : 'Post Suggestions'}
                        </h2>
                        
                        <div className="grid gap-4">
                            {/* Tweet */}
                            {result.tweetSuggestion && (
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="flex items-center gap-2 mb-3">
                                        <XIcon />
                                        <h3 className="font-medium text-slate-200">X (Twitter)</h3>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">
                                        {result.tweetSuggestion}
                                    </div>
                                </div>
                            )}

                            {/* Reddit */}
                            {(result.redditTitleSuggestion || result.redditBodySuggestion) && (
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="flex items-center gap-2 mb-3">
                                        <RedditIcon />
                                        <h3 className="font-medium text-slate-200">Reddit</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {result.redditTitleSuggestion && (
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1">{isTR ? 'Başlık:' : 'Title:'}</div>
                                                <div className="bg-slate-900/50 rounded-lg p-2 font-mono text-sm text-slate-300">
                                                    {result.redditTitleSuggestion}
                                                </div>
                                            </div>
                                        )}
                                        {result.redditBodySuggestion && (
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1">{isTR ? 'İçerik:' : 'Body:'}</div>
                                                <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">
                                                    {result.redditBodySuggestion}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* LinkedIn */}
                            {result.linkedinSuggestion && (
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <div className="flex items-center gap-2 mb-3">
                                        <LinkedInIcon />
                                        <h3 className="font-medium text-slate-200">LinkedIn</h3>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">
                                        {result.linkedinSuggestion}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            {isTR ? 'Yeni Analiz' : 'New Analysis'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}