
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ValidationResult } from '../types';
import ScoreBar from '../components/ScoreBar';
import SuggestionCard from '../components/SuggestionCard';

// --- SVG Icons ---
const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const SignalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5h-.008A.75.75 0 0 1 12 20.25Z" />
    </svg>
);





const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.0003 2.00002C6.47744 2.00002 2.00031 6.47715 2.00031 12C2.00031 17.5229 6.47744 22 12.0003 22C17.5232 22 22.0003 17.5229 22.0003 12C22.0003 6.47715 17.5232 2.00002 12.0003 2.00002ZM12.0003 19.5C8.41044 19.5 5.50031 16.59 5.50031 13C5.50031 11.215 6.25531 9.59502 7.50031 8.5C7.50031 8.5 8.75031 9.25002 8.75031 10.5C8.75031 10.5 9.75031 11.25 11.2503 11.25C12.7503 11.25 13.7503 10.5 13.7503 10.5C13.7503 9.25002 15.0003 8.5 15.0003 8.5C16.2453 9.59502 17.0003 11.215 17.0003 13C17.0003 16.59 14.0903 19.5 12.0003 19.5ZM9.00031 14.25C8.31031 14.25 7.75031 13.69 7.75031 13C7.75031 12.31 8.31031 11.75 9.00031 11.75C9.69031 11.75 10.2503 12.31 10.2503 13C10.2503 13.69 9.69031 14.25 9.00031 14.25ZM15.0003 14.25C14.3103 14.25 13.7503 13.69 13.7503 13C13.7503 12.31 14.3103 11.75 15.0003 11.75C15.6903 11.75 16.2503 12.31 16.2503 13C16.2503 13.69 15.6903 14.25 15.0003 14.25ZM15.8253 16.62C15.8253 16.62 15.1953 17.625 12.0003 17.625C8.80531 17.625 8.17531 16.62 8.17531 16.62C8.04031 16.41 8.17531 16.125 8.41531 16.125H15.5853C15.8253 16.125 15.9603 16.41 15.8253 16.62Z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);



const PlatformIcons: { [key: string]: React.FC } = {
    X: XIcon,
    Twitter: XIcon, // Backward compatibility
    Reddit: RedditIcon,
    LinkedIn: LinkedInIcon,
};

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

    const handleCopyToClipboard = async (text: string, id: string, onCopy?: () => void) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            if (onCopy) onCopy();
            setTimeout(() => setCopiedId(null), 2500);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const handleTweet = () => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.tweetSuggestion)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    };

    const handlePostToReddit = () => {
        const title = result.redditTitleSuggestion;
        const body = result.redditBodySuggestion;
        const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&selftext=${encodeURIComponent(body)}`;
        window.open(redditUrl, '_blank', 'noopener,noreferrer');
    };

    const handlePostToLinkedIn = () => {
        handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-post', () => {
            window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
        });
    };

    const togglePlatformExpand = (platform: string) => {
        setExpandedPlatforms(prev => ({
            ...prev,
            [platform]: !prev[platform]
        }));
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'X':
            case 'Twitter':
                return 'bg-black text-white';
            case 'Reddit':
                return 'bg-orange-500 text-white';
            case 'LinkedIn':
                return 'bg-blue-600 text-white';
            default:
                return 'bg-indigo-500 text-white';
        }
    };

    return (
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/80 mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                    "{result.content || result.idea}"
                </h1>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3">
                        <ChartBarIcon /> Demand Score
                    </h2>
                    <ScoreBar score={result.demandScore} text={result.scoreJustification} />
                    
                    {/* Content Type & Confidence */}
                    <div className="mt-4 flex flex-wrap gap-3">
                        <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {result.contentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        {result.confidenceLevel && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                {result.confidenceLevel}% Confidence
                            </div>
                        )}
                    </div>
                </div>

                {/* Score Breakdown */}
                {result.scoreBreakdown && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                            <ChartBarIcon /> Score Breakdown
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                                        <ChartBarIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Market Size</h3>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">{result.scoreBreakdown.marketSize}</div>
                                <div className="text-sm text-gray-500">out of 25</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                                        <ChartBarIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Competition</h3>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-orange-600 mb-2">{result.scoreBreakdown.competition}</div>
                                <div className="text-sm text-gray-500">out of 25</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white">
                                        <ChartBarIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Trend Momentum</h3>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-2">{result.scoreBreakdown.trendMomentum}</div>
                                <div className="text-sm text-gray-500">out of 25</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                                        <ChartBarIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Feasibility</h3>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">{result.scoreBreakdown.feasibility}</div>
                                <div className="text-sm text-gray-500">out of 25</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Market Timing */}
                {result.marketTiming && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                            <SignalIcon /> Market Timing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                                        <SignalIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Market Readiness</h3>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-indigo-600 mb-2">{result.marketTiming.readiness}%</div>
                                <div className="text-sm text-gray-500">readiness score</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                                        result.marketTiming.trendDirection === 'Rising' ? 'bg-green-500' :
                                        result.marketTiming.trendDirection === 'Declining' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}>
                                        <SignalIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Trend Direction</h3>
                                    </div>
                                </div>
                                <div className={`text-3xl font-bold mb-2 ${
                                    result.marketTiming.trendDirection === 'Rising' ? 'text-green-600' :
                                    result.marketTiming.trendDirection === 'Declining' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                    {result.marketTiming.trendDirection}
                                </div>
                                <div className="text-sm text-gray-500">market trend</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
                                        <SignalIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Optimal Window</h3>
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-cyan-600 mb-2">{result.marketTiming.optimalWindow}</div>
                                <div className="text-sm text-gray-500">best timing</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Quality */}
                {result.contentQuality && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                            <ChartBarIcon /> Content Quality Analysis
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            <div className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-center">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white mx-auto mb-3">
                                    <ChartBarIcon />
                                </div>
                                <div className="text-2xl font-bold text-indigo-600 mb-1">{result.contentQuality.writingQuality}</div>
                                <div className="text-xs text-gray-500">Writing</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-center">
                                <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center text-white mx-auto mb-3">
                                    <ChartBarIcon />
                                </div>
                                <div className="text-2xl font-bold text-pink-600 mb-1">{result.contentQuality.engagementPotential}</div>
                                <div className="text-xs text-gray-500">Engagement</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-center">
                                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white mx-auto mb-3">
                                    <ChartBarIcon />
                                </div>
                                <div className="text-2xl font-bold text-red-600 mb-1">{result.contentQuality.viralityScore}</div>
                                <div className="text-xs text-gray-500">Virality</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-center">
                                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white mx-auto mb-3">
                                    <ChartBarIcon />
                                </div>
                                <div className="text-2xl font-bold text-teal-600 mb-1">{result.contentQuality.grammarScore}</div>
                                <div className="text-xs text-gray-500">Grammar</div>
                            </div>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-center">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white mx-auto mb-3">
                                    <ChartBarIcon />
                                </div>
                                <div className="text-2xl font-bold text-cyan-600 mb-1">{result.contentQuality.clarityScore}</div>
                                <div className="text-xs text-gray-500">Clarity</div>
                            </div>
                        </div>
                        
                        {/* Improvements */}
                        {result.contentQuality.improvements && result.contentQuality.improvements.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white">
                                        💡
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Improvement Suggestions</h3>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {result.contentQuality.improvements.map((improvement, index) => (
                                        <li key={index} className="text-gray-600 flex items-start gap-2">
                                            <span className="text-yellow-500 mt-1">•</span>
                                            {improvement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                        <SignalIcon /> Signal Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.signalSummary.map((signal, index) => {
                            const Icon = PlatformIcons[signal.platform];
                            const isExpanded = expandedPlatforms[signal.platform];
                            const shouldTruncate = signal.summary.length > 200;
                            
                            return (
                                <div 
                                    key={signal.platform} 
                                    className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Platform header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getPlatformColor(signal.platform)}`}>
                                            {Icon && <Icon />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{signal.platform}</h3>
                                            <div className="text-sm text-gray-500">Market Signals</div>
                                        </div>
                                    </div>
                                    
                                    {/* Summary with expand/collapse */}
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        <p className={shouldTruncate && !isExpanded ? 'line-clamp-3' : ''}>
                                            {signal.summary}
                                        </p>
                                        {shouldTruncate && (
                                            <button 
                                                onClick={() => togglePlatformExpand(signal.platform)}
                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 transition-colors"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {/* Instagram Icon */}
                {result.instagramSuggestion && (
                    <SuggestionCard
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        }
                        title="Instagram Post Suggestion"
                        content={result.instagramSuggestion}
                        actions={[
                            {
                                id: 'instagram-copy',
                                label: 'Copy Text',
                                handler: () => handleCopyToClipboard(result.instagramSuggestion, 'instagram-copy'),
                                copiedLabel: 'Copied!'
                            }
                        ]}
                        copiedId={copiedId}
                    />
                )}

                {/* TikTok Icon */}
                {result.tiktokSuggestion && (
                    <SuggestionCard
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        }
                        title="TikTok Content Suggestion"
                        content={result.tiktokSuggestion}
                        actions={[
                            {
                                id: 'tiktok-copy',
                                label: 'Copy Text',
                                handler: () => handleCopyToClipboard(result.tiktokSuggestion, 'tiktok-copy'),
                                copiedLabel: 'Copied!'
                            }
                        ]}
                        copiedId={copiedId}
                    />
                )}
                <SuggestionCard
                    icon={<XIcon />}
                    title="X Post Suggestion"
                    content={result.tweetSuggestion}
                    actions={[
                        {
                            id: 'tweet-post',
                            label: 'Post to X',
                            handler: handleTweet
                        },
                        {
                            id: 'tweet-copy',
                            label: 'Copy Text',
                            handler: () => handleCopyToClipboard(result.tweetSuggestion, 'tweet-copy'),
                            copiedLabel: 'Copied!'
                        }
                    ]}
                    copiedId={copiedId}
                />

                <SuggestionCard
                    icon={<RedditIcon />}
                    title="Reddit Post Suggestion"
                    content={
                        <>
                            <p className="font-semibold text-gray-800">{result.redditTitleSuggestion}</p>
                            <p className="mt-2 text-gray-600">{result.redditBodySuggestion}</p>
                        </>
                    }
                    actions={[
                        {
                            id: 'reddit-post',
                            label: 'Post to Reddit',
                            handler: handlePostToReddit
                        },
                        {
                            id: 'reddit-copy',
                            label: 'Copy Text',
                            handler: () => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit-copy'),
                            copiedLabel: 'Copied!'
                        }
                    ]}
                    copiedId={copiedId}
                />

                <SuggestionCard
                    icon={<LinkedInIcon />}
                    title="LinkedIn Post Suggestion"
                    content={result.linkedinSuggestion}
                    actions={[
                        {
                            id: 'linkedin-post',
                            label: 'Post to LinkedIn',
                            handler: handlePostToLinkedIn,
                            copiedLabel: 'Copied! Now Paste'
                        },
                        {
                            id: 'linkedin-copy',
                            label: 'Copy Text',
                            handler: () => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-copy'),
                            copiedLabel: 'Copied!'
                        }
                    ]}
                    copiedId={copiedId}
                />
            </div>

            <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto font-semibold py-3 px-8 rounded-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-all duration-200"
                    aria-label="Try another idea"
                >
                    Try another idea
                </button>
                <a
                    href="https://buymeacoffee.com/kptbarbarossa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center font-semibold py-3 px-6 rounded-full text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 hover:opacity-90 transition-all duration-200"
                    aria-label="Buy me a coffee"
                >
                    Buy me a coffee
                </a>
                <a
                    href="https://x.com/kptbarbarossa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center font-semibold py-3 px-6 rounded-full text-white bg-black hover:bg-gray-800 transition-all duration-200"
                    aria-label="Feedback on X"
                >
                    Feedback on X
                </a>
            </div>
        </div>
    );
};

export default ResultsPage;
