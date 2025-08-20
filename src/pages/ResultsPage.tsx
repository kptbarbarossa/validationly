import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

interface ValidationResult {
    idea: string;
    demandScore: number;
    scoreJustification: string;
    tweetSuggestion?: string;
    redditTitleSuggestion?: string;
    redditBodySuggestion?: string;
    linkedinSuggestion?: string;
}

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Extract result from location state
    const result = (location.state as any)?.result as ValidationResult;

    if (!result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">No Analysis Results</h1>
                    <p className="text-slate-400 mb-6">Please start a new analysis from the home page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white font-medium transition-colors"
                    >
                        Start New Analysis
                    </button>
                </div>
            </div>
        );
    }

    // Language detection
    const isTR = (() => {
        const turkishWords = ['ve', 'bir', 'bu', 'ile', 'için', 'olarak', 'gibi', 'kadar', 'sonra', 'önce', 'üzerinde', 'altında', 'yanında', 'karşısında'];
        const englishWords = ['and', 'the', 'a', 'an', 'for', 'with', 'in', 'on', 'at', 'to', 'of', 'by', 'from', 'about'];
        
        const ideaText = result.idea?.toLowerCase() || '';
        const justificationText = result.scoreJustification?.toLowerCase() || '';
        
        let turkishCount = 0;
        let englishCount = 0;
        
        turkishWords.forEach(word => {
            if (ideaText.includes(word) || justificationText.includes(word)) turkishCount++;
        });
        
        englishWords.forEach(word => {
            if (ideaText.includes(word) || justificationText.includes(word)) englishCount++;
        });
        
        if (turkishCount > englishCount) return true;
        return false;
    })();

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
            console.error('Failed to copy text: ', err);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-500/20 border-green-500/30';
        if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
        if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
        return 'bg-red-500/20 border-red-500/30';
    };

    const tabs = [
        { id: 'overview', label: isTR ? 'AI Analizi' : 'AI Analysis', icon: '🤖' },
        { id: 'content', label: isTR ? 'İçerik Önerileri' : 'Content Suggestions', icon: '✍️' }
    ];

    return (
        <>
            <SEOHead
                title={`Validation Results: ${result.idea} | Validationly`}
                description={`AI-powered validation analysis for: ${result.idea}. Demand score: ${result.demandScore}/100. Get actionable insights and platform-specific recommendations.`}
                keywords="startup validation, idea validation, demand analysis, market research, AI analysis"
            />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
                {/* Header Section */}
                <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 blur-3xl"></div>
                    <div className="relative container mx-auto px-6 py-12">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                {isTR ? 'Validasyon Sonuçları' : 'Validation Results'}
                            </h1>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                {result.idea}
                            </p>
                        </div>

                        {/* Score Card */}
                        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                            <div className="text-center">
                                <div className="text-6xl font-bold mb-4">
                                    <span className={getScoreColor(result.demandScore)}>{result.demandScore}</span>
                                    <span className="text-slate-400 text-4xl">/100</span>
                                </div>
                                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getScoreBgColor(result.demandScore)}`}>
                                    {result.demandScore >= 80 ? (isTR ? 'Yüksek Potansiyel' : 'High Potential') :
                                     result.demandScore >= 60 ? (isTR ? 'Orta Potansiyel' : 'Medium Potential') :
                                     result.demandScore >= 40 ? (isTR ? 'Düşük Potansiyel' : 'Low Potential') :
                                     (isTR ? 'Çok Düşük Potansiyel' : 'Very Low Potential')}
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>0</span>
                                    <span>50</span>
                                    <span>100</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3">
                                    <div 
                                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                                            result.demandScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                            result.demandScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            result.demandScore >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                            'bg-gradient-to-r from-red-500 to-pink-500'
                                        }`}
                                        style={{ width: `${result.demandScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="container mx-auto px-6 mb-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="container mx-auto px-6 pb-16">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* AI Analysis Display */}
                            {result.scoreJustification && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                            <span className="text-2xl">🤖</span>
                                            {isTR ? 'AI Analizi' : 'AI Analysis'}
                                        </h3>
                                    </div>
                                    
                                    {/* AI Analysis Display */}
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {result.scoreJustification}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content Suggestions Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-8">
                            {/* X (Twitter) Post Suggestions */}
                            {result.tweetSuggestion && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <span className="text-2xl">🐦</span>
                                        X (Twitter) Post Suggestions
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                                            <p className="text-slate-300 leading-relaxed mb-4">{result.tweetSuggestion}</p>
                                            <button
                                                onClick={() => copyText(result.tweetSuggestion!, 0)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                                            >
                                                {copiedIndex === 0 ? '✅ Copied!' : '📋 Copy'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reddit Post Suggestions */}
                            {result.redditTitleSuggestion && result.redditBodySuggestion && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <span className="text-2xl">🤖</span>
                                        Reddit Post Suggestions
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                                            <h4 className="font-semibold text-white mb-3">Title:</h4>
                                            <p className="text-slate-300 leading-relaxed mb-4">{result.redditTitleSuggestion}</p>
                                            <button
                                                onClick={() => copyText(result.redditTitleSuggestion!, 1)}
                                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm transition-colors mr-2"
                                            >
                                                {copiedIndex === 1 ? '✅ Copied!' : '📋 Copy Title'}
                                            </button>
                                            
                                            <h4 className="font-semibold text-white mb-3 mt-6">Body:</h4>
                                            <p className="text-slate-300 leading-relaxed mb-4">{result.redditBodySuggestion}</p>
                                            <button
                                                onClick={() => copyText(result.redditBodySuggestion!, 2)}
                                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white text-sm transition-colors"
                                            >
                                                {copiedIndex === 2 ? '✅ Copied!' : '📋 Copy Body'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LinkedIn Post Suggestions */}
                            {result.linkedinSuggestion && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <span className="text-2xl">💼</span>
                                        LinkedIn Post Suggestions
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                                            <p className="text-slate-300 leading-relaxed mb-4">{result.linkedinSuggestion}</p>
                                            <button
                                                onClick={() => copyText(result.linkedinSuggestion!, 3)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                                            >
                                                {copiedIndex === 3 ? '✅ Copied!' : '📋 Copy'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResultsPage;
