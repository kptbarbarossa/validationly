import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ValidationResult } from '../types';
import SuggestionCard from '../components/SuggestionCard';

// Dashboard Icons
const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const HistoryIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const HeartIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const TrendingIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as ValidationResult;
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [analysisId] = useState(() => Math.floor(Math.random() * 10000));

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

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-blue-500 to-indigo-600';
        if (score >= 40) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Layout */}
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-lg min-h-screen">
                    <div className="p-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">V</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">Validationly</h1>
                                <p className="text-xs text-gray-500">Analysis Dashboard</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <DashboardIcon />
                                <span className="font-medium">Dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <HistoryIcon />
                                <span>Analysis History</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <HeartIcon />
                                <span>Favorites</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <SettingsIcon />
                                <span>Settings</span>
                            </div>
                        </nav>

                        {/* Balance Card */}
                        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-sm">Analysis Credits</span>
                            </div>
                            <div className="text-2xl font-bold mb-1">∞</div>
                            <div className="text-xs opacity-80">Unlimited</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analysis #{analysisId}</h1>
                            <p className="text-gray-500">Live Analysis 🔴</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSaved(!isSaved)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isSaved ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <HeartIcon />
                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <ShareIcon />
                                <span>Share</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <DownloadIcon />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Overall Score</p>
                                    <p className={`text-3xl font-bold ${getScoreColor(result.demandScore)}`}>
                                        {result.demandScore}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getScoreGradient(result.demandScore)} flex items-center justify-center text-white font-bold`}>
                                    {result.demandScore}
                                </div>
                            </div>
                        </div>

                        {result.scoreBreakdown && (
                            <>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Market Size</p>
                                            <p className="text-3xl font-bold text-blue-600">{result.scoreBreakdown.marketSize}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">/ 25</div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Competition</p>
                                            <p className="text-3xl font-bold text-orange-600">{result.scoreBreakdown.competition}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">/ 25</div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Trend</p>
                                            <p className="text-3xl font-bold text-green-600">{result.scoreBreakdown.trendMomentum}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">/ 25</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {result.confidenceLevel && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Confidence</p>
                                        <p className="text-3xl font-bold text-purple-600">{result.confidenceLevel}%</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>       
             {/* Main Content Grid */}
                    <div className="grid grid-cols-3 gap-8">
                        {/* Left Column - Main Analysis */}
                        <div className="col-span-2 space-y-8">
                            {/* Hero Analysis Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Idea Analysis</h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            "{result.content || result.idea}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Analysis Complete
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getScoreGradient(result.demandScore)} text-white text-4xl font-bold mb-4 shadow-2xl`}>
                                        {result.demandScore}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Demand Score</h3>
                                    <p className="text-gray-600">{result.scoreJustification}</p>
                                </div>
                            </div>

                            {/* Market Timing */}
                            {result.marketTiming && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <TrendingIcon />
                                        Market Timing
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-indigo-50 rounded-xl">
                                            <div className="text-2xl font-bold text-indigo-600 mb-1">{result.marketTiming.readiness}%</div>
                                            <div className="text-sm text-gray-600">Market Readiness</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-xl">
                                            <div className={`text-2xl font-bold mb-1 ${
                                                result.marketTiming.trendDirection === 'Rising' ? 'text-green-600' :
                                                result.marketTiming.trendDirection === 'Declining' ? 'text-red-600' : 'text-yellow-600'
                                            }`}>
                                                {result.marketTiming.trendDirection}
                                            </div>
                                            <div className="text-sm text-gray-600">Trend Direction</div>
                                        </div>
                                        <div className="text-center p-4 bg-cyan-50 rounded-xl">
                                            <div className="text-lg font-bold text-cyan-600 mb-1">{result.marketTiming.optimalWindow}</div>
                                            <div className="text-sm text-gray-600">Optimal Window</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Quality */}
                            {result.contentQuality && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Quality Metrics</h3>
                                    <div className="grid grid-cols-5 gap-3 mb-6">
                                        {[
                                            { key: 'writingQuality', label: 'Writing', color: 'indigo' },
                                            { key: 'engagementPotential', label: 'Engagement', color: 'pink' },
                                            { key: 'viralityScore', label: 'Virality', color: 'red' },
                                            { key: 'grammarScore', label: 'Grammar', color: 'teal' },
                                            { key: 'clarityScore', label: 'Clarity', color: 'cyan' }
                                        ].map(({ key, label, color }) => (
                                            <div key={key} className={`text-center p-3 bg-${color}-50 rounded-xl`}>
                                                <div className={`text-xl font-bold text-${color}-600 mb-1`}>
                                                    {result.contentQuality[key as keyof typeof result.contentQuality]}
                                                </div>
                                                <div className="text-xs text-gray-600">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Improvements */}
                                    {result.contentQuality.improvements && result.contentQuality.improvements.length > 0 && (
                                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                                💡 Improvement Suggestions
                                            </h4>
                                            <ul className="space-y-1">
                                                {result.contentQuality.improvements.map((improvement, index) => (
                                                    <li key={index} className="text-yellow-700 text-sm flex items-start gap-2">
                                                        <span className="text-yellow-500 mt-1">•</span>
                                                        {improvement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Platform Suggestions */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Suggestions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* X/Twitter */}
                                    <SuggestionCard
                                        icon={<XIcon />}
                                        title="X Post"
                                        content={result.tweetSuggestion}
                                        actions={[
                                            {
                                                id: 'tweet-copy',
                                                label: 'Copy',
                                                handler: () => handleCopyToClipboard(result.tweetSuggestion, 'tweet-copy'),
                                                copiedLabel: 'Copied!'
                                            }
                                        ]}
                                        copiedId={copiedId}
                                    />

                                    {/* Reddit */}
                                    <SuggestionCard
                                        icon={<RedditIcon />}
                                        title="Reddit Post"
                                        content={
                                            <>
                                                <p className="font-semibold text-gray-800 mb-2">{result.redditTitleSuggestion}</p>
                                                <p className="text-gray-600 text-sm">{result.redditBodySuggestion}</p>
                                            </>
                                        }
                                        actions={[
                                            {
                                                id: 'reddit-copy',
                                                label: 'Copy',
                                                handler: () => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit-copy'),
                                                copiedLabel: 'Copied!'
                                            }
                                        ]}
                                        copiedId={copiedId}
                                    />

                                    {/* LinkedIn */}
                                    <SuggestionCard
                                        icon={<LinkedInIcon />}
                                        title="LinkedIn Post"
                                        content={result.linkedinSuggestion}
                                        actions={[
                                            {
                                                id: 'linkedin-copy',
                                                label: 'Copy',
                                                handler: () => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-copy'),
                                                copiedLabel: 'Copied!'
                                            }
                                        ]}
                                        copiedId={copiedId}
                                    />

                                    {/* Instagram */}
                                    {result.instagramSuggestion && (
                                        <SuggestionCard
                                            icon={<InstagramIcon />}
                                            title="Instagram Post"
                                            content={result.instagramSuggestion}
                                            actions={[
                                                {
                                                    id: 'instagram-copy',
                                                    label: 'Copy',
                                                    handler: () => handleCopyToClipboard(result.instagramSuggestion!, 'instagram-copy'),
                                                    copiedLabel: 'Copied!'
                                                }
                                            ]}
                                            copiedId={copiedId}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Trending Insights */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    🔥 TRENDING INSIGHTS
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            AI
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">AI Tools</div>
                                            <div className="text-sm text-gray-500">Trending category</div>
                                        </div>
                                        <div className="text-green-600 font-bold">+15%</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            💰
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">Fintech</div>
                                            <div className="text-sm text-gray-500">Hot market</div>
                                        </div>
                                        <div className="text-green-600 font-bold">+22%</div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            🏥
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">HealthTech</div>
                                            <div className="text-sm text-gray-500">Growing fast</div>
                                        </div>
                                        <div className="text-green-600 font-bold">+18%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Market Signals */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Signals</h3>
                                <div className="space-y-4">
                                    {result.signalSummary.map((signal, index) => {
                                        const platformColors = {
                                            'X': 'from-gray-900 to-black',
                                            'Twitter': 'from-gray-900 to-black',
                                            'Reddit': 'from-orange-500 to-red-600',
                                            'LinkedIn': 'from-blue-600 to-indigo-700',
                                            'General': 'from-indigo-500 to-purple-600'
                                        };
                                        
                                        return (
                                            <div key={index} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platformColors[signal.platform as keyof typeof platformColors]} flex items-center justify-center text-white`}>
                                                        {signal.platform === 'X' || signal.platform === 'Twitter' ? <XIcon /> :
                                                         signal.platform === 'Reddit' ? <RedditIcon /> :
                                                         signal.platform === 'LinkedIn' ? <LinkedInIcon /> :
                                                         <span className="text-xs">G</span>}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{signal.platform}</h4>
                                                        <div className="text-xs text-gray-500">Market Signals</div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {signal.summary.length > 120 
                                                        ? signal.summary.substring(0, 120) + '...' 
                                                        : signal.summary}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        <DashboardIcon />
                                        <span className="font-medium">New Analysis</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                                        <ShareIcon />
                                        <span className="font-medium">Share Results</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                                        <DownloadIcon />
                                        <span className="font-medium">Export PDF</span>
                                    </button>
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