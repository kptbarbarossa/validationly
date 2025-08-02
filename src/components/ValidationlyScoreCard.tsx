import React, { useState } from 'react';
import type { ValidationlyScore } from '../types';

interface ValidationlyScoreCardProps {
    score: number;
    validationlyScore?: ValidationlyScore;
}

const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const ValidationlyScoreCard: React.FC<ValidationlyScoreCardProps> = ({ score, validationlyScore }) => {
    const [showDetails, setShowDetails] = useState(false);

    const getScoreStatus = (score: number) => {
        if (score >= 80) return { text: '🚀 High Potential', color: 'text-green-700', bg: 'bg-green-100' };
        if (score >= 60) return { text: '⚡ Moderate Potential', color: 'text-yellow-700', bg: 'bg-yellow-100' };
        return { text: '⚠️ Low Potential', color: 'text-red-700', bg: 'bg-red-100' };
    };

    const getScoreDescription = (score: number) => {
        if (score >= 80) return 'Strong market validation with high demand signals';
        if (score >= 60) return 'Moderate market interest with room for improvement';
        return 'Limited market validation - consider pivoting or refining';
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'twitter': return '𝕏';
            case 'reddit': return '🔴';
            case 'linkedin': return '💼';
            case 'googleTrends': return '📈';
            default: return '📊';
        }
    };

    const getPlatformName = (platform: string) => {
        switch (platform) {
            case 'twitter': return 'X (Twitter)';
            case 'reddit': return 'Reddit';
            case 'linkedin': return 'LinkedIn';
            case 'googleTrends': return 'Google Trends';
            default: return platform;
        }
    };

    const getProgressBar = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        const filledBars = Math.round(percentage / 10);
        return '■'.repeat(filledBars) + '□'.repeat(10 - filledBars);
    };

    const status = getScoreStatus(score);

    const handleShareScore = () => {
        const text = `I just validated my startup idea with Validationly and got a ${score}/100 score! 🚀 #ValidationlyScore #StartupValidation`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://validationly.com')}`;
        window.open(url, '_blank');
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 border border-white/50 shadow-2xl text-center">
            {/* Main Score */}
            <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Validationly Score</h2>
                    <div className="group relative">
                        <InfoIcon />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Our proprietary validation algorithm
                        </div>
                    </div>
                </div>
                <div className="text-9xl font-extralight text-gray-900 mb-4 tracking-tight">
                    {score}
                    <span className="text-4xl text-gray-400 ml-3">/100</span>
                </div>
                <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-semibold ${status.bg} ${status.color}`}>
                    {status.text}
                </div>
                <p className="text-gray-600 mt-4 text-lg">{getScoreDescription(score)}</p>
            </div>

            {/* Quick Breakdown */}
            {validationlyScore && (
                <div className="mb-8">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-gray-50/70 rounded-xl">
                            <div className="text-2xl mb-2">{getPlatformIcon('twitter')}</div>
                            <div className="text-lg font-bold text-gray-900">{validationlyScore.breakdown.twitter}</div>
                            <div className="text-xs text-gray-600">/{Math.round(validationlyScore.weighting.twitter * 100)}</div>
                        </div>
                        <div className="p-4 bg-gray-50/70 rounded-xl">
                            <div className="text-2xl mb-2">{getPlatformIcon('reddit')}</div>
                            <div className="text-lg font-bold text-gray-900">{validationlyScore.breakdown.reddit}</div>
                            <div className="text-xs text-gray-600">/{Math.round(validationlyScore.weighting.reddit * 100)}</div>
                        </div>
                        <div className="p-4 bg-gray-50/70 rounded-xl">
                            <div className="text-2xl mb-2">{getPlatformIcon('linkedin')}</div>
                            <div className="text-lg font-bold text-gray-900">{validationlyScore.breakdown.linkedin}</div>
                            <div className="text-xs text-gray-600">/{Math.round(validationlyScore.weighting.linkedin * 100)}</div>
                        </div>
                        <div className="p-4 bg-gray-50/70 rounded-xl">
                            <div className="text-2xl mb-2">{getPlatformIcon('googleTrends')}</div>
                            <div className="text-lg font-bold text-gray-900">{validationlyScore.breakdown.googleTrends}</div>
                            <div className="text-xs text-gray-600">/{Math.round(validationlyScore.weighting.googleTrends * 100)}</div>
                        </div>
                    </div>

                    {/* Details Toggle */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
                    >
                        <span>See Details</span>
                        {showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>

                    {/* Detailed Breakdown */}
                    {showDetails && (
                        <div className="mt-6 p-6 bg-gray-50/50 rounded-2xl text-left">
                            <h4 className="font-bold text-gray-900 mb-4 text-center">Score Breakdown</h4>
                            <div className="space-y-4">
                                {Object.entries(validationlyScore.breakdown).map(([platform, value]) => (
                                    <div key={platform} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{getPlatformIcon(platform)}</span>
                                            <span className="font-medium">{getPlatformName(platform)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-mono text-gray-600">
                                                {getProgressBar(value, Math.round(validationlyScore.weighting[platform as keyof ValidationlyScoreBreakdown] * 100))}
                                            </div>
                                            <span className="font-bold text-gray-900 w-12 text-right">
                                                {value}/{Math.round(validationlyScore.weighting[platform as keyof ValidationlyScoreBreakdown] * 100)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                <h5 className="font-semibold text-blue-900 mb-2">How is this calculated?</h5>
                                <p className="text-sm text-blue-800">
                                    The Validationly Score analyzes social media mentions, engagement patterns, 
                                    search trends, and market signals across multiple platforms to provide 
                                    a comprehensive validation score for your idea.
                                </p>
                            </div>

                            {validationlyScore.improvements.length > 0 && (
                                <div className="mt-4 p-4 bg-green-50 rounded-xl">
                                    <h5 className="font-semibold text-green-900 mb-2">💡 Improvement Tips</h5>
                                    <ul className="text-sm text-green-800 space-y-1">
                                        {validationlyScore.improvements.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Share Button */}
            <button
                onClick={handleShareScore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
                <span>🐦</span>
                <span>Share #ValidationlyScore</span>
            </button>
        </div>
    );
};

export default ValidationlyScoreCard;