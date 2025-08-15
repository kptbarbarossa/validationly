import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DynamicPromptResult } from '../types';
import SEOHead from '../components/SEOHead';

function detectLanguage(text: string): boolean {
    return /[çğıöşüÇĞİÖŞÜ]/.test(text);
}

export default function SmartResultsPage() {
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

    return (
        <>
            <SEOHead 
                title={`${result.idea || result.content} - Validation Report | Validationly`}
                description={`Validation Score: ${result.demandScore}/100`}
            />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                {/* Header */}
                <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="Validationly" className="w-8 h-8" />
                                <span className="text-lg font-semibold">Validationly</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                {isTR ? 'Yeni Analiz' : 'New Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="text-8xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {result.demandScore}
                        </div>
                        <div className="text-2xl text-slate-300 mb-8">
                            {isTR ? 'Validasyon Skoru' : 'Validation Score'}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-8 leading-relaxed max-w-4xl mx-auto">
                            "{result.idea || result.content}"
                        </h1>
                    </div>

                    {/* Score Justification */}
                    {result.scoreJustification && (
                        <div className="mb-12">
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">📊</span>
                                    {isTR ? 'Skor Açıklaması' : 'Score Justification'}
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    {result.scoreJustification}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Platform Analysis */}
                    {result.platformAnalysis && (
                        <div className="mb-12">
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">🔍</span>
                                    {isTR ? 'Platform Analizi' : 'Platform Analysis'}
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(result.platformAnalysis).map(([platform, data]: [string, any]) => (
                                        <div key={platform} className="p-6 bg-slate-700/30 rounded-xl border border-slate-600">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">
                                                    {platform === 'x' ? '🐦' : 
                                                     platform === 'reddit' ? '📱' : 
                                                     platform === 'linkedin' ? '💼' : '🌐'}
                                                </span>
                                                <h3 className="font-semibold text-white capitalize">
                                                    {platform === 'x' ? 'X (Twitter)' : platform}
                                                </h3>
                                            </div>
                                            <div className="text-3xl font-bold text-indigo-400 mb-2">
                                                {data.score}/5
                                            </div>
                                            <p className="text-slate-300 text-sm">
                                                {data.summary}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Post Suggestions */}
                    {result.postSuggestions && result.postSuggestions.length > 0 && (
                        <div className="mb-12">
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">💡</span>
                                    {isTR ? 'Post Önerileri' : 'Post Suggestions'}
                                </h2>
                                <div className="space-y-4">
                                    {result.postSuggestions.map((suggestion, index) => (
                                        <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                                            <p className="text-slate-300">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tweet Series Generator */}
                    <div className="mb-12">
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🐦</div>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    {isTR ? 'Tweet Serisi Üreticisi' : 'Tweet Series Generator'}
                                </h2>
                                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                                    {isTR 
                                        ? 'Fikrini sosyal medyada test etmek için 5 tweet\'lik build-in-public serisi üret. Topluluk geri bildirimi al ve fikrini doğrula.'
                                        : 'Generate a 5-tweet build-in-public series to test your idea on social media. Get community feedback and validate your concept.'
                                    }
                                </p>
                                <button
                                    onClick={() => navigate('/tweet-generator', { 
                                        state: { 
                                            idea: result.idea || result.content,
                                            industry: '',
                                            targetAudience: ''
                                        }
                                    })}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                                >
                                    <span className="text-xl">🚀</span>
                                    {isTR ? 'Tweet Serisi Üret' : 'Generate Tweet Series'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                        >
                            <span className="text-xl">🔄</span>
                            {isTR ? 'Başka Fikir Analiz Et' : 'Analyze Another Idea'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
