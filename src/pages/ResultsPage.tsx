import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ValidationResult } from '../types';
import ValidationlyScoreCard from '../components/ValidationlyScoreCard';

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Glassmorphism Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            </div>
            {/* Premium Layout */}
            <div className="flex">
                {/* Glassmorphism Sidebar */}
                <div className="w-60 bg-white/20 backdrop-blur-xl border-r border-white/30 min-h-screen relative z-10">
                    <div className="p-7">
                        {/* Premium Logo */}
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">Validationly</span>
                        </div>

                        {/* Glassmorphism Navigation */}
                        <nav className="space-y-2">
                            <div className="flex items-center gap-4 px-4 py-3 bg-white/30 backdrop-blur-sm text-indigo-700 rounded-xl border border-white/40 shadow-lg shadow-indigo-500/10">
                                <HomeIcon />
                                <span className="text-sm font-semibold">Overview</span>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/20 hover:backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-white/30">
                                <ChartIcon />
                                <span className="text-sm font-medium">Analytics</span>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/20 hover:backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-white/30">
                                <BookmarkIcon />
                                <span className="text-sm font-medium">Saved</span>
                            </div>
                        </nav>

                        {/* Glassmorphism Bottom Navigation */}
                        <div className="absolute bottom-8 left-7 right-7 space-y-2">
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/20 hover:backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-white/30">
                                <SettingsIcon />
                                <span className="text-sm font-medium">Settings</span>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/20 hover:backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-white/30">
                                <HelpIcon />
                                <span className="text-sm font-medium">Help</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glassmorphism Main Content */}
                <div className="flex-1 p-8 relative z-10">
                    {/* Beautiful Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 Validation Results</h1>
                            <p className="text-gray-500">Your startup idea analysis is complete</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800">AI Analysis</div>
                                <div className="text-xs text-gray-500">Just completed</div>
                            </div>
                        </div>
                    </div>

                    {/* Validationly Score Card */}
                    <div className="mb-16">
                        <ValidationlyScoreCard
                            score={result.demandScore}
                            validationlyScore={result.validationlyScore}
                        />
                        <div className="text-center mt-8">
                            <div className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                "{result.content || result.idea}"
                            </div>
                        </div>
                    </div>



                    {/* Modern Dashboard Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column - Stats */}
                        <div className="col-span-8 space-y-6">
                            {/* Glassmorphism Stats Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Market Size Card */}
                                <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-pink-500/10 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="text-3xl font-bold mb-1 text-gray-800">{result.scoreBreakdown?.marketSize || 20}</div>
                                        <div className="text-gray-600 text-sm font-medium">Market Size</div>
                                        <div className="text-gray-500 text-xs mt-1">out of 25</div>
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-xl"></div>
                                    <div className="absolute -bottom-2 -right-2 text-6xl opacity-10">📊</div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-2xl"></div>
                                </div>

                                {/* Competition Card */}
                                <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-orange-500/10 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="text-3xl font-bold mb-1 text-gray-800">{result.scoreBreakdown?.competition || 15}</div>
                                        <div className="text-gray-600 text-sm font-medium">Competition</div>
                                        <div className="text-gray-500 text-xs mt-1">out of 25</div>
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-xl"></div>
                                    <div className="absolute -bottom-2 -right-2 text-6xl opacity-10">⚔️</div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-2xl"></div>
                                </div>

                                {/* Feasibility Card */}
                                <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-purple-500/10 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="text-3xl font-bold mb-1 text-gray-800">{result.scoreBreakdown?.feasibility || 17}</div>
                                        <div className="text-gray-600 text-sm font-medium">Feasibility</div>
                                        <div className="text-gray-500 text-xs mt-1">out of 25</div>
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl"></div>
                                    <div className="absolute -bottom-2 -right-2 text-6xl opacity-10">🚀</div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-2xl"></div>
                                </div>
                            </div>

                            {/* Glassmorphism Platform Performance Chart */}
                            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-blue-500/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Platform Performance</h3>
                                    <div className="text-sm text-gray-600">Validation Signals</div>
                                </div>
                                <div className="space-y-4">
                                    {result.validationlyScore && Object.entries(result.validationlyScore.breakdown).map(([platform, score]) => (
                                        <div key={platform} className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                                <span className="text-lg">
                                                    {platform === 'twitter' ? '𝕏' :
                                                        platform === 'reddit' ? '🔴' :
                                                            platform === 'linkedin' ? '💼' : '📈'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-gray-800 capitalize">{platform.replace('googleTrends', 'Google Trends')}</span>
                                                    <span className="text-sm font-bold text-gray-900">{score}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ 
                                                            width: `${Math.min(100, (score / (result.validationlyScore?.weighting[platform as keyof typeof result.validationlyScore.weighting] || 40)) * 100)}%` 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

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

                                    {/* LinkedIn */}
                                    {result.linkedinSuggestion && (
                                        <div className="p-6 bg-blue-50/70 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">in</span>
                                                </div>
                                                <span className="font-bold text-gray-900 text-lg">LinkedIn</span>
                                            </div>
                                            <p className="text-gray-700 mb-4 leading-relaxed text-sm">{result.linkedinSuggestion}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-copy')}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                                >
                                                    {copiedId === 'linkedin-copy' ? '✓ Copied' : 'Copy'}
                                                </button>
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                    Post to LinkedIn
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Instagram */}
                                    {result.instagramSuggestion && (
                                        <div className="p-6 bg-pink-50/70 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">📷</span>
                                                </div>
                                                <span className="font-bold text-gray-900 text-lg">Instagram</span>
                                            </div>
                                            <p className="text-gray-700 mb-4 leading-relaxed text-sm">{result.instagramSuggestion}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleCopyToClipboard(result.instagramSuggestion, 'instagram-copy')}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                                >
                                                    {copiedId === 'instagram-copy' ? '✓ Copied' : 'Copy'}
                                                </button>
                                                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-colors">
                                                    Post to Instagram
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* TikTok */}
                                    {result.tiktokSuggestion && (
                                        <div className="p-6 bg-gray-900/10 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">🎵</span>
                                                </div>
                                                <span className="font-bold text-gray-900 text-lg">TikTok</span>
                                            </div>
                                            <p className="text-gray-700 mb-4 leading-relaxed text-sm">{result.tiktokSuggestion}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleCopyToClipboard(result.tiktokSuggestion, 'tiktok-copy')}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                                >
                                                    {copiedId === 'tiktok-copy' ? '✓ Copied' : 'Copy'}
                                                </button>
                                                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                                    Post to TikTok
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Facebook */}
                                    <div className="p-6 bg-blue-50/70 rounded-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">f</span>
                                            </div>
                                            <span className="font-bold text-gray-900 text-lg">Facebook</span>
                                        </div>
                                        <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                                            {result.facebookSuggestion || `Excited to share this new concept: ${result.content || result.idea}. Looking forward to connecting with others who have insights in this space!`}
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleCopyToClipboard(result.facebookSuggestion || `Excited to share this new concept: ${result.content || result.idea}`, 'facebook-copy')}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                            >
                                                {copiedId === 'facebook-copy' ? '✓ Copied' : 'Copy'}
                                            </button>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                Post to Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Profile & Actions */}
                        <div className="col-span-4 space-y-6">
                            {/* Glassmorphism Profile Card */}
                            <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl shadow-purple-500/10 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                                            <span className="text-2xl">🚀</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-gray-800">Your Idea</div>
                                            <div className="text-gray-600 text-sm">Validation Complete</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Score:</span>
                                            <span className="font-bold text-gray-800">{result.demandScore}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="font-bold text-gray-800">
                                                {result.demandScore >= 70 ? 'High Potential' :
                                                    result.demandScore >= 50 ? 'Moderate' : 'Needs Work'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Platforms:</span>
                                            <span className="font-bold text-gray-800">6 Analyzed</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-400/5 rounded-2xl"></div>
                            </div>

                            {/* Glassmorphism Action Cards */}
                            <div className="space-y-4">
                                <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg shadow-green-500/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/50">
                                            <span className="text-gray-700 font-bold">💡</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">Generate Ideas</div>
                                            <div className="text-xs text-gray-600">AI-powered suggestions</div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-green-400/80 to-emerald-500/80 backdrop-blur-sm text-white py-2 rounded-lg text-sm font-medium hover:from-green-500/90 hover:to-emerald-600/90 transition-all border border-white/20">
                                        Generate Similar Ideas
                                    </button>
                                </div>

                                <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg shadow-blue-500/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/50">
                                            <span className="text-gray-700 font-bold">🔄</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">New Analysis</div>
                                            <div className="text-xs text-gray-600">Validate another idea</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gradient-to-r from-blue-400/80 to-indigo-500/80 backdrop-blur-sm text-white py-2 rounded-lg text-sm font-medium hover:from-blue-500/90 hover:to-indigo-600/90 transition-all border border-white/20"
                                    >
                                        Analyze Another Idea
                                    </button>
                                </div>

                                <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg shadow-purple-500/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/50">
                                            <span className="text-gray-700 font-bold">📊</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">Save Results</div>
                                            <div className="text-xs text-gray-600">Keep for later</div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-purple-400/80 to-pink-500/80 backdrop-blur-sm text-white py-2 rounded-lg text-sm font-medium hover:from-purple-500/90 hover:to-pink-600/90 transition-all border border-white/20">
                                        Save to Dashboard
                                    </button>
                                </div>
                            </div>

                            {/* Glassmorphism Latest Scores */}
                            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800">Latest Scores</h3>
                                    <button className="text-sm text-indigo-600 font-medium">View All</button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-400/80 to-emerald-500/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                                <span className="text-white text-xs font-bold">AI</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800">Current Idea</div>
                                                <div className="text-xs text-gray-600">Just now</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">{result.demandScore}</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-400/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                                <span className="text-white text-xs font-bold">--</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-600">Previous Idea</div>
                                                <div className="text-xs text-gray-500">No data</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-gray-500">--</div>
                                    </div>
                                </div>
                            </div>

                            {/* Glassmorphism Support Section */}
                            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800">Support</h3>
                                    <span className="text-xs text-gray-600">Help us grow</span>
                                </div>
                                <div className="space-y-3">
                                    <a
                                        href="https://buymeacoffee.com/kptbarbarossa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 p-3 bg-white/40 backdrop-blur-sm text-amber-700 rounded-xl hover:bg-white/50 transition-all duration-200 font-medium border border-white/30"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-amber-400/80 to-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                            <span className="text-white text-sm">☕</span>
                                        </div>
                                        <span className="text-gray-800">Buy me a coffee</span>
                                    </a>
                                    <a
                                        href="https://x.com/kptbarbarossa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 p-3 bg-white/40 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/50 transition-all duration-200 font-medium border border-white/30"
                                    >
                                        <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                                            <XIcon />
                                        </div>
                                        <span className="text-gray-800">Feedback on X</span>
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