import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ValidationResult } from '../types';

// Clean Minimal Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const BookmarkIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HelpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Platform Icons
const XIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

// Additional Icons for Premium Design
const TrendUpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const TrendDownIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as ValidationResult;
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedPlatforms, setExpandedPlatforms] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!result) {
            navigate('/');
            return;
        }
        window.scrollTo(0, 0);
    }, [result, navigate]);

    if (!result) {
        return null;
    }

    const handleCopyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2500);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const togglePlatformExpand = (platform: string) => {
        setExpandedPlatforms(prev => ({
            ...prev,
            [platform]: !prev[platform]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
            {/* Premium Layout */}
            <div className="flex">
                {/* Ultra Clean Sidebar */}
                <div className="w-60 bg-white/70 backdrop-blur-xl border-r border-gray-200/30 min-h-screen relative">
                    <div className="p-7">
                        {/* Premium Logo */}
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">Validationly</span>
                        </div>

                        {/* Ultra Clean Navigation */}
                        <nav className="space-y-2">
                            <div className="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-600 rounded-xl border border-indigo-100/50">
                                <HomeIcon />
                                <span className="text-sm font-semibold">Overview</span>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50/70 rounded-xl cursor-pointer transition-all duration-200">
                                <ChartIcon />
                                <span className="text-sm font-medium">Analytics</span>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50/70 rounded-xl cursor-pointer transition-all duration-200">
                                <BookmarkIcon />
                                <span className="text-sm font-medium">Saved</span>
                            </div>
                        </nav>

                        {/* Bottom Navigation */}
                        <div className="absolute bottom-8 left-7 right-7 space-y-2">
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50/70 rounded-xl cursor-pointer transition-all duration-200">
                                <SettingsIcon />
                                <span className="text-sm font-medium">Settings</span>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50/70 rounded-xl cursor-pointer transition-all duration-200">
                                <HelpIcon />
                                <span className="text-sm font-medium">Help</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Main Content */}
                <div className="flex-1 p-10">
                    {/* Simple Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis Results</h1>
                        <p className="text-gray-500 text-lg">Your idea validation summary</p>
                    </div>

                    {/* Simple Hero Score */}
                    <div className="mb-16">
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 border border-white/50 shadow-2xl text-center">
                            <div className="text-sm font-medium text-gray-500 mb-4">Demand Score</div>
                            <div className="text-9xl font-extralight text-gray-900 mb-8 tracking-tight">
                                {result.demandScore}
                                <span className="text-4xl text-gray-400 ml-3">/100</span>
                            </div>
                            <div className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                                "{result.content || result.idea}"
                            </div>
                            <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-semibold ${result.demandScore >= 80 ? 'bg-green-100 text-green-700' :
                                    result.demandScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {result.demandScore >= 80 ? '🚀 High Potential' :
                                    result.demandScore >= 60 ? '⚡ Moderate Potential' :
                                        '⚠️ Low Potential'}
                            </div>
                        </div>
                    </div>

                    {/* Simple Key Insights */}
                    <div className="grid grid-cols-3 gap-8 mb-16">
                        {/* Market Opportunity */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {result.scoreBreakdown?.marketSize || 20}/25
                            </div>
                            <div className="text-gray-600 font-medium">Market Size</div>
                        </div>

                        {/* Competition */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl">⚔️</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {result.scoreBreakdown?.competition || 15}/25
                            </div>
                            <div className="text-gray-600 font-medium">Competition</div>
                        </div>

                        {/* Feasibility */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {result.scoreBreakdown?.feasibility || 17}/25
                            </div>
                            <div className="text-gray-600 font-medium">Feasibility</div>
                        </div>
                    </div>

                    {/* Premium Content Grid */}
                    <div className="grid grid-cols-2 gap-10">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {/* Content Quality Metrics - Premium */}
                            {result.contentQuality && (
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl shadow-gray-900/5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-8">Content Quality Metrics</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-2xl">
                                            <div className="text-2xl font-bold text-emerald-600 mb-1">{result.contentQuality.writingQuality}</div>
                                            <div className="text-sm text-gray-600">Writing Quality</div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl">
                                            <div className="text-2xl font-bold text-indigo-600 mb-1">{result.contentQuality.engagementPotential}</div>
                                            <div className="text-sm text-gray-600">Engagement</div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50/50 rounded-2xl">
                                            <div className="text-2xl font-bold text-purple-600 mb-1">{result.contentQuality.viralityScore}</div>
                                            <div className="text-sm text-gray-600">Virality</div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50/50 rounded-2xl">
                                            <div className="text-2xl font-bold text-orange-600 mb-1">{result.contentQuality.clarityScore}</div>
                                            <div className="text-sm text-gray-600">Clarity</div>
                                        </div>
                                    </div>
                                    {result.contentQuality.improvements && result.contentQuality.improvements.length > 0 && (
                                        <div className="p-4 bg-gray-50/50 rounded-2xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">Improvement Suggestions</h4>
                                            <ul className="space-y-2">
                                                {result.contentQuality.improvements.map((improvement, index) => (
                                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                                        <span className="text-indigo-500 mt-1">•</span>
                                                        {improvement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Market Timing - Premium */}
                            {result.marketTiming && (
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl shadow-gray-900/5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-8">Market Timing</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                                            <span className="text-gray-600 font-medium">Market Readiness</span>
                                            <span className="font-bold text-lg text-gray-900">{result.marketTiming.readiness}%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                                            <span className="text-gray-600 font-medium">Trend Direction</span>
                                            <span className={`font-bold text-lg ${result.marketTiming.trendDirection === 'Rising' ? 'text-emerald-600' :
                                                result.marketTiming.trendDirection === 'Declining' ? 'text-red-500' : 'text-amber-500'
                                                }`}>
                                                {result.marketTiming.trendDirection}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                                            <span className="text-gray-600 font-medium">Optimal Window</span>
                                            <span className="font-bold text-lg text-gray-900">{result.marketTiming.optimalWindow}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Simple Content Suggestions */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Content Suggestions</h3>
                                <div className="space-y-6">
                                    {/* X (Twitter) */}
                                    <div className="p-6 bg-gray-50/70 rounded-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                                <XIcon />
                                            </div>
                                            <span className="font-bold text-gray-900 text-lg">X (Twitter)</span>
                                        </div>
                                        <p className="text-gray-700 mb-4 leading-relaxed">{result.tweetSuggestion}</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleCopyToClipboard(result.tweetSuggestion, 'tweet-copy')}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                            >
                                                {copiedId === 'tweet-copy' ? '✓ Copied' : 'Copy'}
                                            </button>
                                            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                                Post to X
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reddit */}
                                    <div className="p-6 bg-orange-50/70 rounded-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                                <RedditIcon />
                                            </div>
                                            <span className="font-bold text-gray-900 text-lg">Reddit</span>
                                        </div>
                                        <p className="font-bold text-gray-800 mb-2">{result.redditTitleSuggestion}</p>
                                        <p className="text-gray-700 mb-4 leading-relaxed text-sm">{result.redditBodySuggestion}</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit-copy')}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                            >
                                                {copiedId === 'reddit-copy' ? '✓ Copied' : 'Copy'}
                                            </button>
                                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                                                Post to Reddit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Actions */}
                        <div className="space-y-8">
                            {/* Simple Summary */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Summary</h3>
                                <div className="text-gray-700 leading-relaxed">
                                    {result.scoreJustification}
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full flex items-center gap-4 p-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-lg font-semibold"
                                    >
                                        <span>🔄</span>
                                        <span>Analyze Another Idea</span>
                                    </button>

                                    <button className="w-full flex items-center gap-4 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-lg font-semibold">
                                        <span>💡</span>
                                        <span>Generate Similar Ideas</span>
                                    </button>

                                    <button className="w-full flex items-center gap-4 p-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-lg font-semibold">
                                        <span>📊</span>
                                        <span>Save to Dashboard</span>
                                    </button>
                                </div>
                            </div>

                            {/* Support */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Support</h3>
                                <div className="space-y-3">
                                    <a
                                        href="https://buymeacoffee.com/kptbarbarossa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-4 p-3 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors font-medium"
                                    >
                                        <span>☕</span>
                                        <span>Buy me a coffee</span>
                                    </a>
                                    <a
                                        href="https://x.com/kptbarbarossa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-4 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        <XIcon />
                                        <span>Feedback on X</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;