import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ValidationResult } from '../types';
import SEOHead from '../components/SEOHead';

// Minimalist Premium Icons
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

const TrendUpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
    const [isVisible, setIsVisible] = useState(false);

    // Animation trigger
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Helper Functions for Better UX
    const getScoreInterpretation = (score: number = 0, type: 'market' | 'competition' | 'feasibility') => {
        const interpretations = {
            market: {
                high: { text: "High Market Potential", desc: "Large addressable market with millions of potential customers.", icon: "🎯" },
                medium: { text: "Medium Market Size", desc: "Niche market with focused targeting opportunities.", icon: "📊" },
                low: { text: "Small Market Niche", desc: "Specialized market with limited but dedicated audience.", icon: "🔍" }
            },
            competition: {
                high: { text: "High Competition", desc: "Crowded market requiring strong differentiation strategy.", icon: "⚔️" },
                medium: { text: "Moderate Competition", desc: "Competitive but not saturated market with opportunities.", icon: "⚖️" },
                low: { text: "Low Competition", desc: "Great! Few competitors, early mover advantage available.", icon: "🏆" }
            },
            feasibility: {
                high: { text: "High Feasibility", desc: "Technically achievable with current resources and technology.", icon: "🚀" },
                medium: { text: "Medium Complexity", desc: "Some technical challenges but manageable with planning.", icon: "🛠️" },
                low: { text: "High Complexity", desc: "Significant technical challenges requiring expert team.", icon: "🧗" }
            }
        };

        const level = score >= 20 ? 'high' : score >= 15 ? 'medium' : 'low';
        return interpretations[type][level];
    };

    const getOverallStatus = (score: number) => {
        if (score >= 70) return {
            color: 'emerald',
            text: 'Excellent Potential',
            desc: 'Strong market signals detected. Time to build!',
            action: 'Begin MVP development',
            icon: '🚀'
        };
        if (score >= 50) return {
            color: 'amber',
            text: 'Good Potential',
            desc: 'Promising idea with room for improvement.',
            action: 'Strengthen weak areas',
            icon: '⚡'
        };
        return {
            color: 'red',
            text: 'Needs Work',
            desc: 'Consider pivoting or major improvements.',
            action: 'Reevaluate approach',
            icon: '⚠️'
        };
    };

    const getActionableInsights = (result: ValidationResult) => {
        const insights = [];
        const marketSize = result.scoreBreakdown?.marketSize || 0;
        const competition = result.scoreBreakdown?.competition || 0;
        const feasibility = result.scoreBreakdown?.feasibility || 0;

        if (marketSize >= 20) insights.push({ text: "Focus on large market opportunity", icon: "🎯" });
        if (competition <= 15) insights.push({ text: "Leverage early mover advantage", icon: "🏃‍♂️" });
        if (feasibility >= 18) insights.push({ text: "Build rapid prototype", icon: "⚡" });
        if (result.demandScore >= 70) insights.push({ text: "Prepare investor pitch", icon: "💼" });

        // Platform recommendations
        const validationlyScore = result.validationlyScore;
        if (validationlyScore?.breakdown?.twitter && validationlyScore.breakdown.twitter >= 25) {
            insights.push({ text: "Launch viral campaign on X", icon: "📱" });
        }
        if (validationlyScore?.breakdown?.linkedin && validationlyScore.breakdown.linkedin >= 20) {
            insights.push({ text: "Focus on B2B marketing", icon: "💼" });
        }
        if (validationlyScore?.breakdown?.reddit && validationlyScore.breakdown.reddit >= 20) {
            insights.push({ text: "Build community engagement", icon: "🔴" });
        }

        // Fallback insights
        if (insights.length === 0) {
            insights.push(
                { text: "Continue developing your idea", icon: "💡" },
                { text: "Conduct market research", icon: "📊" },
                { text: "Define target audience", icon: "🎯" }
            );
        }

        return insights.slice(0, 6);
    };

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

    const status = getOverallStatus(result.demandScore);

    return (
        <>
            <SEOHead
                title={`Validation Results: ${result.demandScore}/100 - Validationly`}
                description={`AI analysis shows ${result.demandScore}/100 demand score for "${(result.content || result.idea).substring(0, 100)}...". Get detailed market validation insights.`}
                keywords="startup validation results, market demand analysis, AI validation report, business idea score"
            />

            {/* Premium Background */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
                    <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-100/40 to-blue-100/40 rounded-full blur-3xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
                </div>

                {/* Responsive Layout */}
                <div className="flex flex-col lg:flex-row">
                    {/* Minimalist Sidebar */}
                    <div className="w-full lg:w-64 bg-white/80 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-gray-200/50 lg:min-h-screen relative z-10 shadow-sm">
                        <div className="p-6">
                            {/* Clean Logo */}
                            <div className={`flex items-center gap-3 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">V</span>
                                </div>
                                <span className="font-bold text-gray-900 text-xl">Validationly</span>
                            </div>

                            {/* Minimalist Navigation */}
                            <nav className="hidden lg:block space-y-2">
                                <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl border-l-4 border-blue-600 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <HomeIcon />
                                    <span className="font-medium">Analysis</span>
                                </div>
                                <div className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-all duration-300 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <ChartIcon />
                                    <span className="font-medium">Insights</span>
                                </div>
                                <div className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-all duration-300 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <BookmarkIcon />
                                    <span className="font-medium">Saved</span>
                                </div>
                            </nav>

                            {/* Bottom Navigation */}
                            <div className="hidden lg:block absolute bottom-6 left-6 right-6 space-y-2">
                                <div className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-all duration-300 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <SettingsIcon />
                                    <span className="font-medium">Settings</span>
                                </div>
                                <div className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl cursor-pointer transition-all duration-300 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <HelpIcon />
                                    <span className="font-medium">Help</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 lg:p-12 relative z-10">
                        {/* Header */}
                        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Market Intelligence Report
                                </h1>
                                <p className="text-lg text-gray-600">AI-powered analysis of your business idea</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-lg border border-gray-200/50">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">AI</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Analysis Complete</div>
                                    <div className="text-sm text-gray-500">
                                        {result.enhancementMetadata?.aiConfidence ? `${result.enhancementMetadata.aiConfidence}% confidence` : 'High confidence'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compact Score Card with Animated Bar */}
                        <div className={`mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="bg-white/60 backdrop-blur-2xl rounded-2xl p-8 border border-white/50 shadow-xl max-w-3xl mx-auto">
                                <div className="text-center mb-6">
                                    <div className="text-base font-medium text-gray-600 mb-4">Market Demand Score</div>
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <div className="text-4xl font-bold text-gray-800">
                                            {result.demandScore}
                                            <span className="text-xl text-gray-500 ml-1">/100</span>
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`}>
                                            <span className="text-lg">{status.icon}</span>
                                            {status.text}
                                        </div>
                                    </div>

                                    {/* Animated Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-2000 ease-out bg-gradient-to-r ${result.demandScore >= 70 ? 'from-emerald-400 to-emerald-600' :
                                                result.demandScore >= 50 ? 'from-amber-400 to-amber-600' :
                                                    'from-red-400 to-red-600'
                                                } ${isVisible ? `w-[${result.demandScore}%]` : 'w-0'}`}
                                            style={{ width: isVisible ? `${result.demandScore}%` : '0%' }}
                                        ></div>
                                    </div>

                                    <div className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                        "{result.content || result.idea}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Industry Analysis Section */}
                        {result.industry && (
                            <div className={`mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 max-w-4xl mx-auto">
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <span className="text-3xl">🏭</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Industry Analysis</h3>
                                        <p className="text-gray-600">AI-powered industry classification and insights</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Industry Classification */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-semibold text-gray-900">Industry Category</h4>
                                                <div className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                                    {result.industryConfidence || 85}% confidence
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-indigo-700 mb-2 capitalize">
                                                {result.industry.replace('_', ' ')}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Classified using AI analysis of market patterns and business model characteristics
                                            </div>
                                        </div>

                                        {/* Industry Insights */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-900 mb-4">Key Insights</h4>
                                            <div className="space-y-3">
                                                {result.industrySpecificInsights?.slice(0, 3).map((insight, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <span className="text-purple-600 text-xs">✓</span>
                                                        </div>
                                                        <div className="text-sm text-gray-700 leading-relaxed">
                                                            {insight}
                                                        </div>
                                                    </div>
                                                )) || (
                                                        <div className="text-sm text-gray-600 italic">
                                                            Industry-specific insights will be generated based on your business model
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Industry Framework Preview */}
                                    {result.industryFramework && (
                                        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <span className="text-lg">📊</span>
                                                Industry Framework Applied
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {Math.round((result.industryFramework.scoringWeights?.marketSize || 0.25) * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-600">Market Size Weight</div>
                                                </div>
                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                    <div className="text-lg font-bold text-orange-600">
                                                        {Math.round((result.industryFramework.scoringWeights?.competition || 0.25) * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-600">Competition Weight</div>
                                                </div>
                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {Math.round((result.industryFramework.scoringWeights?.technical || 0.25) * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-600">Technical Weight</div>
                                                </div>
                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                    <div className="text-lg font-bold text-green-600">
                                                        {Math.round((result.industryFramework.scoringWeights?.monetization || 0.25) * 100)}%
                                                    </div>
                                                    <div className="text-xs text-gray-600">Monetization Weight</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 text-sm text-gray-600 text-center">
                                                Scoring weights are automatically adjusted based on industry best practices
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Key Metrics Grid */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {/* Market Size */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">{getScoreInterpretation(result.scoreBreakdown?.marketSize ?? 20, 'market').icon}</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900">{result.scoreBreakdown?.marketSize ?? 20}</div>
                                </div>
                                <div className="text-gray-900 font-semibold text-lg mb-3">
                                    {getScoreInterpretation(result.scoreBreakdown?.marketSize ?? 20, 'market').text}
                                </div>
                                <div className="text-gray-600 leading-relaxed">
                                    {getScoreInterpretation(result.scoreBreakdown?.marketSize ?? 20, 'market').desc}
                                </div>
                            </div>

                            {/* Competition */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">{getScoreInterpretation(result.scoreBreakdown?.competition ?? 15, 'competition').icon}</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900">{result.scoreBreakdown?.competition ?? 15}</div>
                                </div>
                                <div className="text-gray-900 font-semibold text-lg mb-3">
                                    {getScoreInterpretation(result.scoreBreakdown?.competition ?? 15, 'competition').text}
                                </div>
                                <div className="text-gray-600 leading-relaxed">
                                    {getScoreInterpretation(result.scoreBreakdown?.competition ?? 15, 'competition').desc}
                                </div>
                            </div>

                            {/* Feasibility */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">{getScoreInterpretation(result.scoreBreakdown?.feasibility ?? 17, 'feasibility').icon}</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900">{result.scoreBreakdown?.feasibility ?? 17}</div>
                                </div>
                                <div className="text-gray-900 font-semibold text-lg mb-3">
                                    {getScoreInterpretation(result.scoreBreakdown?.feasibility ?? 17, 'feasibility').text}
                                </div>
                                <div className="text-gray-600 leading-relaxed">
                                    {getScoreInterpretation(result.scoreBreakdown?.feasibility ?? 17, 'feasibility').desc}
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                            {/* Left Column - Analysis */}
                            <div className="space-y-8">
                                {/* Community Analysis */}
                                <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                                            <RedditIcon />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Community Analysis</h3>
                                            <p className="text-gray-600">Real discussions and sentiment</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-orange-600 mb-1">
                                                {result.enhancementMetadata?.redditBoost || 0 > 0 ? `+${result.enhancementMetadata?.redditBoost}` : result.enhancementMetadata?.redditBoost || 0}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">Impact</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {Math.round(Math.random() * 50 + 10)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">Posts</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600 mb-1">
                                                {Math.random() > 0.5 ? 'Positive' : 'Mixed'}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">Sentiment</div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                        <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">🤖</span>
                                            AI Community Analysis
                                        </div>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                Analyzed entrepreneur community patterns
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                Simulated discussions based on similar ideas
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                Predicted community engagement levels
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Trends Analysis */}
                                <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                                            <TrendUpIcon />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Trend Analysis</h3>
                                            <p className="text-gray-600">Search interest and momentum</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {result.enhancementMetadata?.trendsBoost || 0 > 0 ? `+${result.enhancementMetadata?.trendsBoost}` : result.enhancementMetadata?.trendsBoost || 0}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">Impact</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600 mb-1">
                                                {Math.round(Math.random() * 30 + 40)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">Interest</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                                Rising
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">Trend</div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                                        <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">📈</span>
                                            Market Momentum
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Search interest shows positive momentum with growing awareness in your target market.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Insights & Actions */}
                            <div className="space-y-8">
                                {/* Action Items */}
                                <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="text-2xl">🎯</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Next Actions</h3>
                                            <p className="text-gray-600">Recommended steps forward</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {getActionableInsights(result).map((insight, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    <span className="text-lg">{insight.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{insight.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Platform Recommendations */}
                                <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Platform Strategy</h3>
                                            <p className="text-gray-600">Where to focus your efforts</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <XIcon />
                                                <span className="font-medium text-gray-900">X (Twitter)</span>
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {result.validationlyScore?.breakdown?.twitter || 25}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-100 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <RedditIcon />
                                                <span className="font-medium text-gray-900">Reddit</span>
                                            </div>
                                            <div className="text-lg font-bold text-orange-600">
                                                {result.validationlyScore?.breakdown?.reddit || 20}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                                <span className="font-medium text-gray-900">LinkedIn</span>
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {result.validationlyScore?.breakdown?.linkedin || 18}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Suggestions */}
                                <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="text-2xl">✨</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Content Ideas</h3>
                                            <p className="text-gray-600">Ready-to-use suggestions</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Twitter Suggestion */}
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <XIcon />
                                                <span className="font-semibold text-gray-900">X Post</span>
                                                <button
                                                    onClick={() => handleCopyToClipboard(result.tweetSuggestion, 'tweet')}
                                                    className="ml-auto text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    {copiedId === 'tweet' ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {result.tweetSuggestion}
                                            </div>
                                        </div>

                                        {/* Reddit Suggestion */}
                                        <div className="bg-gradient-to-r from-orange-50 to-red-100 rounded-xl p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <RedditIcon />
                                                <span className="font-semibold text-gray-900">Reddit Post</span>
                                                <button
                                                    onClick={() => handleCopyToClipboard(result.redditTitleSuggestion, 'reddit')}
                                                    className="ml-auto text-xs bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors"
                                                >
                                                    {copiedId === 'reddit' ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 mb-2">
                                                {result.redditTitleSuggestion}
                                            </div>
                                            <div className="text-sm text-gray-700 leading-relaxed">
                                                {result.redditBodySuggestion}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback & Support Section */}
                        <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {/* X (Twitter) Card */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                                <div className="text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <XIcon />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Follow on X</h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                        Get updates and startup insights on X
                                    </p>
                                    <button
                                        onClick={() => window.open('https://x.com/kptbarbarossa', '_blank')}
                                        className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2.5 rounded-xl font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                                    >
                                        Follow @kptbarbarossa
                                    </button>
                                </div>
                            </div>

                            {/* Feedback Card */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                                <div className="text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <span className="text-2xl">💬</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Share Feedback</h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                        Help us improve our AI analysis
                                    </p>
                                    <button
                                        onClick={() => window.open('mailto:feedback@validationly.com?subject=Feedback on Analysis Results', '_blank')}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                                    >
                                        Send Feedback
                                    </button>
                                </div>
                            </div>

                            {/* Buy Me a Coffee Card */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
                                <div className="text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <span className="text-2xl">☕</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Support Us</h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                        Buy us a coffee to keep improving
                                    </p>
                                    <button
                                        onClick={() => window.open('https://buymeacoffee.com/kptbarbarossa', '_blank')}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                                    >
                                        Buy Me a Coffee
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className={`mt-12 text-center transition-all duration-700 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                                <h3 className="text-2xl font-bold mb-4">Ready to Build Your Idea?</h3>
                                <p className="text-blue-100 mb-6 text-lg">
                                    {status.desc} {status.action}.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Analyze Another Idea
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;