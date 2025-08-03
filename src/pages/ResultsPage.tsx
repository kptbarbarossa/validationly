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

    // Helper Functions for Better UX
    const getScoreInterpretation = (score: number = 0, type: 'market' | 'competition' | 'feasibility') => {
        const interpretations = {
            market: {
                high: { text: "High Market Potential 🎯", desc: "Large addressable market with millions of potential customers." },
                medium: { text: "Medium Market Size 📊", desc: "Niche market with focused targeting opportunities." },
                low: { text: "Small Market Niche 🔍", desc: "Specialized market with limited but dedicated audience." }
            },
            competition: {
                high: { text: "High Competition ⚔️", desc: "Crowded market requiring strong differentiation strategy." },
                medium: { text: "Moderate Competition ⚖️", desc: "Competitive but not saturated market with opportunities." },
                low: { text: "Low Competition 🏆", desc: "Great! Few competitors, early mover advantage available." }
            },
            feasibility: {
                high: { text: "High Feasibility 🚀", desc: "Technically achievable with current resources and technology." },
                medium: { text: "Medium Complexity 🛠️", desc: "Some technical challenges but manageable with planning." },
                low: { text: "High Complexity 🧗", desc: "Significant technical challenges requiring expert team." }
            }
        };

        const level = score >= 20 ? 'high' : score >= 15 ? 'medium' : 'low';
        return interpretations[type][level];
    };

    const getOverallStatus = (score: number) => {
        if (score >= 70) return {
            color: 'green',
            text: 'GREEN: Start Building! 🟢',
            desc: 'Excellent idea! Time to take action and move forward.',
            action: 'Begin MVP development'
        };
        if (score >= 50) return {
            color: 'yellow',
            text: 'YELLOW: Proceed with Caution 🟡',
            desc: 'Good idea but needs strengthening in some areas.',
            action: 'Improve weak points'
        };
        return {
            color: 'red',
            text: 'RED: Reconsider Approach 🔴',
            desc: 'Idea needs significant development or pivot.',
            action: 'Reevaluate the concept'
        };
    };

    const getActionableInsights = (result: ValidationResult) => {
        const insights = [];
        const marketSize = result.scoreBreakdown?.marketSize || 0;
        const competition = result.scoreBreakdown?.competition || 0;
        const feasibility = result.scoreBreakdown?.feasibility || 0;

        if (marketSize >= 20) insights.push("✅ Focus on large market - millions of potential customers");
        if (competition <= 15) insights.push("✅ Leverage early mover advantage - low competition");
        if (feasibility >= 18) insights.push("✅ Build rapid prototype - technically feasible");
        if (result.demandScore >= 70) insights.push("✅ Prepare investor pitch - strong concept");

        // Platform önerileri - safe access
        const validationlyScore = result.validationlyScore;
        if (validationlyScore?.breakdown?.twitter && validationlyScore.breakdown.twitter >= 25) {
            insights.push("📱 Launch viral campaign on X");
        }
        if (validationlyScore?.breakdown?.linkedin && validationlyScore.breakdown.linkedin >= 20) {
            insights.push("💼 Focus on B2B marketing via LinkedIn");
        }
        if (validationlyScore?.breakdown?.reddit && validationlyScore.breakdown.reddit >= 20) {
            insights.push("🔴 Build organic growth through Reddit communities");
        }

        // Fallback insights if none match
        if (insights.length === 0) {
            insights.push("💡 Continue developing your idea");
            insights.push("📊 Conduct market research");
            insights.push("🎯 Define your target audience");
        }

        return insights.slice(0, 5); // En fazla 5 insight
    };

    const getRiskOpportunityMatrix = (result: ValidationResult) => {
        const opportunities = [];
        const risks = [];

        // Opportunities
        if ((result.scoreBreakdown?.marketSize || 0) >= 18) opportunities.push("Large market potential");
        if ((result.scoreBreakdown?.competition || 0) <= 16) opportunities.push("Early mover advantage");
        if (result.demandScore >= 65) opportunities.push("Strong demand signals");
        if ((result.scoreBreakdown?.feasibility || 0) >= 18) opportunities.push("Rapid development opportunity");

        // Risks  
        if ((result.scoreBreakdown?.competition || 0) >= 20) risks.push("High competition environment");
        if ((result.scoreBreakdown?.feasibility || 0) <= 14) risks.push("Technical challenges");
        if (result.demandScore <= 50) risks.push("Low market interest");
        if ((result.scoreBreakdown?.marketSize || 0) <= 12) risks.push("Limited market size");

        return { opportunities, risks };
    };

    const getSuccessScenario = (result: ValidationResult) => {
        const score = result.demandScore;
        if (score >= 80) return {
            revenue: "$100K-1M+/year",
            users: "50K-500K users",
            timeline: "6-12 months to profitability",
            probability: "High success chance (80%+)"
        };
        if (score >= 60) return {
            revenue: "$50K-500K/year",
            users: "10K-100K users",
            timeline: "12-18 months to profitability",
            probability: "Good success chance (60-80%)"
        };
        return {
            revenue: "$10K-100K/year",
            users: "1K-10K users",
            timeline: "18+ months to profitability",
            probability: "Moderate success chance (40-60%)"
        };
    };

    const getFuturePredictions = () => {
        return {
            market: "Market expected to grow 25% in 6 months",
            competition: "2-3 new competitors may enter",
            technology: "AI tools becoming more affordable",
            trend: "Upward trend in this sector"
        };
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

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
            </div>
            {/* Premium Layout */}
            <div className="flex">
                {/* Clean Dashboard Sidebar */}
                <div className="w-60 bg-white border-r border-gray-200 min-h-screen relative z-10 shadow-sm">
                    <div className="p-6">
                        {/* Clean Logo */}
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">Validationly</span>
                        </div>

                        {/* Clean Navigation */}
                        <nav className="space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border-l-4 border-blue-600">
                                <HomeIcon />
                                <span className="text-sm font-medium">Overview</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <ChartIcon />
                                <span className="text-sm font-medium">Analytics</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <BookmarkIcon />
                                <span className="text-sm font-medium">Saved</span>
                            </div>
                        </nav>

                        {/* Clean Bottom Navigation */}
                        <div className="absolute bottom-6 left-6 right-6 space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <SettingsIcon />
                                <span className="text-sm font-medium">Settings</span>
                            </div>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <HelpIcon />
                                <span className="text-sm font-medium">Help</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clean Main Content */}
                <div className="flex-1 p-8 relative z-10">
                    {/* Clean Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Internet Intelligence Report</h1>
                            <p className="text-gray-600">We scanned the internet, here's what we found</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">AI</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">
                                    Internet Scan Complete
                                    {result.enhancementMetadata?.enhancementApplied && (
                                        <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">🔍</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {result.enhancementMetadata?.aiConfidence ?
                                        `${result.enhancementMetadata.aiConfidence}% confidence` :
                                        'Just completed'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Internet Intelligence Summary Card */}
                    <div className="mb-12">
                        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-2xl shadow-purple-500/10 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-sm font-medium text-gray-600 mb-3">Internet Signal Strength</div>
                                <div className="text-6xl font-extralight text-gray-800 mb-4 tracking-tight">
                                    {result.demandScore}
                                    <span className="text-2xl text-gray-500 ml-2">/100</span>
                                </div>
                                <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-semibold mb-4 ${result.demandScore >= 80 ? 'bg-green-100/80 text-green-700' :
                                    result.demandScore >= 60 ? 'bg-yellow-100/80 text-yellow-700' :
                                        'bg-red-100/80 text-red-700'
                                    }`}>
                                    {result.demandScore >= 80 ? '🚀 High Potential' :
                                        result.demandScore >= 60 ? '⚡ Moderate Potential' :
                                            '⚠️ Low Potential'}
                                </div>
                                <div className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                    "{result.content || result.idea}"
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Modern Dashboard Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column - Stats */}
                        <div className="col-span-8 space-y-6">
                            {/* Clean Stats Cards */}
                            <div className="grid grid-cols-3 gap-6">
                                {/* Market Size Card */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <span className="text-pink-600 text-lg">📊</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{result.scoreBreakdown?.marketSize ?? 20}</div>
                                    </div>
                                    <div className="text-gray-900 font-medium mb-2">
                                        {getScoreInterpretation(result.scoreBreakdown?.marketSize ?? 20, 'market').text}
                                    </div>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        {getScoreInterpretation(result.scoreBreakdown?.marketSize ?? 20, 'market').desc}
                                    </div>
                                </div>

                                {/* Competition Card */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-600 text-lg">⚔️</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{result.scoreBreakdown?.competition ?? 15}</div>
                                    </div>
                                    <div className="text-gray-900 font-medium mb-2">
                                        {getScoreInterpretation(result.scoreBreakdown?.competition ?? 15, 'competition').text}
                                    </div>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        {getScoreInterpretation(result.scoreBreakdown?.competition ?? 15, 'competition').desc}
                                    </div>
                                </div>

                                {/* Feasibility Card */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600 text-lg">🚀</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{result.scoreBreakdown?.feasibility ?? 17}</div>
                                    </div>
                                    <div className="text-gray-900 font-medium mb-2">
                                        {getScoreInterpretation(result.scoreBreakdown?.feasibility ?? 17, 'feasibility').text}
                                    </div>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        {getScoreInterpretation(result.scoreBreakdown?.feasibility ?? 17, 'feasibility').desc}
                                    </div>
                                </div>
                            </div>

                            {/* Internet Platform Signals */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Platform Signals Found</h3>
                                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live Data</div>
                                </div>
                                <div className="space-y-4">
                                    {result.validationlyScore?.breakdown ? Object.entries(result.validationlyScore.breakdown).map(([platform, score]) => (
                                        <div key={platform} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <span className="text-lg">
                                                    {platform === 'twitter' ? '𝕏' :
                                                        platform === 'reddit' ? '🔴' :
                                                            platform === 'linkedin' ? '💼' : '📈'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-900 capitalize">{platform.replace('googleTrends', 'Google Trends')}</span>
                                                    <span className="text-sm font-semibold text-gray-900 bg-blue-50 px-2 py-1 rounded">{score}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${Math.min(100, (score / (result.validationlyScore?.weighting?.[platform as keyof typeof result.validationlyScore.weighting] || 40)) * 100)}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                                            Platform verisi mevcut değil
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* What We Found Summary */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">🔍 What We Found</h3>
                                    <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">Internet Scan Results</div>
                                </div>
                                <div className="space-y-4">
                                    {/* Enhanced metadata insights */}
                                    {result.enhancementMetadata && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="text-sm font-medium text-gray-900 mb-2">🤖 AI Analysis</div>
                                                <div className="text-sm text-gray-600">
                                                    Model: {result.enhancementMetadata.aiModel || 'Gemini'}
                                                    {result.enhancementMetadata.fallbackUsed && ' (Fallback)'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Confidence: {result.enhancementMetadata.aiConfidence}%
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="text-sm font-medium text-gray-900 mb-2">📊 Data Sources</div>
                                                <div className="text-sm text-gray-600">
                                                    Reddit: {result.enhancementMetadata.redditAnalyzed ? '✅ Analyzed' : '❌ Skipped'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Trends: {result.enhancementMetadata.trendsAnalyzed ? '✅ Analyzed' : '❌ Skipped'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Signal strength summary */}
                                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                        <div className="text-sm font-medium text-blue-900 mb-2">📡 Signal Strength: {result.demandScore}/100</div>
                                        <div className="text-sm text-blue-800">
                                            {result.demandScore >= 70 ? 'Strong positive signals found across platforms' :
                                             result.demandScore >= 50 ? 'Mixed signals - some positive indicators' :
                                             'Weak signals - limited online interest detected'}
                                        </div>
                                        {result.enhancementMetadata?.redditBoost && (
                                            <div className="text-xs text-blue-700 mt-1">
                                                Reddit boost: {result.enhancementMetadata.redditBoost > 0 ? '+' : ''}{result.enhancementMetadata.redditBoost} points
                                            </div>
                                        )}
                                        {result.enhancementMetadata?.trendsBoost && (
                                            <div className="text-xs text-blue-700">
                                                Trends boost: {result.enhancementMetadata.trendsBoost > 0 ? '+' : ''}{result.enhancementMetadata.trendsBoost} points
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* What You Can Do */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 What You Can Do With This Data</h3>
                                <div className="space-y-3">
                                    {getActionableInsights(result).map((insight, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="text-sm text-gray-700 leading-relaxed">{insight}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 🚀 PHASE 1: Real-Time Market Insights */}
                            {result.realTimeInsights && (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">📊 Real-Time Market Data</h3>
                                        <div className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                                            Live • {new Date(result.realTimeInsights.dataFreshness).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Google Trends Data */}
                                        {result.realTimeInsights.trends && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-blue-600 text-lg">📈</span>
                                                    <h4 className="font-semibold text-blue-900">Google Trends</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-blue-800">Trend Direction:</span>
                                                        <span className={`text-sm font-semibold ${result.realTimeInsights.trends.overallTrend === 'rising' ? 'text-green-600' :
                                                            result.realTimeInsights.trends.overallTrend === 'declining' ? 'text-red-600' :
                                                                'text-yellow-600'
                                                            }`}>
                                                            {result.realTimeInsights.trends.overallTrend === 'rising' ? '📈 Rising' :
                                                                result.realTimeInsights.trends.overallTrend === 'declining' ? '📉 Declining' :
                                                                    '📊 Stable'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-blue-800">Interest Score:</span>
                                                        <span className="text-sm font-semibold text-blue-900">
                                                            {result.realTimeInsights.trends.trendScore}/100
                                                        </span>
                                                    </div>
                                                    {result.realTimeInsights.trends.insights.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="text-xs text-blue-700 font-medium mb-1">Key Insight:</div>
                                                            <div className="text-xs text-blue-800">
                                                                {result.realTimeInsights.trends.insights[0]}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Reddit Community Data */}
                                        {result.realTimeInsights.reddit && (
                                            <div className="bg-orange-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-orange-600 text-lg">🔴</span>
                                                    <h4 className="font-semibold text-orange-900">Reddit Community</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-orange-800">Community Interest:</span>
                                                        <span className="text-sm font-semibold text-orange-900">
                                                            {result.realTimeInsights.reddit.communityInterest}/100
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-orange-800">Sentiment:</span>
                                                        <span className={`text-sm font-semibold ${result.realTimeInsights.reddit.sentiment > 20 ? 'text-green-600' :
                                                            result.realTimeInsights.reddit.sentiment < -20 ? 'text-red-600' :
                                                                'text-yellow-600'
                                                            }`}>
                                                            {result.realTimeInsights.reddit.sentiment > 20 ? '😊 Positive' :
                                                                result.realTimeInsights.reddit.sentiment < -20 ? '😟 Negative' :
                                                                    '😐 Neutral'}
                                                        </span>
                                                    </div>
                                                    {result.realTimeInsights.reddit.topSubreddits.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="text-xs text-orange-700 font-medium mb-1">Top Community:</div>
                                                            <div className="text-xs text-orange-800">
                                                                r/{result.realTimeInsights.reddit.topSubreddits[0]}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-center">
                                        <div className="text-xs text-gray-500">
                                            Analysis Confidence: {result.realTimeInsights.confidence}% •
                                            Powered by AI Ensemble
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Risk-Opportunity Matrix */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Risk & Opportunity Analysis</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/30">
                                        <div className="font-semibold text-green-800 mb-2">🟢 FIRSATLAR</div>
                                        <div className="space-y-2">
                                            {getRiskOpportunityMatrix(result).opportunities.map((opp, index) => (
                                                <div key={index} className="text-sm text-green-700">• {opp}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-red-50/60 backdrop-blur-sm rounded-lg p-4 border border-red-200/30">
                                        <div className="font-semibold text-red-800 mb-2">🔴 RİSKLER</div>
                                        <div className="space-y-2">
                                            {getRiskOpportunityMatrix(result).risks.map((risk, index) => (
                                                <div key={index} className="text-sm text-red-700">• {risk}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Success Scenario */}
                            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/25 shadow-2xl shadow-purple-500/10">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Başarı Senaryosu</h3>
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-600 mb-4">Eğer bu fikri hayata geçirirseniz:</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                            <div className="text-xs text-gray-600">Potansiyel Gelir</div>
                                            <div className="font-semibold text-gray-800">{getSuccessScenario(result).revenue}</div>
                                        </div>
                                        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                            <div className="text-xs text-gray-600">Hedef Kullanıcı</div>
                                            <div className="font-semibold text-gray-800">{getSuccessScenario(result).users}</div>
                                        </div>
                                        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                            <div className="text-xs text-gray-600">Zaman Çizelgesi</div>
                                            <div className="font-semibold text-gray-800">{getSuccessScenario(result).timeline}</div>
                                        </div>
                                        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                            <div className="text-xs text-gray-600">Başarı İhtimali</div>
                                            <div className="font-semibold text-gray-800">{getSuccessScenario(result).probability}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Future Predictions */}
                            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/25 shadow-2xl shadow-indigo-500/10">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">🔮 Gelecek Tahminleri</h3>
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-600 mb-4">6 ay sonra beklentiler:</div>
                                    {Object.entries(getFuturePredictions()).map(([key, prediction], index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                                            <div className="text-lg">
                                                {key === 'market' ? '📈' : key === 'competition' ? '⚔️' : key === 'technology' ? '🤖' : '📊'}
                                            </div>
                                            <div className="text-sm text-gray-700 leading-relaxed">{prediction}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Content Suggestions */}
                            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-8 border border-white/25 shadow-2xl shadow-cyan-500/10">
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
                                                    onClick={() => handleCopyToClipboard(result.instagramSuggestion || '', 'instagram-copy')}
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
                                                    onClick={() => handleCopyToClipboard(result.tiktokSuggestion || '', 'tiktok-copy')}
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
                                                onClick={() => handleCopyToClipboard(
                                                    result.facebookSuggestion || `Excited to share this new concept: ${result.content || result.idea}. Looking forward to connecting with others who have insights in this space!`,
                                                    'facebook-copy'
                                                )}
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

                        {/* Right Column - Clean Sidebar */}
                        <div className="col-span-4 space-y-6">
                            {/* Clean Story Card */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-purple-600 text-lg">📖</span>
                                    </div>
                                    <div className="font-semibold text-lg text-gray-900">Your Idea's Story</div>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed mb-4">
                                    {result.demandScore >= 70 ?
                                        "🌟 There's a significant market gap and you're arriving at the perfect time! Competitors haven't discovered this space yet. Time to take action!" :
                                        result.demandScore >= 50 ?
                                            "💡 You have a good idea! With some strengthening in key areas, you can succeed. Patient and strategic approach needed." :
                                            "🔍 Your idea has potential but needs more research and development. Don't give up, just make it better!"
                                    }
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <div className="text-xs text-gray-600 mb-1">Overall Status</div>
                                    <div className="font-semibold text-gray-900">{getOverallStatus(result.demandScore).text}</div>
                                </div>
                            </div>

                            {/* Clean Level Card */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Your Idea Level</h3>
                                    <div className="text-2xl">
                                        {result.demandScore >= 80 ? '🏆' : result.demandScore >= 60 ? '🥈' : result.demandScore >= 40 ? '🥉' : '📈'}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="text-xs text-gray-600">Level</div>
                                        <div className="font-semibold text-gray-900">
                                            {result.demandScore >= 80 ? 'GOLD 🏆' :
                                                result.demandScore >= 60 ? 'SILVER 🥈' :
                                                    result.demandScore >= 40 ? 'BRONZE 🥉' : 'STARTER 📈'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="text-xs text-gray-600">Success Probability</div>
                                        <div className="font-semibold text-gray-900">{result.demandScore}%</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="text-xs text-gray-600">Next Level</div>
                                        <div className="font-semibold text-gray-900">
                                            {result.demandScore >= 80 ? 'Find investors!' :
                                                result.demandScore >= 60 ? 'Build prototype!' :
                                                    'Develop idea!'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clean Action Cards */}
                            <div className="space-y-3">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 text-sm">💡</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Generate Ideas</div>
                                            <div className="text-xs text-gray-500">AI-powered suggestions</div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                                        Generate Similar Ideas
                                    </button>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 text-sm">🔄</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">New Analysis</div>
                                            <div className="text-xs text-gray-500">Validate another idea</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Analyze Another Idea
                                    </button>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600 text-sm">📊</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Save Results</div>
                                            <div className="text-xs text-gray-500">Keep for later</div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                                        Save to Dashboard
                                    </button>
                                </div>
                            </div>

                            {/* Enhanced Latest Scores */}
                            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/25 shadow-2xl shadow-indigo-500/10">
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

                            {/* Enhanced Support Section */}
                            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/25 shadow-2xl shadow-pink-500/10">
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