import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface ValidationResult {
    idea: string;
    demandScore: number;
    originalDemandScore?: number;
    momentumAdjusted?: boolean;
    earlySignalAdjusted?: boolean;
    scoreJustification: string;
    rawAnalysis?: string;
    aiModel?: string;
    tweetSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
    linkedinSuggestion: string;
    realWorldData?: {
        socialMediaSignals: {
            twitter: { trending: boolean; sentiment: string; volume: string };
            facebook: { groupActivity: string; engagement: string };
            tiktok: { viralPotential: string; userReaction: string };
        };
        forumInsights: {
            reddit: { discussionVolume: string; painPoints: string[] };
            quora: { questionFrequency: string; topics: string[] };
        };
        marketplaceData: {
            amazon: { similarProducts: number; avgRating: number; reviewCount: number };
            appStore: { competitorApps: number; avgRating: number; downloads: string };
        };
        consumerSentiment: {
            overallSentiment: string;
            keyComplaints: string[];
            positiveFeedback: string[];
        };
    };
    dataConfidence?: string;
    lastDataUpdate?: string;
    platformAnalyses?: any;
    marketIntelligence?: any;
    competitiveLandscape?: any;
    revenueModel?: any;
    targetAudience?: any;
    riskAssessment?: any;
    goToMarket?: any;
    developmentRoadmap?: any;
    productMarketFit?: any;
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

    const getConfidenceColor = (confidence: string) => {
        if (confidence === 'high' || confidence === 'yüksek') return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (confidence === 'medium' || confidence === 'orta') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    };

    const getSentimentColor = (sentiment: string) => {
        if (sentiment === 'positive' || sentiment === 'olumlu') return 'bg-green-500/20 text-green-400';
        if (sentiment === 'negative' || sentiment === 'olumsuz') return 'bg-red-500/20 text-red-400';
        return 'bg-slate-500/20 text-slate-400';
    };

    const tabs = [
        { id: 'overview', label: isTR ? 'Genel Bakış' : 'Overview', icon: '📊' },
        { id: 'platforms', label: isTR ? 'Platform Analizleri' : 'Platform Analysis', icon: '🌐' },
        { id: 'market', label: isTR ? 'Pazar Analizi' : 'Market Analysis', icon: '📈' },
        { id: 'content', label: isTR ? 'İçerik Önerileri' : 'Content Suggestions', icon: '✍️' },
        { id: 'data', label: isTR ? 'Veri Detayları' : 'Data Details', icon: '🔍' }
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

                        {/* Score Justification */}
                        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">💡</span>
                                {isTR ? 'Skor Gerekçesi' : 'Score Justification'}
                            </h2>
                            <p className="text-slate-300 leading-relaxed">{result.scoreJustification}</p>
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
                            {/* Signal Summary */}
                            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <span className="text-2xl">📊</span>
                                    {isTR ? 'Sinyal Özeti' : 'Signal Summary'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="text-3xl mb-3">🐦</div>
                                        <div className="text-2xl font-bold text-blue-400 mb-2">
                                            {result.platformAnalyses?.X?.signalStrength || 'N/A'}
                                        </div>
                                        <div className="text-sm text-slate-400">X (Twitter)</div>
                                    </div>
                                    <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="text-3xl mb-3">🤖</div>
                                        <div className="text-2xl font-bold text-orange-400 mb-2">
                                            {result.platformAnalyses?.Reddit?.signalStrength || 'N/A'}
                                        </div>
                                        <div className="text-sm text-slate-400">Reddit</div>
                                    </div>
                                    <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="text-3xl mb-3">💼</div>
                                        <div className="text-2xl font-bold text-blue-600 mb-2">
                                            {result.platformAnalyses?.LinkedIn?.signalStrength || 'N/A'}
                                        </div>
                                        <div className="text-sm text-slate-400">LinkedIn</div>
                                    </div>
                                </div>
                            </div>

                            {/* Raw AI Analysis - Show if available */}
                            {result.rawAnalysis && (
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                            <span className="text-2xl">🔥</span>
                                            {isTR ? 'Raw AI Analizi' : 'Raw AI Analysis'}
                                        </h3>
                                        {result.aiModel && (
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                                                {result.aiModel.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                                        <div className="prose prose-invert max-w-none">
                                            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                                                {result.rawAnalysis}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {result.dataConfidence ? (isTR ? 
                                            (result.dataConfidence === 'high' ? 'Yüksek' : 
                                             result.dataConfidence === 'medium' ? 'Orta' : 'Düşük') :
                                            (result.dataConfidence === 'high' ? 'High' : 
                                             result.dataConfidence === 'medium' ? 'Medium' : 'Low')
                                        ) : 'N/A'}
                                    </div>
                                    <div className="text-sm text-slate-400">{isTR ? 'Veri Güveni' : 'Data Confidence'}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                                    <div className="text-3xl mb-2">📅</div>
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {result.lastDataUpdate ? new Date(result.lastDataUpdate).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div className="text-sm text-slate-400">{isTR ? 'Son Güncelleme' : 'Last Update'}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                                    <div className="text-3xl mb-2">🌐</div>
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {result.platformAnalyses ? Object.keys(result.platformAnalyses).length : 0}
                                    </div>
                                    <div className="text-sm text-slate-400">{isTR ? 'Platform Analizi' : 'Platforms Analyzed'}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                                    <div className="text-3xl mb-2">📊</div>
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {result.realWorldData ? '✅' : '❌'}
                                    </div>
                                    <div className="text-sm text-slate-400">{isTR ? 'Gerçek Dünya Verisi' : 'Real-World Data'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Platform Analysis Tab */}
                    {activeTab === 'platforms' && (
                        <div className="space-y-8">
                            {result.platformAnalyses && Object.entries(result.platformAnalyses).map(([platform, analysis]: [string, any]) => (
                                <div key={platform} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                            <span className="text-2xl">
                                                {platform === 'X' ? '🐦' : 
                                                 platform === 'Reddit' ? '🤖' : 
                                                 platform === 'LinkedIn' ? '💼' : 
                                                 platform === 'Instagram' ? '📸' : 
                                                 platform === 'TikTok' ? '🎵' : 
                                                 platform === 'YouTube' ? '📺' : 
                                                 platform === 'Facebook' ? '👥' : '🌐'}
                                            </span>
                                            {analysis.platformName || platform}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                analysis.score >= 4 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                analysis.score >= 3 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                                Score: {analysis.score || 'N/A'}/5
                                            </div>
                                            {analysis.signalStrength && (
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    analysis.signalStrength === 'exceptional' || analysis.signalStrength === 'olağanüstü' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                    analysis.signalStrength === 'strong' || analysis.signalStrength === 'güçlü' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                    analysis.signalStrength === 'moderate' || analysis.signalStrength === 'orta' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                    {analysis.signalStrength}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-white mb-3">{isTR ? 'Özet' : 'Summary'}</h4>
                                            <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-3">{isTR ? 'Ana Bulgular' : 'Key Findings'}</h4>
                                            <ul className="space-y-2">
                                                {analysis.keyFindings?.map((finding: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <span className="text-blue-400 mt-1">•</span>
                                                        {finding}
                                                    </li>
                                                )) || <li className="text-slate-400 text-sm">No findings available</li>}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    {analysis.contentSuggestion && (
                                        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <h4 className="font-semibold text-white mb-2">{isTR ? 'İçerik Önerisi' : 'Content Suggestion'}</h4>
                                            <p className="text-slate-300 text-sm">{analysis.contentSuggestion}</p>
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 text-xs text-slate-400">
                                        {isTR ? 'Veri Kaynağı' : 'Data Source'}: {analysis.dataSource || 'AI Analysis'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Market Analysis Tab */}
                    {activeTab === 'market' && (
                        <div className="space-y-8">
                            {/* Real-World Data Analysis */}
                            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
                                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <span className="text-2xl">🌍</span>
                                    {isTR ? 'Gerçek Dünya Veri Analizi' : 'Real-World Data Analysis'}
                                </h3>
                                
                                {result.realWorldData ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Social Media Signals */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-lg">📱</span>
                                                {isTR ? 'Sosyal Medya Sinyalleri' : 'Social Media Signals'}
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                    <span className="text-slate-400">Twitter:</span>
                                                    <span className={`px-2 py-1 rounded text-xs ${getSentimentColor(result.realWorldData.socialMediaSignals.twitter.sentiment)}`}>
                                                        {result.realWorldData.socialMediaSignals.twitter.trending ? '🔥 Trending' : 'Normal'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                    <span className="text-slate-400">Facebook:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.socialMediaSignals.facebook.groupActivity}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                    <span className="text-slate-400">TikTok:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.socialMediaSignals.tiktok.viralPotential}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Forum Insights */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                                <span className="text-lg">💬</span>
                                                {isTR ? 'Forum İçgörüleri' : 'Forum Insights'}
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                    <span className="text-slate-400">Reddit:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.forumInsights.reddit.discussionVolume}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                    <span className="text-slate-400">Quora:</span>
                                                    <span className="text-white text-sm">{result.realWorldData.forumInsights.quora.questionFrequency}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📊</div>
                                        <p className="text-slate-400 mb-4">{isTR ? 'Gerçek dünya verisi mevcut değil' : 'Real-world data not available'}</p>
                                        <p className="text-slate-500 text-sm">{isTR ? 'AI analizi kullanılarak tahmin edildi' : 'Estimated using AI analysis'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Market Intelligence Cards */}
                            {result.marketIntelligence && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <span className="text-lg">📈</span>
                                            {isTR ? 'Pazar Büyüklüğü' : 'Market Size'}
                                        </h4>
                                        <p className="text-slate-300 text-sm">{result.marketIntelligence.marketSize || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <span className="text-lg">🚀</span>
                                            {isTR ? 'Büyüme Hızı' : 'Growth Rate'}
                                        </h4>
                                        <p className="text-slate-300 text-sm">{result.marketIntelligence.growthRate || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content Suggestions Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-8">
                            {/* Social Media Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="text-lg">🐦</span>
                                        X (Twitter) Tweet
                                    </h3>
                                    <p className="text-slate-300 mb-4 text-sm leading-relaxed">{result.tweetSuggestion}</p>
                                    <button
                                        onClick={() => copyText(result.tweetSuggestion, 0)}
                                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-medium transition-colors"
                                    >
                                        {copiedIndex === 0 ? '✅ Copied!' : '📋 Copy Tweet'}
                                    </button>
                                </div>

                                <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="text-lg">🤖</span>
                                        Reddit Post
                                    </h3>
                                    <div className="mb-4">
                                        <h4 className="font-medium text-white mb-2 text-sm">Title:</h4>
                                        <p className="text-slate-300 text-sm mb-3">{result.redditTitleSuggestion}</p>
                                        <h4 className="font-medium text-white mb-2 text-sm">Content:</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">{result.redditBodySuggestion}</p>
                                    </div>
                                    <button
                                        onClick={() => copyText(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 1)}
                                        className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-white text-sm font-medium transition-colors"
                                    >
                                        {copiedIndex === 1 ? '✅ Copied!' : '📋 Copy Post'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-lg">💼</span>
                                    LinkedIn Post
                                </h3>
                                <p className="text-slate-300 mb-4 text-sm leading-relaxed">{result.linkedinSuggestion}</p>
                                <button
                                    onClick={() => copyText(result.linkedinSuggestion, 2)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-medium transition-colors"
                                >
                                    {copiedIndex === 2 ? '✅ Copied!' : '📋 Copy LinkedIn Post'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Data Details Tab */}
                    {activeTab === 'data' && (
                        <div className="space-y-8">
                            {/* Data Status */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">
                                <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                                    <span className="text-lg">📊</span>
                                    {isTR ? 'Veri Durumu' : 'Data Status'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <p className="text-blue-300">
                                            ✅ realWorldData: {result.realWorldData ? 'Loaded' : 'Missing'}
                                        </p>
                                        <p className="text-blue-300">
                                            ✅ Social Media Suggestions: {result.tweetSuggestion ? 'Loaded' : 'Missing'}
                                        </p>
                                        <p className="text-blue-300">
                                            ✅ Platform Analyses: {result.platformAnalyses ? 'Loaded' : 'Missing'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-blue-300">
                                            📅 Last Update: {result.lastDataUpdate ? new Date(result.lastDataUpdate).toLocaleString() : 'N/A'}
                                        </p>
                                        <p className="text-blue-300">
                                            🔍 Available Keys: {Object.keys(result).join(', ')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Raw Data Structure */}
                            <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-lg">🔍</span>
                                    {isTR ? 'Veri Yapısı' : 'Data Structure'}
                                </h3>
                                <div className="bg-slate-800 rounded-xl p-4 overflow-x-auto">
                                    <pre className="text-xs text-slate-300">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResultsPage;